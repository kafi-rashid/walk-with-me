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

export default function Brands(): React.JSX.Element {
  const [products, setProducts] = React.useState<Product[]>([
    {
      id: 1,
      name: 'Laptop Pro',
      price: 1299.99,
      brand: 'TechBrand',
      category: 'Electronics',
      subcategory: 'Laptops',
      stockLeft: 25,
    },
    {
      id: 2,
      name: 'Smartphone X',
      price: 999.99,
      brand: 'PhoneCorp',
      category: 'Electronics',
      subcategory: 'Smartphones',
      stockLeft: 40,
    },
    {
      id: 3,
      name: 'Gaming Headset',
      price: 199.99,
      brand: 'GamerGear',
      category: 'Accessories',
      subcategory: 'Headsets',
      stockLeft: 50,
    },
  ]);

  const addProduct = () => {
    // Placeholder for adding a new product
    alert('Add Product functionality coming soon!');
  };

  return (
    <div className='manage-page'>
      <div className='d-flex justify-content-between'>
        <p className='page-title'>Brands</p>
        <Button
          icon
          labelPosition='left'
          primary
          size='small'
          onClick={addProduct}
        >
          <Icon name='add' /> Add Brand
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
