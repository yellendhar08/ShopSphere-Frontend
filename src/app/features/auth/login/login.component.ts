import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isLoading = false;
  serverError = '';

 onSubmit() {
  this.serverError = ''; 
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;
  const { email, password } = this.loginForm.value;

  this.authService.login({ email: email!, password: password! })
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastService.success('Logged in successfully!');
          this.router.navigate(['/home']);
        } else {
          this.serverError = res.message || 'Login failed.';
        }
      },
      error: (err: any) => {
        this.serverError = err.error?.message || 'Invalid email or password.';
      }
    });
}
}
