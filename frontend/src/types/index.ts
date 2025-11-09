export type Route = {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline?: boolean;
};

export type Comparison = {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  percentDiff: number;
  compliant: boolean;
};

export type CBEntry = {
  shipId: string;
  year: number;
  cb: number;
};

export type BankRecord = {
  id: number;
  shipId: string;
  year: number;
  amount: number;
};

export type PoolMember = {
  shipId: string;
  cb: number;
};
