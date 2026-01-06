export interface AvailabilityDateStatus {
  date: string;
  status: string;
}

export interface AvailabilityCalendarResponse {
  vehicleId: string;
  dates: AvailabilityDateStatus[];
}
