import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidoService } from '../../../core/services/pedido.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { ProductoService } from '../../../core/services/producto.service';
import { Pedido } from '../../../core/models/pedido.model';
import { Cliente } from '../../../core/models/cliente.model';
import { Producto } from '../../../core/models/producto.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-pedido-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Pedidos</h4>
        <a class="btn btn-success btn-sm" routerLink="/pedidos/nuevo" *ngIf="puedeCrear">+ Nuevo</a>
      </div>
      <table class="table table-bordered table-hover">
        <thead class="table-success">
          <tr><th>ID</th><th>Cliente</th><th>Producto</th><th>Cantidad</th><th>Total</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of pedidos">
            <td>{{ p.id }}</td>
            <td>{{ nombreCliente(p.clienteId) }}</td>
            <td>{{ nombreProducto(p.productoId) }}</td>
            <td>{{ p.cantidad }}</td>
            <td>Bs. {{ p.total }}</td>
            <td>
              <span class="badge" [ngClass]="{'bg-warning text-dark': p.estado==='pendiente', 'bg-primary': p.estado==='confirmado', 'bg-success': p.estado==='entregado'}">
                {{ p.estado }}
              </span>
            </td>
            <td>{{ p.fecha }}</td>
            <td>
              <a class="btn btn-warning btn-sm me-1" [routerLink]="['/pedidos/editar', p.id]" *ngIf="puedeCrear">Editar</a>
              <button class="btn btn-danger btn-sm" (click)="eliminar(p.id!)" *ngIf="esAdmin">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class PedidoListComponent implements OnInit {
  private svc = inject(PedidoService);
  private clienteSvc = inject(ClienteService);
  private productoSvc = inject(ProductoService);
  private auth = inject(AuthService);

  pedidos: Pedido[] = [];
  clientes: Cliente[] = [];
  productos: Producto[] = [];
  esAdmin = this.auth.getRole() === 'admin';
  puedeCrear = ['admin', 'vendedor'].includes(this.auth.getRole() ?? '');

  ngOnInit(): void {
    const rol = this.auth.getRole();
    const userId = this.auth.getUserId();

    this.clienteSvc.getAll().subscribe(data => {
      this.clientes = data;
      // Si es cliente, filtrar solo sus pedidos
      if (rol === 'cliente') {
        const miCliente = data.find(c => c.userId === userId);
        if (miCliente) {
          this.svc.getByCliente(miCliente.id!).subscribe(p => this.pedidos = p);
        }
      } else {
        this.svc.getAll().subscribe(p => this.pedidos = p);
      }
    });
    this.productoSvc.getAll().subscribe(data => this.productos = data);
  }

  nombreCliente(id: number): string {
    return this.clientes.find(c => c.id === id)?.nombre ?? '-';
  }

  nombreProducto(id: number): string {
    return this.productos.find(p => p.id === id)?.nombre ?? '-';
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar pedido?')) {
      this.svc.delete(id).subscribe(() => this.svc.getAll().subscribe(data => this.pedidos = data));
    }
  }
}
