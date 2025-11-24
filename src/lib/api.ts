// // src/lib/api.ts
// const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

// export async function apiFetch(
//   path: string,
//   init: RequestInit = {}
// ) {
//   const { headers, ...rest } = init;
//   return fetch(`${apiBaseUrl}${path}`, {
//     ...rest,
//     headers: {
//       'Content-Type': 'application/json',
//       ...(headers ?? {}),
//     },
//   });
// }


// src/lib/api.ts
import { auth } from './firebase';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export async function apiFetch(
  path: string,
  init: RequestInit = {}
) {
  const { headers, ...rest } = init;
  
  // Get the current user
  const user = auth.currentUser;
  let idToken = '';
  
  if (user) {
    try {
      // Get the ID token
      idToken = await user.getIdToken();
    } catch (error) {
      console.error('Error getting ID token:', error);
      throw error;
    }
  }

  return fetch(`${apiBaseUrl}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(idToken ? { 'Authorization': `Bearer ${idToken}` } : {}),
      ...(headers ?? {}),
    },
  });
}