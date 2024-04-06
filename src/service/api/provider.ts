import axios, { AxiosInstance, AxiosResponse } from "axios";

// Create a base Axios instance
const api: AxiosInstance = axios.create({
	baseURL: "http://localhost:8080",
	// timeout: 5000,
});

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
	patch : (url: string, data: Data) => request("patch", url, data),
};
