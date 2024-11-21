import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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
  MenuItem
} from 'semantic-ui-react';

interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  category: string;
  subcategory: string;
  stockLeft: number;
}

export default function Products(): React.JSX.Element {
  const [products, setProducts] = React.useState<Product[]>([]);
  const navigate = useNavigate();

  const addProduct = () => {
    navigate('/seller/products/add');
  };

  return (
    <div className='manage-page'>
      <div className='d-flex justify-content-between'>
        <p className='page-title'>Product List</p>
        <Button
          icon
          labelPosition='left'
          primary
          size='small'
          onClick={addProduct}
        >
          <Icon name='add' /> Add Product
        </Button>
      </div>

      <Divider />
      <div className="page-content">
        <Table compact celled>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Price</TableHeaderCell>
              <TableHeaderCell>Brand</TableHeaderCell>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Subcategory</TableHeaderCell>
              <TableHeaderCell>Stock Left</TableHeaderCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map(product => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.subcategory}</TableCell>
                <TableCell>{product.stockLeft}</TableCell>
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
      </div>
    </div>
  );
}
