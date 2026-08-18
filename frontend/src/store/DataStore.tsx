import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  walkinLeads as seedWalkins,
  students as seedStudents,
  batches as seedBatches,
  employees as seedEmployees,
  classReports as seedClassReports,
  tasks as seedTasks,
  type WalkinLead,
  type StudentRecord,
  type BatchRecord,
  type EmployeeRecord,
  type ClassReportRecord,
  type TaskRecord,
} from "../data/mockData";

interface DataStoreValue {
  walkins: WalkinLead[];
  students: StudentRecord[];
  batches: BatchRecord[];
  employees: EmployeeRecord[];
  classReports: ClassReportRecord[];
  tasks: TaskRecord[];

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
    status: "Present" | "Absent" | "Leave",
  ) => void;

  notifications: { id: string; title: string; description: string; time: string }[];
  dismissNotification: (id: string) => void;
}

const DataStoreContext = createContext<DataStoreValue | null>(null);

function nextId(prefix: string, count: number, pad = 3) {
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(count + 1).padStart(pad, "0")}`;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [walkins, setWalkins] = useState<WalkinLead[]>(seedWalkins);
  const [students, setStudents] = useState<StudentRecord[]>(seedStudents);
  const [batches, setBatches] = useState<BatchRecord[]>(seedBatches);
  const [employees, setEmployees] = useState<EmployeeRecord[]>(seedEmployees);
  const [classReports, setClassReports] =
    useState<ClassReportRecord[]>(seedClassReports);
  const [tasks, setTasks] = useState<TaskRecord[]>(seedTasks);
  const [notifications, setNotifications] = useState<
    { id: string; title: string; description: string; time: string }[]
  >([
    {
      id: "N-1",
      title: "New enquiry - Nisha Menon",
      description: "Weekend Full Stack batch",
      time: "2h ago",
    },
    {
      id: "N-2",
      title: "Fee reminder - Karthik S",
      description: "₹16,000 pending, due 20 Aug",
      time: "1d ago",
    },
  ]);

  const pushNotification = useCallback(
    (title: string, description: string) => {
      setNotifications((prev) => [
        {
          id: `N-${Date.now()}`,
          title,
          description,
          time: "just now",
        },
        ...prev,
      ]);
    },
    [],
  );

  const addWalkin = useCallback<DataStoreValue["addWalkin"]>((walkin) => {
    const record: WalkinLead = {
      ...walkin,
      id: nextId("WL", walkins.length + seedWalkins.length),
    };
    setWalkins((prev) => [record, ...prev]);
    pushNotification("New walk-in enquiry", record.studentName);
    return record;
  }, [walkins.length, pushNotification]);

  const addStudent = useCallback<DataStoreValue["addStudent"]>((student) => {
    const record: StudentRecord = {
      ...student,
      id: nextId("STU", students.length + 124, 5),
      photo: "",
      fee: {
        ...student.fee,
        pendingAmount: Math.max(
          0,
          student.fee.finalFee - student.fee.amountPaid,
        ),
      },
    };
    setStudents((prev) => [record, ...prev]);
    pushNotification("New student registered", record.name);
    return record;
  }, [students.length, pushNotification]);

  const updateStudent = useCallback<DataStoreValue["updateStudent"]>((id, patch) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, ...patch } : student,
      ),
    );
  }, []);

  const updateStudentFee = useCallback<DataStoreValue["updateStudentFee"]>(
    (id, patch) => {
      setStudents((prev) =>
        prev.map((student) => {
          if (student.id !== id) return student;
          const nextFee = { ...student.fee, ...patch };
          nextFee.pendingAmount = Math.max(
            0,
            (nextFee.finalFee || 0) - (nextFee.amountPaid || 0),
          );
          return { ...student, fee: nextFee };
        }),
      );
    },
    [],
  );

  const addBatch = useCallback<DataStoreValue["addBatch"]>((batch) => {
    const record: BatchRecord = {
      ...batch,
      id: `BATCH-${String(batches.length + 1).padStart(2, "0")}`,
    };
    setBatches((prev) => [...prev, record]);
    pushNotification("Batch created", record.batchName);
    return record;
  }, [batches.length, pushNotification]);

  const addEmployee = useCallback<DataStoreValue["addEmployee"]>((employee) => {
    const record: EmployeeRecord = {
      ...employee,
      id: `EMP-${String(employees.length + 101).padStart(3, "0")}`,
    };
    setEmployees((prev) => [...prev, record]);
    pushNotification("Employee added", record.name);
    return record;
  }, [employees.length, pushNotification]);

  const addTask = useCallback<DataStoreValue["addTask"]>((task) => {
    const record: TaskRecord = {
      ...task,
      id: `TASK-${String(tasks.length + 1).padStart(3, "0")}`,
    };
    setTasks((prev) => [record, ...prev]);
    pushNotification("Task assigned", record.title);
    return record;
  }, [tasks.length, pushNotification]);

  const updateTaskStatus = useCallback<DataStoreValue["updateTaskStatus"]>(
    (id, status) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, status } : task)),
      );
    },
    [],
  );

  const addClassReport = useCallback<DataStoreValue["addClassReport"]>(
    (report) => {
      const record: ClassReportRecord = {
        ...report,
        id: `CR-${String(classReports.length + 1).padStart(3, "0")}`,
      };
      setClassReports((prev) => [record, ...prev]);
      pushNotification("Class report submitted", record.topic);
      return record;
    },
    [classReports.length, pushNotification],
  );

  const markAttendance = useCallback<DataStoreValue["markAttendance"]>(
    (studentId, status) => {
      setStudents((prev) =>
        prev.map((student) => {
          if (student.id !== studentId) return student;
          const att = { ...student.attendance };
          att.totalClasses += 1;
          if (status === "Present") att.present += 1;
          if (status === "Absent") att.absent += 1;
          if (status === "Leave") att.leave += 1;
          att.attendancePercentage = Math.round(
            (att.present / att.totalClasses) * 100,
          );
          return { ...student, attendance: att };
        }),
      );
    },
    [],
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = useMemo<DataStoreValue>(
    () => ({
      walkins,
      students,
      batches,
      employees,
      classReports,
      tasks,
      addWalkin,
      addStudent,
      updateStudent,
      updateStudentFee,
      addBatch,
      addEmployee,
      addTask,
      updateTaskStatus,
      addClassReport,
      markAttendance,
      notifications,
      dismissNotification,
    }),
    [
      walkins,
      students,
      batches,
      employees,
      classReports,
      tasks,
      addWalkin,
      addStudent,
      updateStudent,
      updateStudentFee,
      addBatch,
      addEmployee,
      addTask,
      updateTaskStatus,
      addClassReport,
      markAttendance,
      notifications,
      dismissNotification,
    ],
  );

  return (
    <DataStoreContext.Provider value={value}>
      {children}
    </DataStoreContext.Provider>
  );
}

export function useDataStore() {
  const ctx = useContext(DataStoreContext);
  if (!ctx) {
    throw new Error("useDataStore must be used within a DataProvider");
  }
  return ctx;
}
