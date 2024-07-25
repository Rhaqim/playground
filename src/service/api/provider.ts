import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

import { BASE_URL_DEV } from "@/config";

let apiUrl = BASE_URL_DEV;

export const setApiUrl = (url: string) => {
	apiUrl = url;
};

const api: AxiosInstance = axios.create({
	baseURL: apiUrl,
});

api.interceptors.request.use(config => {
	config.baseURL = apiUrl;
	return config;
});

api.interceptors.response.use(
	response => {
		console.log("response", response);
		return response;
	},
	(error: AxiosError) => {
		const { response, request } = error || {};

		if (!response && !request) {
			console.log(error.message);
		}

		const { data, status } = response || {};

		// auth me handling
		const url = request.responseURL.split("/");

		if (
			(status === 401 && url[url.length - 1] === "me") ||
			error.message === "Network Error"
		) {
			// Unauthorized
			return null;
		}
	}
);

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

export const requestBlob = async (
	method: "get" | "post" | "put" | "delete" | "patch",
	url: string,
	data?: Data
): Promise<Blob> => {
	const response: AxiosResponse<Blob> = await api[method](url, data, {
		responseType: "blob",
	});
	return response.data;
};

export const apiFunctions = {
	get: (url: string) => request("get", url),
	post: (url: string, data: Data) => request("post", url, data),
	put: (url: string, data: Data) => request("put", url, data),
	del: (url: string, data?: Data) => request("delete", url, data),
	patch: (url: string, data: Data) => request("patch", url, data),
};
