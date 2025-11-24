import React, { createContext, useContext } from "react";
import axios, { AxiosInstance } from "axios";

// ---------------------------------------------------------
// Context
// ---------------------------------------------------------

interface HttpClientContextValue {
  axiosInstance: AxiosInstance;
}

export const HttpClientContext = createContext<HttpClientContextValue | null>(null);

// ---------------------------------------------------------
// Provider
// ---------------------------------------------------------

export const HttpClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const axiosInstance = axios.create({
    withCredentials: true, // mantém comportamento atual do MF
  });

  // -------------------------------------------------------
  // 🔥 REQUEST INTERCEPTOR — Auth para Strapi
  // -------------------------------------------------------
  axiosInstance.interceptors.request.use((config) => {
    try {
      const token = localStorage.getItem("strapi_jwt");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("Failed to read JWT from localStorage:", e);
    }
    return config;
  });

  // -------------------------------------------------------
  // RESPONSE INTERCEPTOR (opcional)
  // -------------------------------------------------------
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("HTTP Error:", error);
      return Promise.reject(error);
    }
  );

  return (
    <HttpClientContext.Provider value={{ axiosInstance }}>
      {children}
    </HttpClientContext.Provider>
  );
};

// ---------------------------------------------------------
// Hook
// ---------------------------------------------------------

export const useAxiosInstance = (): AxiosInstance => {
  const ctx = useContext(HttpClientContext);
  if (!ctx) {
    throw new Error("Axios instance is not available in HttpClientContext");
  }
  return ctx.axiosInstance;
};
