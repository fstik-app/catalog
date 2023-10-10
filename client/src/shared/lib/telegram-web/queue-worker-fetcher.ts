const FETCH_TIMEOUT = 15_000;

class TimeoutException extends Error { code = 408; }

const waitingList = new Map<string, {
  resolve: AnyToVoidFunction,
  reject: AnyToVoidFunction,
  timeout: NodeJS.Timeout,
}>();

declare const self: WorkerGlobalScope & { sharedWorkerPort: MessagePort };
type FetchTgsResponse = {
  text?: string,
  contentType: string,
  arrayBuffer: ArrayBuffer,
};

export async function removeFromQueue (id: string) {
  self.sharedWorkerPort.postMessage({
    type: 'dequeue',
    id,
  });
}

export async function fetchWithWorker (url: string, key: string) {
  if (!self.sharedWorkerPort) {
    const response = await fetch(url);

    const contentType = response.headers.get('Content-Type') ?? '';
    const arrayBuffer = await response.arrayBuffer();

    let text;

    if (contentType?.startsWith('text/')) {
      text = await response.text();
    }

    return {
      text,
      contentType,
      arrayBuffer,
    };
  }

  if (!self.sharedWorkerPort.onmessage) {
    self.sharedWorkerPort.onmessage = onQueuePortMessage;
  }

  let timeout: NodeJS.Timeout;

  return new Promise<FetchTgsResponse>((resolve, reject) => {
    timeout = setTimeout(() => {
      waitingList.delete(key);
      reject(new TimeoutException());
    }, FETCH_TIMEOUT);

    waitingList.set(key, {
      resolve,
      reject,
      timeout,
    });

    self.sharedWorkerPort.postMessage({
      type: 'fetchUrl',
      url,
      key,
    });
  });
}

export const onQueuePortMessage = (message: {
  data: {
    type: string,
    key: string,
    text?: string,
    contentType: string,
    arrayBuffer: ArrayBuffer,
  }
}) => {
  const { data } = message;

  const wait = waitingList.get(data.key);

  if (!wait) {
    return;
  }

  switch (data.type) {
  case 'response': {
    const { key, text, contentType, arrayBuffer } = data;

    clearTimeout(wait.timeout);
    waitingList.delete(key);

    wait.resolve({
      text,
      contentType,
      arrayBuffer,
    });

    break;
  }
  case 'cancellation': {
    clearTimeout(wait.timeout);
    wait.resolve({}); // TODO

    break;
  }
  }
};
