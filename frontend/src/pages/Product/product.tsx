import * as React from 'react';
import './product.scss';
import { Select } from 'semantic-ui-react'
import Shoe4 from '../../assets/images/dummy/shoe-4.png';

const sizes = [
    { key: '7 US', value: '7 US', text: '7 US' },
    { key: '8 US', value: '8 US', text: '8 US' },
    { key: '9 US', value: '9 US', text: '9 US' },
    { key: '10 US', value: '10 US', text: '10 US' },
]

export default function Product(): React.JSX.Element {
    return (
        <div className='page product'>
            <div className='page-inner'>
                <div className='product-details'>
                    <div className='image'>
                        <img src={ Shoe4 }/>
                    </div>
                    <div className='content'>
                        <p className='title'>Nike Air DT Max '96</p>
                        <p className='category'>Men's Shoes</p>
                        <p className='price'>$170</p>
                        <p className='description'>First released in 1996, the Air DT Max is back again, featuring durable leather plus the adjustable strap and responsive cushioning of the original shoe.</p>
                        <div className='d-flex vertical-center'>
                            <div className='sizes d-flex vertical-center mr-3'>
                                <p className='label'>Size:</p>
                                <Select className='size' placeholder='Select' options={ sizes } />
                            </div>
                            <div className='colors'>
                                <p className='label'>Color:</p>
                                <div className='color bg-red'></div>
                                <div className='color bg-green'></div>
                                <div className='color bg-blue'></div>
                                <div className='color bg-black'></div>
                            </div>
                        </div>
                        <div className='actions'>
                            <button>Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

