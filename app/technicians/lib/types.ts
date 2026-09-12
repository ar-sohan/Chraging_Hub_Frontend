export type Specialisation = {
  id: number;
  name: string;
};

export type MaintenanceTask = {
  id: number;
  category: 'Charging' | 'Hardware';
  stationId: string;
  deviceId?: string;
  deviceType?: string;
  issue: string;
  action?: string;
  notes?: string;
  maintenanceDate: string;
  status: string;
};

export type TechnicianProfile = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  country: string;
  experience: number;
  primarySpecialisation: string;
  certification?: string;
  socialMediaLink?: string;
  profilePhoto?: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  joiningDate: string;
  specialisations: Specialisation[];
  maintenanceTasks: MaintenanceTask[];
};
