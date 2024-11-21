import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
import useAxios from '../../../shared/axios';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  brand: { id: number, name: string };
  parentCategory: { id: number, name: string, parentId: number };
  childCategory: { id: number, name: string, parentId: number };
  stockLeft: number;
}

export default function Products(): React.JSX.Element {
  const [products, setProducts] = React.useState<Product[]>([]);
  const navigate = useNavigate();

  const addProduct = () => {
    navigate('/seller/products/add');
  };

  const axios = useAxios();

  React.useEffect(() => {
    axios.get('/products')
      .then(({ data }) => {
        setProducts(data);
        console.log(data)
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }, []);
  
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
        <Table compact>
          <TableHeader>
            <TableRow>
              <TableHeaderCell style={{ width: '50px' }}>ID</TableHeaderCell>
              <TableHeaderCell style={{ width: '80px' }}>Image</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell style={{ width: '100px' }}>Price</TableHeaderCell>
              <TableHeaderCell>Brand</TableHeaderCell>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Subcategory</TableHeaderCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map(product => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>
                  <img className='product-list-image' src={product.image} alt="Product" />
                </TableCell>
                <TableCell>
                  <NavLink className="anchor" to={ '/seller/products/' + product.id }>
                    {product.name}
                  </NavLink>
                </TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.brand.name}</TableCell>
                <TableCell>{product.parentCategory.name}</TableCell>
                <TableCell>{product.childCategory.name}</TableCell>
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
