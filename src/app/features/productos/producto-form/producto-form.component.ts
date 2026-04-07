import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../core/services/producto.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mt-4" style="max-width:520px">
      <h4>{{ id ? 'Editar' : 'Nuevo' }} Producto</h4>
      <form [formGroup]="form" (ngSubmit)="guardar()">
        <div class="mb-3">
          <label class="form-label">Nombre</label>
          <input class="form-control" formControlName="nombre">
        </div>
        <div class="mb-3">
          <label class="form-label">Descripción <small class="text-muted">(opcional)</small></label>
          <textarea class="form-control" formControlName="descripcion" rows="2"></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Precio (Bs.)</label>
          <input class="form-control" formControlName="precio" type="number" min="0">
        </div>
        <div class="mb-3">
          <label class="form-label">Stock</label>
          <input class="form-control" formControlName="stock" type="number" min="0">
        </div>
        <div class="mb-3">
          <label class="form-label">Categoría</label>
          <select class="form-select" formControlName="categoriaId">
            <option value="">Seleccionar...</option>
            <option *ngFor="let c of categorias" [value]="c.id">{{ c.nombre }}</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">URL de Imagen <small class="text-muted">(opcional)</small></label>
          <input class="form-control" formControlName="imagen" placeholder="https://...">
          <img *ngIf="form.value.imagen" [src]="form.value.imagen" class="mt-2 rounded" style="width:100%;max-height:180px;object-fit:cover" (error)="onImgError($event)">
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-success" type="submit" [disabled]="form.invalid">Guardar</button>
          <a class="btn btn-secondary" routerLink="/productos">Cancelar</a>
        </div>
      </form>
    </div>
  `
})
export class ProductoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(ProductoService);
  private catSvc = inject(CategoriaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id: number | null = null;
  categorias: Categoria[] = [];
  form = this.fb.group({
    nombre:      ['', Validators.required],
    descripcion: [''],
    precio:      [0, [Validators.required, Validators.min(0)]],
    stock:       [0, [Validators.required, Validators.min(0)]],
    categoriaId: ['', Validators.required],
    imagen:      ['']
  });

  ngOnInit(): void {
    this.catSvc.getAll().subscribe(data => this.categorias = data);
    this.id = Number(this.route.snapshot.paramMap.get('id')) || null;
    if (this.id) {
      this.svc.getById(this.id).subscribe(p =>
        this.form.patchValue({ ...p, categoriaId: String(p.categoriaId) })
      );
    }
  }

  guardar(): void {
    const data = {
      ...this.form.value,
      categoriaId: Number(this.form.value.categoriaId),
      token: this.id ? undefined : ('prod-' + Math.random().toString(36).substring(2, 10))
    } as any;
    const op = this.id ? this.svc.update(this.id, data) : this.svc.create(data);
    op.subscribe(() => this.router.navigate(['/productos']));
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = '';
  }
}
