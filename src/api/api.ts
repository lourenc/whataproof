import axios, { AxiosInstance } from "axios";

import { Item } from "../models/Item";
import { Request, RequestStatus } from "../models/Request";

export class Api {
  axios: AxiosInstance;

  constructor(baseUrl: string) {
    this.axios = axios.create({
      baseURL: baseUrl,
    });
  }

  async createItem(dto: { meta: string; distributor: string }): Promise<Item> {
    const response = await this.axios.post(`/items`, dto);
    return response.data;
  }

  async getItem(id: string): Promise<Item> {
    const response = await this.axios.get(`/items/${id}`);
    return response.data;
  }

  async createRequest(request: {
    initiator: string;
    distributor: string;
    status: RequestStatus;
    itemId: string;
  }): Promise<Request> {
    const response = await this.axios.post(`/requests`, request);
    return response.data;
  }

  async getRequests(): Promise<Request[]> {
    const response = await this.axios.get(`/requests`);
    return response.data;
  }

  async getRequest(id: string): Promise<Request> {
    const response = await this.axios.get(`/requests/${id}`);
    return response.data;
  }

  async updateRequest(
    id: string,
    request: { meta?: string; status: RequestStatus }
  ): Promise<Request> {
    const response = await this.axios.put(`/requests/${id}`, request);
    return response.data;
  }

  async getItems(): Promise<Item[]> {
    const response = await this.axios.get(`/items`);
    return response.data;
  }
}

export const api = new Api(
  import.meta.env.VITE_API_URL ?? "http://localhost:3000"
);
