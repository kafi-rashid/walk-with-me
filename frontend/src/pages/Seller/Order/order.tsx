import React, { useEffect, useState } from 'react';
import { Divider, Table, TableHeader, TableHeaderCell, TableRow, TableCell, TableBody, Dropdown } from 'semantic-ui-react';
import useAxios from '../../../shared/axios';
import { useParams } from 'react-router-dom';

interface OrderItem {
  id: number;
  productId: number;
  productName: string | null;
  variantId: number;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  userId: number;
  sellerId: number;
  items: OrderItem[];
  status: string;
  totalAmount: number;
  shippingAddressId: number;
  billingAddressId: number;
}

const statusOptions = [
  { key: 'pending', text: 'Pending', value: 'PENDING' },
  { key: 'shipped', text: 'Shipped', value: 'SHIPPED' },
  { key: 'on_the_way', text: 'On the Way', value: 'ON_THE_WAY' },
  { key: 'delivered', text: 'Delivered', value: 'DELIVERED' },
  { key: 'cancelled', text: 'Cancelled', value: 'CANCELLED' },
];

export default function Order(): React.JSX.Element {
  const [order, setOrder] = useState<Order | null>(null);
  const axios = useAxios();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getOrderDetails();
  }, []);

  const getOrderDetails = () => {
    axios
      .get(`/orders/${id}`)
      .then(({ data }) => {
        setOrder(data);
      })
      .catch((error) => {
        console.log('Error fetching orders', error);
      });
  };

  const handleStatusChange = (e: any, { value }: any) => {
    axios
      .patch(`/orders/${id}/status`, { status: value }) // Adjust endpoint and payload to match API requirements
      .then(({ data }) => {
        setOrder((prevOrder) => prevOrder && { ...prevOrder, status: value });
      })
      .catch((error) => {
        console.log('Error updating status', error);
      });
  };

  return (
    <div className="manage-page">
      <p className="page-title">Order Details</p>
      <Divider />

      {order ? (
        <div>
          <p><strong>Order ID:</strong> {order.id}</p>
          <p>
            <strong>Status:</strong>
            <Dropdown
              inline
              options={statusOptions}
              value={order.status}
              onChange={handleStatusChange}
              style={{ marginLeft: '10px' }}
            />
          </p>
          <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
          <Divider />

          <h4>Order Items</h4>
          <Table celled>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Product Name</TableHeaderCell>
                <TableHeaderCell>Quantity</TableHeaderCell>
                <TableHeaderCell>Price</TableHeaderCell>
                <TableHeaderCell>Subtotal</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.productName || 'Unknown Product'}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
}
