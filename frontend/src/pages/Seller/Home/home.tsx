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
            <div className='page-header'>
                <div className='d-flex align-items-center'>
                    <p className='m-0 p-0 logo mr-3'>Walk with Me</p>
                    <ul>
                        <li>
                            <NavLink to='/seller/products'>Products</NavLink>
                        </li>
                        <li>
                            <NavLink to='/seller/orders'>Orders</NavLink>
                        </li>
                    </ul>
                </div>
                <ul>
                    <li onClick={ handleLogout }>Log Out</li>
                </ul>
            </div>

            <div className='content'>
                <Outlet/>
            </div>
        </div>
    );
}
