import axios, { AxiosInstance } from "axios";

export class WatermarkApi {
  axios: AxiosInstance;

  constructor(baseUrl: string) {
    this.axios = axios.create({
      baseURL: baseUrl,
    });
  }

  addWatermark(formData: FormData) {
    return this.axios.post("/process_image", formData, {
      responseType: "arraybuffer",
    });
  }

  checkWatermark(formData: FormData) {
    return this.axios.post("/check_image", formData);
  }
}

export const watermarkApi = new WatermarkApi(
  import.meta.env.VITE_API_URL ?? "http://localhost:5000"
);
