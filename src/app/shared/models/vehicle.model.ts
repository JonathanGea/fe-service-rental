export interface VehicleResponse {
  id: string;
  name: string;
  brand: string;
  type: string;
  year: number;
  transmission: string;
  capacity: number;
  pricePerDay: number;
  description?: string;
  status: string;
  categoryId?: string;
}

export interface VehicleRequest {
  name: string;
  brand: string;
  type: string;
  year: number;
  transmission: string;
  capacity: number;
  pricePerDay: number;
  description?: string;
  status: string;
  categoryId?: string;
}

export interface VehicleStatusRequest {
  status: string;
}
