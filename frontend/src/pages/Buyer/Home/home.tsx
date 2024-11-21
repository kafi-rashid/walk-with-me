import * as React from 'react';
import './home.scss';
import bannerShoe from '../../../assets/images/banner-shoe.png';
import Shoe1 from '../../../assets/images/dummy/shoe-1.png';
import Shoe2 from '../../../assets/images/dummy/shoe-2.png';
import Shoe3 from '../../../assets/images/dummy/shoe-3.png';
import Shoe4 from '../../../assets/images/dummy/shoe-4.png';
import Shoe5 from '../../../assets/images/dummy/shoe-5.png';
import Shoe6 from '../../../assets/images/dummy/shoe-6.png';
import Shoe7 from '../../../assets/images/dummy/shoe-7.png';

import Nike from '../../../assets/images/brands/nike.png';
import Puma from '../../../assets/images/brands/puma.png';
import Adidas from '../../../assets/images/brands/adidas.png';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../store/UserContext';

import useAxios from '../../../shared/axios';
const API_URL = import.meta.env.VITE_API_URL;

export default function Home(): React.JSX.Element {

    const navigate = useNavigate();
    const { user, setUser } = React.useContext(UserContext);
    const [products, setProducts] = React.useState([]);
    const axios = useAxios();

    React.useEffect(() => {
        getNewArrivals();
    }, []);

    const getNewArrivals = () => {
        axios.get(API_URL + '/products')
            .then(({data}) => {
                console.log(data)
                setProducts(data);
            })
            .catch((error) => {
                console.log(error)
            });
    }

    return (
        <div className='container home'>
            <div className='banner'>
                <div className='hero'>
                    <div className='hero-inner'>
                        <div>
                            <p className='title'>Air Jordan 1 High Method of Make</p>
                            <p className='subtitle'>Womens' Shoes</p>
                            <p className='price'>$90</p>
                            <button className='add-to-cart'>
                                Buy Now
                            </button>
                        </div>
                        <div>
                            <img className='banner-image' src={ bannerShoe }/>
                        </div>
                    </div>

                    <div className='metadata'>

                        <div className='more-shoes' onClick={ () => navigate('/products/1') }>
                            <img src={ Shoe1 }/>
                            <div className='more-shoes-inner'>
                                <p className='title'>Air Max 90</p>
                                <p className='price'>$150</p>
                            </div>
                            <p className="material-icons">
                                arrow_forward
                            </p>
                        </div>
                        <div className='more-shoes' onClick={ () => navigate('/products/1') }>
                            <img src={ Shoe2 }/>
                            <div className='more-shoes-inner'>
                                <p className='title'>Air Max Dd</p>
                                <p className='price'>$160</p>
                            </div>
                            <p className="material-icons">
                                arrow_forward
                            </p>
                        </div>
                        <div className='more-shoes' onClick={ () => navigate('/products/1') }>
                            <img src={ Shoe3 }/>
                            <div className='more-shoes-inner'>
                                <p className='title'>Dunk Low Lx</p>
                                <p className='price'>$90</p>
                            </div>
                            <p className="material-icons">
                                arrow_forward
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            <div className='section top-selling'>
                <div className='section-inner'>
                    <div className='title'>
                        <p>Top Selling</p>
                    </div>
                    <div className='content'>
                        <div className='top-selling-items'>
                            <div className='item'>
                                <div className='item-inner'>
                                    <p className='counter'>01</p>
                                    <img src={ Shoe4 }/>
                                    <p className='title'>Air Max 90</p>
                                    <p className='price'>$150</p>
                                    <button className='action-button' onClick={ () => navigate('/products/1') }>Details</button>
                                </div>
                            </div>
                            <div className='item'>
                                <div className='item-inner'>
                                    <p className='counter'>02</p>
                                    <img src={ Shoe5 }/>
                                    <p className='title'>Air Max Dd</p>
                                    <p className='price'>$160</p>
                                    <button className='action-button' onClick={ () => navigate('/products/1') }>Details</button>
                                </div>
                            </div>
                            <div className='item'>
                                <div className='item-inner'>
                                    <p className='counter'>03</p>
                                    <img src={ Shoe6 }/>
                                    <p className='title'>Dunk Low Lx</p>
                                    <p className='price'>$90</p>
                                    <button className='action-button' onClick={ () => navigate('/products/1') }>Details</button>
                                </div>
                            </div>
                            <div className='item'>
                                <div className='item-inner'>
                                    <p className='counter'>04</p>
                                    <img src={ Shoe7 }/>
                                    <p className='title'>Free Metcon 6</p>
                                    <p className='price'>$120</p>
                                    <button className='action-button' onClick={ () => navigate('/products/1') }>Details</button>
                                </div>
                            </div>
                        </div>

                        <div className='brand-selector'>
                            <div className='brand active'>
                                <img src={ Nike }/>
                            </div>
                            <div className='brand'>
                                <img src={ Puma }/>
                            </div>
                            <div className='brand'>
                                <img src={ Adidas }/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='section new-arrival'>
                <div className='section-inner'>
                    <div className='title'>
                        <p>New Arrival</p>
                    </div>
                    <div className='content'>
                        <div className='new-arrival-items'>
                            {
                                products?.length > 0 &&
                                products.map((product: any) => (
                                    <div key={product?.id} className="product-card" onClick={() => navigate(`/products/${product?.id}`)}>
                                    <div className="product-card-inner">
                                        <div>
                                        <p className="title">{product?.name}</p>
                                        <p className="brand">{product?.brand?.name}</p>
                                        <p className="price">{product?.price}</p>
                                        <p className="material-icons">arrow_forward</p>
                                        </div>
                                        <img src={product?.image} alt={product?.name} />
                                    </div>
                                    </div>
                                ))
                            }

                            {/* <div className='product-card' onClick={ () => navigate('/products/1') }>
                                <div className='product-card-inner'>
                                    <div>
                                        <p className='title'>Air Max Dd</p>
                                        <p className='brand'>Nike</p>
                                        <p className='price'>$160</p>
                                        <p className="material-icons">
                                            arrow_forward
                                        </p>
                                    </div>
                                    <img src={ Shoe2 }/>
                                </div>
                            </div>
                            <div className='product-card' onClick={ () => navigate('/products/1') }>
                                <div className='product-card-inner'>
                                    <div>
                                        <p className='title'>Dunk Low Lx</p>
                                        <p className='brand'>Nike</p>
                                        <p className='price'>$90</p>
                                        <p className="material-icons">
                                            arrow_forward
                                        </p>
                                    </div>
                                    <img src={ Shoe3 }/>
                                </div>
                            </div>
                            <div className='product-card' onClick={ () => navigate('/products/1') }>
                                <div className='product-card-inner'>
                                    <div>
                                        <p className='title'>Air Max 90</p>
                                        <p className='brand'>Nike</p>
                                        <p className='price'>$150</p>
                                        <p className="material-icons">
                                            arrow_forward
                                        </p>
                                    </div>
                                    <img src={ Shoe4 }/>
                                </div>
                            </div>
                            <div className='product-card' onClick={ () => navigate('/products/1') }>
                                <div className='product-card-inner'>
                                    <div>
                                        <p className='title'>Air Max Dd</p>
                                        <p className='brand'>Nike</p>
                                        <p className='price'>$160</p>
                                        <p className="material-icons">
                                            arrow_forward
                                        </p>
                                    </div>
                                    <img src={ Shoe5 }/>
                                </div>
                            </div>
                            <div className='product-card' onClick={ () => navigate('/products/1') }>
                                <div className='product-card-inner'>
                                    <div>
                                        <p className='title'>Dunk Low Lx</p>
                                        <p className='brand'>Nike</p>
                                        <p className='price'>$90</p>
                                        <p className="material-icons">
                                            arrow_forward
                                        </p>
                                    </div>
                                    <img src={ Shoe6 }/>
                                </div>
                            </div>
                            <div className='product-card' onClick={ () => navigate('/products/1') }>
                                <div className='product-card-inner'>
                                    <div>
                                        <p className='title'>Free Metcon 6</p>
                                        <p className='brand'>Nike</p>
                                        <p className='price'>$120</p>
                                        <p className="material-icons">
                                            arrow_forward
                                        </p>
                                    </div>
                                    <img src={ Shoe7 }/>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

