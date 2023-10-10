export const setCssProperty = (key: string, value: string, className?: string) => {
  if (className) {
    document.documentElement.classList.contains(className) && document.documentElement.style.setProperty(key, value);
  } else {
    return;
  }

  return document.documentElement.style.setProperty(key, value);
};

export const getCssProperty = (key: string) => document.documentElement.style.getPropertyValue(key).trim()
  || getComputedStyle(document.documentElement).getPropertyValue(key).trim();

