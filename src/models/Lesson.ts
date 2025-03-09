export interface Lesson {
    id: number;       // מזהה השיעור
    title: string;    // כותרת השיעור
    content: string;  // תוכן השיעור
    courseId: number; // מזהה הקורס שאליו השיעור שייך
}
