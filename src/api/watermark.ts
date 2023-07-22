import axios, { AxiosInstance } from "axios";

export class WatermarkApi {
  axios: AxiosInstance;

  constructor(baseUrl: string) {
    this.axios = axios.create({
      baseURL: baseUrl,
    });
  }

  addWatermark(formData: FormData) {
    return this.axios.post<ArrayBuffer>("/process_image", formData, {
      responseType: "arraybuffer",
    });
  }

  checkWatermark(formData: FormData) {
    return this.axios.post<string>("/check_image", formData);
  }
}

export const watermarkApi = new WatermarkApi(
  import.meta.env.VITE_WATERMARK_API_URL ?? "http://127.0.0.1:8080"
);
