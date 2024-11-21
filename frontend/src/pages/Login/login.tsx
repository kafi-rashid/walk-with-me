import * as React from 'react';
import './login.scss';
import { Button, Input } from 'semantic-ui-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../store/UserContext';
import { useContext, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export default function Login(): React.JSX.Element {
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        console.log(API_URL)
    }, [])

    const login = () => {
        if (email.trim().length > 0 && password.trim().length > 0) {
            const payload = {
                email: email.trim(),
                password: password.trim(),
            };
    
            axios.post(API_URL + '/authenticate/login', payload)
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
