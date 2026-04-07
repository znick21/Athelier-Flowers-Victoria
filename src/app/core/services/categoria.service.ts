import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/categorias`;

  getAll(): Observable<Categoria[]> { return this.http.get<Categoria[]>(this.url); }
  getById(id: number): Observable<Categoria> { return this.http.get<Categoria>(`${this.url}/${id}`); }
  create(c: Categoria): Observable<Categoria> { return this.http.post<Categoria>(this.url, c); }
  update(id: number, c: Categoria): Observable<Categoria> { return this.http.put<Categoria>(`${this.url}/${id}`, c); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
