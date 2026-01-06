import { Component, DestroyRef, inject } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AvailabilityService } from '../../shared/services/availability.service';
import { VehicleService } from '../../shared/services/vehicle.service';
import { AvailabilityDateStatus } from '../../shared/models/availability.model';
import { VehicleResponse } from '../../shared/models/vehicle.model';

interface CalendarDay {
  date: string;
  label: string;
  isInRange: boolean;
  isToday: boolean;
  isPadding: boolean;
  status?: string;
}

interface CalendarSummary {
  total: number;
  available: number;
  rented: number;
  maintenance: number;
  unavailable: number;
  unknown: number;
}

@Component({
  selector: 'app-availability-calendar-page',
  standalone: true,
  imports: [DatePipe, NgClass, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './availability-calendar.component.html'
})
export class AvailabilityCalendarPageComponent {
  private readonly availabilityService = inject(AvailabilityService);
  private readonly vehicleService = inject(VehicleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  vehicles: VehicleResponse[] = [];
  isLoadingVehicles = false;
  isLoading = false;
  errorMessage = '';
  infoMessage = '';
  calendarDays: CalendarDay[] = [];
  calendarWeeks: CalendarDay[][] = [];
  rangeStart: Date | null = null;
  rangeEnd: Date | null = null;
  summary: CalendarSummary = {
    total: 0,
    available: 0,
    rented: 0,
    maintenance: 0,
    unavailable: 0,
    unknown: 0
  };

  readonly weekdayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  readonly filterForm = this.formBuilder.group({
    vehicleId: [''],
    startDate: [''],
    endDate: ['']
  });

  constructor() {
    const defaultRange = this.getDefaultRange();
    this.filterForm.setValue({
      vehicleId: '',
      startDate: defaultRange.startDate,
      endDate: defaultRange.endDate
    });
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.isLoadingVehicles = true;

    this.vehicleService
      .getVehicles()
      .pipe(
        finalize(() => {
          this.isLoadingVehicles = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (vehicles) => {
          this.vehicles = vehicles;
          const selected = this.filterForm.value.vehicleId;
          if (!selected && this.vehicles.length > 0) {
            this.filterForm.patchValue({ vehicleId: this.vehicles[0].id });
            this.loadCalendar();
          }
        },
        error: () => {
          this.vehicles = [];
        }
      });
  }

  loadCalendar(): void {
    const { vehicleId, startDate, endDate } = this.filterForm.value;
    this.errorMessage = '';
    this.infoMessage = '';

    if (!vehicleId || !startDate || !endDate) {
      this.errorMessage = 'Pilih kendaraan dan rentang tanggal terlebih dahulu.';
      this.resetCalendarState();
      return;
    }

    const start = this.parseDateString(startDate);
    const end = this.parseDateString(endDate);
    if (end < start) {
      this.errorMessage = 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai.';
      this.resetCalendarState();
      return;
    }

    this.isLoading = true;

    this.availabilityService
      .getAvailabilityCalendar(vehicleId, startDate, endDate)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          this.rangeStart = start;
          this.rangeEnd = end;
          const statusMap = this.buildStatusMap(response.dates ?? []);
          this.buildCalendarGrid(start, end, statusMap);
          this.summary = this.buildSummary(response.dates ?? [], start, end);
          if (!response.dates?.length) {
            this.infoMessage = 'Belum ada data ketersediaan pada rentang tersebut.';
          }
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.resetCalendarState();
        }
      });
  }

  resetFilters(): void {
    const defaultRange = this.getDefaultRange();
    const currentVehicleId = this.filterForm.value.vehicleId ?? '';
    this.filterForm.setValue({
      vehicleId: currentVehicleId,
      startDate: defaultRange.startDate,
      endDate: defaultRange.endDate
    });
    if (currentVehicleId) {
      this.loadCalendar();
    } else {
      this.resetCalendarState();
    }
  }

  getDayCellClass(day: CalendarDay): string {
    if (day.isPadding) {
      return 'bg-app text-strong/40';
    }
    if (day.status?.toLowerCase() === 'available') {
      return 'bg-primary/10 text-strong';
    }
    return 'bg-surface text-strong';
  }

  getStatusLabel(day: CalendarDay): string {
    if (day.isPadding) {
      return 'Di luar rentang';
    }
    const normalized = day.status?.toLowerCase();
    if (normalized === 'available') {
      return 'Available';
    }
    if (normalized === 'rented') {
      return 'Rented';
    }
    if (normalized === 'maintenance') {
      return 'Maintenance';
    }
    if (normalized === 'unavailable') {
      return 'Unavailable';
    }
    return 'Tidak ada data';
  }

  getStatusDotClass(day: CalendarDay): string {
    if (day.isPadding) {
      return 'bg-strong/30';
    }
    const normalized = day.status?.toLowerCase();
    if (normalized === 'available') {
      return 'bg-primary';
    }
    if (normalized === 'rented') {
      return 'bg-strong/40';
    }
    if (normalized === 'maintenance') {
      return 'bg-primary/70';
    }
    if (normalized === 'unavailable') {
      return 'bg-strong/60';
    }
    return 'bg-strong/20';
  }

  private buildStatusMap(items: AvailabilityDateStatus[]): Map<string, string> {
    const map = new Map<string, string>();
    items.forEach((item) => {
      map.set(item.date, item.status);
    });
    return map;
  }

  private buildCalendarGrid(
    start: Date,
    end: Date,
    statusMap: Map<string, string>
  ): void {
    const days: CalendarDay[] = [];
    const startOfWeek = this.getStartOfWeek(start);
    const endOfWeek = this.getEndOfWeek(end);
    const todayString = this.formatDateInput(new Date());

    for (
      let current = new Date(startOfWeek);
      current <= endOfWeek;
      current.setDate(current.getDate() + 1)
    ) {
      const dateString = this.formatDateInput(current);
      const isInRange = current >= start && current <= end;
      days.push({
        date: dateString,
        label: `${current.getDate()}`,
        isInRange,
        isPadding: !isInRange,
        isToday: dateString === todayString,
        status: statusMap.get(dateString)
      });
    }

    this.calendarDays = days;
    this.calendarWeeks = [];
    for (let i = 0; i < days.length; i += 7) {
      this.calendarWeeks.push(days.slice(i, i + 7));
    }
  }

  private buildSummary(items: AvailabilityDateStatus[], start: Date, end: Date): CalendarSummary {
    const summary: CalendarSummary = {
      total: 0,
      available: 0,
      rented: 0,
      maintenance: 0,
      unavailable: 0,
      unknown: 0
    };

    items.forEach((item) => {
      const normalized = item.status?.toLowerCase();
      if (normalized === 'available') {
        summary.available += 1;
      } else if (normalized === 'rented') {
        summary.rented += 1;
      } else if (normalized === 'maintenance') {
        summary.maintenance += 1;
      } else if (normalized === 'unavailable') {
        summary.unavailable += 1;
      }
    });

    summary.total = this.getDaysBetween(start, end) + 1;
    const known =
      summary.available + summary.rented + summary.maintenance + summary.unavailable;
    summary.unknown = Math.max(summary.total - known, 0);
    return summary;
  }

  private resetCalendarState(): void {
    this.calendarDays = [];
    this.calendarWeeks = [];
    this.rangeStart = null;
    this.rangeEnd = null;
    this.summary = {
      total: 0,
      available: 0,
      rented: 0,
      maintenance: 0,
      unavailable: 0,
      unknown: 0
    };
  }

  private getDefaultRange(): { startDate: string; endDate: string } {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      startDate: this.formatDateInput(start),
      endDate: this.formatDateInput(end)
    };
  }

  private parseDateString(value: string): Date {
    return new Date(`${value}T00:00:00`);
  }

  private formatDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getStartOfWeek(date: Date): Date {
    const mondayIndex = (date.getDay() + 6) % 7;
    const start = new Date(date);
    start.setDate(date.getDate() - mondayIndex);
    return start;
  }

  private getEndOfWeek(date: Date): Date {
    const mondayIndex = (date.getDay() + 6) % 7;
    const end = new Date(date);
    end.setDate(date.getDate() + (6 - mondayIndex));
    return end;
  }

  private getDaysBetween(start: Date, end: Date): number {
    const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    return Math.floor((endUtc - startUtc) / (1000 * 60 * 60 * 24));
  }
}
