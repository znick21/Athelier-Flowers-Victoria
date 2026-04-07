import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Clientes</h4>
        <a class="btn btn-success btn-sm" routerLink="/clientes/nuevo" *ngIf="esAdmin">+ Nuevo</a>
      </div>
      <table class="table table-bordered table-hover">
        <thead class="table-success">
          <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Token</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of clientes">
            <td>{{ c.id }}</td>
            <td>{{ c.nombre }}</td>
            <td>{{ c.email }}</td>
            <td>{{ c.telefono }}</td>
            <td><small class="text-muted">{{ c.token }}</small></td>
            <td>
              <a class="btn btn-warning btn-sm me-1" [routerLink]="['/clientes/editar', c.id]">Editar</a>
              <button class="btn btn-danger btn-sm" (click)="eliminar(c.id!)" *ngIf="esAdmin">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ClienteListComponent implements OnInit {
  private svc = inject(ClienteService);
  private auth = inject(AuthService);

  clientes: Cliente[] = [];
  esAdmin = this.auth.getRole() === 'admin';

  ngOnInit(): void { this.svc.getAll().subscribe(data => this.clientes = data); }

  eliminar(id: number): void {
    if (confirm('¿Eliminar cliente?')) {
      this.svc.delete(id).subscribe(() => this.svc.getAll().subscribe(data => this.clientes = data));
    }
  }
}
