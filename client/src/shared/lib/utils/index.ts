import WebApp from '@twa-dev/sdk';


export * from './user-agent';
export * from './telegram';
export * from './get-query-param';
export * from './cycleRestrict';
export * from './generateIdFor';
export * from './check-telegram-login-query';
export * from './get-random-color';

export const noop = () => {};

export const apiVersion = () => WebApp.version;

export const roundReaction = (n: number) => {
  if (n <= 0) {
    return '';
  }
  if (n >= 1e3) {
    return `${Math.trunc(n/1e2)/10}K`;
  }
  if (n >= 1e6){
    return `${Math.trunc(n/1e5)/10}M`;
  }
  return n;
};

export const RGBToHSL = (color: string) => {
  const c = color.trim().replace('#', '').match(/..?/g) || [];
  const [r, g, b] = c.map((n) => Number.parseInt(n, 16) / 255);
  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s
    ? l === r
      ? (g - b) / s
      : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
    : 0;

  const arr = [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ];

  return arr;
};

// export const HSLToRGB = ([h, s, l]: number[]): any => {
//   s /= 100;
//   l /= 100;
//   const k = (n: number) => (n + h / 30) % 12;
//   const a = s * Math.min(l, 1 - l);
//   const f = (n: number) =>
//     l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
//   return [255 * f(0), 255 * f(8), 255 * f(4)].map(c => c^0);
// };

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
