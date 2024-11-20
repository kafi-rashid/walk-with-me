import * as React from 'react';
import './Header.scss';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Header(): React.JSX.Element {

    const navigate = useNavigate();

    return (
        <div className='header'>
            <p className='logo'>Walk with Me</p>

            <div className='menu'>
                <ul>
                    <li onClick={ () => navigate('/') }>Home</li>
                    <li onClick={ () => navigate('/products') }>
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
                <div className='avatar'>

                </div>
                <p className='greetings'>Hello Kafi Rashid</p>
                <button>
                    <span className="material-icons">
                        keyboard_arrow_down
                    </span>
                </button>
            </div>
        </div>
    )
}

