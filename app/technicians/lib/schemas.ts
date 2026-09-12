import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

export const registrationSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .regex(/^[A-Za-z\s]+$/, 'Full name must contain alphabets only'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z.string().regex(/^01\d{9}$/, 'Phone must start with 01 and contain 11 digits'),
  location: z.string().min(1, 'Location is required'),
  country: z.string().min(1, 'Country is required').max(30, 'Country must be 30 characters or fewer'),
  experience: z.coerce.number().int('Experience must be a whole number').min(0, 'Experience cannot be negative'),
  primarySpecialisation: z.string().min(1, 'Primary specialisation is required'),
  certification: z.string(),
  socialMediaLink: z.string(),
  specialisations: z.string(),
});

export const maintenanceSchema = z.object({
  category: z.enum(['Charging', 'Hardware']),
  stationId: z.string().min(1, 'Station ID is required'),
  deviceId: z.string(),
  deviceType: z.string(),
  issue: z.string().min(1, 'Issue is required'),
  action: z.string(),
  notes: z.string(),
  maintenanceDate: z.string().min(1, 'Maintenance date is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type MaintenanceFormData = z.infer<typeof maintenanceSchema>;
