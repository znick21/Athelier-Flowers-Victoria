import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PagoService } from '../../../core/services/pago.service';
import { PedidoService } from '../../../core/services/pedido.service';
import { Pago } from '../../../core/models/pago.model';
import { Pedido } from '../../../core/models/pedido.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-pago-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Pagos</h4>
        <a class="btn btn-success btn-sm" routerLink="/pagos/nuevo">+ Nuevo</a>
      </div>
      <table class="table table-bordered table-hover">
        <thead class="table-success">
          <tr><th>ID</th><th>Pedido #</th><th>Monto</th><th>Método</th><th>Fecha</th><th>Token</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of pagos">
            <td>{{ p.id }}</td>
            <td>{{ p.pedidoId }}</td>
            <td>Bs. {{ p.monto }}</td>
            <td>{{ p.metodo }}</td>
            <td>{{ p.fecha }}</td>
            <td><small class="text-muted">{{ p.token }}</small></td>
            <td>
              <a class="btn btn-info btn-sm me-1 text-white" [routerLink]="['/factura', p.id]">Factura</a>
              <a class="btn btn-warning btn-sm me-1" [routerLink]="['/pagos/editar', p.id]">Editar</a>
              <button class="btn btn-danger btn-sm" (click)="eliminar(p.id!)" *ngIf="esAdmin">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class PagoListComponent implements OnInit {
  private svc = inject(PagoService);
  private auth = inject(AuthService);

  pagos: Pago[] = [];
  esAdmin = this.auth.getRole() === 'admin';

  ngOnInit(): void { this.svc.getAll().subscribe(data => this.pagos = data); }

  eliminar(id: number): void {
    if (confirm('¿Eliminar pago?')) {
      this.svc.delete(id).subscribe(() => this.svc.getAll().subscribe(data => this.pagos = data));
    }
  }
}
