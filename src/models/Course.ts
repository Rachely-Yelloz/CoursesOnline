
export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName?: string; // מיקום עבור שם המורה שיתווסף
}