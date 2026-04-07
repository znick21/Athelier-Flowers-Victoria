import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../core/services/producto.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { PedidoService } from '../../core/services/pedido.service';
import { ClienteService } from '../../core/services/cliente.service';
import { Producto } from '../../core/models/producto.model';
import { Categoria } from '../../core/models/categoria.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .carousel-img {
      height: 420px;
      object-fit: cover;
      border-radius: 0 0 12px 12px;
    }
    .carousel-caption-custom {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      background: linear-gradient(transparent, rgba(0,0,0,.65));
      padding: 2rem 1.5rem 1.5rem;
      border-radius: 0 0 12px 12px;
      text-align: left;
    }
    .stat-card {
      border-radius: 12px;
      padding: 1.2rem;
      color: #fff;
      text-align: center;
    }
    .welcome-bar {
      background: linear-gradient(90deg, #880e4f, #c2185b);
      color: #fff;
      border-radius: 12px;
      padding: 1.2rem 1.5rem;
      margin-bottom: 1.5rem;
    }
    .section-title {
      color: #880e4f;
      font-weight: 700;
      margin-bottom: 1rem;
      border-left: 4px solid #880e4f;
      padding-left: .75rem;
    }
    .prod-card {
      border: none;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,.09);
      transition: transform .2s, box-shadow .2s;
      height: 100%;
      background: #fff;
    }
    .prod-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(136,14,79,.2);
    }
    .prod-card img {
      width: 100%;
      height: 180px;
      object-fit: cover;
    }
    .prod-card .no-img {
      width: 100%;
      height: 180px;
      background: linear-gradient(135deg, #f3e5f5, #fce4ec);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
    }
    .prod-card .card-body { padding: .9rem 1rem; }
    .prod-card .precio {
      font-size: 1.1rem;
      font-weight: 700;
      color: #880e4f;
    }
    .prod-card .cat-badge {
      font-size: .72rem;
      background: #f8bbd9;
      color: #880e4f;
      padding: .15rem .5rem;
      border-radius: 999px;
      font-weight: 600;
    }
    .stock-low { color: #e65100; font-weight: 600; font-size: .8rem; }
    .stock-ok  { color: #2e7d32; font-weight: 600; font-size: .8rem; }
  `],
  template: `
    <div class="p-4">

      <!-- Bienvenida -->
      <div class="welcome-bar d-flex align-items-center gap-3">
        <div style="font-size:2rem">🌸</div>
        <div>
          <h5 class="mb-0 fw-bold">Bienvenido, {{ nombre }}</h5>
          <small class="opacity-75">Atelier Flowers Victoria — Panel de gestión</small>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="stat-card" style="background:#880e4f">
            <div style="font-size:1.8rem">📦</div>
            <div class="fs-4 fw-bold">{{ totalProductos }}</div>
            <small>Productos</small>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card" style="background:#6a1b4d">
            <div style="font-size:1.8rem">🏷️</div>
            <div class="fs-4 fw-bold">{{ totalCategorias }}</div>
            <small>Categorías</small>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card" style="background:#4a0d38">
            <div style="font-size:1.8rem">👥</div>
            <div class="fs-4 fw-bold">{{ totalClientes }}</div>
            <small>Clientes</small>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card" style="background:#2d0024">
            <div style="font-size:1.8rem">🛒</div>
            <div class="fs-4 fw-bold">{{ totalPedidos }}</div>
            <small>Pedidos</small>
          </div>
        </div>
      </div>

      <!-- ── Carrusel de productos ── -->
      <h5 class="section-title">Nuestros Productos</h5>

      <div *ngIf="productosConImagen.length > 0"
           id="carruselProductos"
           class="carousel slide shadow rounded mb-5"
           data-bs-ride="carousel"
           data-bs-interval="3500">

        <!-- Indicadores -->
        <div class="carousel-indicators">
          <button *ngFor="let p of productosConImagen; let i = index"
            type="button"
            data-bs-target="#carruselProductos"
            [attr.data-bs-slide-to]="i"
            [class.active]="i === 0"
            style="background-color:#880e4f">
          </button>
        </div>

        <!-- Slides -->
        <div class="carousel-inner rounded">
          <div *ngFor="let p of productosConImagen; let i = index"
               class="carousel-item"
               [class.active]="i === 0">
            <img [src]="p.imagen" [alt]="p.nombre"
                 class="d-block w-100 carousel-img"
                 (error)="onImgError($event)">
            <div class="carousel-caption-custom">
              <span class="badge mb-1" style="background:rgba(255,255,255,.25);font-size:.75rem">
                {{ nombreCategoria(p.categoriaId) }}
              </span>
              <h5 class="text-white fw-bold mb-0">{{ p.nombre }}</h5>
              <p class="text-white opacity-75 mb-1 small">{{ p.descripcion }}</p>
              <span class="fw-bold text-white" style="font-size:1.1rem">Bs. {{ p.precio }}</span>
            </div>
          </div>
        </div>

        <!-- Controles -->
        <button class="carousel-control-prev" type="button"
                data-bs-target="#carruselProductos" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button"
                data-bs-target="#carruselProductos" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span>
        </button>
      </div>

      <!-- Sin imágenes en carrusel -->
      <div *ngIf="productosConImagen.length === 0 && productos.length === 0"
           class="text-center py-4 text-muted mb-4">
        <div style="font-size:3rem">🌸</div>
        <p>Cargando catálogo...</p>
      </div>

      <!-- ── Catálogo de productos (tarjetas) ── -->
      <h5 class="section-title mt-2">Catálogo Completo</h5>

      <div class="row g-3">
        <div *ngFor="let p of productos" class="col-6 col-md-4 col-lg-3">
          <div class="prod-card">
            <img *ngIf="p.imagen" [src]="p.imagen" [alt]="p.nombre"
                 (error)="onImgError($event)">
            <div *ngIf="!p.imagen" class="no-img">🌸</div>
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-1">
                <span class="cat-badge">{{ nombreCategoria(p.categoriaId) }}</span>
                <span *ngIf="p.stock <= 5" class="stock-low">⚠ Bajo</span>
                <span *ngIf="p.stock > 5"  class="stock-ok">✔ Stock</span>
              </div>
              <h6 class="mb-1 fw-semibold" style="font-size:.9rem;line-height:1.3">{{ p.nombre }}</h6>
              <p *ngIf="p.descripcion" class="text-muted mb-2"
                 style="font-size:.78rem;line-height:1.3;
                        display:-webkit-box;-webkit-line-clamp:2;
                        -webkit-box-orient:vertical;overflow:hidden">
                {{ p.descripcion }}
              </p>
              <div class="precio">Bs. {{ p.precio }}</div>
            </div>
          </div>
        </div>

        <!-- Sin productos -->
        <div *ngIf="productos.length === 0" class="col-12 text-center py-4 text-muted">
          <p>No hay productos registrados aún.</p>
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  private productoSvc  = inject(ProductoService);
  private categoriaSvc = inject(CategoriaService);
  private pedidoSvc    = inject(PedidoService);
  private clienteSvc   = inject(ClienteService);
  private auth         = inject(AuthService);

  productos:      Producto[]  = [];
  categorias:     Categoria[] = [];
  totalProductos  = 0;
  totalCategorias = 0;
  totalPedidos    = 0;
  totalClientes   = 0;

  get nombre()             { return this.auth.getNombre(); }
  get productosConImagen() { return this.productos.filter(p => p.imagen); }

  ngOnInit(): void {
    this.productoSvc.getAll().subscribe(d  => { this.productos = d; this.totalProductos = d.length; });
    this.categoriaSvc.getAll().subscribe(d => { this.categorias = d; this.totalCategorias = d.length; });
    this.pedidoSvc.getAll().subscribe(d   => this.totalPedidos = d.length);
    this.clienteSvc.getAll().subscribe(d  => this.totalClientes = d.length);
  }

  nombreCategoria(id: number): string {
    return this.categorias.find(c => c.id === id)?.nombre ?? '';
  }

  onImgError(e: Event): void {
    (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/f3e5f5/880e4f?text=Atelier+Flowers';
  }
}
