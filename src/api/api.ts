import axios from "axios"
import { Item } from "../models/Item"

export class Api {
  constructor(private readonly baseUrl: string) {}

  getItems(): Promise<Item[]> {
    return axios.get(`${this.baseUrl}/items`)
  }
}

export const api = new Api(import.meta.env.VITE_API_URL ?? 'http://localhost:3000')
