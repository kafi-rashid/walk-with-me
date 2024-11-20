import * as React from 'react';
import './login.scss';
import { Button, Input } from 'semantic-ui-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../store/UserContext';
import { useContext } from 'react';

export default function Login(): React.JSX.Element {
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const login = () => {
        if (email.trim().length > 0 && password.trim().length > 0) {
            const payload = {
                email: email.trim(),
                password: password.trim(),
            };
            console.log('Login Payload:', payload);


            const loggedInAs = {
                isAuthenticated: true,
                token: '1234',
                user: {
                    firstName: 'Kafi',
                    lastName: 'Rashid',
                    id: 1,
                    role: ['Buyer']
                }
            }

            setUser(loggedInAs);

            if (email === 'admin') {
                navigate('/admin/');
            } else if (email === 'customer') {
                navigate('/');
            } else {
                navigate('/seller/')
            }
    
            // fetch('/api/login', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(payload),
            // })
            // .then(response => response.json())
            // .then(data => {
            //     console.log('Login successful:', data);
            // })
            // .catch(error => {
            //     console.error('Error during login:', error);
            // });
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            login();
        }
    };

    return (
        <div className='login-container'>
            <div className='content'>
                <div className="content-inner">
                    <p>Walk<br/>with<br/>Me</p>
                </div>
            </div>

            <div className='input-container' onKeyDown={ handleKeyDown }>
                <div className="inner">
                    <p className='logo'>Walk with Me</p>
                    <p className='title'>Log In to Continue</p>
                    <Input
                        className='input-field'
                        type='text'
                        placeholder='Email address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        className='input-field'
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button className='action-button' primary onClick={login}>
                        Log In
                    </Button>
                    <Button className='forgot-button'>Forgot Password?</Button>

                    <p className='sign-up-here'>
                        Or sign up <NavLink to={'/public/register'}>here</NavLink>
                    </p>
                    <p className='disclaimer'>
                        By logging in you agree to Walk with Me's Terms of Services and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
