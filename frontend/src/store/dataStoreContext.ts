import { createContext, useContext } from "react";

import type {
  BatchRecord,
  ClassReportRecord,
  EmployeeRecord,
  StudentRecord,
  TaskRecord,
  VideoRecord,
  AttendanceRecord,
  WalkinLead,
} from "../data/mockData";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
}

export interface DataStoreValue {
  walkins: WalkinLead[];
  students: StudentRecord[];
  batches: BatchRecord[];
  employees: EmployeeRecord[];
  classReports: ClassReportRecord[];
  tasks: TaskRecord[];
  videoRecords: VideoRecord[];
  attendanceRecords: AttendanceRecord[];

  addWalkin: (walkin: Omit<WalkinLead, "id">) => WalkinLead;
  addStudent: (student: Omit<StudentRecord, "id" | "photo">) => StudentRecord;
  updateStudent: (id: string, patch: Partial<StudentRecord>) => void;
  updateStudentFee: (id: string, patch: Partial<StudentRecord["fee"]>) => void;
  addBatch: (batch: Omit<BatchRecord, "id">) => BatchRecord;
  addEmployee: (employee: Omit<EmployeeRecord, "id">) => EmployeeRecord;
  addTask: (task: Omit<TaskRecord, "id">) => TaskRecord;
  updateTaskStatus: (id: string, status: TaskRecord["status"]) => void;
  addClassReport: (report: Omit<ClassReportRecord, "id">) => ClassReportRecord;
  markAttendance: (
    studentId: string,
    date: string,
    status: "Present" | "Absent" | "Leave",
  ) => boolean;

  notifications: NotificationItem[];
  dismissNotification: (id: string) => void;
}

export const DataStoreContext = createContext<DataStoreValue | null>(null);

export function useDataStore() {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error("useDataStore must be used within a DataProvider");
  return ctx;
}
