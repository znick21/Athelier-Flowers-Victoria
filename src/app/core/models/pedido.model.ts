export type EstadoPedido = 'pendiente' | 'confirmado' | 'entregado';

export interface Pedido {
  id?: number;
  clienteId: number;
  productoId: number;
  cantidad: number;
  total: number;
  estado: EstadoPedido;
  fecha: string;
  token: string;
}
