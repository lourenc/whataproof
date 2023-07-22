import axios, { AxiosInstance } from "axios";

export class WatermarkApi {
  axios: AxiosInstance;

  constructor(baseUrl: string) {
    this.axios = axios.create({
      baseURL: baseUrl,
    });
  }

  addWatermark(formData: FormData) {
    return this.axios
      .post("/process_image", formData, {
        responseType: "arraybuffer",
      })
      .then((response) => response.data);
  }

  checkWatermark(formData: FormData): Promise<string> {
    return this.axios
      .post("/check_image", formData)
      .then((response) => response.data);
  }
}

export const watermarkApi = new WatermarkApi(
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:5000"
);
