export type LeadStatus =
  | "New"
  | "Contacted"
  | "Counselling"
  | "Interested"
  | "Admission"
  | "Not Interested";

export type EmployeeType =
  | "Trainer"
  | "Developer"
  | "Designer"
  | "Video Editor"
  | "Digital Marketing"
  | "Counsellor";

export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";
export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type PaymentMode = "Cash" | "UPI" | "Card" | "Bank Transfer";

export interface WalkinLead {
  id: string;
  studentName: string;
  mobileNumber: string;
  email: string;
  courseInterested: string;
  qualification: string;
  location: string;
  source: "Walk-in" | "Website" | "Google" | "Instagram" | "Referral";
  counsellorName: string;
  enquiryDate: string;
  remarks: string;
  followUpDate: string;
  leadStatus: LeadStatus;
}

export interface StudentRecord {
  id: string;
  name: string;
  photo: string;
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
  fee: {
    courseFee: number;
    discount: number;
    finalFee: number;
    amountPaid: number;
    pendingAmount: number;
    paymentDate: string;
    paymentMode: PaymentMode;
    nextPaymentDate: string;
    paymentRemarks: string;
  };
  attendance: {
    totalClasses: number;
    present: number;
    absent: number;
    leave: number;
    attendancePercentage: number;
  };
  performance: {
    technicalKnowledge: number;
    practicalSkills: number;
    communication: number;
    attendance: number;
    taskCompletion: number;
    behaviour: number;
    overallPerformance: number;
  };
}

export interface BatchRecord {
  id: string;
  course: string;
  batchName: string;
  startDate: string;
  endDate: string;
  classTiming: string;
  days: string[];
  trainer: string;
  students: string[];
}

export function getBatchName(batchId: string, batchList: BatchRecord[]): string {
  return batchList.find((batch) => batch.id === batchId)?.batchName ?? batchId;
}

export interface EmployeeRecord {
  id: string;
  name: string;
  type: EmployeeType;
  department: string;
  phone: string;
  email: string;
  allocatedStudents: number;
  availability: "Available" | "On Leave" | "Busy";
}

export interface ClassReportRecord {
  id: string;
  date: string;
  batchId: string;
  trainer: string;
  topic: string;
  module: string;
  description: string;
  tasksGiven: string;
  taskStatus: TaskStatus;
  studentAttendance: number;
  studentPerformance: string;
  remarks: string;
  nextClassPlan: string;
}

export interface TaskRecord {
  id: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  trainerRemarks: string;
  studentId: string;
}

export interface VideoRecord {
  id: string;
  studentId: string;
  title: string;
  date: string;
  duration: string;
  type: "Class recording" | "Project review" | "Feedback";
  url: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: "Present" | "Absent" | "Leave";
}

export const revenueOverview = [
  { month: "JAN", value: 48 },
  { month: "FEB", value: 62 },
  { month: "MAR", value: 54 },
  { month: "APR", value: 72 },
  { month: "MAY", value: 58 },
  { month: "JUN", value: 80 },
  { month: "JUL", value: 66 },
  { month: "AUG", value: 95 },
  { month: "SEP", value: 74 },
  { month: "OCT", value: 64 },
  { month: "NOV", value: 70 },
  { month: "DEC", value: 60 },
];

export const dailyRevenueOverview = [
  { month: "01", value: 18 },
  { month: "02", value: 24 },
  { month: "03", value: 16 },
  { month: "04", value: 30 },
  { month: "05", value: 22 },
  { month: "06", value: 28 },
  { month: "07", value: 34 },
  { month: "08", value: 26 },
  { month: "09", value: 38 },
  { month: "10", value: 31 },
  { month: "11", value: 42 },
  { month: "12", value: 36 },
  { month: "13", value: 45 },
  { month: "14", value: 39 },
  { month: "15", value: 48 },
  { month: "16", value: 43 },
  { month: "17", value: 52 },
  { month: "18", value: 46 },
  { month: "19", value: 56 },
  { month: "20", value: 50 },
  { month: "21", value: 61 },
  { month: "22", value: 54 },
  { month: "23", value: 64 },
  { month: "24", value: 58 },
  { month: "25", value: 68 },
  { month: "26", value: 62 },
  { month: "27", value: 72 },
  { month: "28", value: 66 },
  { month: "29", value: 76 },
  { month: "30", value: 70 },
];

