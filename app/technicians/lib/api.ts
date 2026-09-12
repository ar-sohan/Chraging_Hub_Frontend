import axios from 'axios';
import { MaintenanceFormData, RegistrationFormData } from './schemas';
import { MaintenanceTask, TechnicianProfile } from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

export async function createTechnician(data: RegistrationFormData): Promise<TechnicianProfile> {
  const specialisations = data.specialisations
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const response = await api.post<TechnicianProfile>('/technician', {
    ...data,
    certification: data.certification || undefined,
    socialMediaLink: data.socialMediaLink || undefined,
    specialisations,
  });
  return response.data;
}

export async function getTechnician(id: string): Promise<TechnicianProfile> {
  const response = await api.get<TechnicianProfile>(`/technician/${id}`);
  return response.data;
}

export async function getMaintenanceTasks(id: string): Promise<MaintenanceTask[]> {
  const response = await api.get<MaintenanceTask[]>(`/technician/${id}/maintenance`);
  return response.data;
}

export async function createMaintenanceTask(
  id: string,
  data: MaintenanceFormData,
): Promise<MaintenanceTask> {
  const response = await api.post<MaintenanceTask>(`/technician/${id}/maintenance`, data);
  return response.data;
}
