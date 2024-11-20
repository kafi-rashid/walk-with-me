import * as React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function SellerHome(): React.JSX.Element {
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
                    <li>Log Out</li>
                </ul>
            </div>

            <div className='content'>
                <Outlet/>
            </div>
        </div>
    );
}