export const monthlyProgress = [
  { name: "Jan", value: 48 },
  { name: "Feb", value: 56 },
  { name: "Mar", value: 62 },
  { name: "Apr", value: 71 },
  { name: "May", value: 77 },
  { name: "Jun", value: 82 },
  { name: "Jul", value: 79 },
  { name: "Aug", value: 84 },
  { name: "Sep", value: 88 },
  { name: "Oct", value: 86 },
  { name: "Nov", value: 91 },
  { name: "Dec", value: 94 },
];

export const videoRecords: VideoRecord[] = [
  {
    id: "VID-001",
    studentId: "STU-2026-00125",
    title: "React component patterns",
    date: "2026-08-12",
    duration: "42 min",
    type: "Class recording",
    url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "VID-002",
    studentId: "STU-2026-00125",
    title: "Project review and feedback",
    date: "2026-08-15",
    duration: "28 min",
    type: "Project review",
    url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "VID-003",
    studentId: "STU-2026-00126",
    title: "API integration walkthrough",
    date: "2026-08-14",
    duration: "35 min",
    type: "Class recording",
    url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
];

export const attendanceRecords: AttendanceRecord[] = [
  { id: "ATT-001", studentId: "STU-2026-00125", date: "2026-08-18", status: "Present" },
  { id: "ATT-002", studentId: "STU-2026-00125", date: "2026-08-19", status: "Present" },
  { id: "ATT-003", studentId: "STU-2026-00126", date: "2026-08-18", status: "Absent" },
  { id: "ATT-004", studentId: "STU-2026-00127", date: "2026-08-18", status: "Leave" },
];

export const walkinLeads: WalkinLead[] = [
  {
    id: "WL-2026-001",
    studentName: "Nisha Menon",
    mobileNumber: "9876541230",
    email: "nisha.menon@example.com",
    courseInterested: "Full Stack Development",
    qualification: "B.E. Computer Science",
    location: "Bengaluru",
    source: "Google",
    counsellorName: "Priya",
    enquiryDate: "2026-08-02",
    remarks: "Interested in weekend batch.",
    followUpDate: "2026-08-16",
    leadStatus: "Interested",
  },
  {
    id: "WL-2026-002",
    studentName: "Rohan Singh",
    mobileNumber: "9123456780",
    email: "rohan.singh@example.com",
    courseInterested: "Digital Marketing",
    qualification: "B.Com",
    location: "Delhi",
    source: "Instagram",
    counsellorName: "Rahul",
    enquiryDate: "2026-08-04",
    remarks: "Needs demo session before enrollment.",
    followUpDate: "2026-08-18",
    leadStatus: "Counselling",
  },
  {
    id: "WL-2026-003",
    studentName: "Meera Iyer",
    mobileNumber: "9988776655",
    email: "meera.iyer@example.com",
    courseInterested: "UI/UX Design",
    qualification: "B.Des",
    location: "Hyderabad",
    source: "Referral",
    counsellorName: "Anita",
    enquiryDate: "2026-08-06",
    remarks: "Waiting for fee confirmation.",
    followUpDate: "2026-08-12",
    leadStatus: "Admission",
  },
  {
    id: "WL-2026-004",
    studentName: "Vikas Patel",
    mobileNumber: "9001122334",
    email: "vikas.patel@example.com",
    courseInterested: "Java Development",
    qualification: "BCA",
    location: "Ahmedabad",
    source: "Walk-in",
    counsellorName: "Karthik",
    enquiryDate: "2026-08-08",
    remarks: "Not interested after introductory call.",
    followUpDate: "2026-08-14",
    leadStatus: "Not Interested",
  },
];

export const students: StudentRecord[] = [
  {
    id: "STU-2026-00125",
    name: "Arun Kumar",
    photo: "",
    mobile: "9876543210",
    email: "arun.kumar@example.com",
    dateOfBirth: "2002-05-14",
    gender: "Male",
    address: "Chennai, Tamil Nadu",
    qualification: "B.Tech",
    course: "Full Stack Development",
    courseDuration: "6 Months",
    joiningDate: "2026-04-10",
    batchId: "FS-APR-01",
    mode: "Offline",
    assignedCounsellor: "Priya",
    fee: {
      courseFee: 60000,
      discount: 5000,
      finalFee: 55000,
      amountPaid: 30000,
      pendingAmount: 25000,
      paymentDate: "2026-04-12",
      paymentMode: "UPI",
      nextPaymentDate: "2026-09-10",
      paymentRemarks: "Initial installment paid via UPI.",
    },
    attendance: {
      totalClasses: 42,
      present: 38,
      absent: 2,
      leave: 2,
      attendancePercentage: 92,
    },
    performance: {
      technicalKnowledge: 78,
      practicalSkills: 82,
      communication: 71,
      attendance: 92,
      taskCompletion: 80,
      behaviour: 88,
      overallPerformance: 81,
    },
  },
  {
    id: "STU-2026-00126",
    name: "Divya Raj",
    photo: "",
    mobile: "9876543211",
    email: "divya.raj@example.com",
    dateOfBirth: "2001-09-22",
    gender: "Female",
    address: "Coimbatore, Tamil Nadu",
    qualification: "B.Sc Computer Science",
    course: "Full Stack Development",
    courseDuration: "6 Months",
    joiningDate: "2026-04-12",
    batchId: "FS-APR-01",
    mode: "Online",
    assignedCounsellor: "Rahul",
    fee: {
      courseFee: 60000,
      discount: 6000,
      finalFee: 54000,
      amountPaid: 35000,
      pendingAmount: 19000,
      paymentDate: "2026-04-15",
      paymentMode: "Card",
      nextPaymentDate: "2026-09-12",
      paymentRemarks: "Second installment pending.",
    },
    attendance: {
      totalClasses: 42,
      present: 40,
      absent: 1,
      leave: 1,
      attendancePercentage: 95,
    },
    performance: {
      technicalKnowledge: 85,
      practicalSkills: 88,
      communication: 79,
      attendance: 95,
      taskCompletion: 90,
      behaviour: 85,
      overallPerformance: 87,
    },
  },
  {
    id: "STU-2026-00127",
    name: "Karthik S",
    photo: "",
    mobile: "9876543212",
    email: "karthik.s@example.com",
    dateOfBirth: "2000-11-03",
    gender: "Male",
    address: "Madurai, Tamil Nadu",
    qualification: "BCA",
    course: "Java Development",
    courseDuration: "5 Months",
    joiningDate: "2026-05-02",
    batchId: "JAVA-MAY-01",
    mode: "Offline",
    assignedCounsellor: "Priya",
    fee: {
      courseFee: 45000,
      discount: 4000,
      finalFee: 41000,
      amountPaid: 25000,
      pendingAmount: 16000,
      paymentDate: "2026-05-04",
      paymentMode: "Bank Transfer",
      nextPaymentDate: "2026-08-20",
      paymentRemarks: "Follow-up sent, pending due this month.",
    },
    attendance: {
      totalClasses: 37,
      present: 31,
      absent: 4,
      leave: 2,
      attendancePercentage: 84,
    },
    performance: {
      technicalKnowledge: 72,
      practicalSkills: 75,
      communication: 68,
      attendance: 84,
      taskCompletion: 74,
      behaviour: 80,
      overallPerformance: 76,
    },
  },
];

export const batches: BatchRecord[] = [
  {
    id: "FS-APR-01",
    course: "Full Stack Development",
    batchName: "Full Stack Apr 2026",
    startDate: "2026-04-10",
    endDate: "2026-09-30",
    classTiming: "6:30 PM - 8:30 PM",
    days: ["Mon", "Wed", "Fri", "Sat"],
    trainer: "Sathish Kumar",
    students: ["STU-2026-00125", "STU-2026-00126"],
  },
  {
    id: "JAVA-MAY-01",
    course: "Java Development",
    batchName: "Java May 2026",
    startDate: "2026-05-02",
    endDate: "2026-09-30",
    classTiming: "7:00 AM - 9:00 AM",
    days: ["Tue", "Thu", "Sat"],
    trainer: "Deepak Nair",
    students: ["STU-2026-00127"],
  },
  {
    id: "UI-JUN-01",
    course: "UI/UX Design",
    batchName: "UX Masterclass",
    startDate: "2026-06-05",
    endDate: "2026-11-15",
    classTiming: "10:00 AM - 12:00 PM",
    days: ["Mon", "Tue", "Thu", "Fri"],
    trainer: "Asha Raman",
    students: [],
  },
];

export const employees: EmployeeRecord[] = [
  {
    id: "EMP-101",
    name: "Sathish Kumar",
    type: "Trainer",
    department: "Academics",
    phone: "9876541001",
    email: "sathish.kumar@example.com",
    allocatedStudents: 12,
    availability: "Available",
  },
  {
    id: "EMP-102",
    name: "Deepak Nair",
    type: "Trainer",
    department: "Academics",
    phone: "9876541002",
    email: "deepak.nair@example.com",
    allocatedStudents: 8,
    availability: "Busy",
  },
  {
    id: "EMP-103",
    name: "Anita Sharma",
    type: "Counsellor",
    department: "Admissions",
    phone: "9876541003",
    email: "anita.sharma@example.com",
    allocatedStudents: 18,
    availability: "Available",
  },
  {
    id: "EMP-104",
    name: "Ramesh M",
    type: "Developer",
    department: "Product",
    phone: "9876541004",
    email: "ramesh.m@example.com",
    allocatedStudents: 5,
    availability: "On Leave",
  },
];

export const classReports: ClassReportRecord[] = [
  {
    id: "CR-001",
    date: "2026-08-01",
    batchId: "FS-APR-01",
    trainer: "Sathish Kumar",
    topic: "React Fundamentals",
    module: "Frontend Basics",
    description: "Covered JSX, props, state, and component lifecycle basics.",
    tasksGiven: "Build a simple calculator component",
    taskStatus: "In Progress",
    studentAttendance: 91,
    studentPerformance: "Good",
    remarks: "Students engaged well with props and state examples.",
    nextClassPlan: "Introduction to hooks and form handling.",
  },
  {
    id: "CR-002",
    date: "2026-08-03",
    batchId: "JAVA-MAY-01",
    trainer: "Deepak Nair",
    topic: "OOP Concepts",
    module: "Core Java",
    description: "Detailed review of encapsulation, inheritance, and polymorphism.",
    tasksGiven: "Create class hierarchy for library management",
    taskStatus: "Completed",
    studentAttendance: 86,
    studentPerformance: "Satisfactory",
    remarks: "Need more practical exercises for inheritance use cases.",
    nextClassPlan: "Collections and exception handling practice.",
  },
  {
    id: "CR-003",
    date: "2026-08-05",
    batchId: "FS-APR-01",
    trainer: "Sathish Kumar",
    topic: "CSS Grid & Responsive Design",
    module: "Frontend Design",
    description: "Workshop on layout systems and responsive design patterns.",
    tasksGiven: "Create a responsive dashboard card layout",
    taskStatus: "Completed",
    studentAttendance: 95,
    studentPerformance: "Excellent",
    remarks: "Students performed well with CSS media queries and grid.",
    nextClassPlan: "Component styling and reusable design systems.",
  },
];

export const tasks: TaskRecord[] = [
  {
    id: "TASK-001",
    title: "Build Portfolio Landing Page",
    description: "Create a responsive landing page using React and CSS.",
    assignedDate: "2026-08-01",
    dueDate: "2026-08-12",
    priority: "High",
    status: "In Progress",
    trainerRemarks: "Focus on layout and responsiveness.",
    studentId: "STU-2026-00125",
  },
  {
    id: "TASK-002",
    title: "Java Collections Exercise",
    description: "Implement a student record manager using ArrayList and HashMap.",
    assignedDate: "2026-08-04",
    dueDate: "2026-08-15",
    priority: "Medium",
    status: "Pending",
    trainerRemarks: "Submit working code with sample data.",
    studentId: "STU-2026-00127",
  },
  {
    id: "TASK-003",
    title: "Dashboard Wireframe",
    description: "Design a dashboard wireframe for a learning portal.",
    assignedDate: "2026-08-02",
    dueDate: "2026-08-10",
    priority: "Urgent",
    status: "Completed",
    trainerRemarks: "Good structure and user flow.",
    studentId: "STU-2026-00126",
  },
];

export const performanceRecords = [
  {
    name: "Arun Kumar",
    technicalKnowledge: 78,
    practicalSkills: 82,
    communication: 71,
    attendance: 92,
    taskCompletion: 80,
    behaviour: 88,
    overallPerformance: 81,
  },
  {
    name: "Divya Raj",
    technicalKnowledge: 85,
    practicalSkills: 88,
    communication: 79,
    attendance: 95,
    taskCompletion: 90,
    behaviour: 85,
    overallPerformance: 87,
  },
  {
    name: "Karthik S",
    technicalKnowledge: 72,
    practicalSkills: 75,
    communication: 68,
    attendance: 84,
    taskCompletion: 74,
    behaviour: 80,
    overallPerformance: 76,
  },
];

export const attendanceOverview = [
  { name: "Present", value: 109 },
  { name: "Absent", value: 7 },
  { name: "Leave", value: 5 },
];

export const dashboardRevenue = [
  { month: "Jan", students: 40, revenue: 120000 },
  { month: "Feb", students: 55, revenue: 155000 },
  { month: "Mar", students: 68, revenue: 190000 },
  { month: "Apr", students: 72, revenue: 220000 },
  { month: "May", students: 85, revenue: 260000 },
  { month: "Jun", students: 94, revenue: 285000 },
];
