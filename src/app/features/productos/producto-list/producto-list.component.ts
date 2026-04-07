import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../../core/services/producto.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Producto } from '../../../core/models/producto.model';
import { Categoria } from '../../../core/models/categoria.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Productos</h4>
        <a class="btn btn-success btn-sm" routerLink="/productos/nuevo" *ngIf="esAdmin">+ Nuevo</a>
      </div>
      <table class="table table-bordered table-hover">
        <thead class="table-success">
          <tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Categoría</th><th>Token</th><th *ngIf="esAdmin">Acciones</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of productos">
            <td>{{ p.id }}</td>
            <td>{{ p.nombre }}</td>
            <td>Bs. {{ p.precio }}</td>
            <td>{{ p.stock }}</td>
            <td>{{ nombreCategoria(p.categoriaId) }}</td>
            <td><small class="text-muted">{{ p.token }}</small></td>
            <td *ngIf="esAdmin">
              <a class="btn btn-warning btn-sm me-1" [routerLink]="['/productos/editar', p.id]">Editar</a>
              <button class="btn btn-danger btn-sm" (click)="eliminar(p.id!)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ProductoListComponent implements OnInit {
  private svc = inject(ProductoService);
  private catSvc = inject(CategoriaService);
  private auth = inject(AuthService);

  productos: Producto[] = [];
  categorias: Categoria[] = [];
  esAdmin = this.auth.getRole() === 'admin';

  ngOnInit(): void {
    this.svc.getAll().subscribe(data => this.productos = data);
    this.catSvc.getAll().subscribe(data => this.categorias = data);
  }

  nombreCategoria(id: number): string {
    return this.categorias.find(c => c.id === id)?.nombre ?? '-';
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar producto?')) {
      this.svc.delete(id).subscribe(() => this.svc.getAll().subscribe(data => this.productos = data));
    }
  }
}
