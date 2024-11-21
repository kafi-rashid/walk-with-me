import * as React from 'react';
import '../Login/login.scss';
import { Button, Input } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { Select } from 'semantic-ui-react';

const roles = [
    { key: 'Buyer', value: 'Buyer', text: 'Buyer' },
    { key: 'Seller', value: 'Seller', text: 'Seller' },
];

export default function Register(): React.JSX.Element {
    const [role, setRole] = React.useState<string | undefined>();
    const [firstName, setFirstName] = React.useState<string>('');
    const [lastName, setLastName] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [confirmPassword, setConfirmPassword] = React.useState<string>('');

    const register = () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const payload = {
            role,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password,
        };

        console.log('Register Payload:', payload);

        // fetch('/api/register', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(payload),
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log('Registration successful:', data);
        // })
        // .catch(error => {
        //     console.error('Error during registration:', error);
        // });
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

                        <Select
                            className='input-field'
                            placeholder='Sign up as'
                            options={roles}
                            onChange={(e, { value }) => setRole(value as string)}
                        />

                        <div className='d-flex'>
                            <Input
                                className='input-field mr-3'
                                type='text'
                                placeholder='First name'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <Input
                                className='input-field'
                                type='text'
                                placeholder='Last name'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <Input
                            className='input-field'
                            type='text'
                            placeholder='Email address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className='d-flex'>
                            <Input
                                className='input-field mr-3'
                                type='password'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Input
                                className='input-field'
                                type='password'
                                placeholder='Confirm password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
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
