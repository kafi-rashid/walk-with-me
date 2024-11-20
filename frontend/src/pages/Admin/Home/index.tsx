import * as React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../../../assets/styles/manage.scss';

export default function AdminHome(): React.JSX.Element {

    const navigate = useNavigate();

    return (
        <div className='container'>
            <div className='header'>
                <ul>
                    <li>
                        <NavLink to='/admin/sellers'>Sellers</NavLink>
                    </li>
                    <li>
                        <NavLink to='/admin/reviews'>Reviews</NavLink>
                    </li>
                    <li>
                        Config
                        <ul>
                            <li onClick={ () => navigate('/admin/categories') }>
                                Categories
                            </li>
                            <li onClick={ () => navigate('/admin/brands') }>
                                Brands
                            </li>
                            <li onClick={ () => navigate('/admin/attributes') }>
                                Attributes
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul>
                    <li>
                        <NavLink to='/admin/profile'>Profile</NavLink>
                    </li>
                    <li>
                        <NavLink to='/admin/account'>Account</NavLink>
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
