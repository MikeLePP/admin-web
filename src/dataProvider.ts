import { fetchUtils } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import Auth from '@aws-amplify/auth';

export const httpClient = async (url: string, options = {} as any) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  const { signInUserSession } = await Auth.currentAuthenticatedUser();
  options.headers.set('Authorization', `Bearer ${signInUserSession.accessToken.jwtToken}`);
  return fetchUtils.fetchJson(url, options);
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
