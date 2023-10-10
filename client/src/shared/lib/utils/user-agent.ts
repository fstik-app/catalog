import WebApp from '@twa-dev/sdk';


export const getMobileOS = () => {
  if (WebApp.platform !== 'unknown') {
    return WebApp.platform;
  }

  const ua = navigator.userAgent;

  if (/android/i.test(ua)) {
    return 'android';
  } else if (/ipad|iphone|ipod/i.test(ua)) {
    return 'ios';
  } else if (/macintosh/i.test(ua)) {
    return 'macos';
  }
  return 'unknown';
};

export const detectAndroid = () => {
  return getMobileOS() === 'android';
};

export function iOS () {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod',
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes('mac') && 'ontouchend' in document);
} // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
