export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia';

export interface Pago {
  id?: number;
  pedidoId: number;
  monto: number;
  metodo: MetodoPago;
  fecha: string;
  token: string;
}
