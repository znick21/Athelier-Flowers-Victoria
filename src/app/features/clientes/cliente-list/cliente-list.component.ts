import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mt-4">

      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="fw-bold mb-0" style="color:#880e4f">👥 Clientes</h4>
        <a class="btn btn-sm text-white" style="background:#880e4f"
           routerLink="/clientes/nuevo" *ngIf="esAdmin">+ Nuevo</a>
      </div>

      <div class="input-group mb-3" style="max-width:360px">
        <span class="input-group-text bg-white">🔍</span>
        <input class="form-control" type="text"
               placeholder="Buscar por nombre, email o teléfono..."
               [(ngModel)]="busqueda">
        <button *ngIf="busqueda" class="btn btn-outline-secondary"
                type="button" (click)="busqueda=''">✕</button>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead style="background:#f3e5f5">
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of filtrados">
              <td class="text-muted">{{ c.id }}</td>
              <td class="fw-semibold">{{ c.nombre }}</td>
              <td>{{ c.email }}</td>
              <td>{{ c.telefono }}</td>
              <td>
                <a class="btn btn-sm btn-outline-warning me-1"
                   [routerLink]="['/clientes/editar', c.id]">Editar</a>
                <button class="btn btn-sm btn-outline-danger"
                        (click)="eliminar(c.id!)" *ngIf="esAdmin">Eliminar</button>
              </td>
            </tr>
            <tr *ngIf="filtrados.length === 0">
              <td colspan="5" class="text-center text-muted py-3">
                Sin resultados para "{{ busqueda }}"
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <small class="text-muted">{{ filtrados.length }} de {{ clientes.length }} clientes</small>
    </div>
  `
})
export class ClienteListComponent implements OnInit {
  private svc  = inject(ClienteService);
  private auth = inject(AuthService);

  clientes: Cliente[] = [];
  busqueda = '';
  esAdmin  = this.auth.getRole() === 'admin';

  get filtrados(): Cliente[] {
    const q = this.busqueda.toLowerCase().trim();
    if (!q) return this.clientes;
    return this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)  ||
      c.telefono.toLowerCase().includes(q)
    );
  }

  ngOnInit(): void { this.svc.getAll().subscribe(d => this.clientes = d); }

  eliminar(id: number): void {
    if (confirm('¿Eliminar cliente?')) {
      this.svc.delete(id).subscribe(() =>
        this.svc.getAll().subscribe(d => this.clientes = d));
    }
  }
}
