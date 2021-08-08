import { fetchUtils } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import Auth from '@aws-amplify/auth';

export const httpClient = async (
  url: string,
  options: fetchUtils.Options = {},
): ReturnType<typeof fetchUtils.fetchJson> => {
  const innerOptions = options;
  if (!innerOptions.headers) {
    innerOptions.headers = new Headers({ Accept: 'application/json' });
  }
  const { signInUserSession } = await Auth.currentAuthenticatedUser();
  (innerOptions.headers as Headers).set(
    'Authorization',
    `Bearer ${String(signInUserSession.accessToken.jwtToken)}`,
  );
  return fetchUtils.fetchJson(url, innerOptions);
};

export default simpleRestProvider(process.env.REACT_APP_API_URL!, httpClient);
// const dataProvider: any = simpleRestProvider(process.env.REACT_APP_API_URL!, httpClient);

// export default {
//   ...dataProvider,
//   update: (resource: any, params: any) => {
//     if (resource === 'users') {
//       // more hacky stuff to work around react-admin
//       const mobileNumber = params.data.mobileNumber;
//       delete params.data.mobileNumber;
//       return dataProvider.update(resource, {
//         ...params,
//         data: {
//           ...params.data,
//           ...(mobileNumber !== params.previousData.mobileNumber && { mobileNumber }),
//         },
//       });
//     }

//     return dataProvider.update(resource, params);
//   },
// };
