import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Usuario {
  id: number; nombre: string; email: string;
  role: string; activo: number; created_at: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">

      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="fw-bold mb-0" style="color:#880e4f">👤 Gestión de Usuarios</h4>
      </div>

      <div class="input-group mb-3" style="max-width:360px">
        <span class="input-group-text bg-white">🔍</span>
        <input class="form-control" type="text"
               placeholder="Buscar por nombre, email o rol..."
               [(ngModel)]="busqueda">
        <button *ngIf="busqueda" class="btn btn-outline-secondary"
                type="button" (click)="busqueda=''">✕</button>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead style="background:#f3e5f5">
            <tr>
              <th>#</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of filtrados">
              <td class="text-muted">{{ u.id }}</td>
              <td class="fw-semibold">{{ u.nombre }}</td>
              <td>{{ u.email }}</td>
              <td>
                <span class="badge"
                  [ngClass]="{
                    'bg-danger':            u.role === 'admin',
                    'bg-warning text-dark': u.role === 'vendedor',
                    'bg-info text-dark':    u.role === 'cliente'
                  }">
                  {{ u.role }}
                </span>
              </td>
              <td>
                <span class="badge" [ngClass]="u.activo ? 'bg-success' : 'bg-secondary'">
                  {{ u.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <button *ngIf="u.activo"  class="btn btn-sm btn-outline-danger"
                        (click)="desactivar(u)">Desactivar</button>
                <button *ngIf="!u.activo" class="btn btn-sm btn-outline-success"
                        (click)="activar(u)">Activar</button>
              </td>
            </tr>
            <tr *ngIf="filtrados.length === 0">
              <td colspan="6" class="text-center text-muted py-3">
                Sin resultados para "{{ busqueda }}"
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <small class="text-muted">{{ filtrados.length }} de {{ usuarios.length }} usuarios</small>
    </div>
  `
})
export class UsuariosComponent implements OnInit {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  usuarios: Usuario[] = [];
  busqueda = '';

  get filtrados(): Usuario[] {
    const q = this.busqueda.toLowerCase().trim();
    if (!q) return this.usuarios;
    return this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)  ||
      u.role.toLowerCase().includes(q)
    );
  }

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.http.get<Usuario[]>(`${this.api}/usuarios`).subscribe(d => this.usuarios = d);
  }

  desactivar(u: Usuario): void {
    if (!confirm(`¿Desactivar a ${u.nombre}?`)) return;
    this.http.patch(`${this.api}/usuarios/${u.id}/desactivar`, {}).subscribe(() => this.cargar());
  }

  activar(u: Usuario): void {
    this.http.patch(`${this.api}/usuarios/${u.id}/activar`, {}).subscribe(() => this.cargar());
  }
}
