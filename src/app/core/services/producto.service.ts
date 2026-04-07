import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/productos`;

  getAll(): Observable<Producto[]> { return this.http.get<Producto[]>(this.url); }
  getById(id: number): Observable<Producto> { return this.http.get<Producto>(`${this.url}/${id}`); }
  getByCategoria(categoriaId: number): Observable<Producto[]> { return this.http.get<Producto[]>(`${this.url}?categoriaId=${categoriaId}`); }
  create(p: Producto): Observable<Producto> { return this.http.post<Producto>(this.url, p); }
  update(id: number, p: Producto): Observable<Producto> { return this.http.put<Producto>(`${this.url}/${id}`, p); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
