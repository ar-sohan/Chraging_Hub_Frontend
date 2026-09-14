import axios from 'axios';
import { FaultReportFormData, LoginFormData, MaintenanceFormData, ProfileUpdateFormData, RegistrationFormData, SafetyCheckFormData } from './schemas';
import { FaultReport, MaintenanceTask, SafetyCheck, StationSearchResult, TechnicianProfile } from './types';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:3000', headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use((config) => {
  const token = typeof window === 'undefined' ? null : localStorage.getItem('technicianToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// An expired/invalid token returns 401 from the JwtAuthGuard. Clear it and send the
// technician back to login instead of leaving every protected page stuck on a raw error.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isUnauthorized = axios.isAxiosError(error) && error.response?.status === 401;
    if (isUnauthorized && typeof window !== 'undefined' && !window.location.pathname.startsWith('/technicians/login')) {
      localStorage.removeItem('technicianToken');
      window.location.href = '/technicians/login';
    }
    return Promise.reject(error);
  },
);

export async function createTechnician(data: RegistrationFormData): Promise<TechnicianProfile> {
  const specialisations = data.specialisations.split(',').map((item) => item.trim()).filter(Boolean);
  return (await api.post<TechnicianProfile>('/technician/register', { ...data, certification: data.certification || undefined, socialMediaLink: data.socialMediaLink || undefined, specialisations })).data;
}

export async function loginTechnician(data: LoginFormData): Promise<{ accessToken: string; technician: TechnicianProfile }> { return (await api.post('/technician/login', data)).data; }
export async function getTechnician(id: string): Promise<TechnicianProfile> { return (await api.get(`/technician/${id}`)).data; }
export async function getMyProfile(): Promise<TechnicianProfile> { return (await api.get('/technician/me')).data; }
export async function updateCountry(id: number, country: string): Promise<TechnicianProfile> { return (await api.patch(`/technician/${id}/country`, { country })).data; }
export async function updateMyProfile(id: number, data: Partial<ProfileUpdateFormData>): Promise<TechnicianProfile> { return (await api.patch(`/technician/${id}/profile`, data)).data; }
export async function getMaintenanceTasks(id: string): Promise<MaintenanceTask[]> { return (await api.get(`/technician/${id}/maintenance`)).data; }
export async function createMaintenanceTask(id: string, data: MaintenanceFormData): Promise<MaintenanceTask> { return (await api.post(`/technician/${id}/maintenance`, data)).data; }
export async function getMaintenanceById(id: number): Promise<MaintenanceTask> { return (await api.get(`/technician/maintenance/${id}`)).data; }
export async function updateMaintenanceTask(id: number, status: string, notes?: string): Promise<MaintenanceTask> { return (await api.patch(`/technician/maintenance/${id}`, { status, notes })).data; }
export async function deleteMaintenanceTask(id: number): Promise<{ message: string }> { return (await api.delete(`/technician/maintenance/${id}`)).data; }
export async function addSpecialisation(technicianId: number, name: string): Promise<TechnicianProfile> { return (await api.post(`/technician/${technicianId}/specialisations/${encodeURIComponent(name)}`)).data; }

export async function createSafetyCheck(technicianId: number, data: SafetyCheckFormData): Promise<SafetyCheck> { return (await api.post(`/technician/${technicianId}/safety-checks`, data)).data; }
export async function getSafetyCheckById(id: number): Promise<SafetyCheck> { return (await api.get(`/technician/safety-checks/${id}`)).data; }

export async function reportFault(technicianId: number, data: FaultReportFormData): Promise<FaultReport> { return (await api.post(`/technician/${technicianId}/faults`, data)).data; }
export async function getFaultById(id: number): Promise<FaultReport> { return (await api.get(`/technician/faults/${id}`)).data; }
export async function updateFaultStatus(id: number, status: string, resolutionNote?: string): Promise<FaultReport> { return (await api.patch(`/technician/faults/${id}`, { status, resolutionNote })).data; }

export async function searchByStation(stationId: string): Promise<StationSearchResult> { return (await api.get(`/technician/search/${encodeURIComponent(stationId)}`)).data; }

export function logoutTechnician(): void { localStorage.removeItem('technicianToken'); }

// Admin approval operations. No other Admin functions are changed.
export async function getAllTechnicians(): Promise<TechnicianProfile[]> { return (await api.get('/technician')).data; }
export async function updateTechnicianApproval(id: number, approvalStatus: 'Approved' | 'Rejected'): Promise<TechnicianProfile> { return (await api.patch(`/technician/${id}/approval`, { approvalStatus })).data; }
