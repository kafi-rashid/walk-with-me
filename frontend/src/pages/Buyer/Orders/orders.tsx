import * as React from 'react';
import { 
    Divider,
    TableRow,
    TableHeaderCell,
    TableHeader,
    TableCell,
    TableBody,
    Table,
    Button,
    Icon,
    TableFooter
} from 'semantic-ui-react';
import useAxios from '../../../shared/axios';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
    id: number;
    productId: number;
    productName: string | null;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    totalAmount: number;
    status: string;
    items: OrderItem[];
    createdAt: string;
}

export default function OrderHistory(): React.JSX.Element {
    const [orders, setOrders] = React.useState<Order[]>([]);
    const axios = useAxios();
    const [userObj, setUserObj] = React.useState<any>({});
    const navigate = useNavigate();

    React.useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUserObj(JSON.parse(user));
        }
    }, []);

    React.useEffect(() => {
        if (userObj?.userId) {
            getOrderHistory();
        }
    }, [userObj]);

    const getOrderHistory = () => {
        axios.get(`/orders/by-user?userId=${userObj?.userId}`)
            .then(({ data }) => {
                setOrders(data);
            })
            .catch((error) => {
                console.error('Error fetching order history:', error);
            });
    };

    return (
        <div className="page product">
            <div className="page-inner">
                <div className="manage-page">
                    <p className="page-title">Order History</p>
                    <Divider />
                    <div className="page-content">
                        <Table singleLine>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell style={{ width: '100px' }}>Order ID</TableHeaderCell>
                                    <TableHeaderCell style={{ width: '140px' }}>Date</TableHeaderCell>
                                    <TableHeaderCell style={{ width: '190px' }}>Total Amount</TableHeaderCell>
                                    <TableHeaderCell>Status</TableHeaderCell>
                                    <TableHeaderCell style={{ width: '100px' }}>Details</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.length > 0 ? (
                                    orders.map(order => (
                                        <TableRow key={order.id}>
                                            <TableCell>{order.id}</TableCell>
                                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                            <TableCell>{order.status}</TableCell>
                                            <TableCell>
                                                <Button 
                                                    icon 
                                                    size="small"
                                                    primary
                                                    onClick={() => console.log('View details for order', order.id)}
                                                >
                                                    <Icon name="eye" /> View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="5" textAlign="center">
                                            No orders found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter fullWidth>
                                <TableRow>
                                    <TableHeaderCell colSpan="5">
                                        <Button
                                            floated="right"
                                            icon
                                            labelPosition="left"
                                            primary
                                            size="small"
                                            onClick={ () => navigate('/') }
                                        >
                                            <Icon name="shopping cart" /> Shop More
                                        </Button>
                                    </TableHeaderCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}
