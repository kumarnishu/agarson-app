import axios from "axios";
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL

let BaseURL = "/api/v1/"
if (VITE_SERVER_URL)
  BaseURL = VITE_SERVER_URL + BaseURL

const apiClient = axios.create({
  baseURL: BaseURL,
  withCredentials: true
})

apiClient.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response.data.message === "please login to access this resource" || error.response.data.message === "login again ! session expired") {
    window.location.reload()
  }
  return Promise.reject(error);
});

export {
  BaseURL,
  apiClient
}