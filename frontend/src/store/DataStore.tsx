import {
  useCallback,
  useEffect,
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
  attendanceRecords as seedAttendanceRecords,
  employeeAllocations as seedEmployeeAllocations,
  type WalkinLead,
  type StudentRecord,
  type BatchRecord,
  type EmployeeRecord,
  type ClassReportRecord,
  type TaskRecord,
  type EmployeeAllocation,
  type FeeTransaction,
  type VideoRecord,
  feeTransactions as seedFeeTransactions,
} from "../data/mockData";

const makeId = (prefix: string, count: number, pad = 3) =>
  `${prefix}-${new Date().getFullYear()}-${String(count).padStart(pad, "0")}`;

function syncBatchMembers(students: StudentRecord[], batches: BatchRecord[]): BatchRecord[] {
  return batches.map((batch) => ({
    ...batch,
    students: students.filter((student) => student.batchId === batch.id).map((student) => student.id),
  }));
}

function syncEmployeeCounts(
  employees: EmployeeRecord[],
  allocations: EmployeeAllocation[],
  batches: BatchRecord[],
): EmployeeRecord[] {
  return employees.map((employee) => {
    const studentIds = new Set<string>();
    allocations
      .filter((allocation) => allocation.employeeId === employee.id)
      .forEach((allocation) => {
        if (allocation.studentId) studentIds.add(allocation.studentId);
        if (allocation.batchId) {
          batches.find((batch) => batch.id === allocation.batchId)?.students.forEach((studentId) => studentIds.add(studentId));
        }
      });
    return { ...employee, allocatedStudents: studentIds.size };
  });
}

const STORAGE_PREFIX = "sms.data.";

