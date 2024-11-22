import * as React from 'react';
import './home.scss';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../store/UserContext';

import useAxios from '../../../shared/axios';
import Product from '../../../components/Product';
const API_URL = import.meta.env.VITE_API_URL;

export default function Home(): React.JSX.Element {

    const navigate = useNavigate();
    const { user, setUser } = React.useContext(UserContext);
    const [newArrivals, setNewArrivals] = React.useState([]);
    const [topSelling, setTopSelling] = React.useState([]);
    const axios = useAxios();

    React.useEffect(() => {
        getNewArrivals();
        getTopSelling();
    }, []);

    const getNewArrivals = () => {
        axios.get(API_URL + '/products/new-arrival')
            .then(({data}) => {
                console.log(data)
                setNewArrivals(data);
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const getTopSelling = () => {
        axios.get(API_URL + '/products/top-slling')
            .then(({data}) => {
                console.log(data)
                setTopSelling(data);
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
                            <p className='title'>
                                { newArrivals[0]?.name }
                                <br/>
                                High Method of Make
                            </p>
                            <p className='subtitle'>
                                { newArrivals[0]?.parentCategory.name }
                            </p>
                            <p className='price'>
                                ${ newArrivals[0]?.price }
                            </p>
                            <button className='add-to-cart'
                                onClick={ () => navigate('/products/' + newArrivals[0]?.id) }>
                                Buy Now
                            </button>
                        </div>
                        <div className='banner-image-wrapper' style={{ backgroundImage: 'url(' + newArrivals[0]?.image + ')' }}>
                            {/* <img className='banner-image' src={ newArrivals[0]?.image }/> */}
                        </div>
                    </div>

                    <div className='metadata'>

                        {
                            newArrivals &&
                            newArrivals.map((product, i) => (
                                i !== 0 && i < 4 &&
                                <div className='more-shoes' key={ i } onClick={ () => navigate('/products/' + product.id) }>
                                    <img src={ product.image }/>
                                    <div className='more-shoes-inner'>
                                        <p className='title'>{ product.name }</p>
                                        <p className='price'>${ product.price }</p>
                                    </div>
                                    <p className="material-icons">
                                        arrow_forward
                                    </p>
                                </div>
                            ))
                        }
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
                            {
                                topSelling.map((product, id) => (
                                    <div className='item'>
                                        <div className='item-inner'>
                                            <p className='counter'>0{ id + 1 }</p>
                                            <img src={ product.image }/>
                                            <p className='title'>{ product.name }</p>
                                            <p className='price'>${ product.price }</p>
                                            <button className='action-button' onClick={ () => navigate('/products/' + product.id) }>Details</button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        {/* <div className='brand-selector'>
                            <div className='brand active'>
                                <img src={ Nike }/>
                            </div>
                            <div className='brand'>
                                <img src={ Puma }/>
                            </div>
                            <div className='brand'>
                                <img src={ Adidas }/>
                            </div>
                        </div> */}
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
                                newArrivals?.length > 0 &&
                                newArrivals.map((product: any) => (
                                    <Product product={ product }/>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

