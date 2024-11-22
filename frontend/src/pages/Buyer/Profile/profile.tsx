import * as React from 'react';
import { Button, Divider, Input, Message } from 'semantic-ui-react';
import './profile.scss';
import useAxios from '../../../shared/axios';

export default function Profile(): React.JSX.Element {
    const axios = useAxios();
    const [userObj, setUserObj] = React.useState('');
    const [userProfile, setUserProfile] = React.useState<any>({});
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
    const [loading, setLoading] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    React.useEffect(() => {
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
        setLoading(true);
        axios.get('/users/' + userObj?.userId)
            .then(({ data }) => {
                setUserProfile(data);
                setShippingAddress(data.shippingAddress || shippingAddress);
                setBillingAddress(data.billingAddress || billingAddress);
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage('Failed to fetch user details.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const { name, value } = e.target;
        if (type === 'shipping') {
            setShippingAddress((prev) => ({ ...prev, [name]: value }));
        } else if (type === 'billing') {
            setBillingAddress((prev) => ({ ...prev, [name]: value }));
        }
    };

    const updateAddress = () => {
        setLoading(true);
        const payload = {
            ...userProfile,
            billingAddress,
            shippingAddress
        };

        axios.put('/users/' + userObj.userId, payload)
            .then(({ data }) => {
                setSuccessMessage('Address updated successfully.');
                setUserProfile(data);
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage('Failed to update address.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="page product">
            <div className="page-inner">
                <div className="manage-page">
                    <p className="page-title">Profile</p>
                    <Divider />

                    {successMessage && <Message positive>{successMessage}</Message>}
                    {errorMessage && <Message negative>{errorMessage}</Message>}

                    <div className="d-flex flex-direction-column address-wrapper">
                        <p className="page-title mb-3">Shipping Address</p>
                        <Input
                            className="mb-3"
                            name="street"
                            placeholder="Street Address"
                            value={shippingAddress.street}
                            onChange={(e) => handleInputChange(e, 'shipping')}
                        />
                        <div className="d-flex">
                            <Input
                                className="mb-3 flex-1 mr-2"
                                name="city"
                                placeholder="City"
                                value={shippingAddress.city}
                                onChange={(e) => handleInputChange(e, 'shipping')}
                            />
                            <Input
                                className="mb-3 flex-1 ml-1"
                                name="state"
                                placeholder="State"
                                value={shippingAddress.state}
                                onChange={(e) => handleInputChange(e, 'shipping')}
                            />
                        </div>
                        <div className="d-flex flex-1">
                            <Input
                                className="mb-3 flex-1 mr-2"
                                name="zipCode"
                                placeholder="Zip Code"
                                value={shippingAddress.zipCode}
                                onChange={(e) => handleInputChange(e, 'shipping')}
                            />
                            <Input
                                className="mb-3 flex-2 ml-1"
                                name="country"
                                placeholder="Country"
                                value={shippingAddress.country}
                                onChange={(e) => handleInputChange(e, 'shipping')}
                            />
                        </div>
                    </div>

                    <div className="d-flex flex-direction-column address-wrapper">
                        <p className="page-title mb-3">Billing Address</p>
                        <Input
                            className="mb-3"
                            name="street"
                            placeholder="Street Address"
                            value={billingAddress.street}
                            onChange={(e) => handleInputChange(e, 'billing')}
                        />
                        <div className="d-flex">
                            <Input
                                className="mb-3 flex-1 mr-2"
                                name="city"
                                placeholder="City"
                                value={billingAddress.city}
                                onChange={(e) => handleInputChange(e, 'billing')}
                            />
                            <Input
                                className="mb-3 flex-1 ml-1"
                                name="state"
                                placeholder="State"
                                value={billingAddress.state}
                                onChange={(e) => handleInputChange(e, 'billing')}
                            />
                        </div>
                        <div className="d-flex flex-1">
                            <Input
                                className="mb-3 flex-1 mr-2"
                                name="zipCode"
                                placeholder="Zip Code"
                                value={billingAddress.zipCode}
                                onChange={(e) => handleInputChange(e, 'billing')}
                            />
                            <Input
                                className="mb-3 flex-2 ml-1"
                                name="country"
                                placeholder="Country"
                                value={billingAddress.country}
                                onChange={(e) => handleInputChange(e, 'billing')}
                            />
                        </div>
                    </div>

                    <Divider />

                    <Button size="small" primary onClick={updateAddress} disabled={loading}>
                        {loading ? 'Updating...' : 'Update'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
