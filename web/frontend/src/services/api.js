import axios from "axios";
import { getCookie } from "../utils/getCookie";

const isDev = process.env.NODE_ENV === "development";
const API_DELAY = isDev ? 400 : 0;
const sleep = () => new Promise((resolve) => setTimeout(resolve, API_DELAY));

const axiosInstance = axios.create({
  baseURL: isDev
    ? "http://127.0.0.1:8001/api" // Note this needs to be exact for sessions cookie to be inc via withCredentials (ie 127.0.0.1 =/= localhost!)
    : "https://links.bayford.dev/api",
  timeout: 3000,
  withCredentials: true,
});

axiosInstance.defaults.headers.post["X-CSRFToken"] = getCookie("csrftoken");
axiosInstance.defaults.headers.post["Content-Type"] = "application/jsom";

// Interceptors
axiosInstance.interceptors.request.use(
  (requestConfig) => {
    return requestConfig;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosInstance.interceptors.response.use(
  async (response) => {
    await sleep();
    return response;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// Axios config
const requests = {
  get: (url) => axiosInstance.get(url),
  post: (url, body) => axiosInstance.post(url, body),
  put: (url, body) => axiosInstance.put(url, body),
  patch: (url, body) => axiosInstance.patch(url, body),
  delete: (url) => axiosInstance.delete(url),
};

// APIs
const Config = {
  getConfig: () =>
    requests.get("config").then(({ data }) => {
      const platformLookup = {};
      data.platform_lookup.forEach(
        (platform) => (platformLookup[platform[0]] = platform[1])
      );

      return {
        platformLookup,
        platformRegexes: data?.platform_regexes,
        platforms: data?.platforms,
      };
    }),
};

const User = {
  getUser: () => requests.get("user").then((res) => res.data),
  updateUser: (userData) =>
    requests.post("user", userData).then((res) => {
      return { status: res.status };
    }),
  uploadProfilePicture: (profilePicture) =>
    requests.post("user/upload", profilePicture).then((res) => {
      return { status: res.status };
    }),
};

const Links = {
  reorderLinks: () => requests.get("links").then((res) => res.data),
  createLink: (link) => requests.post("links", link).then((res) => res.data),
  updateLink: (link) =>
    requests.patch(`links/${link.id}`, link).then((res) => res.data),
  updateLinks: (links) => requests.patch("links/reorder", { links: links }),
  deleteLink: (id) => requests.delete(`links/${id}`),
};

const api = {
  Config,
  User,
  Links,
};

export default api;
