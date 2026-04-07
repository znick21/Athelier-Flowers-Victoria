import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Usuario {
  id: number; nombre: string; email: string;
  role: string; activo: number; created_at: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h4 class="fw-bold mb-3" style="color:#880e4f">Gestión de Usuarios</h4>
      <table class="table table-bordered table-hover">
        <thead class="table-light">
          <tr>
            <th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of usuarios">
            <td>{{ u.id }}</td>
            <td>{{ u.nombre }}</td>
            <td>{{ u.email }}</td>
            <td>
              <span class="badge"
                [ngClass]="{'bg-danger':u.role==='admin','bg-warning text-dark':u.role==='vendedor','bg-info text-dark':u.role==='cliente'}">
                {{ u.role }}
              </span>
            </td>
            <td>
              <span class="badge" [ngClass]="u.activo ? 'bg-success' : 'bg-secondary'">
                {{ u.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <button *ngIf="u.activo" class="btn btn-sm btn-outline-danger"
                (click)="desactivar(u)">Desactivar</button>
              <button *ngIf="!u.activo" class="btn btn-sm btn-outline-success"
                (click)="activar(u)">Activar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class UsuariosComponent implements OnInit {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;
  usuarios: Usuario[] = [];

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
