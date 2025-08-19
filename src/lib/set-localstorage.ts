export const getToken = (key: string): string | null => {
  const token = localStorage.getItem(key);
  if (token) {
    return token;
  } else {
    return null;
  }
};

export const setLocalStorage = (key: string, value: string | boolean) => {
  localStorage.setItem(key, JSON.stringify(value));
};
