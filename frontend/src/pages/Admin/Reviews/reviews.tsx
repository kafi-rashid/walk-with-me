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
  Checkbox,
  Icon,
  Table,
} from 'semantic-ui-react';

interface Review {
  id: number;
  productId: number;
  productName: string;
  reviewerName: string;
  reviewerEmail: string;
  comment: string;
  timestamp: string;
  selected: boolean;
}

export default function Reviews(): React.JSX.Element {
  const [reviews, setReviews] = React.useState<Review[]>([
    {
      id: 1,
      productId: 101,
      productName: 'Product A',
      reviewerName: 'John Doe',
      reviewerEmail: 'johndoe@gmail.com',
      comment: 'Great product!',
      timestamp: '2024-11-15 10:30 AM',
      selected: false,
    },
    {
      id: 2,
      productId: 102,
      productName: 'Product B',
      reviewerName: 'Jane Smith',
      reviewerEmail: 'janesmith@gmail.com',
      comment: 'Could be better.',
      timestamp: '2024-11-16 2:00 PM',
      selected: false,
    },
    {
      id: 3,
      productId: 103,
      productName: 'Product C',
      reviewerName: 'Mark Lee',
      reviewerEmail: 'marklee@gmail.com',
      comment: 'Excellent value for money!',
      timestamp: '2024-11-17 6:45 PM',
      selected: false,
    },
  ]);

  const deleteSelectedReviews = () => {
    setReviews(reviews.filter(review => !review.selected));
  };

  const toggleSelectRow = (id: number) => {
    setReviews(reviews.map(review =>
      review.id === id ? { ...review, selected: !review.selected } : review
    ));
  };

  const isAnyRowSelected = reviews.some(review => review.selected);

  return (
    <div className='manage-page'>
      <p className='page-title'>Product Reviews</p>
      <Divider />
      <div className="page-content">
        <Table compact celled>
          <TableHeader>
            <TableRow>
              <TableHeaderCell />
              <TableHeaderCell>Product ID</TableHeaderCell>
              <TableHeaderCell>Product Name</TableHeaderCell>
              <TableHeaderCell>Reviewer Name</TableHeaderCell>
              <TableHeaderCell>Reviewer Email</TableHeaderCell>
              <TableHeaderCell>Comment</TableHeaderCell>
              <TableHeaderCell>Timestamp</TableHeaderCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reviews.map(review => (
              <TableRow key={review.id}>
                <TableCell collapsing>
                  <Checkbox
                    checked={review.selected}
                    onChange={() => toggleSelectRow(review.id)}
                  />
                </TableCell>
                <TableCell>{review.productId}</TableCell>
                <TableCell>{review.productName}</TableCell>
                <TableCell>{review.reviewerName}</TableCell>
                <TableCell>{review.reviewerEmail}</TableCell>
                <TableCell>{review.comment}</TableCell>
                <TableCell>{review.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter fullWidth>
            <TableRow>
              <TableHeaderCell />
              <TableHeaderCell colSpan='6'>
                <Button
                  size='small'
                  color='red'
                  onClick={deleteSelectedReviews}
                  disabled={!isAnyRowSelected}
                >
                  <Icon name='trash' /> Delete Selected
                </Button>
              </TableHeaderCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
