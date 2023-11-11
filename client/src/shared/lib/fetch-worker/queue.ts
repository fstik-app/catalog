export type QueueItem = {
  url: string,
  key: string,
  resolve: Function,
  reject: Function,
  callback?: AnyToVoidFunction,
};

class CancellationException extends Error { cancellation = true; }

export default class FetchQueue {
  private tickTime = 100;

  private interval?: NodeJS.Timeout;

  private queue: QueueItem[] = [];

  constructor () {
    this.start();
  }

  private start () {
    this.interval = setInterval(async () => {
      const message = this.queue.shift();

      if (!message) {
        return;
      }

      const result = await fetch(message.url);

      message.resolve(result);
    }, this.tickTime);
  }

  private stop () {
    clearInterval(this.interval);
  }

  enqueue (item: QueueItem) {
    this.queue.push(item);
  }

  dequeue (data: { key?: string, url?: string }) {
    const prop = data.key ? 'key' : 'url';

    const index = this.queue.findIndex((item) => item[prop] === data[prop]);

    if (index > -1) {
      const [element] = this.queue.splice(index, 1);

      element.reject(new CancellationException());
    }
  }
}
