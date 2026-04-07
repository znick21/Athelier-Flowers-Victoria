import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { switchMap, forkJoin } from 'rxjs';
import { PagoService } from '../../core/services/pago.service';
import { PedidoService } from '../../core/services/pedido.service';
import { ClienteService } from '../../core/services/cliente.service';
import { ProductoService } from '../../core/services/producto.service';
import { Pago } from '../../core/models/pago.model';
import { Pedido } from '../../core/models/pedido.model';
import { Cliente } from '../../core/models/cliente.model';
import { Producto } from '../../core/models/producto.model';

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styles: [`
    @media print { .no-print { display: none !important; } }
    .factura { max-width: 600px; margin: 2rem auto; border: 1px solid #ccc; padding: 2rem; }
  `],
  template: `
    <div class="factura" *ngIf="pago && pedido && cliente && producto">
      <div class="text-center mb-4">
        <h3>🌸 Florería</h3>
        <h5>FACTURA #{{ pago.id }}</h5>
        <small class="text-muted">Fecha: {{ pago.fecha }}</small>
      </div>
      <hr>
      <h6>Cliente</h6>
      <p>{{ cliente.nombre }}<br>{{ cliente.email }}<br>{{ cliente.telefono }}</p>
      <hr>
      <h6>Detalle del Pedido #{{ pedido.id }}</h6>
      <table class="table table-sm">
        <thead><tr><th>Producto</th><th>Precio</th><th>Cant.</th><th>Subtotal</th></tr></thead>
        <tbody>
          <tr>
            <td>{{ producto.nombre }}</td>
            <td>Bs. {{ producto.precio }}</td>
            <td>{{ pedido.cantidad }}</td>
            <td>Bs. {{ pedido.total }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr><th colspan="3" class="text-end">TOTAL</th><th>Bs. {{ pedido.total }}</th></tr>
        </tfoot>
      </table>
      <hr>
      <p><strong>Método de Pago:</strong> {{ pago.metodo | titlecase }}</p>
      <p><strong>Monto Pagado:</strong> Bs. {{ pago.monto }}</p>
      <p class="text-muted"><small>Token de verificación: {{ pago.token }}</small></p>
      <div class="text-center mt-4 no-print">
        <button class="btn btn-success me-2" (click)="imprimir()">Imprimir</button>
        <a class="btn btn-secondary" routerLink="/pagos">Volver</a>
      </div>
    </div>
    <div class="container mt-4 text-center" *ngIf="!pago">
      <p>Cargando factura...</p>
    </div>
  `
})
export class FacturaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pagoSvc = inject(PagoService);
  private pedidoSvc = inject(PedidoService);
  private clienteSvc = inject(ClienteService);
  private productoSvc = inject(ProductoService);

  pago?: Pago;
  pedido?: Pedido;
  cliente?: Cliente;
  producto?: Producto;

  ngOnInit(): void {
    const pagoId = Number(this.route.snapshot.paramMap.get('pagoId'));
    this.pagoSvc.getById(pagoId).pipe(
      switchMap(pago => {
        this.pago = pago;
        return this.pedidoSvc.getById(pago.pedidoId);
      }),
      switchMap(pedido => {
        this.pedido = pedido;
        return forkJoin([
          this.clienteSvc.getById(pedido.clienteId),
          this.productoSvc.getById(pedido.productoId)
        ]);
      })
    ).subscribe(([cliente, producto]) => {
      this.cliente = cliente;
      this.producto = producto;
    });
  }

  imprimir(): void { window.print(); }
}
