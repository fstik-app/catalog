// https://github.com/terikon/promise-worker-transferable/blob/master/index.js#L55
import { createWorkerInterface } from '../telegram-web/createWorkerInterface';

import FetchQueue from './queue';


export {};


interface QueuePortMessageEnqueue {
  type: 'fetchUrl';
  url: string;
  key: string;
  workerPort: MessagePort;
}

interface QueuePortMessageDequeue {
  type: 'dequeue';
  id: string;
  url: string;
  key: string;
  workerPort: MessagePort;
}

export type QueuePortMessageEvent = {
  data: QueuePortMessageEnqueue | QueuePortMessageDequeue;
};

const queue = new FetchQueue();


const registerWorkerPort = (port: MessagePort) => {
  port.onmessage = (message: QueuePortMessageEvent) => {
    const { data } = message;


    switch(data.type) {
    case 'fetchUrl': {
      const { url, key } = data;

      const promise = new Promise<Response>((resolve, reject) => {
        queue.enqueue({ url, key, resolve, reject });
      });

      promise.then(async (result) => {
        const arrayBuffer = await result.arrayBuffer();
        const contentType = result.headers.get('Content-Type');

        port.postMessage({
          type: 'response',
          arrayBuffer,
          contentType,
          key,
        }, [arrayBuffer]);
      }).catch((error) => {
        if (error.cancellation) {
          port.postMessage({
            type: 'cancellation',
            key,
          });
        }
      });

      break;
    }
    case 'dequeue': {
      queue.dequeue({ key: data.key });

      break;
    }
    }
  };
};

const enqueue = async (
  key: string,
  url: string,
) => {
  const promise = new Promise<Response>((resolve, reject) => {
    queue.enqueue({ url, key, resolve, reject });
  });

  return await promise.then(async (result) => {
    const arrayBuffer = await result.arrayBuffer();
    const contentType = result.headers.get('Content-Type');

    return [
      {
        arrayBuffer,
        contentType,
        key,
      },
      [
        arrayBuffer,
      ],
    ];
  },
  ).catch((error) => {
    console.error(error);
  });
};

function dequeue (
  key: string,
  url: string,
) {
  queue.dequeue({ key, url });
}

createWorkerInterface({
  registerWorkerPort,
  enqueue,
  dequeue,
});
