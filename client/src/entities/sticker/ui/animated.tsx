import { memo, RefObject, useCallback, useEffect, useRef, useState } from 'react';

import RLottie from '@/shared/lib/rlottie/RLottie';
import { ObserveFn, useIsIntersecting, fastRaf } from '@/shared/lib/telegram-web';
import useBackgroundMode from '@/shared/lib/telegram-web/useBackgroundMode';
import useHeavyAnimationCheck from '@/shared/lib/telegram-web/useHeavyAnimationCheck';
import useStopOnScrollingMode from '@/shared/lib/telegram-web/useStopOnScrollingMode';


export type OwnProps = {
  ref?: RefObject<HTMLDivElement>;
  className?: string;
  style?: string;
  tgsUrl?: string;
  play?: boolean | string;
  playSegment?: [number, number];
  speed?: number;
  noLoop?: boolean;
  size: number;
  quality?: number;
  isLowPriority?: boolean;
  forceOnHeavyAnimation?: boolean;
  color?: [number, number, number];
  onClick?: NoneToVoidFunction;
  onLoad?: AnyToVoidFunction;
  onEnded?: NoneToVoidFunction;
  onDestroy?: AnyToVoidFunction;
  observeIntersection?: ObserveFn;
  observeIntersectionDestroyAnimated?: ObserveFn;
};

const AnimatedStickerComponent = ({
  ref,
  // className,
  // style,
  tgsUrl,
  play,
  playSegment,
  speed,
  noLoop,
  size,
  quality,
  isLowPriority,
  color,
  forceOnHeavyAnimation,
  onClick,
  onLoad,
  onEnded,
  onDestroy,
  observeIntersection,
  observeIntersectionDestroyAnimated,
}: OwnProps) => {
  let containerRef = useRef<HTMLDivElement>(null);

  if (ref) {
    containerRef = ref;
  }

  const [animation, setAnimation] = useState<RLottie>();
  const wasPlaying = useRef(false);
  const isFrozen = useRef(false);
  const isFirstRender = useRef(true);

  const playRef = useRef<string | boolean | undefined>();

  playRef.current = play;
  const playSegmentRef = useRef<[number, number]>();

  playSegmentRef.current = playSegment;

  const isIntesecting = useIsIntersecting(containerRef, observeIntersection);
  const isMovedOut = !useIsIntersecting(containerRef, observeIntersectionDestroyAnimated);
  const exec = useRef<() => void>();

  useEffect(() => {
    if (!isMovedOut && exec.current) {
      exec.current();
    }

    if (isIntesecting) {
      animation?.play();
    } else {
      animation?.pause();
    }

    if (isMovedOut) {
      animation?.destroy();
      onDestroy?.(animation);
    }
  }, [isMovedOut, isIntesecting]);

  useEffect(() => {
    if (animation || !tgsUrl) {
      return;
    }

    exec.current = () => {
      if (!containerRef.current) {
        return;
      }

      const newAnimation = new RLottie(
        containerRef.current,
        tgsUrl,
        {
          noLoop,
          size,
          quality,
          isLowPriority,
        },
        onLoad,
        color,
        onEnded,
      );

      if (speed) {
        newAnimation.setSpeed(speed);
      }

      setAnimation(newAnimation);
    };

    if (RLottie && !isMovedOut) {
      exec.current();
    } else {
      // ensureLottie().then(() => {
      //   fastRaf(() => {
      //     if (containerRef.current) {
      //       exec();
      //     }
      //   });
      // });
    }
  }, [color, animation, tgsUrl, isLowPriority, noLoop, onLoad, quality, size, speed, onEnded]);

  useEffect(() => {
    if (!animation) {return;}

    animation.setColor(color);
  }, [color, animation]);

  useEffect(() => {
    return () => {
      if (animation) {
        animation.destroy();
        onDestroy?.(animation);
      }
    };
  }, [animation]);

  const playAnimation = useCallback((shouldRestart = false) => {
    if (animation && (playRef.current || playSegmentRef.current)) {
      if (playSegmentRef.current) {
        animation.playSegment(playSegmentRef.current);
      } else {
        animation.play(shouldRestart);
      }
    }
  }, [animation]);

  const pauseAnimation = useCallback(() => {
    if (!animation) {
      return;
    }

    animation.pause();
  }, [animation]);

  const freezeAnimation = useCallback(() => {
    isFrozen.current = true;

    if (!animation) {
      return;
    }

    if (!wasPlaying.current) {
      wasPlaying.current = animation.isPlaying();
    }

    pauseAnimation();
  }, [animation, pauseAnimation]);

  const unfreezeAnimation = useCallback(() => {
    if (wasPlaying.current) {
      playAnimation(noLoop);
    }

    wasPlaying.current = false;
    isFrozen.current = false;
  }, [noLoop, playAnimation]);

  const unfreezeAnimationOnRaf = useCallback(() => {
    fastRaf(unfreezeAnimation);
  }, [unfreezeAnimation]);

  useEffect(() => {
    if (!animation) {
      return;
    }
    if (play || playSegment) {
      if (isFrozen.current) {
        wasPlaying.current = true;
      } else {
        playAnimation(noLoop);
      }
    } else {
      if (isFrozen.current) {
        wasPlaying.current = false;
      } else {
        pauseAnimation();
      }
    }
  }, [animation, play, playSegment, noLoop, playAnimation, pauseAnimation]);

  useEffect(() => {
    if (animation) {
      if (isFirstRender.current) {
        isFirstRender.current = false;
      } else if (tgsUrl) {
        animation.changeData(tgsUrl);
        playAnimation();
      }
    }
  }, [playAnimation, animation, tgsUrl]);

  useHeavyAnimationCheck(freezeAnimation, unfreezeAnimation, forceOnHeavyAnimation);
  useStopOnScrollingMode(freezeAnimation, unfreezeAnimation);
  // Pausing frame may not happen in background
  // so we need to make sure it happens right after focusing,
  // then we can play again.
  useBackgroundMode(freezeAnimation, unfreezeAnimationOnRaf);

  return (
    <div
      ref={containerRef}
      className={'animatedTGS'}
      style={{
        width: size,
        height: size,
      }}
      onClick={onClick}
    />
  );
};

export const AnimatedSticker = memo(AnimatedStickerComponent);
