import * as React from 'react';
import '../Home/home.scss';
import './category.scss';
import { useNavigate, useParams } from 'react-router-dom';
import useAxios from '../../../shared/axios';
import Product from '../../../components/Product';
const API_URL = import.meta.env.VITE_API_URL;

export default function Category(): React.JSX.Element {
    const navigate = useNavigate();
    const [products, setProducts] = React.useState([]);
    const [category, setCategory] = React.useState({ id: null, name: '', parentId: null });
    const axios = useAxios();
    const { cat, sub } = useParams(); 

    React.useEffect(() => {
        getCategoryDetails();
        getProducts();
    }, [cat, sub]);

    const getCategoryDetails = () => {
        const categoryId = sub || cat;
        axios.get(`${API_URL}/categories/${categoryId}`)
            .then(({ data }) => {
                setCategory(data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getProducts = () => {
        let path = '/products/new-arrival';
        if (sub) {
            path = `/products/filter?childCategoryId=${sub}`;
        } else if (cat) {
            path = `/products/filter?parentCategoryId=${cat}`;
        }
        axios.get(`${API_URL}${path}`)
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
                            { category.name }
                        </p>
                    </div>
                    <div className='content'>
                        <div className='new-arrival-items'>
                            {
                                products?.length > 0 &&
                                products.map((product: any) => (
                                    <Product key={product.id} product={product} />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
