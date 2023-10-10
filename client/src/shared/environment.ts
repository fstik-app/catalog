// import { Capacitor } from '@capacitor/core';
import WebApp from '@twa-dev/sdk';
// import {
//   MOBILE_SCREEN_MAX_WIDTH,
//   MOBILE_SCREEN_LANDSCAPE_MAX_HEIGHT,
//   MOBILE_SCREEN_LANDSCAPE_MAX_WIDTH,
// } from 'app/lib/config';
// import { debugAds } from 'shared/lib/debug';


export const DEBUG = import.meta.env.VITE_DEBUG;
export const DEVELOPMENT = import.meta.env.REACT_APP_DEVELOPMENT;
// export const isNativePlatform = Capacitor.isNativePlatform();
// export const isAdMobTesting = process.env.REACT_APP_IS_TESTING === 'true';
// debugAds('AdMob testing mode', isAdMobTesting);

export const MIN_SCREEN_WIDTH_FOR_STATIC_RIGHT_COLUMN = 1275; // px
export const MIN_SCREEN_WIDTH_FOR_STATIC_LEFT_COLUMN = 925; // px
export const MAX_SCREEN_WIDTH_FOR_EXPAND_PINNED_MESSAGES = 1340; // px
export const MOBILE_SCREEN_MAX_WIDTH = 600; // px
export const MOBILE_SCREEN_LANDSCAPE_MAX_WIDTH = 950; // px
export const MOBILE_SCREEN_LANDSCAPE_MAX_HEIGHT = 450; // px

export const DPR = window.devicePixelRatio || 1;
// Keep in mind the landscape orientation
export const IS_SINGLE_COLUMN_LAYOUT = window.innerWidth <= MOBILE_SCREEN_MAX_WIDTH || (
  window.innerWidth <= MOBILE_SCREEN_LANDSCAPE_MAX_WIDTH && window.innerHeight <= MOBILE_SCREEN_LANDSCAPE_MAX_HEIGHT
);
export function getPlatform () {
  if (WebApp.platform !== 'unknown') {
    return WebApp.platform.toLowerCase();
  }

  const { userAgent, platform } = window.navigator;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os: 'macOS' | 'iOS' | 'Windows' | 'Android' | 'Linux' | undefined;

  if (macosPlatforms.includes(platform)) {
    os = 'macOS';
  } else if (iosPlatforms.includes(platform)) {
    os = 'iOS';
  } else if (windowsPlatforms.includes(platform)) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (/Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}

export const PLATFORM_ENV = getPlatform();
export const IS_MAC_OS = PLATFORM_ENV === 'macos';
export const IS_IOS = PLATFORM_ENV === 'ios';
export const IS_ANDROID = PLATFORM_ENV === 'android';
export const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
export const isWebApp = !!WebApp.initData;
export const isMobile = IS_IOS || IS_ANDROID || isWebApp || window.innerWidth < 768;

const TEST_VIDEO = document.createElement('video');

export const IS_WEBM_SUPPORTED = Boolean(TEST_VIDEO.canPlayType('video/webm; codecs="vp9"').replace('no', ''))
  && !(IS_MAC_OS && IS_SAFARI);

TEST_VIDEO.remove();
