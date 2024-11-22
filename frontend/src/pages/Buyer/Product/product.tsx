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
} from 'semantic-ui-react'
import useAxios from '../../../shared/axios';

export default function Product(): React.JSX.Element {
  const { id: productId } = useParams<{ id: string }>(); // Get `id` from the URL
  const [product, setProduct] = React.useState<any>(null);
  const [sizes, setSizes] = React.useState([]);
  const [category, setCategory] = React.useState<any>(null);
  const [brand, setBrand] = React.useState<any>(null);
  const [seller, setSeller] = React.useState<any>(null);
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

      // Fetch category details
      if (data.parentCategoryId) {
        const categoryResponse = await axios.get(`/categories/${data.parentCategoryId}`);
        setCategory(categoryResponse.data);
      }

      // Fetch brand details
      if (data.brandId) {
        const brandResponse = await axios.get(`/brands/${data.brandId}`);
        setBrand(brandResponse.data);
      }

      // Fetch seller details
      if (data.sellerId) {
        const sellerResponse = await axios.get(`/users/${data.sellerId}`);
        setSeller(sellerResponse.data);
      }

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
            <img src={product.image || ''} alt={product.name} />
          </div>
          <div className="content">
            <p className="title m-0">{product.name}</p>
            <p className="category ">{category?.name || "Uncategorized"}</p>
            <p className="price m-0 mb-4">${product.price}</p>

            <Table basic='very' celled collapsing>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            Brand
                        </TableCell>
                        <TableCell>
                            { brand?.name || "N/A" }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Sold by
                        </TableCell>
                        <TableCell>
                            { (seller?.firstName + ' ' + seller?.lastName) || "N/A" }
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
              <Select className="size" placeholder="Select" options={sizes} />
            </div>
            <div className="actions pt-4">
              <button>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
