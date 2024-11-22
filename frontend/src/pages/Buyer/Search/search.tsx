import * as React from 'react';
import '../Home/home.scss';
import './search.scss';
import { useNavigate, useParams } from 'react-router-dom';

import useAxios from '../../../shared/axios';
import Product from '../../../components/Product';
const API_URL = import.meta.env.VITE_API_URL;

export default function Search(): React.JSX.Element {
    const navigate = useNavigate();
    const [products, setProducts] = React.useState([]);
    const axios = useAxios();
    const { cat, sub } = useParams(); // Extract category or subcategory ID

    React.useEffect(() => {
        getProducts();
    }, [cat, sub]);

    const getProducts = () => {
        axios.get(`${API_URL}/products/new-arrival`)
            .then(({ data }) => {
                setProducts(data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className='container home category-page'>
            <div className='section new-arrival'>
                <div className='section-inner'>
                    <div className='category-page-title'>
                        <p>
                            Search Result
                        </p>
                    </div>
                    <div className='content'>
                        <div className='new-arrival-items'>
                            {products?.length > 0 &&
                                products.map((product: any) => (
                                    <Product key={product.id} product={product} />
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
