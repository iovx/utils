import { getCookie, isCSRFSafeMethod } from './util';

type MapType<T = any> = Record<string, T>;

export interface ISimpleXHROptions<T = any> {
  async?: boolean;
  url: string;
  data?: any;
  method?: ISimpleXHRMethod;
  contentType?: string;
  dataType?: XMLHttpRequestResponseType;
  withCredentials?: boolean;
  timeout?: number;
  aysnc?: boolean;
  listener?: ISimpleXHRListener;
  headers?: ISimpleXHRHeader;
  uploadListener?: ISimpleXHRUploadListener;
  auth?: ISimpleXHRAuth;
  prevInterceptors?: ISimpleXHRPrevInterceptor[];
  nextInterceptors?: ISimpleXHRNextInterceptor<T>[];

  success?(response: ISimpleXHRResponse<T>): void;

  error?: ((data: any, xhr: XMLHttpRequest) => void) | null;

  beforeSend?(xhr: XMLHttpRequest): void;
}

export type ISimpleXHRPrevInterceptorMethod = (options: ISimpleXHROptions, xhr: XMLHttpRequest) => boolean;
export type ISimpleXHRNextInterceptorMethod<T = any> = (response: ISimpleXHRResponse<T>) => ISimpleXHRResponse<T>;

export interface ISimpleXHRInterceptor {
  intercept: Function;
}

export interface ISimpleXHRPrevInterceptor extends ISimpleXHRInterceptor {
  intercept: ISimpleXHRPrevInterceptorMethod;
}

export interface ISimpleXHRNextInterceptor<T = any> extends ISimpleXHRInterceptor {
  intercept: ISimpleXHRNextInterceptorMethod<T>;
}

export interface ISimpleXHRAuth {
  username: string;
  password: string;
}

export type ISimpleXHRMethod =
  | 'GET'
  | 'POST'
  | 'OPTIONS'
  | 'DELETE'
  | 'PUT'
  | 'HEAD'
  | 'get'
  | 'post'
  | 'options'
  | 'delete'
  | 'put'
  | 'head';

export interface ISimpleXHRHeader {
  [index: string]: string;
}

export interface ISimpleXHRListener {
  [index: string]: (ev: XMLHttpRequestEventTargetEventMap[keyof XMLHttpRequestEventTargetEventMap]) => any;
}

export interface ISimpleXHRUploadListener {
  [index: string]: (ev: XMLHttpRequestEventTargetEventMap[keyof XMLHttpRequestEventTargetEventMap]) => any;
}

export interface ISimpleXHRResponse<T = any> {
  status: number;
  statusText: string;
  data: T;
  headers: any;
}

function getParsedHeaders(headerString: string) {
  return headerString
    .split('\r\n')
    .filter((item) => !!item)
    .reduce((prev, cur) => {
      const [key, value] = cur.split(':', 2);
      prev[key] = value.trim();
      return prev;
    }, {} as ISimpleXHRHeader);
}

const contentTypeObj: MapType<string> = {
  form: 'application/x-www-form-urlencoded;charset=utf-8',
  xml: 'application/xml;charset-utf-8',
  'plain-text': 'application/text;charset-utf-8',
  'form-data': 'application/form-data;charset-utf-8',
  json: 'application/json;charset=utf-8',
  upload: 'multipart/form-data',
  none: 'NONE',
};

/**
 * GET JSON参数
 * @param data
 */
function buildJSON(data: object) {
  return encodeURIComponent(JSON.stringify(data));
}

/**
 * 转换参数
 * @param data
 * @returns {string}
 */
function buildQuery(data: string | object | [string, string][]) {
  if (data) {
    if (data instanceof FormData) {
      return data;
    }
    if (typeof data === 'string') {
      return data;
    }
    if (Array.isArray(data)) {
      return data
        .filter(([key, value]) => typeof value !== 'undefined')
        .map(([key, value]) => {
          return `${key}=${encodeURIComponent(value)}`;
        })
        .join('&');
    }
    if (typeof data === 'object') {
      return Object.entries(data)
        .filter(([key, value]) => typeof value !== 'undefined')
        .map(([key, value]) => {
          return `${key}=${encodeURIComponent(value)}`;
        })
        .join('&');
    }
  }
  return '';
}

/**
 * 计算GET URL
 * @param url
 * @param params
 * @param contentType
 */
function getUrl(url: string, params?: string | object | object[], contentType?: string) {
  if (typeof params === 'undefined') {
    return url;
  }
  const result = url.trim();
  const lastChar = result[result.length - 1];
  const b = contentType === contentTypeObj.json ? buildJSON : buildQuery;
  if (result.indexOf('?') !== -1) {
    return `${url}${lastChar === '&' ? '' : '&'}${b(params)}`;
  }
  return `${url}?${b(params)}`;
}

function buildBodyData(params?: string | object | object[], contentType?: string) {
  if (!params) {
    return;
  }
  if (
    contentType === contentTypeObj.upload ||
    contentType === contentTypeObj.json ||
    contentType === contentTypeObj['form-data']
  ) {
    const formData = new FormData();
    Object.entries(params).forEach(([k, v]) => {
      formData.append(k, v instanceof Blob ? v : typeof v === 'object' ? JSON.stringify(v) : v);
    });
    return formData;
  }
  const b = contentType === contentTypeObj.json ? buildJSON : buildQuery;
  return b(params);
}

