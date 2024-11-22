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
    TableFooter,
    Input
} from 'semantic-ui-react';
import useAxios from '../../../shared/axios';

export default function Cart(): React.JSX.Element {
    const [products, setProducts] = React.useState<any[]>([]);
    const axios = useAxios();
    const [userObj, setUserObj] = React.useState('');
    const [userProfile, setUserProfile] = React.useState({});

    const [shippingAddress, setShippingAddress] = React.useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });
    const [billingAddress, setBillingAddress] = React.useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    React.useEffect(() => {
        const storedItems = localStorage.getItem('cart');
        if (storedItems) {
            setProducts(JSON.parse(storedItems));
        }

        const user = localStorage.getItem('user');
        if (user) {
            setUserObj(JSON.parse(user));
        }
    }, []);

    React.useEffect(() => {
        if (userObj) {
            getUserDetails();
        }
    }, [userObj]);

    const getUserDetails = () => {
        axios.get('/users/' + userObj?.userId)
            .then(({ data }) => {
                setUserProfile(data);
                if (data.hasOwnProperty('billingAddress')) {
                    setBillingAddress(data.billingAddress)
                }
                if (data.hasOwnProperty('shippingAddress')) {
                    setShippingAddress(data.shippingAddress)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const updateCartInLocalStorage = (updatedCart: any[]) => {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setProducts(updatedCart);
    };

    const incrementQuantity = (variantId: number) => {
        const updatedProducts = products.map((item) => {
            if (item.variant === variantId) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        updateCartInLocalStorage(updatedProducts);
    };

    const decrementQuantity = (variantId: number) => {
        const updatedProducts = products.map((item) => {
            if (item.variant === variantId && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });
        updateCartInLocalStorage(updatedProducts);
    };

    const removeItem = (variantId: number) => {
        const updatedProducts = products.filter((item) => item.variant !== variantId);
        updateCartInLocalStorage(updatedProducts);
    };

    // Calculate grand total
    const calculateGrandTotal = () => {
        return products.reduce(
            (total, item) =>
                total +
                item.quantity *
                (item.product.variants.find((variant: any) => variant.id === item.variant)?.price || 0),
            0
        );
    };

    return (
        <div className="page product">
            <div className="page-inner">
                <div className="manage-page">
                    <p className="page-title">Cart</p>
                    <Divider />

                    <div className='pb-3'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell>SN</TableHeaderCell>
                                    <TableHeaderCell>Product Name</TableHeaderCell>
                                    <TableHeaderCell>Brand</TableHeaderCell>
                                    <TableHeaderCell style={{ width: '120px' }}>Variant</TableHeaderCell>
                                    <TableHeaderCell>Quantity</TableHeaderCell>
                                    <TableHeaderCell>Price</TableHeaderCell>
                                    <TableHeaderCell style={{ width: '160px' }}>Actions</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products && products.length > 0 ? (
                                    products.map((item, index) => {
                                        const variant = item.product.variants.find(
                                            (variant: any) => variant.id === item.variant
                                        );
                                        const price = variant?.price || 0;
                                        const total = item.quantity * price;

                                        return (
                                            <TableRow key={item.variant}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
                                                    <div className="d-flex">
                                                        <img
                                                            className="product-list-image mr-4"
                                                            src={item.product.image}
                                                            alt={item.product.name}
                                                        />
                                                        <div>
                                                            <p className="font-weight-medium m-0 p-0">
                                                                {item.product.name}
                                                            </p>
                                                            <p className="m-0 p-0 font-size-small">
                                                                {item.product.description.slice(0, 100) + '...'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{item.product.brand?.name || 'N/A'}</TableCell>
                                                <TableCell>
                                                    Size: {variant?.size || 'N/A'}
                                                </TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>${total.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Button icon onClick={() => incrementQuantity(item.variant)}>
                                                        <Icon name="plus" />
                                                    </Button>
                                                    <Button icon onClick={() => decrementQuantity(item.variant)}>
                                                        <Icon name="minus" />
                                                    </Button>
                                                    <Button icon color="red" onClick={() => removeItem(item.variant)}>
                                                        <Icon name="trash" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="7">Your cart is empty.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            {
                                products &&
                                products.length > 0 &&

                                <TableFooter>
                                    <TableRow>
                                        <TableHeaderCell colSpan="5" textAlign='right'>
                                            Grand Total:
                                        </TableHeaderCell>
                                        <TableHeaderCell colSpan="2">
                                            ${ calculateGrandTotal().toFixed(2) }
                                        </TableHeaderCell>
                                    </TableRow>
                                </TableFooter>
                            }
                        </Table>
                    </div>

                    <div className='d-flex justify-content-between mt-4'>
                        <div className='d-flex flex-direction-column mr-4' style={{ flex: 1 }}>
                            <p className='page-title'>
                                Billing Address
                            </p>
                            <Divider/>
                            <div>
                                <table>
                                    <tr>
                                        <td>Street Address</td>
                                        <td>: { shippingAddress.street }</td>
                                    </tr>
                                    <tr>
                                        <td>City</td>
                                        <td>: { shippingAddress.city }</td>
                                    </tr>
                                    <tr>
                                        <td>State</td>
                                        <td>: { shippingAddress.state }</td>
                                    </tr>
                                    <tr>
                                        <td>Zip</td>
                                        <td>: { shippingAddress.zipCode }</td>
                                    </tr>
                                    <tr>
                                        <td>Country</td>
                                        <td>: { shippingAddress.country }</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div className='d-flex flex-direction-column ml-4' style={{ flex: 1 }}>
                            <p className='page-title'>
                                Shipping Address
                            </p>
                            <Divider/>
                            <div>
                                <table>
                                    <tr>
                                        <td>Street Address</td>
                                        <td>: { billingAddress.street }</td>
                                    </tr>
                                    <tr>
                                        <td>City</td>
                                        <td>: { billingAddress.city }</td>
                                    </tr>
                                    <tr>
                                        <td>State</td>
                                        <td>: { billingAddress.state }</td>
                                    </tr>
                                    <tr>
                                        <td>Zip</td>
                                        <td>: { billingAddress.zipCode }</td>
                                    </tr>
                                    <tr>
                                        <td>Country</td>
                                        <td>: { billingAddress.country }</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Divider/>
                        <Button primary
                            floated='right'>
                            Check Out
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}
