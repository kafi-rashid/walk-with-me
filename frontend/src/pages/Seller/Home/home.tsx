import * as React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../../store/UserContext';
import { logout } from '../../../shared/utils';

export default function SellerHome(): React.JSX.Element {

    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const handleLogout = () => {
        logout(setUser, navigate);
    }

    return (
        <div className='container'>
            <div className='header'>
                <ul>
                    <li>
                        <NavLink to='/seller/products'>Products</NavLink>
                    </li>
                    <li>
                        <NavLink to='/seller/orders'>Orders</NavLink>
                    </li>
                </ul>
                <ul>
                    <li>
                        <NavLink to='/seller/profile'>Profile</NavLink>
                    </li>
                    <li>
                        <NavLink to='/seller/account'>Account</NavLink>
                    </li>
                    <li onClick={ handleLogout }>Log Out</li>
                </ul>
            </div>

            <div className='content'>
                <Outlet/>
            </div>
        </div>
    );
}