function loadStored<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // Storage can be unavailable or full; the in-memory store remains usable.
  }
}

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
  const [isLoading, setIsLoading] = useState(true);
  const [walkins, setWalkins] = useState<WalkinLead[]>(() => loadStored("walkins", seedWalkins));
  const [students, setStudents] = useState<StudentRecord[]>(() => loadStored("students", seedStudents));
  const [batches, setBatches] = useState<BatchRecord[]>(() => {
    const storedStudents = loadStored("students", seedStudents);
    return syncBatchMembers(storedStudents, loadStored("batches", seedBatches));
  });
  const [employees, setEmployees] = useState<EmployeeRecord[]>(() => {
    const storedStudents = loadStored("students", seedStudents);
    const storedBatches = loadStored("batches", seedBatches);
    const storedAllocations = loadStored("employeeAllocations", seedEmployeeAllocations);
    const syncedBatches = syncBatchMembers(storedStudents, storedBatches);
    return syncEmployeeCounts(loadStored("employees", seedEmployees), storedAllocations, syncedBatches);
  });
  const [classReports, setClassReports] = useState<ClassReportRecord[]>(() => loadStored("classReports", seedClassReports));
  const [tasks, setTasks] = useState<TaskRecord[]>(() => loadStored("tasks", seedTasks));
  const [videoRecords, setVideoRecords] = useState(() => loadStored("videoRecords", seedVideoRecords));
  const [attendanceRecords, setAttendanceRecords] = useState(() => loadStored("attendanceRecords", seedAttendanceRecords));
  const [employeeAllocations, setEmployeeAllocations] = useState(() => loadStored("employeeAllocations", seedEmployeeAllocations));
  const [feeTransactions, setFeeTransactions] = useState(() => loadStored("feeTransactions", seedFeeTransactions));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStored("notifications", seedNotifications));

  useEffect(() => {
    const hydrationTask = window.setTimeout(() => setIsLoading(false), 0);
    return () => window.clearTimeout(hydrationTask);
  }, []);

  useEffect(() => {
    saveStored("walkins", walkins);
    saveStored("students", students);
    saveStored("batches", batches);
    saveStored("employees", employees);
    saveStored("classReports", classReports);
    saveStored("tasks", tasks);
    saveStored("videoRecords", videoRecords);
    saveStored("attendanceRecords", attendanceRecords);
    saveStored("employeeAllocations", employeeAllocations);
    saveStored("feeTransactions", feeTransactions);
    saveStored("notifications", notifications);
  }, [walkins, students, batches, employees, classReports, tasks, videoRecords, attendanceRecords, employeeAllocations, feeTransactions, notifications]);

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
      setBatches((prev) => {
        const nextBatches = syncBatchMembers([created, ...students], prev);
        setEmployees((prevEmployees) => syncEmployeeCounts(prevEmployees, employeeAllocations, nextBatches));
        return nextBatches;
      });
      pushNotification("New student registered", student.name);
      return created;
    },
    [pushNotification, students, employeeAllocations],
  );

  const updateStudent = useCallback<DataStoreValue["updateStudent"]>(
    (id, patch) => {
      setStudents((prev) => {
        const nextStudents = prev.map((s) => (s.id === id ? { ...s, ...patch } : s));
        if (patch.batchId !== undefined) {
          setBatches((prevBatches) => {
            const nextBatches = syncBatchMembers(nextStudents, prevBatches);
            setEmployees((prevEmployees) => syncEmployeeCounts(prevEmployees, employeeAllocations, nextBatches));
            return nextBatches;
          });
        }
        return nextStudents;
      });
    },
    [employeeAllocations],
  );

  const deleteStudent = useCallback<DataStoreValue["deleteStudent"]>((id) => {
    if (!students.some((student) => student.id === id)) return false;
    const remainingStudents = students.filter((student) => student.id !== id);
    const remainingAllocations = employeeAllocations.filter((allocation) => allocation.studentId !== id);
    const remainingBatches = syncBatchMembers(remainingStudents, batches);

    setStudents(remainingStudents);
    setBatches(remainingBatches);
    setAttendanceRecords((prev) => prev.filter((record) => record.studentId !== id));
    setTasks((prev) => prev.filter((task) => task.studentId !== id));
    setVideoRecords((prev) => prev.filter((record) => record.studentId !== id));
    setFeeTransactions((prev) => prev.filter((transaction) => transaction.studentId !== id));
    setEmployeeAllocations(remainingAllocations);
    setEmployees((prev) => syncEmployeeCounts(prev, remainingAllocations, remainingBatches));
    setClassReports((prev) => prev.map((report) => ({ ...report, studentIds: report.studentIds?.filter((studentId) => studentId !== id) ?? [] })));
    pushNotification("Student deleted", id);
    return true;
  }, [students, batches, employeeAllocations, pushNotification]);

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

  const addEmployeeAllocation = useCallback<DataStoreValue["addEmployeeAllocation"]>(
    (allocation) => {
      const duplicate = employeeAllocations.some(
        (entry) => entry.employeeId === allocation.employeeId && entry.batchId === allocation.batchId && entry.studentId === allocation.studentId,
      );
      if (duplicate) return null;
      const created: EmployeeAllocation = {
        ...allocation,
        id: `ALLOC-${Date.now()}`,
      };
      setEmployeeAllocations((prev) => [...prev, created]);
      setEmployees((prev) => syncEmployeeCounts(prev, [...employeeAllocations, created], batches));
      pushNotification("Employee allocation created", allocation.studentId ?? allocation.batchId ?? "Assignment");
      return created;
    },
    [employeeAllocations, batches, pushNotification],
  );

  const addFeeTransaction = useCallback<DataStoreValue["addFeeTransaction"]>(
    (transaction) => {
      if (transaction.amount <= 0) return null;
      const created: FeeTransaction = { ...transaction, id: `PAY-${Date.now()}` };
      setFeeTransactions((prev) => [...prev, created]);
      setStudents((prev) => prev.map((student) => {
        if (student.id !== transaction.studentId) return student;
        const amountPaid = student.fee.amountPaid + transaction.amount;
        return { ...student, fee: { ...student.fee, amountPaid, pendingAmount: Math.max(0, student.fee.finalFee - amountPaid), paymentDate: transaction.date, paymentMode: transaction.paymentMode, paymentRemarks: transaction.remarks } };
      }));
      pushNotification("Payment recorded", transaction.studentId);
      return created;
    },
    [pushNotification],
  );

  const addVideoRecord = useCallback<DataStoreValue["addVideoRecord"]>((record) => {
    const created: VideoRecord = { ...record, id: `VID-${Date.now()}` };
    setVideoRecords((prev) => [...prev, created]);
    pushNotification("Video record added", record.title);
    return created;
  }, [pushNotification]);

  const updateVideoRecord = useCallback<DataStoreValue["updateVideoRecord"]>((id, patch) => {
    setVideoRecords((prev) => prev.map((record) => record.id === id ? { ...record, ...patch } : record));
  }, []);

  const deleteVideoRecord = useCallback<DataStoreValue["deleteVideoRecord"]>((id) => {
    let removed = false;
    setVideoRecords((prev) => {
      removed = prev.some((record) => record.id === id);
      return prev.filter((record) => record.id !== id);
    });
    return removed;
  }, []);

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
    (studentId, date, status) => {
      if (attendanceRecords.some((record) => record.studentId === studentId && record.date === date)) {
        return false;
      }
      setAttendanceRecords((prev) => [
        ...prev,
        { id: `ATT-${Date.now()}-${studentId}`, studentId, date, status },
      ]);
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
      return true;
    },
    [attendanceRecords],
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
      deleteStudent,
      updateStudentFee,
      addBatch,
      addEmployee,
      addEmployeeAllocation,
      addFeeTransaction,
      addVideoRecord,
      updateVideoRecord,
      deleteVideoRecord,
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
      deleteStudent,
      updateStudentFee,
      addBatch,
      addEmployee,
      addEmployeeAllocation,
      addFeeTransaction,
      addVideoRecord,
      updateVideoRecord,
      deleteVideoRecord,
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
      attendanceRecords,
      employeeAllocations,
      feeTransactions,
      notifications,
      ...actions,
    }),
    [walkins, students, batches, employees, classReports, tasks, videoRecords, attendanceRecords, employeeAllocations, feeTransactions, notifications, actions],
  );

  return (
    <DataStoreContext.Provider value={value}>
      {isLoading ? (
        <main data-testid="app-loading-state" className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-4">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
            <p className="mt-4 text-sm font-medium text-slate-600">Loading academy data...</p>
          </div>
        </main>
      ) : children}
    </DataStoreContext.Provider>
  );
}
