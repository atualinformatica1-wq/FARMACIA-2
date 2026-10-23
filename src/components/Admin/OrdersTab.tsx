import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Order, OrderStatus } from '../../types/pharmacy';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ClipboardList,
  Search,
  MessageCircle,
  Truck,
  Store,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  ExternalLink,
  Eye,
  Filter
} from 'lucide-react';

export const OrdersTab: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderPaymentStatus, deleteOrder, pharmacyInfo } = usePharmacy();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone) return false;
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[11px] font-bold">Pendente</span>;
      case 'preparing':
        return <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded text-[11px] font-bold">Em Separação</span>;
      case 'waiting_payment':
        return <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded text-[11px] font-bold">Aguardando Pagamento</span>;
      case 'out_for_delivery':
        return <span className="bg-sky-100 text-sky-900 px-2 py-0.5 rounded text-[11px] font-bold">Saiu para Entrega</span>;
      case 'ready_for_pickup':
        return <span className="bg-teal-100 text-teal-900 px-2 py-0.5 rounded text-[11px] font-bold">Pronto p/ Retirada</span>;
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded text-[11px] font-bold">Concluído</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-900 px-2 py-0.5 rounded text-[11px] font-bold">Cancelado</span>;
    }
  };

  const openWhatsAppWithCustomer = (order: Order) => {
    const cleanCustomerPhone = order.customerPhone.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Olá ${order.customerName}! Aqui é da ${pharmacyInfo.name}. Estamos entrando em contato sobre o seu pedido #${order.orderNumber}.`
    );
    window.open(`https://wa.me/${cleanCustomerPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por número, cliente ou tel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-1.5 font-medium focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Todos os Status ({orders.length})</option>
            <option value="pending">Pendentes</option>
            <option value="preparing">Em Separação</option>
            <option value="waiting_payment">Aguardando Pagamento</option>
            <option value="out_for_delivery">Saiu para Entrega</option>
            <option value="ready_for_pickup">Pronto p/ Retirada</option>
            <option value="completed">Concluídos</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Pedido</th>
                  <th className="p-3.5">Cliente</th>
                  <th className="p-3.5">Recebimento</th>
                  <th className="p-3.5">Pagamento</th>
                  <th className="p-3.5">Total</th>
                  <th className="p-3.5">Status do Pedido</th>
                  <th className="p-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Number & Date */}
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        #{order.orderNumber}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {formatDate(order.createdAt)}
                      </div>
                      {order.hasPrescriptionItems && (
                        <span className="inline-block bg-amber-100 text-amber-900 font-bold text-[9px] px-1 py-0.2 rounded mt-1">
                          Receita Médica
                        </span>
                      )}
                    </td>

                    {/* Customer */}
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800">{order.customerName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <span>{order.customerPhone}</span>
                      </div>
                    </td>

                    {/* Fulfillment */}
                    <td className="p-3.5">
                      <span className="font-medium text-slate-700 flex items-center gap-1">
                        {order.fulfillmentType === 'delivery' ? (
                          <>
                            <Truck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Entrega</span>
                          </>
                        ) : (
                          <>
                            <Store className="w-3.5 h-3.5 text-blue-600" />
                            <span>Retirada</span>
                          </>
                        )}
                      </span>
                      {order.deliveryAddress && (
                        <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          {order.deliveryAddress.neighborhood}
                        </div>
                      )}
                    </td>

                    {/* Payment */}
                    <td className="p-3.5">
                      <div className="font-medium text-slate-700">{order.paymentMethodName}</div>
                      <select
                        value={order.paymentStatus}
                        onChange={(e: any) => updateOrderPaymentStatus(order.id, e.target.value)}
                        className={`text-[10px] font-bold rounded px-1.5 py-0.5 border mt-1 ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="pending">Aguardando Pagamento</option>
                        <option value="paid">Pago / Confirmado</option>
                        <option value="pay_on_delivery">Pagar no Ato</option>
                      </select>
                    </td>

                    {/* Total */}
                    <td className="p-3.5 font-bold text-emerald-900 text-sm">
                      {formatCurrency(order.total)}
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-3.5">
                      <select
                        value={order.status}
                        onChange={(e: any) => updateOrderStatus(order.id, e.target.value)}
                        className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="pending">Pendente</option>
                        <option value="preparing">Em Separação</option>
                        <option value="waiting_payment">Aguardando Pagamento</option>
                        <option value="out_for_delivery">Saiu para Entrega</option>
                        <option value="ready_for_pickup">Pronto p/ Retirada</option>
                        <option value="completed">Concluído</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Ver detalhes completos do pedido"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openWhatsAppWithCustomer(order)}
                          className="p-1.5 text-[#25D366] hover:text-[#20ba5a] hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                          title="Falar com cliente pelo WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4 fill-[#25D366]/20" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Deseja realmente excluir o pedido #${order.orderNumber}?`)) {
                              deleteOrder(order.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Excluir pedido"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-400 text-xs">
          Nenhum pedido encontrado para os filtros selecionados.
        </div>
      )}

      {/* Order Detail Modal for Admin */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Detalhes do Pedido</span>
                <h3 className="text-base font-bold text-slate-900">#{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-700 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800 mb-1">Dados do Cliente:</div>
                <p>Nome: <strong>{selectedOrder.customerName}</strong></p>
                <p>Telefone: <strong>{selectedOrder.customerPhone}</strong></p>
                {selectedOrder.customerCpf && <p>CPF: <strong>{selectedOrder.customerCpf}</strong></p>}
              </div>

              {selectedOrder.deliveryAddress && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-800 mb-1">Endereço de Entrega:</div>
                  <p>{selectedOrder.deliveryAddress.street}, nº {selectedOrder.deliveryAddress.number}</p>
                  {selectedOrder.deliveryAddress.complement && <p>Compl: {selectedOrder.deliveryAddress.complement}</p>}
                  <p>Bairro: {selectedOrder.deliveryAddress.neighborhood} - {selectedOrder.deliveryAddress.city}</p>
                  {selectedOrder.deliveryAddress.referencePoint && (
                    <p className="text-slate-500">Ref: {selectedOrder.deliveryAddress.referencePoint}</p>
                  )}
                </div>
              )}

              <div>
                <div className="font-bold text-slate-800 mb-2">Itens Solicitados:</div>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {selectedOrder.items.map((it, i) => (
                    <div key={i} className="p-2.5 flex justify-between items-center bg-white">
                      <div>
                        <span className="font-semibold text-slate-800">{it.quantity}x {it.productName}</span>
                        {it.requiresPrescription && (
                          <span className="block text-[10px] text-amber-700 font-bold">⚠️ Exige receita médica</span>
                        )}
                      </div>
                      <span className="font-bold text-slate-900">{formatCurrency(it.totalItemPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Entrega:</span>
                  <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-100">
                  <span>Total:</span>
                  <span className="text-emerald-900">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="p-3 bg-amber-50 rounded-xl text-amber-900 border border-amber-200">
                  <span className="font-bold block">Observações do Cliente:</span>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
