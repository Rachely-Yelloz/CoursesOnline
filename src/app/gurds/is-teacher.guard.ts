import { CanActivateFn } from '@angular/router';

export const isTeacherGuard: CanActivateFn = (route, state) => {

  let Isteacher :any=false;
  if (typeof window !== 'undefined' && sessionStorage) {  // בדיקה אם אנחנו בצד הלקוח

    Isteacher= sessionStorage.getItem('role') === 'teacher';}
  if (Isteacher) {
    return true;
  }
  else {
    return false
  }
};
