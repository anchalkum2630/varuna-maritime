import axios from "axios";
import type { Route, ComparisonResponse, AdjustedCBItem } from "../types";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
const api = axios.create({ baseURL: BASE, timeout: 5000 });

// Routes
export const fetchRoutes = async (): Promise<Route[]> => {
  const r = await api.get("/routes");
  console.log(r);
  return r.data;
};
export const postSetBaseline = async (routeId: string) => {
  const r = await api.post(`/routes/${routeId}/baseline`);
  
  return r.data;
};
export const fetchComparison = async (): Promise<ComparisonResponse> => {
  const r = await api.get("/routes/comparison");
  return r.data;
};

// Compliance / Banking / Pools
export const fetchCB = async (shipId: string, year: number) => {
  const r = await api.get(`/compliance/cb?shipId=${encodeURIComponent(shipId)}&year=${year}`);
  return r.data;
};
export const fetchAdjustedCB = async (year: number): Promise<{ year: number; adjusted: AdjustedCBItem[] }> => {
  const r = await api.get(`/compliance/adjusted-cb?year=${year}`);
  return r.data;
};

export const bankSurplus = async (payload: { shipId: string; year: number }) => {
  const r = await api.post("/banking/bank", payload);
  return r.data;
};
export const applyBank = async (payload: { shipId: string; year: number; amount: number }) => {
  const r = await api.post("/banking/apply", payload);
  return r.data;
};

export const createPool = async (payload: { year: number; members: { shipId: string; cb: number }[] }) => {
  const r = await api.post("/pools", payload);
  return r.data;
};
