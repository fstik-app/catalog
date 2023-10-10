// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
import { onQueuePortMessage } from './queue-worker-fetcher';
import type { CancellableCallback, OriginMessageEvent, WorkerMessageData } from './WorkerConnector';


declare const self: WorkerGlobalScope & { sharedWorkerPort: MessagePort };

handleErrors();

const callbackState = new Map<string, CancellableCallback>();

export function createWorkerInterface (api: Record<string, Function>) {
  onmessage = async (message: OriginMessageEvent) => {
    const { data } = message;

    switch (data.type) {
    case 'callMethod': {
      const { messageId, name, args } = data;

      try {
        if (messageId) {
          const callback = (...callbackArgs: any[]) => {
            const lastArg = callbackArgs.at(-1);

            sendToOrigin({
              type: 'methodCallback',
              messageId,
              callbackArgs,
            }, lastArg instanceof ArrayBuffer ? [lastArg] : undefined);
          };

          callbackState.set(messageId, callback);

          args.push(callback as never);
        }

        const [response, arrayBuffers] = (await api[name](...args)) || [];

        if (messageId) {
          sendToOrigin(
            {
              type: 'methodResponse',
              messageId,
              response,
            },
            arrayBuffers,
          );
        }
      } catch (error: any) {
        if (messageId) {
          sendToOrigin({
            type: 'methodResponse',
            messageId,
            error: { message: error.message },
          });
        }
      }

      if (messageId) {
        callbackState.delete(messageId);
      }

      break;
    }
    case 'cancelProgress': {
      const callback = callbackState.get(data.messageId);

      if (callback) {
        callback.isCanceled = true;
      }

      break;
    }
    case 'assignSharedWorkerPort': {
      self.sharedWorkerPort = data.sharedWorkerPort;

      self.sharedWorkerPort.onmessage = onQueuePortMessage;
      break;
    }
    }
  };
}

function handleErrors () {
  self.onerror = (e) => {
    console.error(e);
    sendToOrigin({ type: 'unhandledError', error: { message: e.error.message || 'Uncaught exception in worker' } });
  };

  self.addEventListener('unhandledrejection', (e) => {
    console.error(e);
    sendToOrigin({ type: 'unhandledError', error: { message: e.reason.message || 'Uncaught rejection in worker' } });
  });
}

function sendToOrigin (data: WorkerMessageData, arrayBuffers?: ArrayBuffer[]) {
  if (arrayBuffers) {
    postMessage(data, arrayBuffers);
  } else {
    postMessage(data);
  }
}
