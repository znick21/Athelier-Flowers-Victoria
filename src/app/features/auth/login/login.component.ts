import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styles: [`
    .login-wrap {
      min-height: 100vh;
      background: linear-gradient(135deg, #880e4f 0%, #4a0027 100%);
      display: flex; align-items: center; justify-content: center;
    }
    .login-card {
      width: 100%; max-width: 400px;
      background: #fff; border-radius: 16px;
      padding: 2.5rem 2rem; box-shadow: 0 12px 40px rgba(0,0,0,.25);
    }
    .logo-login { width: 90px; height: 90px; object-fit: contain; }
    .btn-login {
      background: #880e4f; border: none; color: #fff;
      width: 100%; padding: .65rem; border-radius: 8px;
      font-weight: 600; font-size: 1rem;
    }
    .btn-login:disabled { opacity: .6; }
    .btn-login:hover:not(:disabled) { background: #6d003f; }
  `],
  template: `
    <div class="login-wrap">
      <div class="login-card">
        <div class="text-center mb-4">
          <img src="/Logo.png" alt="Logo" class="logo-login mb-2" (error)="onLogoError($event)">
          <h5 class="fw-bold mb-0" style="color:#880e4f">Atelier Flowers Victoria</h5>
          <small class="text-muted">Iniciar Sesión</small>
        </div>

        <form [formGroup]="form" (ngSubmit)="login()">
          <div class="mb-3">
            <label class="form-label fw-semibold">Email</label>
            <input class="form-control" formControlName="email" type="email" placeholder="correo@ejemplo.com">
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold">Contraseña</label>
            <input class="form-control" formControlName="password" type="password" placeholder="••••••">
          </div>
          <div *ngIf="error" class="alert alert-danger py-2 text-center">{{ error }}</div>
          <button class="btn-login mt-1" type="submit" [disabled]="form.invalid">Ingresar</button>
        </form>

        <hr class="my-3">
        <p class="text-center mb-0 small">
          ¿No tienes cuenta?
          <a routerLink="/register" style="color:#880e4f;font-weight:600">Regístrate aquí</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb   = inject(FormBuilder);
  private auth  = inject(AuthService);
  private router = inject(Router);

  error = '';
  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  login(): void {
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => this.error = 'Credenciales incorrectas'
    });
  }

  onLogoError(e: Event) { (e.target as HTMLImageElement).style.display = 'none'; }
}
