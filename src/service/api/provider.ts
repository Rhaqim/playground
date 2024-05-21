import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

import { BASE_URL_DEV } from "@/config";

let apiUrl = BASE_URL_DEV;

export const setApiUrl = (url: string) => {
	apiUrl = url;
};

console.log("API URL", apiUrl);

const api: AxiosInstance = axios.create({
	baseURL: apiUrl,
});

api.interceptors.request.use(config => {
	config.baseURL = apiUrl;
	return config;
});

// api.interceptors.response.use(
// 	(response) => {
// 		return response.data;
// 	},
// 	(error: AxiosError) => {
// 		const { response } = error;

// 		if (response && response?.status >= 400) {
// 			console.error("Error Response", response);
// 		}

// 		return Promise.reject(error);

// 	}
// );

// Define the Data type
type Data = Record<string, any>;

const request = async (
	method: "get" | "post" | "put" | "delete" | "patch",
	url: string,
	data?: Data
): Promise<Data> => {
	const response: AxiosResponse<Data> = await api[method](url, data);
	return response;
};

export const apiFunctions = {
	get: (url: string) => request("get", url),
	post: (url: string, data: Data) => request("post", url, data),
	put: (url: string, data: Data) => request("put", url, data),
	del: (url: string, data?: Data) => request("delete", url, data),
	patch: (url: string, data: Data) => request("patch", url, data),
};
