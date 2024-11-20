import React from 'react';
import Header from '../components/Header';

export default function AuthLayout({ children }): React.JSX.Element {
    return (
        <>
            <Header />
            { children }
        </>
    )
}

