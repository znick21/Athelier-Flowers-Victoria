import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../../core/services/pedido.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { ProductoService } from '../../../core/services/producto.service';
import { Cliente } from '../../../core/models/cliente.model';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mt-4" style="max-width:500px">
      <h4>{{ id ? 'Editar' : 'Nuevo' }} Pedido</h4>
      <form [formGroup]="form" (ngSubmit)="guardar()">
        <div class="mb-3">
          <label class="form-label">Cliente</label>
          <select class="form-select" formControlName="clienteId">
            <option value="">Seleccionar...</option>
            <option *ngFor="let c of clientes" [value]="c.id">{{ c.nombre }}</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Producto</label>
          <select class="form-select" formControlName="productoId" (change)="calcularTotal()">
            <option value="">Seleccionar...</option>
            <option *ngFor="let p of productos" [value]="p.id">{{ p.nombre }} - Bs. {{ p.precio }}</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Cantidad</label>
          <input class="form-control" formControlName="cantidad" type="number" min="1" (input)="calcularTotal()">
        </div>
        <div class="mb-3">
          <label class="form-label">Total</label>
          <input class="form-control" formControlName="total" type="number" readonly>
        </div>
        <div class="mb-3">
          <label class="form-label">Estado</label>
          <select class="form-select" formControlName="estado">
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="entregado">Entregado</option>
          </select>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-success" type="submit" [disabled]="form.invalid">Guardar</button>
          <a class="btn btn-secondary" routerLink="/pedidos">Cancelar</a>
        </div>
      </form>
    </div>
  `
})
export class PedidoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(PedidoService);
  private clienteSvc = inject(ClienteService);
  private productoSvc = inject(ProductoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id: number | null = null;
  clientes: Cliente[] = [];
  productos: Producto[] = [];

  form = this.fb.group({
    clienteId: ['', Validators.required],
    productoId: ['', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]],
    total: [{ value: 0, disabled: true }],
    estado: ['pendiente', Validators.required]
  });

  ngOnInit(): void {
    this.clienteSvc.getAll().subscribe(data => this.clientes = data);
    this.productoSvc.getAll().subscribe(data => this.productos = data);
    this.id = Number(this.route.snapshot.paramMap.get('id')) || null;
    if (this.id) {
      this.svc.getById(this.id).subscribe(p =>
        this.form.patchValue({ ...p, clienteId: String(p.clienteId), productoId: String(p.productoId) })
      );
    }
  }

  calcularTotal(): void {
    const productoId = Number(this.form.value.productoId);
    const cantidad = Number(this.form.value.cantidad);
    const producto = this.productos.find(p => p.id === productoId);
    if (producto && cantidad > 0) {
      this.form.patchValue({ total: producto.precio * cantidad });
    }
  }

  guardar(): void {
    const v = this.form.getRawValue();
    const data = {
      clienteId: Number(v.clienteId),
      productoId: Number(v.productoId),
      cantidad: Number(v.cantidad),
      total: Number(v.total),
      estado: v.estado as any,
      fecha: new Date().toISOString().split('T')[0],
      token: this.id ? undefined : ('ped-' + Math.random().toString(36).substring(2, 10))
    };
    const op = this.id ? this.svc.update(this.id, data as any) : this.svc.create(data as any);
    op.subscribe(() => this.router.navigate(['/pedidos']));
  }
}
