import * as React from 'react';
import './login.scss';
import { Button, Input, Message } from 'semantic-ui-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../store/UserContext';
import { useContext, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export default function Login(): React.JSX.Element {
    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [showError, setShowError] = React.useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        console.log(API_URL)
    }, [])

    const login = () => {
        setShowError(false);
        
        if (email.trim().length > 0 && password.trim().length > 0) {
            const payload = {
                email: email.trim(),
                password: password.trim(),
            };
    
            axios.post(API_URL + '/authenticate/login', payload)
                .then(({ data }) => {
                    setUser(data);
                    localStorage.setItem("user", JSON.stringify(data));
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
                    setShowError(true);
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
                        className='input-field mb-3'
                        type='text'
                        placeholder='Email address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        className='input-field mb-3'
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button className='action-button mb-3' primary onClick={login}>
                        Log In
                    </Button>

                    {
                        showError &&
                        <Message color='red'>Incorrect email address or password!</Message>
                    }


                    <Button className='forgot-button'>Forgot Password?</Button>

                    <p className='sign-up-here'>
                        Or sign up <NavLink to={'/public/register'}>here</NavLink>
                    </p>
                    <p className='disclaimer' style={{ width: '300px' }}>
                        By logging in you agree to Walk with Me's Terms of Services and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
