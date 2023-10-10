export {};
// import { StickerSetInterface } from 'types';


// export function syntaxHighlight (json: string | StickerSetInterface | undefined) {
//   if (!json) {
//     return '';
//   }

//   if (typeof json !== 'string') {
//     json = JSON.stringify(json, undefined, 2);
//   }
//   json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

//   // eslint-disable-next-line unicorn/no-unsafe-regex
//   json = json.replace(/("(\\u[\dA-Za-z]{4}|\\[^u]|[^"\\])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[Ee][+-]?\d+)?)/g, function (match) {
//     let cls = 'number';

//     if (match.startsWith('"')) {
//       cls = match.endsWith(':') ? 'key' : 'string';
//     } else if (/true|false/.test(match)) {
//       cls = 'boolean';
//     } else if (/null/.test(match)) {
//       cls = 'null';
//     }
//     return '<span class="' + cls + '">' + match + '</span>';
//   });
//   return json;
// }
