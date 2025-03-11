import { CanActivateFn } from '@angular/router';

export const isTeacherGuard: CanActivateFn = (route, state) => {
  const Isteacher = sessionStorage.getItem('role') === 'teacher';
  if (Isteacher) {
    return true;
  }
  else {
    return false
  }
};
