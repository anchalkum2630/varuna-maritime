import axios from "axios";
import type { Route, CBEntry, PoolMember } from "../types";

const BASE_URL = "http://localhost:4000";

export const api = axios.create({
  baseURL: BASE_URL,
});

// ROUTES
export const getRoutes = async (): Promise<Route[]> => {
  const res = await api.get("/routes");
  return res.data;
};

export const setBaseline = async (routeId: string) => {
  const res = await api.post(`/routes/${routeId}/baseline`);
  return res.data;
};

export const getComparison = async () => {
  const res = await api.get("/routes/comparison");
  return res.data;
};

// COMPLIANCE / BANKING
export const getCB = async (shipId: string, year: number) => {
  const res = await api.get("/compliance/cb", { params: { shipId, year } });
  return res.data;
};

export const getAdjustedCB = async (year: number) => {
  const res = await api.get("/compliance/adjusted-cb", { params: { year } });
  return res.data;
};

export const getBankRecords = async (shipId: string, year: number) => {
  const res = await api.get("/banking/records", { params: { shipId, year } });
  return res.data;
};

export const bankCB = async (shipId: string, year: number) => {
  const res = await api.post("/banking/bank", { shipId, year });
  return res.data;
};

export const applyBank = async (shipId: string, year: number, amount: number) => {
  const res = await api.post("/banking/apply", { shipId, year, amount });
  return res.data;
};

// POOLS
export const createPool = async (year: number, members: PoolMember[]) => {
  const res = await api.post("/pools", { year, members });
  return res.data;
};
