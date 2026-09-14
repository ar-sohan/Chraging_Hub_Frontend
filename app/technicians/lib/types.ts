export type Specialisation = {
  id: number;
  name: string;
};

// Populated only by the single-record endpoints (getFaultById, getMaintenanceById,
// getSafetyCheckById) and by search results, since those can surface another
// technician's report. Absent from the arrays nested in TechnicianProfile.
export type ReportedByTechnician = {
  id: number;
  fullName: string;
};

export type MaintenanceTask = {
  id: number;
  category: 'Charging' | 'Hardware';
  stationId: string;
  stationLocation?: string;
  deviceId?: string;
  deviceType?: string;
  issue: string;
  action?: string;
  notes?: string;
  maintenanceDate: string;
  status: string;
  createdAt: string;
  technician?: ReportedByTechnician;
};

export type SafetyCheck = {
  id: number;
  stationId: string;
  stationLocation?: string;
  checkType: string;
  result: string;
  remarks: string;
  reportDate: string;
  checkedAt: string;
  technician?: ReportedByTechnician;
};

export type FaultReport = {
  id: number;
  stationId: string;
  stationLocation?: string;
  faultType: string;
  description: string;
  severity: string;
  reportDate: string;
  status: string;
  resolutionNote?: string;
  resolvedAt?: string;
  reportedAt: string;
  technician?: ReportedByTechnician;
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
  safetyChecks: SafetyCheck[];
  faultReports: FaultReport[];
};

export type StationSearchResult = {
  stationId: string;
  faultReports: FaultReport[];
  safetyChecks: SafetyCheck[];
  maintenanceTasks: MaintenanceTask[];
};
