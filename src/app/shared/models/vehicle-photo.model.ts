export interface VehiclePhotoResponse {
  id: string;
  vehicleId: string;
  url: string;
  caption?: string;
  order?: number;
}

export interface VehiclePhotoUpdateRequest {
  order?: number;
  caption?: string;
}
