import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const isAuth = sessionStorage.getItem('userId');
  if (isAuth) {
    return true;
  }
  else {
    return false;
  }
};
