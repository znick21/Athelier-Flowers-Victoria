import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/pedidos`;

  getAll(): Observable<Pedido[]> { return this.http.get<Pedido[]>(this.url); }
  getById(id: number): Observable<Pedido> { return this.http.get<Pedido>(`${this.url}/${id}`); }
  getByCliente(clienteId: number): Observable<Pedido[]> { return this.http.get<Pedido[]>(`${this.url}?clienteId=${clienteId}`); }
  create(p: Pedido): Observable<Pedido> { return this.http.post<Pedido>(this.url, p); }
  update(id: number, p: Pedido): Observable<Pedido> { return this.http.put<Pedido>(`${this.url}/${id}`, p); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
