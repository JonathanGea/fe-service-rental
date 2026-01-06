export interface RentalResponse {
  id: string;
  vehicleId: string;
  renterName: string;
  renterPhone: string;
  renterAddress: string;
  renterIdNumber: string;
  startDate: string;
  endDate: string;
  returnDate?: string;
  pickupLocation?: string;
  returnLocation?: string;
  priceTotal: number;
  status?: string;
  notes?: string;
  conditionNotes?: string;
}

export interface RentalRequest {
  vehicleId: string;
  renterName: string;
  renterPhone: string;
  renterAddress: string;
  renterIdNumber: string;
  startDate: string;
  endDate: string;
  pickupLocation?: string;
  returnLocation?: string;
  priceTotal: number;
  notes?: string;
}

export interface RentalUpdateRequest {
  renterName?: string;
  renterPhone?: string;
  renterAddress?: string;
  renterIdNumber?: string;
  startDate?: string;
  endDate?: string;
  pickupLocation?: string;
  returnLocation?: string;
  priceTotal?: number;
  notes?: string;
}

export interface RentalReturnRequest {
  returnDate: string;
  conditionNotes?: string;
}
