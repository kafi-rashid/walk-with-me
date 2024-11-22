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
    TextArea,
    Form,
    Button,
    Rating,
    Divider,
} from 'semantic-ui-react';
import useAxios from '../../../shared/axios';

export default function Product(): React.JSX.Element {
    const { id: productId } = useParams<{ id: string }>(); // Get `id` from the URL
    const [product, setProduct] = React.useState<any>(null);
    const [sizes, setSizes] = React.useState([]);
    const [selectedSize, setSelectedSize] = React.useState<string | null>(null); // Track selected size
    const [loading, setLoading] = React.useState(true);
    const [review, setReview] = React.useState({ comment: '', rating: 0 }); // Review state
    const [reviews, setReviews] = React.useState([]);
    const [userObj, setUserObj] = React.useState({});
    const axios = useAxios();

    React.useEffect(() => {
      const user = localStorage.getItem('user');
      if (user) {
        setUserObj(JSON.parse(user));
      }

      if (productId) {
        fetchProductDetails(Number(productId));
      }
    }, [productId]);

    const fetchProductDetails = async (id: number) => {
        try {
            const { data } = await axios.get(`/products/${id}`);
            setProduct(data);
            if (data.hasOwnProperty('reviews')) {
              setReviews(data.reviews);
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

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size.');
            return;
        }

        const selectedVariant = product.variants.find(
            (variant: any) => variant.size === selectedSize
        );
        const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingCartItem = currentCart.find(
            (item: any) =>
                item.productId === product.id && item.variant === selectedVariant?.id
        );

        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            currentCart.push({
                product: product,
                productId: product.id,
                variant: selectedVariant?.id,
                quantity: 1,
            });
        }

        localStorage.setItem('cart', JSON.stringify(currentCart));
        const event = new Event('cartUpdate');
        window.dispatchEvent(event);
        alert('Product added to cart!');
    };

    const handleReviewChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        key: string
    ) => {
        setReview((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const handleRatingChange = (e: React.MouseEvent, { rating }: any) => {
        setReview((prev) => ({ ...prev, rating }));
    };

    const submitReview = async () => {
      if (!review.comment || review.rating === 0) {
        alert('Please provide a comment and rating.');
        return;
      }
      try {
        const payload = {
          ...review,
          productId: product.id,
          buyerId: userObj?.userId ?? null
        }
        await axios.put('/products/add-review/' + product.id, payload);
        alert('Review submitted successfully!');
        setReview({ comment: '', rating: 0 });
        fetchReviews(Number(productId)); // Refresh reviews
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    };

    if (loading) {
        return (
            <div className='loader-fullpage'>
                <Loader active inline='centered' />
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
                        <p className="category">
                            {product?.parentCategory?.name || 'Uncategorized'}
                            {product?.childCategory?.name &&
                                ' > ' + product?.childCategory?.name}
                        </p>
                        <p className="price m-0 mb-4">${product.price}</p>

                        <Table basic="very" celled collapsing>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Brand</TableCell>
                                    <TableCell>
                                        {product?.brand?.name || 'N/A'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Sold by</TableCell>
                                    <TableCell>
                                        {product?.seller?.firstName +
                                            ' ' +
                                            product?.seller?.lastName || 'N/A'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Description</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <div className="sizes d-flex vertical-center pt-4 mr-3 mb-4">
                            <p className="label">Size:</p>
                            <Select
                                className="size"
                                placeholder="Select"
                                options={sizes}
                                value={selectedSize}
                                onChange={(e, { value }) =>
                                    setSelectedSize(value as string)
                                }
                            />
                        </div>
                        <div className="actions pt-4 pb-4">
                            <Button primary onClick={handleAddToCart}>Add to Cart</Button>
                        </div>

                        <Divider/>

                        <div className="reviews pt-3 pb-4 mb-4">
                          <p className='page-title mb-3'>Reviews</p>
                          {
                            reviews && reviews.length > 0 ? (
                              reviews.map((review: any) => (
                                <div key={review.id} className="review mb-4">
                                  <p className='font-weight-medium'>{ review.buyer.firstName + ' ' + review.buyer.lastName }</p>
                                  <Rating icon="star" defaultRating={review.rating} maxRating={5} disabled />
                                  <p className='pt-2'>{ review.comment }</p>
                                </div>
                              ))
                            ) :
                            <p className='mt-2'>No reviews yet.</p>
                          }
                          <Form>
                            <TextArea
                              className="mb-4"
                              placeholder="Write a comment..."
                              value={review.comment}
                              onChange={(e) => handleReviewChange(e, 'comment')}
                            />
                            <Rating
                              className='mr-3'
                              icon="star"
                              maxRating={5}
                              onRate={handleRatingChange}
                              rating={review.rating}
                            />
                            <Button
                              className='mb-4'
                              secondary
                              onClick={submitReview}>
                              Submit Review
                            </Button>
                          </Form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
