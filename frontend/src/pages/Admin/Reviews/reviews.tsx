import * as React from 'react';
import {
  Divider,
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableFooter,
  TableCell,
  TableBody,
  Button,
  Icon,
  Table,
  Menu,
  MenuItem,
  Confirm,
} from 'semantic-ui-react';
import useAxios from '../../../shared/axios';

interface Review {
  id: number;
  comment: string;
  rating: number;
  productId: number | null;
  productName: string;
  buyerId: number | null;
  buyerFistName: string;
  buyerLastName: string;
  reviewDate: string | null;
}

export default function Reviews(): React.JSX.Element {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);
  const axios = useAxios();

  React.useEffect(() => {
    axios
      .get('/reviews')
      .then(({ data }) => {
        setReviews(data);
      })
      .catch((error) => {
        console.log('Error fetching reviews:', error);
      });
  }, []);

  const deleteReview = () => {
    if (confirmDeleteId !== null) {
      axios
        .delete(`/reviews/${confirmDeleteId}`)
        .then(() => {
          setReviews((prevReviews) =>
            prevReviews.filter((review) => review.id !== confirmDeleteId)
          );
          setConfirmDeleteId(null); // Close the confirmation dialog
        })
        .catch((error) => {
          console.log('Error deleting review:', error);
        });
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null); // Close the confirmation dialog without deleting
  };

  return (
    <div className='manage-page'>
      <div className="d-flex justify-content-between">
        <p className='page-title'>Reviews</p>
      </div>

      <Divider />
      <div className="page-content">
        <Table celled>
          <TableHeader>
            <TableRow>
              <TableHeaderCell style={{ width: '50px' }}>ID</TableHeaderCell>
              <TableHeaderCell style={{ width: '300px' }}>Product</TableHeaderCell>
              <TableHeaderCell style={{ width: '80px' }}>Rating</TableHeaderCell>
              <TableHeaderCell>Comment</TableHeaderCell>
              <TableHeaderCell style={{ width: '200px' }}>Buyer</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.id}</TableCell>
                <TableCell>{review.productName}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell>{review.comment}</TableCell>
                <TableCell>{`${review.buyerFistName} ${review.buyerLastName}`}</TableCell>
                <TableCell className="delete-column">
                  <Button
                    icon
                    color="red"
                    onClick={() => setConfirmDeleteId(review.id)} // Open confirmation dialog
                    size="small"
                  >
                    <Icon name="trash" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter fullWidth>
            <TableRow>
              <TableHeaderCell colSpan="6">
                <Menu floated="right" pagination>
                  <MenuItem as="a" icon>
                    <Icon name="chevron left" />
                  </MenuItem>
                  <MenuItem as="a">1</MenuItem>
                  <MenuItem as="a">2</MenuItem>
                  <MenuItem as="a">3</MenuItem>
                  <MenuItem as="a">4</MenuItem>
                  <MenuItem as="a" icon>
                    <Icon name="chevron right" />
                  </MenuItem>
                </Menu>
              </TableHeaderCell>
            </TableRow>
          </TableFooter>
        </Table>

        {/* Confirmation Dialog */}
        <Confirm
          open={confirmDeleteId !== null}
          header="Delete Review"
          content={`Are you sure you want to delete this review?`}
          onCancel={cancelDelete}
          onConfirm={deleteReview}
        />
      </div>
    </div>
  );
}
