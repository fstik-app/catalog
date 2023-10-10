// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-non-null-assertion */
type Scheduler =
  typeof requestAnimationFrame
  | typeof onTickEnd;

export function debounce<F extends AnyToVoidFunction> (
  fn: F,
  ms: number,
  shouldRunFirst = true,
  shouldRunLast = true,
) {
  let waitingTimeout: number | undefined;

  return (...args: Parameters<F>) => {
    if (waitingTimeout) {
      clearTimeout(waitingTimeout);
      waitingTimeout = undefined;
    } else if (shouldRunFirst) {
      fn(...args);
    }

    waitingTimeout = self.setTimeout(() => {
      if (shouldRunLast) {
        fn(...args);
      }

      waitingTimeout = undefined;
    }, ms);
  };
}

export function throttle<F extends AnyToVoidFunction> (
  fn: F,
  ms: number,
  shouldRunFirst = true,
) {
  let interval: number | undefined;
  let isPending: boolean;
  let args: Parameters<F>;

  return (..._args: Parameters<F>) => {
    isPending = true;
    args = _args;

    if (!interval) {
      if (shouldRunFirst) {
        isPending = false;
        fn(...args);
      }

      interval = self.setInterval(() => {
        if (!isPending) {
          self.clearInterval(interval!);
          interval = undefined;
          return;
        }

        isPending = false;
        fn(...args);
      }, ms);
    }
  };
}

export function throttleWithRaf<F extends AnyToVoidFunction> (fn: F) {
  return throttleWith(fastRaf, fn);
}

export function throttleWithPrimaryRaf<F extends AnyToVoidFunction> (fn: F) {
  return throttleWith(fastRafPrimary, fn);
}

export function throttleWithTickEnd<F extends AnyToVoidFunction> (fn: F) {
  return throttleWith(onTickEnd, fn);
}

export function throttleWith<F extends AnyToVoidFunction> (schedulerFn: Scheduler, fn: F) {
  let waiting = false;
  let args: Parameters<F>;

  return (..._args: Parameters<F>) => {
    args = _args;

    if (!waiting) {
      waiting = true;

      schedulerFn(() => {
        waiting = false;
        fn(...args);
      });
    }
  };
}

export function onIdle (cb: NoneToVoidFunction, timeout?: number) {
  if (self.requestIdleCallback) {
    self.requestIdleCallback(cb, { timeout });
  } else {
    onTickEnd(cb);
  }
}

export const pause = (ms: number) => new Promise<void>((resolve) => {
  setTimeout(() => resolve(), ms);
});

export function rafPromise () {
  return new Promise<void>((resolve) => {
    fastRaf(resolve);
  });
}

let fastRafCallbacks: NoneToVoidFunction[] | undefined;
let fastRafPrimaryCallbacks: NoneToVoidFunction[] | undefined;

// May result in an immediate execution if called from another `requestAnimationFrame` callback
export function fastRaf (callback: NoneToVoidFunction, isPrimary = false) {
  if (!fastRafCallbacks) {
    fastRafCallbacks = isPrimary ? [] : [callback];
    fastRafPrimaryCallbacks = isPrimary ? [callback] : [];

    requestAnimationFrame(() => {
      const currentCallbacks = fastRafCallbacks!;
      const currentPrimaryCallbacks = fastRafPrimaryCallbacks!;

      fastRafCallbacks = undefined;
      fastRafPrimaryCallbacks = undefined;
      for (const cb of currentPrimaryCallbacks) {cb();}
      for (const cb of currentCallbacks) {cb();}
    });
  } else if (isPrimary) {
    fastRafPrimaryCallbacks!.push(callback);
  } else {
    fastRafCallbacks.push(callback);
  }
}

export function fastRafPrimary (callback: NoneToVoidFunction) {
  fastRaf(callback, true);
}

let onTickEndCallbacks: NoneToVoidFunction[] | undefined;
let onTickEndPrimaryCallbacks: NoneToVoidFunction[] | undefined;

export function onTickEnd (callback: NoneToVoidFunction, isPrimary = false) {
  if (!onTickEndCallbacks) {
    onTickEndCallbacks = isPrimary ? [] : [callback];
    onTickEndPrimaryCallbacks = isPrimary ? [callback] : [];

    Promise.resolve().then(() => {
      const currentCallbacks = onTickEndCallbacks!;
      const currentPrimaryCallbacks = onTickEndPrimaryCallbacks!;

      onTickEndCallbacks = undefined;
      onTickEndPrimaryCallbacks = undefined;
      for (const cb of currentPrimaryCallbacks) {cb();}
      for (const cb of currentCallbacks) {cb();}
    });
  } else if (isPrimary) {
    onTickEndPrimaryCallbacks!.push(callback);
  } else {
    onTickEndCallbacks.push(callback);
  }
}

export function onTickEndPrimary (callback: NoneToVoidFunction) {
  onTickEnd(callback, true);
}

let beforeUnloadCallbacks: NoneToVoidFunction[] | undefined;

export function onBeforeUnload (callback: NoneToVoidFunction, isLast = false) {
  if (!beforeUnloadCallbacks) {
    beforeUnloadCallbacks = [];

    self.addEventListener('beforeunload', () => {
      for (const cb of beforeUnloadCallbacks!) {cb();}
    });
  }

  if (isLast) {
    beforeUnloadCallbacks.push(callback);
  } else {
    beforeUnloadCallbacks.unshift(callback);
  }

  return () => {
    beforeUnloadCallbacks = beforeUnloadCallbacks!.filter((cb) => cb !== callback);
  };
}
