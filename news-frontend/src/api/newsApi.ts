import axios from "axios";

const API = axios.create({
  baseURL: "/api", // this will be proxied to FastAPI
});

export const fetchNews = () => API.get("/news");
export const fetchTrending = () => API.get("/api/v1/news/trending/");

// Re-export the new feed files API functions
export {
  fetchFeedFiles,
  fetchNationalLatestNews,
  fetchWorldLatestNews,
  fetchLatestNewsByCategory,
  fetchNewsByCategory
} from '../services/newsApi';
export const fetchTrendingLatest = () => API.get("/api/v1/news/trending/latest");
export const fetchTrendingCategories = () => API.get("/api/v1/news/trending/categories");
export const refreshTrending = () => API.post("/api/v1/news/trending/refresh");
export const fetchBreaking = () => API.get("/news/breaking");
export const fetchPublic = () => API.get("/news/public");
