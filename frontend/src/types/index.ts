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

export type ComparisonResponse = {
  baseline: { routeId: string; ghgIntensity: number };
  comparisons: {
    routeId: string;
    ghgIntensity: number;
    percentDiff: number;
    compliant: boolean;
  }[];
  target?: number;
};

export type AdjustedCBItem = {
  shipId: string;
  cb: number;
};
