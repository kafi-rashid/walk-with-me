import React, { useContext, useEffect, useState } from 'react';
import './Header.scss';
import { useNavigate } from 'react-router-dom';
import { logout } from '../shared/utils';
import useAxios from '../shared/axios';

export default function Header(): React.JSX.Element {
    const navigate = useNavigate();
    const [showOptions, setShowOptions] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [subCategories, setSubCategories] = useState<any>({});
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [cartCount, setCartCount] = useState(0);
    const axios = useAxios();

    useEffect(() => {
        getCategories();
        updateCartCount();

        const loggedInAs = localStorage.getItem('user');
        if (loggedInAs) {
            setUser(JSON.parse(loggedInAs));
        }

        const handleStorageChange = () => {
            updateCartCount();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('cartUpdate', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('cartUpdate', handleStorageChange);
        };
    }, []);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            navigate(`/search?product=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(totalItems);
    };

    const triggerCartUpdate = () => {
        const event = new Event('cartUpdate');
        window.dispatchEvent(event);
    };

    const goToCart = () => {
        navigate('/cart');
    };

    const getCategories = () => {
        axios.get('/categories/primary-categories')
            .then(({ data }) => {
                setCategories(data);
                data.forEach((category: any) => {
                    getSubCategories(category.id);
                });
            })
            .catch((error: any) => {
                console.log('Error fetching categories:', error);
            });
    };

    const getSubCategories = (categoryId: number) => {
        axios.get(`/categories/${categoryId}/sub-categories`)
            .then(({ data }) => {
                setSubCategories((prevState: any) => ({
                    ...prevState,
                    [categoryId]: data,
                }));
            })
            .catch((error: any) => {
                console.log('Error fetching subcategories:', error);
            });
    };

    const toggleOptions = () => {
        setShowOptions((prevState) => !prevState);
    };

    const handleLogout = () => {
        logout(setUser, navigate);
    };

    return (
        <div className='page-header'>
            <p className='logo' onClick={() => navigate('/')}>Walk with Me</p>

            <div className='menu'>
                <ul>
                    <li onClick={() => navigate('/')}>Home</li>

                    {categories.map((category) => (
                        <li key={category.id} onClick={() => navigate(`/categories/${category.id}`)}>
                            {category.name}
                            <ul>
                                {(subCategories[category.id] || []).map((subCategory: any) => (
                                    <li 
                                        key={subCategory.id} 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/categories/${category.id}/sub-categories/${subCategory.id}`);
                                        }}
                                    >
                                        {subCategory.name}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='header-search'>
                <input type='text'
                    placeholder="Search products by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}/>
            </div>

            <div className='user'>
                {
                    user !== null ?
                    <>
                        <button className='cart' onClick={goToCart}>
                            <span className="material-icons">shopping_cart</span>
                            <span className='counter'>{cartCount}</span>
                        </button>
                        <p className='greetings'>Hello {user?.firstName} {user?.lastName}!</p>
                        <button onClick={toggleOptions}>
                            <span className="material-icons">
                                {showOptions ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                            </span>
                        </button>

                        <div className={`options ${showOptions ? 'show' : ''}`}>
                            <p onClick={() => navigate('/profile')}>Profile</p>
                            <p onClick={handleLogout}>Log Out</p>
                        </div>
                    </> :
                    <p className='greetings'
                        onClick={ () => navigate('/public/login') } >Log In or Sign Up</p>
                }
                
            </div>
        </div>
    );
}
