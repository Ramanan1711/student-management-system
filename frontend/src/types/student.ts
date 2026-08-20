export type LeadStatus =
  | "New"
  | "Contacted"
  | "Counselling"
  | "Interested"
  | "Admission"
  | "Not Interested";

export interface Student {
  id: string;
  name: string;
  photo?: string;
  mobile: string;
  email: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  address: string;
  qualification: string;
  course: string;
  courseDuration: string;
  joiningDate: string;
  batchId: string;
  mode: "Online" | "Offline" | "Hybrid";
  assignedCounsellor: string;
}