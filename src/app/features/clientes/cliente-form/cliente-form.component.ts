import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../../core/services/cliente.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mt-4" style="max-width:500px">
      <h4>{{ id ? 'Editar' : 'Nuevo' }} Cliente</h4>
      <form [formGroup]="form" (ngSubmit)="guardar()">
        <div class="mb-3">
          <label class="form-label">Nombre</label>
          <input class="form-control" formControlName="nombre">
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input class="form-control" formControlName="email" type="email">
        </div>
        <div class="mb-3">
          <label class="form-label">Teléfono</label>
          <input class="form-control" formControlName="telefono">
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-success" type="submit" [disabled]="form.invalid">Guardar</button>
          <a class="btn btn-secondary" routerLink="/clientes">Cancelar</a>
        </div>
      </form>
    </div>
  `
})
export class ClienteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(ClienteService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id: number | null = null;
  form = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required]
  });

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id')) || null;
    if (this.id) {
      this.svc.getById(this.id).subscribe(c => this.form.patchValue(c));
    }
  }

  guardar(): void {
    const userId = this.auth.getUserId() ?? 0;
    const data = { ...this.form.value, userId, token: this.id ? undefined : this.generarToken() } as any;
    const op = this.id ? this.svc.update(this.id, data) : this.svc.create(data);
    op.subscribe(() => this.router.navigate(['/clientes']));
  }

  private generarToken(): string {
    return 'cli-' + Math.random().toString(36).substring(2, 10);
  }
}
