import axios, { AxiosInstance } from 'axios';
import { HazardNewRow } from '../types/quantificationData';
import { getBaseApiUrl } from '../urls-defs';

let instance: AxiosInstance | null = null;
const serverUrl: string = getBaseApiUrl();

export const configureAxiosInstance = (
  getToken: () => string,
  baseURL = serverUrl
) => {
  instance = axios.create({
    baseURL,
  });
  instance.interceptors.request.use((config) => {
    const newConfig = { ...config };

    newConfig.headers['Accept'] = 'application/json';
    newConfig.headers['Authorization'] = `Bearer ${getToken()}`;

    return newConfig;
  });
  return instance;
};

// hazard api

export const getHazards = (client: AxiosInstance, params: { phrase: string }) =>
  client
    .get<HazardNewRow[]>(`${serverUrl}/api/search-hazard`, { params })
    .then(({ data }) => data)
    .catch((err) => {
      console.error(err);
      return [];
    });