function getDefaultOptions(): Partial<ISimpleXHROptions> {
  return {
    method: 'GET' as ISimpleXHRMethod,
    dataType: 'json' as XMLHttpRequestResponseType,
    withCredentials: false,
    timeout: 0,
    aysnc: true,
    headers: {} as ISimpleXHRHeader,
    listener: {} as ISimpleXHRListener,
    contentType: contentTypeObj.form,
    uploadListener: {} as ISimpleXHRUploadListener,
    auth: {} as ISimpleXHRAuth,
    error: null as ((data: any) => void) | null,
    prevInterceptors: [] as ISimpleXHRPrevInterceptor[],
    nextInterceptors: [] as ISimpleXHRNextInterceptor[],
  };
}

export function SimpleXHR<T = any>(options: ISimpleXHROptions<T>) {
  const finalOptions: ISimpleXHROptions = { ...getDefaultOptions(), ...options };
  const {
    url,
    async = true,
    timeout = 0,
    withCredentials = true,
    dataType,
    contentType,
    data,
    auth,
    method,
    listener,
    uploadListener,
    headers,
    success,
    beforeSend,
    error,
    prevInterceptors,
    nextInterceptors,
  } = finalOptions;
  const xhr = new XMLHttpRequest();
  const { username, password } = auth || ({} as ISimpleXHRAuth);
  const finalMethod = method || 'GET';
  let finalUrl = url;
  const ct = contentTypeObj[contentType || ''] || contentType;
  if (finalMethod.toUpperCase() === 'GET' || finalMethod.toUpperCase() === 'HEAD') {
    finalUrl = getUrl(finalUrl, data, ct);
  }
  const finalPrevInterceptors = prevInterceptors || [];
  while (finalPrevInterceptors.length) {
    const interceptor = finalPrevInterceptors.shift();
    if (interceptor) {
      const res = interceptor.intercept(finalOptions, xhr);
      if (!res) {
        return null;
      }
    }
  }
  if (listener) {
    Object.keys(listener).forEach((key) => {
      xhr.addEventListener(key, listener[key]);
    });
  }
  if (uploadListener) {
    Object.keys(uploadListener).forEach((key) => {
      xhr.upload.addEventListener(key, uploadListener[key]);
    });
  }
  if (async && dataType) {
    xhr.responseType = dataType;
  }
  if (error) {
    xhr.onerror = function (e: ProgressEvent<EventTarget>) {
      error(e, xhr);
    };
  }
  const result: ISimpleXHRResponse<T> = {
    status: 0,
    statusText: '',
    data: (null as any) as T,
    headers: {} as ISimpleXHRHeader,
  };
  xhr.onreadystatechange = () => {
    const { statusText, status, response } = xhr;
    result.data = response;
    result.status = status;
    result.statusText = statusText;
    if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
      result.headers = getParsedHeaders(xhr.getAllResponseHeaders());
      return;
    }
    if (xhr.readyState === XMLHttpRequest.OPENED) {
      if (!isCSRFSafeMethod(finalMethod as string)) {
        xhr.setRequestHeader('X-CSRFTOKEN', getCookie('CSRF_TOKEN') || '');
      }
      if (ct && ct !== 'NONE' && ct.toLowerCase() !== 'multipart/form-data') {
        xhr.setRequestHeader('Content-Type', ct);
      }
      if (headers) {
        Object.keys(headers).forEach((key) => {
          if (key.toLocaleLowerCase() === 'content-type') {
            return;
          }
          xhr.setRequestHeader(key, headers[key]);
        });
      }
      return;
    }
    if (xhr.readyState === XMLHttpRequest.UNSENT) {
      return;
    }
    if (xhr.readyState === XMLHttpRequest.LOADING) {
      return;
    }
    if (xhr.readyState === XMLHttpRequest.DONE) {
      let temp = result;
      const finalNextInterceptors = nextInterceptors || [];
      while (finalNextInterceptors.length) {
        const interceptor = finalNextInterceptors.shift();
        if (interceptor) {
          temp = interceptor.intercept(temp);
        }
      }
      if (xhr.status === 200) {
        if (success) {
          success(temp);
        }
      } else {
        if (error) {
          error(temp, xhr);
        }
      }
      return;
    }
  };
  xhr.open(finalMethod, finalUrl, async, username, password);
  xhr.timeout = timeout;
  xhr.withCredentials = withCredentials;
  const body = buildBodyData(data, contentType);
  xhr.send(body);
  return xhr;
}

export function request<T = any>(options: ISimpleXHROptions) {
  return new Promise<ISimpleXHRResponse<T>>((resolve, reject) => {
    const xhr = SimpleXHR<T>({
      ...options,
      success: (res) => {
        resolve(res);
      },
      error: (res) => {
        reject({ res, xhr });
      },
    });
  });
}

export function remove<T>(options: ISimpleXHROptions) {
  return request<T>({
    method: 'DELETE',
    ...options,
  });
}

export function put<T>(options: ISimpleXHROptions) {
  return request<T>({
    method: 'PUT',
    ...options,
  });
}

export default class Http {
  static get<T = any>(options: ISimpleXHROptions) {
    return request<T>({
      method: 'GET',
      ...options,
    });
  }

  static post<T = any>(options: ISimpleXHROptions) {
    return request<T>({
      method: 'POST',
      ...options,
    });
  }

  static head<T = any>(options: ISimpleXHROptions) {
    return request<T>({
      method: 'HEAD',
      ...options,
    });
  }

  static delete<T = any>(options: ISimpleXHROptions) {
    return request<T>({
      method: 'DELETE',
      ...options,
    });
  }

  static put<T = any>(options: ISimpleXHROptions) {
    return put<T>(options);
  }
}
