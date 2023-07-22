import axios, { AxiosInstance } from "axios";

import { Item } from "../models/Item";
import { Request } from "../models/Request";

export class Api {
  axios: AxiosInstance;

  constructor(baseUrl: string) {
    this.axios = axios.create({
      baseURL: baseUrl,
    });
  }

  getItems(): Promise<Item[]> {
    return this.axios.get(`/items`);
  }

  createItem(item: Item): Promise<Item> {
    return this.axios.post(`/items`, item);
  }

  getItem(id: string): Promise<Item> {
    return this.axios.get(`/items/${id}`);
  }

  createRequest(request: Request): Promise<Request> {
    return this.axios.post(`/requests`, request);
  }

  getRequests(): Promise<Request[]> {
    return this.axios.get(`/requests`);
  }

  getRequest(id: string): Promise<Request> {
    return this.axios.get(`/requests/${id}`);
  }

  updateRequest(id: string, request: Request): Promise<Request> {
    return this.axios.put(`/requests/${id}`, request);
  }
}

export const api = new Api(
  import.meta.env.VITE_API_URL ?? "http://localhost:3000"
);
