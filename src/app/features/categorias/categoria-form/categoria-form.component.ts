import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../core/services/categoria.service';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4" style="max-width:500px">
      <h4>{{ id ? 'Editar' : 'Nueva' }} Categoría</h4>
      <form [formGroup]="form" (ngSubmit)="guardar()">
        <div class="mb-3">
          <label class="form-label">Nombre</label>
          <input class="form-control" formControlName="nombre">
        </div>
        <div class="mb-3">
          <label class="form-label">Descripción</label>
          <input class="form-control" formControlName="descripcion">
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-success" type="submit" [disabled]="form.invalid">Guardar</button>
          <a class="btn btn-secondary" routerLink="/categorias">Cancelar</a>
        </div>
      </form>
    </div>
  `
})
export class CategoriaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(CategoriaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id: number | null = null;
  form = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required]
  });

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id')) || null;
    if (this.id) {
      this.svc.getById(this.id).subscribe(c => this.form.patchValue(c));
    }
  }

  guardar(): void {
    const data = { ...this.form.value, token: this.id ? undefined : this.generarToken() } as any;
    const op = this.id ? this.svc.update(this.id, data) : this.svc.create(data);
    op.subscribe(() => this.router.navigate(['/categorias']));
  }

  private generarToken(): string {
    return 'cat-' + Math.random().toString(36).substring(2, 10);
  }
}
