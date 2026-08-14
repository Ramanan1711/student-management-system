import studentsData from "../data/students.json";
import type { Student } from "../types/student";

const students = studentsData as Student[];

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function getStudents(): Promise<Student[]> {
  await delay(500);

  return students;
}

export async function getStudentById(
  id: string,
): Promise<Student | undefined> {
  await delay(300);

  return students.find((student) => student.id === id);
}