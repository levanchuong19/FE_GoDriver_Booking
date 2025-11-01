export interface FareBracket {
  from: number;
  to: number | null;
  pricePerKm: number;
}

export interface Multipliers {
  after21h?: number;
  after23h?: number;
  weekend?: number;
  holiday?: number;
}

export interface FarePolicyInput {
  serviceType: "per_km" | string;
  baseFare: number;
  fareBrackets: FareBracket[];
  multipliers?: Multipliers;
  waitingFeePerMin?: number;
  platformFee?: number;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface FarePolicy extends FarePolicyInput {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
