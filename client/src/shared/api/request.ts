import qs from 'qs';
import { merge } from 'lodash-es';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';


export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15_000,
  params: {
    // type: 'public',
    // app_id: import.meta.env.PACKAGE_VERSION,
  },
  headers: {},
});

type ReqType = object & { user_token?: string | null; };
export type ApiResponse<Res> = {
  success: boolean,
  result: Res,
};

interface IRequest<Req extends ReqType> {
  method: 'POST' | 'GET' | 'PUT' | 'DELETE',
  url: string,
  data: Req,
  addition: AxiosRequestConfig,
}

export async function fetch <Res, Req extends ReqType> ({
  method,
  url,
  data,
  addition,
}: IRequest<Req>) {
  // const headers = data.user_token ? { Authorization: `Bearer ${data.user_token}` } : {};

  const query = method === 'GET'
    ? qs.stringify(data, { arrayFormat: 'repeat', addQueryPrefix: true })
    : '';
  const config: AxiosRequestConfig = {
    method,
    data,
    url: `${url}${query}`,
  };

  const res = await api<Req, Res>(merge(config, addition));

  return res as AxiosResponse<ApiResponse<Res>>;
}

type requestType = {
  <Res, Req extends ReqType>(
    url: IRequest<Req>['url'],
    data: Req,
    addition?: IRequest<Req>['addition'],
  ): Promise<AxiosResponse<ApiResponse<Res>>>;
};

const request: {
  get: requestType;
  post: requestType;
  put: requestType;
  delete: requestType;
} = {
  get: (url, data, addition = {}) => fetch({ method: 'GET', url, data, addition }),
  post: (url, data, addition = {}) => fetch({ method: 'POST', url, data, addition }),
  put: (url, data, addition = {}) => fetch({ method: 'PUT', url, data, addition }),
  delete: (url, data, addition = {}) => fetch({ method: 'DELETE', url, data, addition }),
};

export default request;
