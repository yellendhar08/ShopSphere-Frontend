import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const customerOnlyGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If not logged in, redirect to login
  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  // If ADMIN, redirect to admin dashboard (preventing access to customer pages)
  if (authService.isAdmin()) {
    router.navigate(['/admin/dashboard']);
    return false;
  }

  // If CUSTOMER, allow access
  return true;
};
