import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Input,
  Dropdown,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHeaderCell,
  Icon,
  Divider,
  Form,
  TextArea,
  Image,
  Confirm,
} from 'semantic-ui-react';
import useAxios from '../../../shared/axios';

export default function ProductDetails(): React.JSX.Element {
  const { id: productId } = useParams<{ id: string }>(); // Get `id` from URL params
  const [loading, setLoading] = React.useState(true);
  const [name, setName] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [price, setPrice] = React.useState<number | ''>('');
  const [image, setImage] = React.useState<string | null>(null);
  const [brandId, setBrandId] = React.useState<number | null>(null);
  const [parentCategoryId, setParentCategoryId] = React.useState<number | null>(null);
  const [childCategoryId, setChildCategoryId] = React.useState<number | null>(null);
  const [variants, setVariants] = React.useState<Array<{ id?: number; size: string; price: number; stockQuantity: number }>>([]);
  const [brands, setBrands] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [subcategories, setSubcategories] = React.useState([]);
  const [userObj, setUserObj] = React.useState({});
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const navigate = useNavigate();
  const axios = useAxios();

  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserObj(JSON.parse(user));
    }
  }, []);

  React.useEffect(() => {
    getBrands();
    getCategories();
    if (productId) {
      fetchProductDetails(Number(productId));
    } else {
      setLoading(false);
    }
  }, [productId]);

  const getBrands = () => {
    axios.get('/brands')
      .then(({ data }) => setBrands(data))
      .catch((error) => console.error('Error fetching brands:', error));
  };

  const getCategories = () => {
    axios.get('/categories/primary-categories')
      .then(({ data }) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  };

  const getSubCategories = (id: number) => {
    axios.get(`/categories/${id}/sub-categories`)
      .then(({ data }) => setSubcategories(data))
      .catch((error) => console.error('Error fetching subcategories:', error));
  };

  const fetchProductDetails = (id: number) => {
    axios.get(`/products/${id}`)
      .then(({ data }) => {
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setImage(data.image);
        setBrandId(data.brand?.id || null);
        setParentCategoryId(data.parentCategory?.id || null);
        setChildCategoryId(data.childCategory?.id || null);
        setVariants(data.variants || []);

        if (data.parentCategory?.id) {
          getSubCategories(data.parentCategory.id);
        }
      })
      .catch((error) => console.error('Error fetching product details:', error))
      .finally(() => setLoading(false));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addVariant = () => {
    setVariants([...variants, { size: '', price: 0, stockQuantity: 0 }]);
  };

  const updateVariant = (index: number, key: string, value: string | number) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], [key]: value };
    setVariants(updatedVariants);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleDelete = () => {
    if (!productId) return;

    axios.delete(`/products/${productId}`)
      .then(() => {
        alert('Product deleted successfully!');
        navigate('/seller/products');
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
        alert('Can not delete this product as this item is already in order history.');
      });
  };

  const handleSubmit = () => {
    if (!userObj?.userId) {
      alert("Couldn't fetch Seller ID, please refresh this page or try logging in again!");
      return;
    }
    const payload = {
      name,
      description,
      price,
      image,
      brandId,
      parentCategoryId,
      childCategoryId,
      variants,
      sellerId: userObj?.userId ?? null,
    };

    if (productId) {
      axios.put(`/products/${productId}`, payload)
        .then(() => {
          alert('Product has been updated!');
          navigate('/seller/products');
        })
        .catch((error) => console.error('Error updating product:', error));
    } else {
      axios.post('/products', payload)
        .then(() => {
          alert('Product has been added!');
          navigate('/seller/products');
        })
        .catch((error) => console.error('Error adding product:', error));
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="manage-page">
      <p className="page-title">{productId ? 'Edit Product' : 'Add Product'}</p>
      <Divider />

      <Form style={{ width: '100%', maxWidth: '700px' }}>
        <Form.Field>
          <label>Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter product name" />
        </Form.Field>

        <Form.Field>
          <label>Description</label>
          <TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter product description" />
        </Form.Field>

        <Form.Field>
          <label>Price</label>
          <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Enter price" />
        </Form.Field>

        <Form.Field>
          <label>Image</label>
          <Input type="file" onChange={handleImageUpload} />
          <Image className="mt-3" src={image} size="small" />
        </Form.Field>

        <Form.Field>
          <label>Brand</label>
          <Dropdown
            placeholder="Select Brand"
            selection
            value={brandId}
            options={brands.map((brand) => ({ key: brand.id, value: brand.id, text: brand.name }))}
            onChange={(e, { value }) => setBrandId(value as number)}
          />
        </Form.Field>

        <Form.Field>
          <label>Category</label>
          <Dropdown
            placeholder="Select Category"
            selection
            value={parentCategoryId}
            options={categories.map((category) => ({ key: category.id, value: category.id, text: category.name }))}
            onChange={(e, { value }) => {
              setParentCategoryId(value as number);
              getSubCategories(value as number);
            }}
          />
        </Form.Field>

        {subcategories.length > 0 && (
          <Form.Field>
            <label>Sub-category</label>
            <Dropdown
              placeholder="Select Subcategory"
              selection
              value={childCategoryId}
              options={subcategories.map((subcategory) => ({ key: subcategory.id, value: subcategory.id, text: subcategory.name }))}
              onChange={(e, { value }) => setChildCategoryId(value as number)}
            />
          </Form.Field>
        )}

        <label className="font-weight-bold">Variants</label>
        <Table compact celled>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Size</TableHeaderCell>
              <TableHeaderCell>Price</TableHeaderCell>
              <TableHeaderCell>Stock</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map((variant, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={variant.size}
                    onChange={(e) => updateVariant(index, 'size', e.target.value)}
                    placeholder="Enter size"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={variant.price}
                    onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                    placeholder="Enter price"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={variant.stockQuantity}
                    onChange={(e) => updateVariant(index, 'stockQuantity', Number(e.target.value))}
                    placeholder="Enter stock quantity"
                  />
                </TableCell>
                <TableCell>
                  <Icon name="trash" color="red" onClick={() => removeVariant(index)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={addVariant} color="green" icon labelPosition="left">
          <Icon name="plus" />
          Add Variant
        </Button>

        <Divider />

        {productId && (
          <>
            <Button color="red" className="mr-3" onClick={() => setConfirmOpen(true)}>
              Delete Product
            </Button>
            <Confirm
              open={confirmOpen}
              onCancel={() => setConfirmOpen(false)}
              onConfirm={handleDelete}
              content="Are you sure you want to delete this product?"
            />
          </>
        )}

        <Button primary onClick={handleSubmit}>
          {productId ? 'Update Product' : 'Add Product'}
        </Button>
      </Form>
    </div>
  );
}
