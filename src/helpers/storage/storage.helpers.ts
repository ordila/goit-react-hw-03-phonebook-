import { LOCAL_STORAGE_KEYS } from '@/constants/storage/localStorageKeys.constants';

export const localStorageService = <TData>(key: LOCAL_STORAGE_KEYS) => {
  const getItem = (): TData => {
    const data = localStorage.getItem(key);

    return data ? JSON.parse(data) : null;
  };

  const removeItem = () => {
    return localStorage.removeItem(key);
  };

  const setItem = (data?: TData) => {
    if (data) {
      return localStorage.setItem(key, JSON.stringify(data));
    }

    removeItem();
  };

  return { setItem, getItem, removeItem };
};
