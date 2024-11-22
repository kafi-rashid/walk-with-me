import * as React from 'react';
import '../Home/home.scss';
import './category.scss';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../store/UserContext';

import useAxios from '../../../shared/axios';
import Product from '../../../components/Product';
const API_URL = import.meta.env.VITE_API_URL;

export default function Category(): React.JSX.Element {

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
        <div className='container home category-page'>
            <div className='section new-arrival'>
                <div className='section-inner'>
                    <div className='category-page-title'>
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

