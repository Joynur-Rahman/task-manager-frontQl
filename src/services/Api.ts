import axios, { type AxiosRequestConfig } from "axios";
import tokens from "./tokens.json";

interface Tokens {
  [key: string]: string | false;
}

// Base64 encoding characters
const base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function toBase64(num: number): string {
  let result = "";
  const str = num.toString();
  for (let i = 0; i < str.length; i++) {
    const charCode = parseInt(str[i]);
    result += base64chars[charCode % 64];
  }
  return result;
}

const database = import.meta.env.VITE_DATABASE;

const baseUrl = import.meta.env.VITE_BASE_URL;
const localServer = import.meta.env.VITE_FQ_LOCAL_SERVER;

type HttpMethod = "get" | "post" | "put" | "delete" | "sql";

type RequestOptions = {
  loading?: boolean;
  body?: {
    sql: "string";
    params: [{ [key: string]: string | number }];
  };
  key?: string;
  page?: string;
  sort?: string;
  joins?: string;
  filter?: string;
  search?: string;
  nearby?: string;
  hidden?: string;
  fields?: string;
  session?: string;
  validation?: string;
  permissions?: string;
};

function uniqueKey(input: string) {
  let code = input.charCodeAt(0);
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    code = (code << 5) - code + char;
    code &= code;
  }

  return toBase64(Math.abs(code)).substring(0, 8);
}

function getKey(method: HttpMethod, url: string, options: RequestOptions) {
  if (!localServer) throw new Error("localServer is not defined");
  const _url = localServer + url;
  const parsed_url = new URL(_url);
  const pathname = "/" + parsed_url.pathname.split("/")[1];

  const request: any = {
    fields: options?.fields,
    hidden: options?.hidden,
    filter: options?.filter,
    nearby: options?.nearby,
    collections: options?.joins,
    permissions: options?.permissions,
    validation: options?.validation,
  };

  request["body_is_array"] = Array.isArray(options.body || {});

  let tokenStr = pathname;
  for (const key in request) {
    if (request[key as keyof typeof request]) {
      tokenStr += key + ":" + request[key as keyof typeof request];
    }
  }
  const key = method + ":" + pathname + ">" + uniqueKey(tokenStr);
  return key;
}

const makeRequest = async (method: HttpMethod, endpoint: string, options: RequestOptions = {}): Promise<unknown> => {
  const {
    body,
    page,
    sort,
    joins,
    hidden,
    fields,
    filter,
    search,
    nearby,
    session,
    validation,
    permissions,
    loading = true,
  } = options;

  const headers: any = {};

  if (hidden) headers.hidden = hidden;
  if (filter) headers.filter = filter;
  if (fields) headers.fields = fields;
  if (session) headers.session = session;
  if (nearby) headers.nearby = nearby;
  if (joins) headers.collections = joins;
  if (validation) headers.validation = validation;
  if (permissions) headers.permissions = permissions;

  const key = getKey(method, endpoint, options);
  const token = (tokens as Tokens)[key] || false;

  if (!token) {
    headers["key"] = key;
  } else {
    headers.token = token;
  }

  const params: { [key: string]: string | number | boolean | object | undefined } = {
    page: page,
    sort: sort,
    search: search,
  };

  try {
    if (loading) {
      console.log("Loading started...");
    }

    const axiosInstance = axios.create({
      baseURL: token ? baseUrl : localServer,
      headers: { app: database },
    });

    const requestConfig: AxiosRequestConfig = {
      method,
      params,
      headers,
      data: body,
      url: endpoint,
    };

    const response = await axiosInstance(requestConfig);
    return response.data;
  } catch (error: any) {
    console.error(`${method.toUpperCase()} Error:`, error.message);
    throw error;
  } finally {
    if (loading) {
      console.log("Loading completed.");
    }
  }
};

const Api = {
  get: async (endpoint: string, options?: RequestOptions): Promise<any> => makeRequest("get", endpoint, options),
  put: async (endpoint: string, options?: RequestOptions): Promise<any> => makeRequest("put", endpoint, options),
  post: async (endpoint: string, options?: RequestOptions): Promise<any> => makeRequest("post", endpoint, options),
  delete: async (endpoint: string, options?: RequestOptions): Promise<any> => makeRequest("delete", endpoint, options),
  sql: async (endpoint: string, options?: RequestOptions): Promise<any> =>
    makeRequest("post", `/sql-${endpoint.replace("/", "")}`, options),
};

export { Api };
export default Api;