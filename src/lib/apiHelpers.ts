import { reduce } from 'lodash';

export interface Resources<T> {
  data: {
    id: string;
    type: string;
    attributes: T;
  }[];
}

export interface Resource<T> {
  data: {
    id: string;
    type: string;
    attributes: T;
    relationships: Resource<unknown>[];
  };
}

export const flatObject = <T>(data: Resource<T>['data']): T => ({
  ...(data.id && { id: data.id }),
  ...data.attributes,
  ...reduce(
    data.relationships,
    (acc, cur, key) => {
      if (cur.data[0]) {
        acc[key] = flatObject(cur.data[0]);
      }
      return acc;
    },
    {},
  ),
});
