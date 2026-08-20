import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DataStoreContext,
  type DataStoreValue,
  type NotificationItem,
} from "./dataStoreContext";

import {
  walkinLeads as seedWalkins,
  students as seedStudents,
  batches as seedBatches,
  employees as seedEmployees,
  classReports as seedClassReports,
  tasks as seedTasks,
  videoRecords as seedVideoRecords,
  type WalkinLead,
  type StudentRecord,
  type BatchRecord,
  type EmployeeRecord,
  type ClassReportRecord,
  type TaskRecord,
} from "../data/mockData";

const makeId = (prefix: string, count: number, pad = 3) =>
  `${prefix}-${new Date().getFullYear()}-${String(count).padStart(pad, "0")}`;

const seedNotifications: NotificationItem[] = [
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
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [walkins, setWalkins] = useState<WalkinLead[]>(seedWalkins);
  const [students, setStudents] = useState<StudentRecord[]>(seedStudents);
  const [batches, setBatches] = useState<BatchRecord[]>(seedBatches);
  const [employees, setEmployees] = useState<EmployeeRecord[]>(seedEmployees);
  const [classReports, setClassReports] =
    useState<ClassReportRecord[]>(seedClassReports);
  const [tasks, setTasks] = useState<TaskRecord[]>(seedTasks);
  const [videoRecords] = useState(seedVideoRecords);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(seedNotifications);

  // All mutations below use functional setState so callbacks stay dependency-free
  // and never capture stale collection lengths.

  const pushNotification = useCallback((title: string, description: string) => {
    setNotifications((prev) => [
      { id: `N-${Date.now()}`, title, description, time: "just now" },
      ...prev,
    ]);
  }, []);

  const addWalkin = useCallback<DataStoreValue["addWalkin"]>(
    (walkin) => {
      let created!: WalkinLead;
      setWalkins((prev) => {
        created = { ...walkin, id: makeId("WL", prev.length + 1) };
        return [created, ...prev];
      });
      pushNotification("New walk-in enquiry", walkin.studentName);
      return created;
    },
    [pushNotification],
  );

  const addStudent = useCallback<DataStoreValue["addStudent"]>(
    (student) => {
      let created!: StudentRecord;
      setStudents((prev) => {
        created = {
          ...student,
          id: makeId("STU", prev.length + 125, 5),
          photo: "",
          fee: {
            ...student.fee,
            pendingAmount: Math.max(
              0,
              student.fee.finalFee - student.fee.amountPaid,
            ),
          },
        };
        return [created, ...prev];
      });
      pushNotification("New student registered", student.name);
      return created;
    },
    [pushNotification],
  );

  const updateStudent = useCallback<DataStoreValue["updateStudent"]>(
    (id, patch) => {
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      );
    },
    [],
  );

  const updateStudentFee = useCallback<DataStoreValue["updateStudentFee"]>(
    (id, patch) => {
      setStudents((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          const nextFee = { ...s.fee, ...patch };
          nextFee.pendingAmount = Math.max(
            0,
            (nextFee.finalFee || 0) - (nextFee.amountPaid || 0),
          );
          return { ...s, fee: nextFee };
        }),
      );
    },
    [],
  );

  const addBatch = useCallback<DataStoreValue["addBatch"]>(
    (batch) => {
      let created!: BatchRecord;
      setBatches((prev) => {
        created = {
          ...batch,
          id: `BATCH-${String(prev.length + 1).padStart(2, "0")}`,
        };
        return [...prev, created];
      });
      pushNotification("Batch created", batch.batchName);
      return created;
    },
    [pushNotification],
  );

  const addEmployee = useCallback<DataStoreValue["addEmployee"]>(
    (employee) => {
      let created!: EmployeeRecord;
      setEmployees((prev) => {
        created = {
          ...employee,
          id: `EMP-${String(prev.length + 101).padStart(3, "0")}`,
        };
        return [...prev, created];
      });
      pushNotification("Employee added", employee.name);
      return created;
    },
    [pushNotification],
  );

  const addTask = useCallback<DataStoreValue["addTask"]>(
    (task) => {
      let created!: TaskRecord;
      setTasks((prev) => {
        created = {
          ...task,
          id: `TASK-${String(prev.length + 1).padStart(3, "0")}`,
        };
        return [created, ...prev];
      });
      pushNotification("Task assigned", task.title);
      return created;
    },
    [pushNotification],
  );

  const updateTaskStatus = useCallback<DataStoreValue["updateTaskStatus"]>(
    (id, status) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t)),
      );
    },
    [],
  );

  const addClassReport = useCallback<DataStoreValue["addClassReport"]>(
    (report) => {
      let created!: ClassReportRecord;
      setClassReports((prev) => {
        created = {
          ...report,
          id: `CR-${String(prev.length + 1).padStart(3, "0")}`,
        };
        return [created, ...prev];
      });
      pushNotification("Class report submitted", report.topic);
      return created;
    },
    [pushNotification],
  );

  const markAttendance = useCallback<DataStoreValue["markAttendance"]>(
    (studentId, status) => {
      setStudents((prev) =>
        prev.map((s) => {
          if (s.id !== studentId) return s;
          const att = { ...s.attendance };
          att.totalClasses += 1;
          if (status === "Present") att.present += 1;
          if (status === "Absent") att.absent += 1;
          if (status === "Leave") att.leave += 1;
          att.attendancePercentage = Math.round(
            (att.present / att.totalClasses) * 100,
          );
          return { ...s, attendance: att };
        }),
      );
    },
    [],
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Actions are stable (useCallback with no changing deps), so we memoize them
  // separately from the data — reducing the value memo to 7 dependencies.
  const actions = useMemo(
    () => ({
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
      dismissNotification,
    }),
    [
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
      dismissNotification,
    ],
  );

  const value = useMemo<DataStoreValue>(
    () => ({
      walkins,
      students,
      batches,
      employees,
      classReports,
      tasks,
      videoRecords,
      notifications,
      ...actions,
    }),
    [walkins, students, batches, employees, classReports, tasks, videoRecords, notifications, actions],
  );

  return (
    <DataStoreContext.Provider value={value}>
      {children}
    </DataStoreContext.Provider>
  );
}
