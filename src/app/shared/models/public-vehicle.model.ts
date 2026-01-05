export interface PublicVehicleItemResponse {
  id: string;
  name: string;
  pricePerDay: number;
  status: string;
  nextAvailableDate?: string | null;
  thumbnailUrl?: string | null;
}

export interface PublicVehiclesResponse {
  items: PublicVehicleItemResponse[];
}
