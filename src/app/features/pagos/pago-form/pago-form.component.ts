import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagoService } from '../../../core/services/pago.service';
import { PedidoService } from '../../../core/services/pedido.service';
import { Pedido } from '../../../core/models/pedido.model';

@Component({
  selector: 'app-pago-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mt-4" style="max-width:500px">
      <h4>{{ id ? 'Editar' : 'Nuevo' }} Pago</h4>
      <form [formGroup]="form" (ngSubmit)="guardar()">
        <div class="mb-3">
          <label class="form-label">Pedido</label>
          <select class="form-select" formControlName="pedidoId">
            <option value="">Seleccionar pedido...</option>
            <option *ngFor="let p of pedidos" [value]="p.id">
              Pedido #{{ p.id }} — Bs. {{ p.total }} ({{ p.estado }})
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Monto (Bs.)</label>
          <input class="form-control" formControlName="monto" type="number" min="0">
        </div>
        <div class="mb-3">
          <label class="form-label">Método de Pago</label>
          <select class="form-select" formControlName="metodo">
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-success" type="submit" [disabled]="form.invalid">Guardar</button>
          <a class="btn btn-secondary" routerLink="/pagos">Cancelar</a>
        </div>
      </form>
    </div>
  `
})
export class PagoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(PagoService);
  private pedidoSvc = inject(PedidoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id: number | null = null;
  pedidos: Pedido[] = [];

  form = this.fb.group({
    pedidoId: ['', Validators.required],
    monto: [0, [Validators.required, Validators.min(0)]],
    metodo: ['efectivo', Validators.required]
  });

  ngOnInit(): void {
    this.pedidoSvc.getAll().subscribe(data => this.pedidos = data);
    this.id = Number(this.route.snapshot.paramMap.get('id')) || null;
    if (this.id) {
      this.svc.getById(this.id).subscribe(p =>
        this.form.patchValue({ ...p, pedidoId: String(p.pedidoId) })
      );
    }
  }

  guardar(): void {
    const v = this.form.value;
    const data = {
      pedidoId: Number(v.pedidoId),
      monto: Number(v.monto),
      metodo: v.metodo as any,
      fecha: new Date().toISOString().split('T')[0],
      token: this.id ? undefined : ('pag-' + Math.random().toString(36).substring(2, 10))
    };
    const op = this.id ? this.svc.update(this.id, data as any) : this.svc.create(data as any);
    op.subscribe(() => this.router.navigate(['/pagos']));
  }
}
