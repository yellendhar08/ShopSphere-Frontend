import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { LoginRequest, SignUpRequest, AuthResponse, DecodedToken } from '../models/auth.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = `${environment.apiUrl}/auth`;
  
  private jwtHelper = new JwtHelperService();
  private readonly TOKEN_KEY = 'shopsphere_token';
  
  currentUser$ = new BehaviorSubject<DecodedToken | null>(null);

  constructor() {
    this.initAuthState();
  }

  private initAuthState(): void {
    const token = this.getToken();
    if (token) {
      if (!this.jwtHelper.isTokenExpired(token)) {
        this.currentUser$.next(this.jwtHelper.decodeToken(token));
      } else {
        this.logout();
      }
    }
  }

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/login`, request).pipe(
      tap(res => {
        if (res.success && res.data?.token) {
          this.saveToken(res.data.token);
          this.currentUser$.next(this.jwtHelper.decodeToken(res.data.token));
        }
      })
    );
  }

  signup(request: SignUpRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/signup`, request).pipe(
      tap(res => {
        if (res.success && res.data?.token) {
          this.saveToken(res.data.token);
          this.currentUser$.next(this.jwtHelper.decodeToken(res.data.token));
        }
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decoded = this.jwtHelper.decodeToken(token) as DecodedToken;
      return decoded.role === 'ADMIN';
    }
    return false;
  }

  getCurrentUser(): DecodedToken | null {
    return this.currentUser$.value;
  }
}
