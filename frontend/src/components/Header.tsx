import React, { useContext, useEffect, useState } from 'react';
import './Header.scss';
import { useNavigate } from 'react-router-dom';
import { logout } from '../shared/utils';
import { UserContext } from '../store/UserContext';

export default function Header(): React.JSX.Element {
    const navigate = useNavigate();
    const [showOptions, setShowOptions] = useState(false);
    const { user, setUser } = useContext(UserContext);

    const toggleOptions = () => {
        setShowOptions((prevState) => !prevState);
    };

    useEffect(() => {
        console.log(user)
    })

    const handleLogout = () => {
        logout(setUser, navigate);
    }

    return (
        <div className='header'>
            <p className='logo' onClick={() => navigate('/')}>Walk with Me</p>

            <div className='menu'>
                <ul>
                    <li onClick={() => navigate('/')}>Home</li>
                    <li onClick={() => navigate('/products')}>
                        Women
                        <ul>
                            <li>All Shoes</li>
                            <li>Basketball</li>
                            <li>Running</li>
                            <li>Training & Gym</li>
                            <li>Lifestyle</li>
                        </ul>
                    </li>
                    <li>
                        Men
                        <ul>
                            <li>All Shoes</li>
                            <li>Basketball</li>
                            <li>Running</li>
                            <li>Training & Gym</li>
                            <li>Lifestyle</li>
                        </ul>
                    </li>
                    <li>
                        Kids
                        <ul>
                            <li>All Shoes</li>
                            <li>Big Kids</li>
                            <li>Little Kids</li>
                            <li>Baby & Toddler</li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div className='user'>
                <button className='cart'>
                    <span className="material-icons">shopping_cart</span>
                    <span className='counter'>4</span>
                </button>
                <p className='greetings'>Hello { user?.firstName } { user?.lastName }!</p>
                <button onClick={toggleOptions}>
                    <span className="material-icons">
                        { showOptions ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }
                        </span>
                </button>

                <div className={`options ${showOptions ? 'show' : ''}`}>
                    <p>Profile</p>
                    <p>Account</p>
                    <p onClick={ handleLogout }>Log Out</p>
                </div>
            </div>
        </div>
    );
}
