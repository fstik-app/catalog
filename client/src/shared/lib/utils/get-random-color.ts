export function getRandomLightColor () {
  const letters = '0123456789ABCDEF';
  let color = '#';

  // Generate a six-digit hexadecimal color code
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}
