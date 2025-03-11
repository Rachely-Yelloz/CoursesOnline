import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  let isAuth: any | null = null;
  if (typeof window !== 'undefined' && sessionStorage) {  // בדיקה אם אנחנו בצד הלקוח
    isAuth = sessionStorage.getItem('userId');

  }

  if (isAuth) {
    return true;
  }
  else {
    return false;
  }
};
