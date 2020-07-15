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
  password: string
}

export interface ISimpleInterceptorMap<T=any> {
  prev: ISimpleXHRPrevInterceptor;
  next: ISimpleXHRNextInterceptor<T>;
}

export type ISimpleXHRMethod =
  'GET'
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
  data: T,
  headers: any;
}
