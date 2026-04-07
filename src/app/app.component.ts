import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  styles: [`
    .navbar-brand img {
      width: 38px; height: 38px;
      object-fit: contain;
      border-radius: 50%;
      background: rgba(255,255,255,.15);
      padding: 2px;
    }
    .navbar-brand .brand-name {
      font-weight: 700;
      font-size: 1rem;
      color: #fff;
      line-height: 1;
    }
    .navbar-brand .brand-sub {
      font-size: .7rem;
      color: rgba(255,255,255,.7);
      font-style: italic;
    }
    .navbar-custom {
      background: linear-gradient(90deg, #880e4f 0%, #4a0027 100%);
      box-shadow: 0 2px 10px rgba(0,0,0,.25);
    }
    .navbar-custom .nav-link {
      color: rgba(255,255,255,.82) !important;
      font-size: .9rem;
      padding: .4rem .85rem;
      border-radius: 6px;
      transition: background .18s;
    }
    .navbar-custom .nav-link:hover,
    .navbar-custom .nav-link.active {
      background: rgba(255,255,255,.18);
      color: #fff !important;
    }
    .navbar-custom .navbar-toggler {
      border-color: rgba(255,255,255,.4);
    }
    .navbar-custom .navbar-toggler-icon {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255,255,255,.75)' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
    }
    .user-badge {
      background: rgba(255,255,255,.2);
      color: #fff;
      font-size: .78rem;
      padding: .2rem .55rem;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.35);
      font-weight: 600;
    }
    .btn-logout {
      background: rgba(255,255,255,.15);
      border: 1px solid rgba(255,255,255,.35);
      color: #fff;
      font-size: .82rem;
      padding: .3rem .85rem;
      border-radius: 999px;
      transition: background .18s;
      white-space: nowrap;
    }
    .btn-logout:hover { background: rgba(255,255,255,.28); color: #fff; }
    .main-content {
      min-height: calc(100vh - 56px);
      background: #f8f5f7;
    }
  `],
  template: `
    <!-- ── Navbar Bootstrap ── -->
    <nav class="navbar navbar-expand-lg navbar-custom" *ngIf="auth.isLoggedIn()">
      <div class="container-fluid px-3">

        <!-- Brand -->
        <a class="navbar-brand d-flex align-items-center gap-2 text-decoration-none"
           routerLink="/dashboard">
          <img src="/Logo.png" alt="Logo" (error)="onLogoError($event)">
          <div>
            <div class="brand-name">Atelier Flowers</div>
            <div class="brand-sub">Victoria</div>
          </div>
        </a>

        <!-- Toggler móvil -->
        <button class="navbar-toggler" type="button"
                data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Links -->
        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-2 gap-1">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                🏠 Dashboard
              </a>
            </li>
            <ng-container *ngIf="rol === 'admin' || rol === 'vendedor'">
              <li class="nav-item">
                <a class="nav-link" routerLink="/productos" routerLinkActive="active">
                  📦 Productos
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/clientes" routerLinkActive="active">
                  👥 Clientes
                </a>
              </li>
            </ng-container>
            <ng-container *ngIf="rol === 'admin'">
              <li class="nav-item">
                <a class="nav-link" routerLink="/categorias" routerLinkActive="active">
                  🏷️ Categorías
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/usuarios" routerLinkActive="active">
                  👤 Usuarios
                </a>
              </li>
            </ng-container>
          </ul>

          <!-- Usuario + Cerrar Sesión -->
          <div class="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            <span class="user-badge">{{ sigla }}</span>
            <span class="text-white opacity-75" style="font-size:.85rem">{{ auth.getNombre() }}</span>
            <button class="btn-logout" (click)="auth.logout()">🚪 Salir</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- ── Contenido principal ── -->
    <div [class.main-content]="auth.isLoggedIn()">
      <router-outlet />
    </div>
  `
})
export class AppComponent {
  auth = inject(AuthService);

  get rol() { return this.auth.getRole(); }

  get sigla() {
    const s: Record<string, string> = { admin: 'ADM', vendedor: 'VEN', cliente: 'CLI' };
    return s[this.rol ?? ''] ?? '';
  }

  onLogoError(e: Event) {
    (e.target as HTMLImageElement).style.display = 'none';
  }
}
