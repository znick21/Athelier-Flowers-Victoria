import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pago } from '../models/pago.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PagoService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/pagos`;

  getAll(): Observable<Pago[]> { return this.http.get<Pago[]>(this.url); }
  getById(id: number): Observable<Pago> { return this.http.get<Pago>(`${this.url}/${id}`); }
  getByPedido(pedidoId: number): Observable<Pago[]> { return this.http.get<Pago[]>(`${this.url}?pedidoId=${pedidoId}`); }
  create(p: Pago): Observable<Pago> { return this.http.post<Pago>(this.url, p); }
  update(id: number, p: Pago): Observable<Pago> { return this.http.put<Pago>(`${this.url}/${id}`, p); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
