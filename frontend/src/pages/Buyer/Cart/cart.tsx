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
        postalCode: '',
        country: ''
    });
    const [billingAddress, setBillingAddress] = React.useState({
        street: '',
        city: '',
        state: '',
        postalCode: '',
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
        const event = new Event('cartUpdate');
        window.dispatchEvent(event);
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

    const handleCheckout = () => {
        const items = products.map((item) => {
            const variant = item.product.variants.find(
                (variant: any) => variant.id === item.variant
            );
            const price = variant?.price || 0;
    
            return {
                productId: item.product.id,
                sellerId: item.product.seller.id,
                productName: item.product.name,
                quantity: item.quantity,
                price: price,
                variantId: item.variant,
            };
        });
    
        const groupedItemsBySeller = items.reduce((acc, item) => {
            if (!acc[item.sellerId]) {
                acc[item.sellerId] = [];
            }
            acc[item.sellerId].push(item);
            return acc;
        }, {} as { [sellerId: string]: typeof items });
    
        const payloads = Object.keys(groupedItemsBySeller).map((sellerId) => ({
            sellerId,
            userId: userObj?.userId,
            items: groupedItemsBySeller[sellerId],
            totalAmount: groupedItemsBySeller[sellerId].reduce(
                (total, item) => total + item.price * item.quantity,
                0
            ),
            shippingAddressId: userProfile?.shippingAddress?.id || null,
            billingAddressId: userProfile?.billingAddress?.id || null,
        }));
    
        if (
            payloads.some(
                (payload) => !payload.shippingAddressId || !payload.billingAddressId
            )
        ) {
            alert('Please go to profile and add both billing and shipping addresses');
            return;
        }
    
        console.log("Checkout Payloads:", payloads);
    
        payloads.forEach((payload) => {
            axios.post('/orders', payload)
                .then((response) => {
                    console.log("Checkout successful for seller:", response.data);
                })
                .catch((error) => {
                    console.error("Checkout error:", error);
                });
        });
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
                                        <td className='pr-4'>Street Address</td>
                                        <td>: { shippingAddress.street }</td>
                                    </tr>
                                    <tr>
                                        <td className='pr-4'>City</td>
                                        <td>: { shippingAddress.city }</td>
                                    </tr>
                                    <tr>
                                        <td className='pr-4'>State</td>
                                        <td>: { shippingAddress.state }</td>
                                    </tr>
                                    <tr>
                                        <td className='pr-4'>Zip</td>
                                        <td>: { shippingAddress.postalCode }</td>
                                    </tr>
                                    <tr>
                                        <td className='pr-4'>Country</td>
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
                                        <td className='pr-4'>Street Address</td>
                                        <td>: { billingAddress.street }</td>
                                    </tr>
                                    <tr>
                                        <td className='pr-4'>City</td>
                                        <td>: { billingAddress.city }</td>
                                    </tr>
                                    <tr>
                                        <td className='pr-4'>State</td>
                                        <td>: { billingAddress.state }</td>
                                    </tr>
                                    <tr>
                                        <td className='pr-4'>Zip</td>
                                        <td>: { billingAddress.postalCode }</td>
                                    </tr>
                                    <tr>
                                        <td className='pr-4'>Country</td>
                                        <td>: { billingAddress.country }</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Divider/>
                        <Button primary floated="right" onClick={handleCheckout}>
                            Check Out
                        </Button>

                    </div>

                </div>
            </div>
        </div>
    );
}
