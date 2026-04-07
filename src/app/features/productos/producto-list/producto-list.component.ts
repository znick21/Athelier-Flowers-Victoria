import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../../core/services/producto.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Producto } from '../../../core/models/producto.model';
import { Categoria } from '../../../core/models/categoria.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mt-4">

      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="fw-bold mb-0" style="color:#880e4f">📦 Productos</h4>
        <a class="btn btn-sm text-white" style="background:#880e4f"
           routerLink="/productos/nuevo" *ngIf="esAdmin">+ Nuevo</a>
      </div>

      <div class="input-group mb-3" style="max-width:360px">
        <span class="input-group-text bg-white">🔍</span>
        <input class="form-control" type="text"
               placeholder="Buscar por nombre o categoría..."
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
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th *ngIf="esAdmin">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of filtrados">
              <td class="text-muted">{{ p.id }}</td>
              <td class="fw-semibold">{{ p.nombre }}</td>
              <td>Bs. {{ p.precio }}</td>
              <td>
                <span [class]="p.stock <= 5 ? 'badge bg-warning text-dark' : 'badge bg-success'">
                  {{ p.stock }}
                </span>
              </td>
              <td>{{ nombreCategoria(p.categoriaId) }}</td>
              <td *ngIf="esAdmin">
                <a class="btn btn-sm btn-outline-warning me-1"
                   [routerLink]="['/productos/editar', p.id]">Editar</a>
                <button class="btn btn-sm btn-outline-danger"
                        (click)="eliminar(p.id!)">Eliminar</button>
              </td>
            </tr>
            <tr *ngIf="filtrados.length === 0">
              <td [attr.colspan]="esAdmin ? 6 : 5" class="text-center text-muted py-3">
                Sin resultados para "{{ busqueda }}"
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <small class="text-muted">{{ filtrados.length }} de {{ productos.length }} productos</small>
    </div>
  `
})
export class ProductoListComponent implements OnInit {
  private svc    = inject(ProductoService);
  private catSvc = inject(CategoriaService);
  private auth   = inject(AuthService);

  productos:  Producto[]  = [];
  categorias: Categoria[] = [];
  busqueda  = '';
  esAdmin   = this.auth.getRole() === 'admin';

  get filtrados(): Producto[] {
    const q = this.busqueda.toLowerCase().trim();
    if (!q) return this.productos;
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      this.nombreCategoria(p.categoriaId).toLowerCase().includes(q)
    );
  }

  ngOnInit(): void {
    this.svc.getAll().subscribe(d    => this.productos  = d);
    this.catSvc.getAll().subscribe(d => this.categorias = d);
  }

  nombreCategoria(id: number): string {
    return this.categorias.find(c => c.id === id)?.nombre ?? '-';
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar producto?')) {
      this.svc.delete(id).subscribe(() =>
        this.svc.getAll().subscribe(d => this.productos = d));
    }
  }
}
