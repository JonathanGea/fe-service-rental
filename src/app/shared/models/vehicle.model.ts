export interface VehicleResponse {
  id: string;
  name: string;
  brandId: string;
  brand: string;
  vehicleTypeId: string;
  type: string;
  year: number;
  transmission: string;
  capacity: number;
  pricePerDay: number;
  description?: string;
  status: string;
}

export interface VehicleRequest {
  name: string;
  brandId: string;
  vehicleTypeId: string;
  year: number;
  transmission: string;
  capacity: number;
  pricePerDay: number;
  description?: string;
  status: string;
}

export interface VehicleStatusRequest {
  status: string;
}
