import axios, { AxiosInstance } from 'axios';

const Axios: AxiosInstance = axios.create();

Axios.interceptors.response.use((response) => {
  if (response.data) {
    convertSnakeToCamel(response.data);
  }
  return response;
});

const snakeToCamel = (str: string): string =>
  str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );

const convertSnakeToCamel = (target: any): void => {
  if (Array.isArray(target)) {
    target.forEach(convertSnakeToCamel);
    return;
  }

  if (typeof target !== 'object' || target === null) {
    return;
  }

  for (const key in target) {
    if (Object.hasOwnProperty.call(target, key)) {
      const value = target[key];

      if (typeof value === 'object') {
        convertSnakeToCamel(value);
      }

      const camelKey = snakeToCamel(key);
      if (camelKey !== key) {
        target[camelKey] = value;
        delete target[key];
      }
    }
  }
};

export default Axios;