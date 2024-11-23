import * as React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Divider,
  Table,
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableFooter,
  TableCell,
  TableBody,
  Icon,
  Menu,
  MenuItem,
  Button,
} from 'semantic-ui-react';
import useAxios from '../../../shared/axios';
import { useEffect, useState } from 'react';

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

export default function Orders(): React.JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const axios = useAxios();

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = () => {
    axios
      .get('/orders')
      .then(({ data }) => {
        setOrders(data);
      })
      .catch((error) => {
        console.log('Error fetching orders', error);
      });
  };

  return (
    <div className="manage-page">
      <p className="page-title">Order List</p>
      <Divider />
      <div className="page-content">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell style={{ width: '50px' }}>ID</TableHeaderCell>
              <TableHeaderCell>Customer</TableHeaderCell>
              <TableHeaderCell>Seller</TableHeaderCell>
              <TableHeaderCell>Total Amount</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Details</TableHeaderCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.buyerName}</TableCell>
                <TableCell>{order.sellerName}</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <NavLink to={`/seller/orders/${order.id}`}>View Details</NavLink>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter fullWidth>
            <TableRow>
              <TableHeaderCell colSpan="6">
                <Menu floated="right" pagination>
                  <MenuItem
                    as="a"
                    icon
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    <Icon name="chevron left" />
                  </MenuItem>
                  <MenuItem as="a">{currentPage}</MenuItem>
                  <MenuItem
                    as="a"
                    icon
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    <Icon name="chevron right" />
                  </MenuItem>
                </Menu>
              </TableHeaderCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
