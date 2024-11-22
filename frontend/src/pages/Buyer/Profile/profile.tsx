import * as React from 'react';
import { Button, Divider, Input } from 'semantic-ui-react';
import './profile.scss';
import useAxios from '../../../shared/axios';

export default function Profile(): React.JSX.Element {
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
            })
            .catch((error) => {
                console.log(error);
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
        const payload = {
            id: userProfile.id,
            billingAddress,
            shippingAddress
        };

        console.log(payload);
        axios.put('/users/' + userObj.userId, payload)
            .then(({ data }) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="page product">
            <div className="page-inner">
                <div className="manage-page">
                    <p className="page-title">Profile</p>
                    <Divider />

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

                    <Button size="small" primary onClick={updateAddress}>
                        Update
                    </Button>
                </div>
            </div>
        </div>
    );
}
