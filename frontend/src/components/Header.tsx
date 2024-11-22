import React, { useContext, useEffect, useState } from 'react';
import './Header.scss';
import { useNavigate } from 'react-router-dom';
import { logout } from '../shared/utils';
import { UserContext } from '../store/UserContext';
import useAxios from '../shared/axios';

export default function Header(): React.JSX.Element {
    const navigate = useNavigate();
    const [showOptions, setShowOptions] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [subCategories, setSubCategories] = useState<any>({});
    const { user, setUser } = useContext(UserContext);
    const axios = useAxios();

    useEffect(() => {
        getCategories();
        if (!user?.user?.userId) {
            const loggedInAs = localStorage.getItem('user');
            if (loggedInAs) {
                setUser(JSON.parse(loggedInAs));
            }
        }
    }, []);

    const goToCart = () => {
        navigate('/cart');
    }

    const getCategories = () => {
        axios.get('/categories/primary-categories')
            .then(({ data }) => {
                setCategories(data);
                data.forEach((category: any) => {
                    getSubCategories(category.id); // Fetch subcategories for each category
                });
            })
            .catch((error: any) => {
                console.log('Error fetching categories:', error);
            });
    }

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
    }

    const toggleOptions = () => {
        setShowOptions((prevState) => !prevState);
    };

    const handleLogout = () => {
        logout(setUser, navigate);
    }

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
                                    <li key={subCategory.id} onClick={() => navigate(`/categories/${category.id}/sub-categories/${subCategory.id}`)}>
                                        {subCategory.name}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='user'>
                <button className='cart'
                    onClick={ goToCart }>
                    <span className="material-icons">shopping_cart</span>
                    <span className='counter'>4</span>
                </button>
                <p className='greetings'>Hello {user?.firstName} {user?.lastName}!</p>
                <button onClick={toggleOptions}>
                    <span className="material-icons">
                        {showOptions ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                    </span>
                </button>

                <div className={`options ${showOptions ? 'show' : ''}`}>
                    <p onClick={ () => navigate('/profile') }>Profile</p>
                    <p onClick={ handleLogout }>Log Out</p>
                </div>
            </div>
        </div>
    );
}
