import * as React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../../../assets/styles/manage.scss';
import { useContext } from 'react';
import { UserContext } from '../../../store/UserContext';
import { logout } from '../../../shared/utils';

export default function AdminHome(): React.JSX.Element {

    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const handleLogout = () => {
        logout(setUser, navigate);
    }

    return (
        <div className='container'>
            <div className='header'>
                <div className='d-flex align-items-center'>
                    <p className='m-0 p-0 logo mr-3'>Walk with Me</p>
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
                </div>
                <ul>
                    <li>
                        <NavLink to='/admin/profile'>Profile</NavLink>
                    </li>
                    <li>
                        <NavLink to='/admin/account'>Account</NavLink>
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
