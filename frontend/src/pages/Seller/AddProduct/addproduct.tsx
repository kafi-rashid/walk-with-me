import * as React from 'react';
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
} from 'semantic-ui-react';
import useAxios from '../../../shared/axios';

export default function AddProduct(): React.JSX.Element {
  const [name, setName] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [price, setPrice] = React.useState<number | ''>('');
  const [image, setImage] = React.useState<string | null>(null);
  const [brandId, setBrandId] = React.useState<number | null>(null);
  const [parentCategoryId, setParentCategoryId] = React.useState<number | null>(null);
  const [childCategoryId, setChildCategoryId] = React.useState<number | null>(null);
  const [variants, setVariants] = React.useState<Array<{ size: string; price: number; stockQuantity: number }>>([]);
  const [brands, setBrands] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [subcategories, setSubcategories] = React.useState([]);

  const axios = useAxios();

  React.useEffect(() => {
    getBrands();
    getCategories();
  }, []);

  const getBrands = () => {
    axios.get('/brands')
      .then(({ data }) => setBrands(data))
      .catch((error) => console.error("Error fetching brands:", error));
  };

  const getCategories = () => {
    axios.get('/categories/primary-categories')
      .then(({ data }) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const getSubCategories = (id: number) => {
    axios.get(`/categories/${id}/sub-categories`)
      .then(({ data }) => setSubcategories(data))
      .catch((error) => console.error("Error fetching subcategories:", error));
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

  const handleSubmit = () => {
    const payload = {
      name,
      description,
      price,
      image,
      brandId,
      parentCategoryId,
      childCategoryId,
      variants,
    };
    axios.post('/products', payload)
      .then(({ data }) => {
        console.log(data);
      })
      .catch((error) => {
        console.log("Error adding new brand:", error);
      });
  };

  return (
    <div className="manage-page">
      <p className="page-title">Add Product</p>
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
          {image && <p>Image uploaded successfully</p>}
        </Form.Field>

        <Form.Field>
          <label>Brand</label>
          <Dropdown
            placeholder="Select Brand"
            selection
            options={brands.map((brand) => ({ key: brand.id, value: brand.id, text: brand.name }))}
            onChange={(e, { value }) => setBrandId(value as number)}
          />
        </Form.Field>

        <Form.Field>
          <label>Category</label>
          <Dropdown
            placeholder="Select Category"
            selection
            options={categories.map((category) => ({ key: category.id, value: category.id, text: category.name }))}
            onChange={(e, { value }) => {
              setParentCategoryId(value as number);
              getSubCategories(value as number);
            }}
          />
        </Form.Field>

        {
          subcategories.length > 0 &&
          <Form.Field>
            <label>Sub-category</label>
            <Dropdown
              placeholder="Select Subcategory"
              selection
              options={subcategories.map((subcategory) => ({ key: subcategory.id, value: subcategory.id, text: subcategory.name }))}
              onChange={(e, { value }) => setChildCategoryId(value as number)}
            />
          </Form.Field>
        }
        
        <label className='font-weight-bold'>Variants</label>

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
                    placeholder="Enter stock"
                  />
                </TableCell>
                <TableCell>
                  <Button icon="trash" color="red" onClick={() => removeVariant(index)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button secondary icon labelPosition="left" onClick={addVariant}>
          <Icon name="add" /> Add Variant
        </Button>

        <Divider />

        <Button primary onClick={handleSubmit}>
          Add Product
        </Button>
      </Form>
    </div>
  );
}
