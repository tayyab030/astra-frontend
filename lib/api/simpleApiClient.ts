import axios from "axios"
import { getApiBaseUrl } from "./config"

const baseURL = getApiBaseUrl()

export const publicApi = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

export const authApi = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})
