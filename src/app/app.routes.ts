import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/welcome/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'usuarios',
    canActivate: [authGuard, roleGuard], data: { roles: ['admin'] },
    loadComponent: () => import('./features/usuarios/usuarios.component').then(m => m.UsuariosComponent)
  },
  {
    path: 'categorias',
    canActivate: [authGuard, roleGuard], data: { roles: ['admin'] },
    loadComponent: () => import('./features/categorias/categoria-list/categoria-list.component').then(m => m.CategoriaListComponent)
  },
  {
    path: 'categorias/nueva',
    canActivate: [authGuard, roleGuard], data: { roles: ['admin'] },
    loadComponent: () => import('./features/categorias/categoria-form/categoria-form.component').then(m => m.CategoriaFormComponent)
  },
  {
    path: 'categorias/editar/:id',
    canActivate: [authGuard, roleGuard], data: { roles: ['admin'] },
    loadComponent: () => import('./features/categorias/categoria-form/categoria-form.component').then(m => m.CategoriaFormComponent)
  },
  {
    path: 'productos',
    canActivate: [authGuard, roleGuard], data: { roles: ['admin', 'vendedor'] },
    loadComponent: () => import('./features/productos/producto-list/producto-list.component').then(m => m.ProductoListComponent)
  },
  {
    path: 'productos/nuevo',
    canActivate: [authGuard, roleGuard], data: { roles: ['admin'] },
    loadComponent: () => import('./features/productos/producto-form/producto-form.component').then(m => m.ProductoFormComponent)
  },
  {
    path: 'productos/editar/:id',
    canActivate: [authGuard, roleGuard], data: { roles: ['admin'] },
    loadComponent: () => import('./features/productos/producto-form/producto-form.component').then(m => m.ProductoFormComponent)
  },
  {
    path: 'clientes',
    canActivate: [authGuard, roleGuard], data: { roles: ['admin', 'vendedor'] },
    loadComponent: () => import('./features/clientes/cliente-list/cliente-list.component').then(m => m.ClienteListComponent)
  },
  {
    path: 'clientes/nuevo',
    canActivate: [authGuard, roleGuard], data: { roles: ['admin'] },
    loadComponent: () => import('./features/clientes/cliente-form/cliente-form.component').then(m => m.ClienteFormComponent)
  },
  {
    path: 'clientes/editar/:id',
    canActivate: [authGuard, roleGuard], data: { roles: ['admin', 'vendedor'] },
    loadComponent: () => import('./features/clientes/cliente-form/cliente-form.component').then(m => m.ClienteFormComponent)
  },
  { path: '**', redirectTo: '' }
];
