import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styles: [`
    .register-wrap {
      min-height: 100vh;
      background: linear-gradient(135deg, #880e4f 0%, #4a0027 100%);
      display: flex; align-items: center; justify-content: center; padding: 1rem;
    }
    .register-card {
      width: 100%; max-width: 420px;
      background: #fff; border-radius: 16px;
      padding: 2rem 2rem; box-shadow: 0 12px 40px rgba(0,0,0,.25);
    }
    .logo-img { width: 70px; height: 70px; object-fit: contain; }
    .btn-primary-custom {
      background: #880e4f; border: none; color: #fff;
      width: 100%; padding: .6rem; border-radius: 8px;
      font-weight: 600; font-size: 1rem;
    }
    .btn-primary-custom:disabled { opacity: .6; }
    .btn-primary-custom:hover:not(:disabled) { background: #6d003f; }
  `],
  template: `
    <div class="register-wrap">
      <div class="register-card">
        <div class="text-center mb-3">
          <img src="/Logo.png" alt="Logo" class="logo-img mb-2" (error)="e($event)">
          <h5 class="fw-bold mb-0" style="color:#880e4f">Atelier Flowers Victoria</h5>
          <small class="text-muted">Crear cuenta</small>
        </div>

        <form [formGroup]="form" (ngSubmit)="registrar()">
          <div class="mb-2">
            <label class="form-label fw-semibold">Nombre completo</label>
            <input class="form-control" formControlName="nombre" placeholder="Tu nombre">
          </div>
          <div class="mb-2">
            <label class="form-label fw-semibold">Email</label>
            <input class="form-control" formControlName="email" type="email" placeholder="correo@ejemplo.com">
          </div>
          <div class="mb-2">
            <label class="form-label fw-semibold">Teléfono <small class="text-muted">(opcional)</small></label>
            <input class="form-control" formControlName="telefono" placeholder="70000000">
          </div>
          <div class="mb-2">
            <label class="form-label fw-semibold">Contraseña</label>
            <input class="form-control" formControlName="password" type="password" placeholder="Mín. 6 caracteres">
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold">Confirmar contraseña</label>
            <input class="form-control" formControlName="confirmar" type="password">
            <small class="text-danger" *ngIf="form.errors?.['noCoinciden'] && form.get('confirmar')?.touched">
              Las contraseñas no coinciden
            </small>
          </div>

          <div *ngIf="error"   class="alert alert-danger py-2 text-center">{{ error }}</div>
          <div *ngIf="exito"   class="alert alert-success py-2 text-center">{{ exito }}</div>

          <button class="btn-primary-custom" type="submit" [disabled]="form.invalid || cargando">
            {{ cargando ? 'Registrando...' : 'Crear cuenta' }}
          </button>
        </form>

        <hr class="my-3">
        <p class="text-center mb-0 small">
          ¿Ya tienes cuenta? <a routerLink="/login" style="color:#880e4f">Iniciar sesión</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb   = inject(FormBuilder);
  private http  = inject(HttpClient);
  private router = inject(Router);

  error    = '';
  exito    = '';
  cargando = false;

  form = this.fb.group({
    nombre:   ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    telefono: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmar:['', Validators.required]
  }, { validators: this.passwordsIguales });

  passwordsIguales(g: AbstractControl) {
    const p = g.get('password')?.value;
    const c = g.get('confirmar')?.value;
    return p === c ? null : { noCoinciden: true };
  }

  registrar(): void {
    this.error = ''; this.exito = ''; this.cargando = true;
    const { nombre, email, password, telefono } = this.form.value;
    this.http.post(`${environment.apiUrl}/register`, { nombre, email, password, telefono }).subscribe({
      next: () => {
        this.exito = '¡Cuenta creada! Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 1800);
      },
      error: (err) => {
        this.error = err.error?.error ?? 'Error al registrar';
        this.cargando = false;
      }
    });
  }

  e(ev: Event) { (ev.target as HTMLImageElement).style.display = 'none'; }
}
