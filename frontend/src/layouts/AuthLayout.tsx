import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function AuthLayout({ children }): React.JSX.Element {
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            const hasBuyerRole = parsedUser.roles?.includes('buyer');
            const hasSellerRole = parsedUser.roles?.includes('seller');
            const hasAdminRole = parsedUser.roles?.includes('admin');
            if (!hasBuyerRole) {
                if (hasSellerRole) {
                    navigate('/seller/');
                } else if (hasAdminRole) {
                    navigate('/admin/');
                }
            }
        }
    }, [navigate]);

    return (
        <>
            <Header />
            {children}
        </>
    );
}
