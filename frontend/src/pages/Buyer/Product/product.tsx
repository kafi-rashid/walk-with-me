import * as React from 'react';
import { useParams } from 'react-router-dom';
import './product.scss';
import {
    Select,
    TableRow,
    TableCell,
    TableBody,
    Loader,
    Table,
} from 'semantic-ui-react';
import useAxios from '../../../shared/axios';

export default function Product(): React.JSX.Element {
  const { id: productId } = useParams<{ id: string }>(); // Get `id` from the URL
  const [product, setProduct] = React.useState<any>(null);
  const [sizes, setSizes] = React.useState([]);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null); // Track selected size
  const [loading, setLoading] = React.useState(true);
  const axios = useAxios();

  React.useEffect(() => {
    if (productId) {
      fetchProductDetails(Number(productId));
    }
  }, [productId]);

  const fetchProductDetails = async (id: number) => {
    try {
      const { data } = await axios.get(`/products/${id}`);
      setProduct(data);

      // Set size options from variants
      if (data.variants) {
        const sizeOptions = data.variants.map((variant: any) => ({
          key: variant.size,
          value: variant.size,
          text: variant.size,
        }));
        setSizes(sizeOptions);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size.');
      return;
    }
  
    // Get the selected variant from the product's variants
    const selectedVariant = product.variants.find((variant: any) => variant.size === selectedSize);
  
    // Get the current cart from localStorage, or initialize it as an empty array
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
  
    // Find if the product with the same variant already exists in the cart
    const existingCartItem = currentCart.find(
      (item: any) => item.productId === product.id && item.variant === selectedVariant?.id
    );
  
    if (existingCartItem) {
      // Increment quantity if product with same variant exists
      existingCartItem.quantity += 1;
    } else {
      // Add the product with the selected variant to the cart
      currentCart.push({
        product: product,
        productId: product.id,
        variant: selectedVariant?.id,
        quantity: 1,
      });
    }
  
    // Update the cart in localStorage
    localStorage.setItem('cart', JSON.stringify(currentCart));
  
    alert('Product added to cart!');
  };
  

  if (loading) {
    return (
        <div className='loader-fullpage'>
            <Loader active inline='centered'/>
        </div>
    );
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="page product">
      <div className="page-inner">
        <div className="product-details">
          <div className="image">
            <img src={ product.image || ''} alt={ product.name } />
          </div>
          <div className="content">
            <p className="title m-0">{ product.name }</p>
            <p className="category">
              { product?.parentCategory?.name || "Uncategorized" }

              { product?.childCategory?.name && ' > ' + product?.childCategory?.name }
            </p>
            <p className="price m-0 mb-4">${ product.price }</p>

            <Table basic='very' celled collapsing>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            Brand
                        </TableCell>
                        <TableCell>
                            { product?.brand?.name || "N/A" }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Sold by
                        </TableCell>
                        <TableCell>
                            { (product?.seller?.firstName + ' ' + product?.seller?.lastName) || "N/A" }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Description
                        </TableCell>
                        <TableCell>
                            { product.description }
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <div className="sizes d-flex vertical-center pt-4 mr-3 mb-4">
              <p className="label">Size:</p>
              <Select
                className="size"
                placeholder="Select"
                options={ sizes }
                value={ selectedSize }
                onChange={(e, { value }) => setSelectedSize(value as string)}
              />
            </div>
            <div className="actions pt-4">
              <button onClick={ handleAddToCart }>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
