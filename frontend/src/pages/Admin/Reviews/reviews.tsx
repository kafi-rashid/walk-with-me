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
  Input,
  Confirm,
} from 'semantic-ui-react';
import useAxios from '../../../shared/axios';

interface Buyer {
  firstName: string;
  lastName: string;
}

interface Product {
  id: number;
  name: string;
}

interface Review {
  id: number;
  comment: string;
  rating: number;
  buyer: Buyer;
  product: Product;
}

export default function Reviews(): React.JSX.Element {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [editingReviewId, setEditingReviewId] = React.useState<number | null>(null);
  const [editingComment, setEditingComment] = React.useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);
  const axios = useAxios();

  React.useEffect(() => {
    axios.get('/products/reviews')
      .then(({ data }) => {
        setReviews(data);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }, []);

  const startEditing = (reviewId: number, currentComment: string) => {
    setEditingReviewId(reviewId);
    setEditingComment(currentComment);
  };

  const saveEdit = (reviewId: number) => {
    if (editingComment.trim().length <= 0) {
      setEditingReviewId(null);
      setEditingComment('');
      return;
    }
    axios.put(`/reviews/${reviewId}`, { comment: editingComment })
      .then(() => {
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === reviewId ? { ...review, comment: editingComment } : review
          )
        );
        setEditingReviewId(null);
        setEditingComment('');
      })
      .catch((error) => {
        console.log("Error updating review:", error);
        setEditingReviewId(null);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent, reviewId: number) => {
    if (e.key === 'Enter') {
      saveEdit(reviewId);
    }
  };

  const deleteReview = () => {
    if (confirmDeleteId !== null) {
      axios.delete(`/reviews/${confirmDeleteId}`)
        .then(() => {
          setReviews((prevReviews) =>
            prevReviews.filter((review) => review.id !== confirmDeleteId)
          );
          setConfirmDeleteId(null); // Close the confirmation dialog
        })
        .catch((error) => {
          console.log("Error deleting review:", error);
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
              <TableHeaderCell>Comment</TableHeaderCell>
              <TableHeaderCell>Rating</TableHeaderCell>
              <TableHeaderCell>Buyer</TableHeaderCell>
              <TableHeaderCell>Product</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.id}</TableCell>
                <TableCell onDoubleClick={() => startEditing(review.id, review.comment)}>
                  {editingReviewId === review.id ? (
                    <Input
                      value={editingComment}
                      onChange={(e) => setEditingComment(e.target.value)}
                      onBlur={() => saveEdit(review.id)}
                      onKeyDown={(e) => handleKeyDown(e, review.id)}
                      autoFocus
                    />
                  ) : (
                    review.comment
                  )}
                </TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell>{`${review.buyer.firstName} ${review.buyer.lastName}`}</TableCell>
                <TableCell>{review.product.name}</TableCell>
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
              <TableHeaderCell colSpan='7'>
                <Menu floated='right' pagination>
                  <MenuItem as='a' icon>
                    <Icon name='chevron left' />
                  </MenuItem>
                  <MenuItem as='a'>1</MenuItem>
                  <MenuItem as='a'>2</MenuItem>
                  <MenuItem as='a'>3</MenuItem>
                  <MenuItem as='a'>4</MenuItem>
                  <MenuItem as='a' icon>
                    <Icon name='chevron right' />
                  </MenuItem>
                </Menu>
              </TableHeaderCell>
            </TableRow>
          </TableFooter>
        </Table>

        {/* Confirmation Dialog */}
        <Confirm
          open={confirmDeleteId !== null}
          header='Delete Review'
          content={`Are you sure you want to delete this review?`}
          onCancel={cancelDelete}
          onConfirm={deleteReview}
        />
      </div>
    </div>
  );
}
