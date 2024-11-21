import * as React from 'react';
import '../Login/login.scss';
import { Button, Input, Label } from 'semantic-ui-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Select } from 'semantic-ui-react';
import useAxios from '../../shared/axios';
import { UserContext } from '../../store/UserContext';

const roles = [
    { key: 'Buyer', value: 'Buyer', text: 'Buyer' },
    { key: 'Seller', value: 'Seller', text: 'Seller' },
];

export default function Register(): React.JSX.Element {
    const { user, setUser } = React.useContext(UserContext);
    const navigate = useNavigate();

    const [role, setRole] = React.useState<string | undefined>();
    const [firstName, setFirstName] = React.useState<string>('');
    const [lastName, setLastName] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const [phoneNumber, setPhoneNumber] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [confirmPassword, setConfirmPassword] = React.useState<string>('');
    
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    
    const axios = useAxios();

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!role) newErrors.role = 'Role is required';
        if (!firstName.trim()) newErrors.firstName = 'First name is required';
        if (!lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!email.trim()) newErrors.email = 'Email is required';
        if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
        if (!password) newErrors.password = 'Password is required';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const register = () => {
        if (!validateForm()) {
            return;
        }

        const payload = {
            roles: [
                {
                    name: role
                }
            ],
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phoneNumber: phoneNumber.trim(),
            password,
        };

        axios.post('/authenticate/register', payload)
            .then((response) => {
                alert('Account has been created. Logging you in...');

                const loginPayload = {
                    email: email.trim(),
                    password: password.trim(),
                };
        
                axios.post('/authenticate/login', loginPayload)
                    .then(({ data }) => {
                        setUser(data);
                        if (data?.roles?.length > 0) {
                            const role = data.roles[0];
                            if (role.toLowerCase() === 'admin') {
                                navigate('/admin/');
                            } else if (role.toLowerCase() === 'seller') {
                                navigate('/seller/');
                            } else {
                                navigate('/')
                            }
                        } 
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log('Registration error:', error);
                alert('An error occurred during registration. Please try again later.');
            });
    };

    return (
        <div className='login-container register'>
            <div className='content'>
                <div className="content-inner">
                    <p>Walk<br />with<br />Me</p>
                </div>
            </div>

            <div className='input-container'>
                <div className="inner">
                    <div className="wrapper">
                        <p className='logo'>Walk with Me</p>
                        <p className='title'>Sign Up as a Customer or Seller</p>

                        <div className='mb-3'>
                            <Select
                                className='input-field'
                                placeholder='Sign up as'
                                options={roles}
                                onChange={(e, { value }) => setRole(value as string)}
                                error={errors.role ? true : false}
                            />

                            {
                                errors.role && 
                                <Label basic color='red' pointing>
                                    Please select a role
                                </Label>
                            }
                        </div>

                        <div className='d-flex mb-3'>
                            <div className='d-flex flex-direction-column mr-3'>
                                <Input
                                    className='input-field mr-3'
                                    type='text'
                                    placeholder='First name'
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    error={errors.firstName ? true : false}
                                />
                                {
                                    errors.firstName && 
                                    <Label basic color='red' pointing>
                                        Please enter first name
                                    </Label>
                                }
                            </div>

                            <div className='d-flex flex-direction-column'>
                                <Input
                                    className='input-field'
                                    type='text'
                                    placeholder='Last name'
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    error={errors.lastName ? true : false}
                                />
                                {
                                    errors.lastName &&
                                    <Label basic color='red' pointing>
                                        Please enter last name
                                    </Label>
                                }
                            </div>
                        </div>

                        <div className="mb-3">
                            <Input
                                className='input-field'
                                type='text'
                                placeholder='Email address'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={errors.email ? true : false}
                            />
                            {
                                errors.email && 
                                <Label basic color='red' pointing>
                                    Please enter email address
                                </Label>
                            }
                        </div>

                        <div className="mb-3">
                            <Input
                                className='input-field'
                                type='text'
                                placeholder='Phone number'
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                error={errors.phoneNumber ? true : false}
                            />
                            {
                                errors.phoneNumber &&
                                <Label basic color='red' pointing>
                                    Please enter phone number
                                </Label>
                            }
                        </div>

                        <div className='d-flex mb-3'>
                            <div className='d-flex flex-direction-column mr-3'>
                                <Input
                                    className='input-field mr-3'
                                    type='password'
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={errors.password ? true : false}
                                />
                                {
                                    errors.password &&
                                    <Label basic color='red' pointing>
                                        Please enter password
                                    </Label>
                                }
                            </div>

                            <div className='d-flex flex-direction-column'>
                                <Input
                                    className='input-field'
                                    type='password'
                                    placeholder='Confirm password'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    error={errors.confirmPassword ? true : false}
                                />
                                {
                                    errors.confirmPassword &&
                                    <Label basic color='red' pointing>
                                        Please enter password again
                                    </Label>
                                }
                            </div>
                        </div>

                        <Button className='action-button' primary onClick={register}>
                            Create Account
                        </Button>

                        <p className='sign-up-here'>
                            Or log in <NavLink to={'/public/login'}>here</NavLink>
                        </p>
                        <p className='disclaimer'>
                            By creating an account you agree to Walk with Me's Terms of Services and Privacy Policy
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
