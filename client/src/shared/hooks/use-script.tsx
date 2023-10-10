import { useEffect } from 'react';


export const useScript = (url: string) => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;
    script.crossOrigin = 'anonymous';

    document.body.append(script);

    return () => {
      script.remove();
    };
  }, [url]);
};
