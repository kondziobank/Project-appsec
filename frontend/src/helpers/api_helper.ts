import axios from "axios"
import mem from 'src/../node_modules/mem/dist/index';
import i18n from "src/i18n";
import authInfoManager from './auth-info'

export interface LoginPayload {
  email: string;
  password: string;
}

const apiConfig = {
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' }
};

const unauthenticatedApi = axios.create(apiConfig);
unauthenticatedApi.interceptors.request.use(
  function(config) {
    config.headers = {
      ...config.headers,
      'Accept-Language': i18n.language
    };

    return config;
  },
  error => Promise.reject(error)
);

const refreshTokenAuthenticatedApi = axios.create(apiConfig);
refreshTokenAuthenticatedApi.interceptors.request.use(
  function(config) {
    const authInfo = authInfoManager.get();
    if (authInfo?.refreshToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${authInfo.refreshToken}`,
        'Accept-Language': i18n.language
      };
    }

    return config;
  },
  error => Promise.reject(error)
);

const api = axios.create(apiConfig);
api.interceptors.request.use(
  config => {
    const authInfo = authInfoManager.get();
    if (authInfo?.accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${authInfo.accessToken}`,
        'Accept-Language': i18n.language
      };
    }
    return config;
  },
  error => Promise.reject(error)
);
api.interceptors.response.use(
  response => response,
  async error => {
    const config = error?.config;

    if (error?.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (!config?._retry) {
      config._retry = true;
      await refreshSession();
      return api(config);
    }
  }
)


const refreshSession = mem(async () => {
  try {
    const response = await refreshTokenAuthenticatedApi.put('/auth/sessions')
    const authInfo = response.data;
    authInfoManager.set(authInfo);
  } catch (err) {
    authInfoManager.clear();
  }
}, { maxAge: 10000 });

export async function login(payload: LoginPayload) {
  const response = await api.post('/auth/sessions', payload);
  authInfoManager.set(response.data);
}

export async function logout() {
  await refreshTokenAuthenticatedApi.put('/auth/sessions')
    .catch(() => {});
  authInfoManager.clear();
}


export interface SignUpPayload {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export async function signUp(payload: SignUpPayload) {
  await unauthenticatedApi.post('/users/registrations', payload);
}

export async function getCurrentUserInfo() {
  const response = await api.get('/me')
  return response.data.data
}

export async function pushCurrentUserInfo(payload: any) {
  const response = await api.put('/me', payload);
}

export type OAuth2Provider = 'google' | 'facebook' | 'discord';

export function getSupportedOAuth2Providers() {
  return ['google', 'facebook', 'discord'];
}

export async function getOAuth2AuthorizationUrl(provider: OAuth2Provider) {
  const response = await unauthenticatedApi.get(`/auth/${provider}/authorization-url`);
  return response.data.url
}

interface OAuth2Credentials {
  code: string;
  state: string;
}

export async function loginByOAuth2(provider: OAuth2Provider, payload: OAuth2Credentials) {
  const response = await unauthenticatedApi.post(`/auth/${provider}/sessions`, payload);
  authInfoManager.set(response.data);
}

export async function confirmAccount(token: string) {
  unauthenticatedApi.delete(`/me/confirmation-tokens/${token}`);
}

export async function getTableOfContents() {
  const response = await api.get('/articles/tree')
  return response.data.data
}

export async function pushTableOfContentsToApi(payload: any) {
  await api.put('/articles/tree', payload)
}

export async function getArticle(slug: string) {
  const response = await api.get(`/articles/@${slug}`)
  return response.data.data
}

export async function pushArticleToApi(slug: string, payload: any) {
  const response = await api.put(`/articles/@${slug}`, payload)
}

export async function getUsers() {
  const response = await api.get('/users');
  return response.data.data
}

export async function getRoles() {
  const response = await api.get('/roles');
  return response.data.data
}

export async function pushUserToApi(id: string, payload: any) {
  const response = await api.put(`/users/~${id}`, payload);
}

export async function deleteUserFromApi(id: string) {
  const response = await api.delete(`/users/~${id}`);
}

export async function getFileMetadata(_id: string) {
  const response = await api.get(`/uploads/~${_id}`);
  const { data } = response.data;
  return {
    ...data,
    publicUrl: `${apiConfig.baseURL}/uploads/public/${data.publicToken}`
  }
}

export async function uploadPublicFile(metadata: any, file: File)  {
  const metadataUploadResponse = await api.post('/uploads', metadata);
  const { _id, name, slug, publicToken } = metadataUploadResponse.data.data

  const fd = new FormData()
  fd.append('file', file)
  await api.post(`/uploads/~${_id}/file`, fd, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return {
    _id,
    name,
    slug,
    publicToken,
    url: `${apiConfig.baseURL}/uploads/public/${publicToken}`
  }
}

export async function isArticleSlugFree(slug: string) {
  try {
    await api.head(`/articles/@${slug}`);
    return false;
  } catch (error) {
    const e: any = error
    if (e.response.status === 404) {
      return true;
    } else{
      throw error;
    }
  }
}

export async function resendConfirmationToken() {
  return api.post(`/me/confirmation-tokens`);
}

export async function sendResetPasswordToken(email: string) {
  return api.post('/me/reset-password-tokens', { email });
}

export async function resetPassword(token: string, payload: any) {
  return api.delete(`/me/reset-password-tokens/${token}`, { data: payload });
}

export async function sendNotification(payload: any) {
  return api.post('/notifications', payload);
}

export async function getNotifications(read?: boolean) {
  const qs = read !== undefined
    ? '?read=' + (read ? '1' : '0')
    : '';

  const response = await api.get('/me/notifications' + qs);
  return response.data.data
}

export async function markNotificationRead(id: string, read: boolean = true) {
  return api.put(`/me/notifications/~${id}/read`, { read });
}

export async function markAllNotificationsRead(read: boolean = true) {
  return api.put(`/me/notifications/read`, { read });
}
