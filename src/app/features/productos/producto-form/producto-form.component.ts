import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ProductoService } from '../../../core/services/producto.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/models/categoria.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styles: [`
    .img-preview {
      width: 100%; max-height: 200px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid #ddd;
      margin-top: .5rem;
    }
    .upload-area {
      border: 2px dashed #c8a0bc;
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;
      cursor: pointer;
      background: #fdf3f8;
      transition: border-color .2s;
    }
    .upload-area:hover { border-color: #880e4f; }
    .upload-area input[type=file] { display: none; }
    .spinner { font-size: .85rem; color: #880e4f; }
  `],
  template: `
    <div class="container mt-4" style="max-width:520px">
      <h4 class="fw-bold mb-4" style="color:#880e4f">
        {{ id ? 'Editar' : 'Nuevo' }} Producto
      </h4>

      <form [formGroup]="form" (ngSubmit)="guardar()">

        <div class="mb-3">
          <label class="form-label fw-semibold">Nombre</label>
          <input class="form-control" formControlName="nombre">
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">
            Descripción <small class="text-muted fw-normal">(opcional)</small>
          </label>
          <textarea class="form-control" formControlName="descripcion" rows="2"></textarea>
        </div>

        <div class="row g-3 mb-3">
          <div class="col-6">
            <label class="form-label fw-semibold">Precio (Bs.)</label>
            <input class="form-control" formControlName="precio" type="number" min="0">
          </div>
          <div class="col-6">
            <label class="form-label fw-semibold">Stock</label>
            <input class="form-control" formControlName="stock" type="number" min="0">
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Categoría</label>
          <select class="form-select" formControlName="categoriaId">
            <option value="">Seleccionar...</option>
            <option *ngFor="let c of categorias" [value]="c.id">{{ c.nombre }}</option>
          </select>
        </div>

        <!-- Imagen -->
        <div class="mb-4">
          <label class="form-label fw-semibold">Imagen del producto</label>

          <!-- Área de carga -->
          <label class="upload-area d-block">
            <input type="file" accept="image/*" (change)="onFileSelected($event)">
            <div *ngIf="!subiendo">
              <div style="font-size:2rem">🖼️</div>
              <div class="text-muted" style="font-size:.9rem">
                Haz clic para seleccionar una imagen<br>
                <small>JPG, PNG, WEBP — máx. 5 MB</small>
              </div>
            </div>
            <div *ngIf="subiendo" class="spinner">
              ⏳ Subiendo imagen...
            </div>
          </label>

          <!-- Preview -->
          <img *ngIf="previewUrl" [src]="previewUrl" class="img-preview"
               (error)="previewUrl = ''">

          <!-- Mensaje de éxito -->
          <div *ngIf="form.value.imagen && !subiendo"
               class="mt-2 small text-success fw-semibold">
            ✔ Imagen cargada correctamente
          </div>
        </div>

        <div class="d-flex gap-2">
          <button class="btn text-white fw-semibold" style="background:#880e4f"
                  type="submit" [disabled]="form.invalid || subiendo">
            {{ id ? 'Actualizar' : 'Guardar' }}
          </button>
          <a class="btn btn-outline-secondary" routerLink="/productos">Cancelar</a>
        </div>

      </form>
    </div>
  `
})
export class ProductoFormComponent implements OnInit {
  private fb      = inject(FormBuilder);
  private svc     = inject(ProductoService);
  private catSvc  = inject(CategoriaService);
  private http    = inject(HttpClient);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);
  private api     = environment.apiUrl;

  id:         number | null = null;
  categorias: Categoria[]   = [];
  previewUrl  = '';
  subiendo    = false;

  form = this.fb.group({
    nombre:      ['', Validators.required],
    descripcion: [''],
    precio:      [0, [Validators.required, Validators.min(0)]],
    stock:       [0, [Validators.required, Validators.min(0)]],
    categoriaId: ['', Validators.required],
    imagen:      ['']
  });

  ngOnInit(): void {
    this.catSvc.getAll().subscribe(d => this.categorias = d);
    this.id = Number(this.route.snapshot.paramMap.get('id')) || null;
    if (this.id) {
      this.svc.getById(this.id).subscribe(p => {
        this.form.patchValue({ ...p, categoriaId: String(p.categoriaId) });
        if (p.imagen) this.previewUrl = this.api + p.imagen;
      });
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Preview local inmediato
    const reader = new FileReader();
    reader.onload = () => this.previewUrl = reader.result as string;
    reader.readAsDataURL(file);

    // Subir al backend
    this.subiendo = true;
    const fd = new FormData();
    fd.append('imagen', file);

    this.http.post<{ url: string }>(`${this.api}/upload`, fd).subscribe({
      next: res => {
        this.form.patchValue({ imagen: res.url });
        this.previewUrl = this.api + res.url;
        this.subiendo   = false;
      },
      error: () => {
        alert('Error al subir la imagen. Verifica que el backend esté corriendo.');
        this.subiendo = false;
      }
    });
  }

  guardar(): void {
    const data = {
      ...this.form.value,
      categoriaId: Number(this.form.value.categoriaId),
      token: this.id ? undefined : ('prod-' + Math.random().toString(36).slice(2, 10))
    } as any;
    const op = this.id ? this.svc.update(this.id, data) : this.svc.create(data);
    op.subscribe(() => this.router.navigate(['/productos']));
  }
}
