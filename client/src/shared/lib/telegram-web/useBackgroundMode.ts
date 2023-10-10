import { useEffect } from 'react';

import { IS_ANDROID } from '@/shared/environment';


export default function useBackgroundMode (
  onBlur?: AnyToVoidFunction,
  onFocus?: AnyToVoidFunction,
) {
  useEffect(() => {
    if (IS_ANDROID) {
      return;
    }

    if (onBlur && !document.hasFocus()) {
      onBlur();
    }

    if (onBlur) {
      window.addEventListener('blur', onBlur);
    }

    if (onFocus) {
      window.addEventListener('focus', onFocus);
    }

    return () => {
      if (onFocus) {
        window.removeEventListener('focus', onFocus);
      }

      if (onBlur) {
        window.removeEventListener('blur', onBlur);
      }
    };
  }, [onBlur, onFocus]);
}
