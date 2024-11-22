import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Product({ product }): React.JSX.Element {

    const navigate = useNavigate();

    return (
        <div key={ product?.id } className="product-card" onClick={() => navigate(`/products/${product?.id}`)}>
            <div className="product-card-inner">
                <div>
                <p className="title">{ product?.name }</p>
                <p className="brand">{ product?.brand?.name }</p>
                <p className="price">{ product?.price }</p>
                <p className="material-icons">arrow_forward</p>
                </div>
                <img src={ product?.image } alt={ product?.name } />
            </div>
        </div>
    );
}
