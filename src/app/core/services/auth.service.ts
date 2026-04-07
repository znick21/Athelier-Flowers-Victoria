import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private api = environment.apiUrl;

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.api}/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('role', res.user.role);
        localStorage.setItem('userId', String(res.user.id));
        localStorage.setItem('nombre', res.user.nombre ?? res.user.email);
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? Number(id) : null;
  }

  getNombre(): string | null {
    return localStorage.getItem('nombre');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
