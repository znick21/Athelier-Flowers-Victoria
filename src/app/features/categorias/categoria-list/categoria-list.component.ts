import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mt-4">

      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="fw-bold mb-0" style="color:#880e4f">🏷️ Categorías</h4>
        <a class="btn btn-sm text-white" style="background:#880e4f"
           routerLink="/categorias/nueva">+ Nueva</a>
      </div>

      <div class="input-group mb-3" style="max-width:360px">
        <span class="input-group-text bg-white">🔍</span>
        <input class="form-control" type="text"
               placeholder="Buscar por nombre o descripción..."
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
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of filtrados">
              <td class="text-muted">{{ c.id }}</td>
              <td class="fw-semibold">{{ c.nombre }}</td>
              <td class="text-muted">{{ c.descripcion }}</td>
              <td>
                <a class="btn btn-sm btn-outline-warning me-1"
                   [routerLink]="['/categorias/editar', c.id]">Editar</a>
                <button class="btn btn-sm btn-outline-danger"
                        (click)="eliminar(c.id!)">Eliminar</button>
              </td>
            </tr>
            <tr *ngIf="filtrados.length === 0">
              <td colspan="4" class="text-center text-muted py-3">
                Sin resultados para "{{ busqueda }}"
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <small class="text-muted">{{ filtrados.length }} de {{ categorias.length }} categorías</small>
    </div>
  `
})
export class CategoriaListComponent implements OnInit {
  private svc = inject(CategoriaService);

  categorias: Categoria[] = [];
  busqueda = '';

  get filtrados(): Categoria[] {
    const q = this.busqueda.toLowerCase().trim();
    if (!q) return this.categorias;
    return this.categorias.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      (c.descripcion ?? '').toLowerCase().includes(q)
    );
  }

  ngOnInit(): void { this.cargar(); }

  cargar(): void { this.svc.getAll().subscribe(d => this.categorias = d); }

  eliminar(id: number): void {
    if (confirm('¿Eliminar categoría?')) {
      this.svc.delete(id).subscribe(() => this.cargar());
    }
  }
}
