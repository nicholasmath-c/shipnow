import { SPLoaderInCard } from "@/components/SpinnerLoader";
import { iOrder } from "@/data/@types/order";
import { iOrderItem } from "@/data/@types/orderItem";
import { listAllOrdersItemsByOrder } from "@/data/services/orderItemService";
import { useEffect, useState } from "react";

interface OrderDetailsInTableProps {
  order: iOrder;
}

export default function OrderDetailsInTable({
  order,
}: OrderDetailsInTableProps) {
  const [orderItems, setOrderItems] = useState<iOrderItem[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const request = async () => {
      setOrderItems(await listAllOrdersItemsByOrder(order?.id));
      setIsLoading(false);
    };

    request();
  }, []);

  if (isLoading) {
    return <SPLoaderInCard/>;
  }

  return (
    <div className="p-4 space-y-4">
      <p className="font-semibold">Detalhes do pedido</p>
      <div className="flex gap-10">
        {order.client_name !== null && (
          <div className="space-y-2">
            <p className="text-xs font-medium">Cliente</p>
            <p className="text-xs text-muted-foreground">
              Nome: {order.client_name}
            </p>
            <p className="text-xs text-muted-foreground">
              Email: {order.client_email}
            </p>
            <p className="text-xs text-muted-foreground">
              Telefone: {order.client_phone}
            </p>
            <p className="text-xs text-muted-foreground">
              NIF: {order.client_nif}
            </p>
          </div>
        )}
        {order.delivery_address_id !== null && (
          <div className="space-y-2">
            <p className="text-xs font-medium">Endereço de entrega</p>
            <p className="text-xs text-muted-foreground">
              Rua: {order.delivery_address_street}
            </p>
            <p className="text-xs text-muted-foreground">
              Número: {order.delivery_address_number}
            </p>
            <p className="text-xs text-muted-foreground">
              Complemento: {order.delivery_address_complement || "Vazio..."}
            </p>
            <p className="text-xs text-muted-foreground">
              Código Postal: {order.delivery_address_postal_code}
            </p>
            <p className="text-xs text-muted-foreground">
              Cidade: {order.delivery_address_city}
            </p>
            <p className="text-xs text-muted-foreground">
              Freguesia: {order.delivery_address_district}
            </p>
            <p className="text-xs text-muted-foreground">
              País: {order.delivery_address_country}
            </p>
          </div>
        )}
        {orderItems && orderItems.length !== 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium">Produtos</p>
            {orderItems.map((orderItem) => (
              <p className="text-xs text-muted-foreground">
                {orderItem.quantity} x {orderItem.product_name} (
                {orderItem.product_sku})
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
