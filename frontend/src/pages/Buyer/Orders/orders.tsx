import * as React from 'react';
import { 
    Divider,
    TableRow,
    TableHeaderCell,
    TableHeader,
    TableCell,
    TableBody,
    Table,
    Button,
    Icon,
    TableFooter,
    Input
} from 'semantic-ui-react';
import useAxios from '../../../shared/axios';

export default function OrderHistory(): React.JSX.Element {
    const [products, setProducts] = React.useState<any[]>([]);
    const axios = useAxios();
    const [userObj, setUserObj] = React.useState('');
    const [userProfile, setUserProfile] = React.useState({});

    React.useEffect(() => {
        const storedItems = localStorage.getItem('cart');
        if (storedItems) {
            setProducts(JSON.parse(storedItems));
        }

        const user = localStorage.getItem('user');
        if (user) {
            setUserObj(JSON.parse(user));
        }
    }, []);

    React.useEffect(() => {
        if (userObj) {
            getUserDetails();
        }
    }, [userObj]);

    const getUserDetails = () => {
        axios.get('/users/' + userObj?.userId)
            .then(({ data }) => {
                setUserProfile(data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
  
    return (
        <div className="page product">
            <div className="page-inner">
                <div className="manage-page">
                    <p className="page-title">Order History</p>
                    <Divider />

                    <div className='pb-3'>
                    </div>

                </div>
            </div>
        </div>
    );
}
