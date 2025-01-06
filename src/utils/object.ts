import { isEmpty, keys } from 'lodash';

export const removeEmptyValues = (obj: Record<string, any>) => {
  keys(obj).forEach((key) => {
    if (isEmpty(obj[key])) {
      delete obj[key];
      removeEmptyValues(obj);
    } else if (obj[key] && typeof obj[key] === 'object') {
      removeEmptyValues(obj[key]);
    }
  });
};
