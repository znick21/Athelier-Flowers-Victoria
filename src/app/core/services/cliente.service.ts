import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/clientes`;

  getAll(): Observable<Cliente[]> { return this.http.get<Cliente[]>(this.url); }
  getById(id: number): Observable<Cliente> { return this.http.get<Cliente>(`${this.url}/${id}`); }
  getByUserId(userId: number): Observable<Cliente[]> { return this.http.get<Cliente[]>(`${this.url}?userId=${userId}`); }
  create(c: Cliente): Observable<Cliente> { return this.http.post<Cliente>(this.url, c); }
  update(id: number, c: Cliente): Observable<Cliente> { return this.http.put<Cliente>(`${this.url}/${id}`, c); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
