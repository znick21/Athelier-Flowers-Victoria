import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Categorías</h4>
        <a class="btn btn-success btn-sm" routerLink="/categorias/nueva">+ Nueva</a>
      </div>
      <table class="table table-bordered table-hover">
        <thead class="table-success">
          <tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Token</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of categorias">
            <td>{{ c.id }}</td>
            <td>{{ c.nombre }}</td>
            <td>{{ c.descripcion }}</td>
            <td><small class="text-muted">{{ c.token }}</small></td>
            <td>
              <a class="btn btn-warning btn-sm me-1" [routerLink]="['/categorias/editar', c.id]">Editar</a>
              <button class="btn btn-danger btn-sm" (click)="eliminar(c.id!)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class CategoriaListComponent implements OnInit {
  private svc = inject(CategoriaService);
  categorias: Categoria[] = [];

  ngOnInit(): void { this.cargar(); }

  cargar(): void { this.svc.getAll().subscribe(data => this.categorias = data); }

  eliminar(id: number): void {
    if (confirm('¿Eliminar categoría?')) {
      this.svc.delete(id).subscribe(() => this.cargar());
    }
  }
}
