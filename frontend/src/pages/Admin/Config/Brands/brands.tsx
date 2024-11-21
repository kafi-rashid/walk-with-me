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
import useAxios from '../../../../shared/axios';

interface Brand {
  id: number;
  name: string;
}

export default function Brands(): React.JSX.Element {
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [editingBrandId, setEditingBrandId] = React.useState<number | null>(null);
  const [editingName, setEditingName] = React.useState<string>('');
  const [newBrandName, setNewBrandName] = React.useState<string>('');
  const [isAddingBrand, setIsAddingBrand] = React.useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);
  const axios = useAxios();

  React.useEffect(() => {
    axios.get('/brands/')
      .then(({ data }) => {
        setBrands(data);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }, []);

  const startEditing = (brandId: number, currentName: string) => {
    setEditingBrandId(brandId);
    setEditingName(currentName);
  };

  const saveEdit = (brandId: number) => {
    if (editingName.trim().length <= 0) {
      setEditingBrandId(null);
      setEditingName('');
      return;
    }
    axios.put(`/brands/${brandId}`, { name: editingName })
      .then(() => {
        setBrands((prevBrands) =>
          prevBrands.map((brand) =>
            brand.id === brandId ? { ...brand, name: editingName } : brand
          )
        );
        setEditingBrandId(null);
        setEditingName('');
      })
      .catch((error) => {
        console.log("Error updating brand:", error);
        setEditingBrandId(null);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent, brandId: number) => {
    if (e.key === 'Enter') {
      saveEdit(brandId);
    }
  };

  const addBrandRow = () => {
    setIsAddingBrand(true);
    setNewBrandName('');
  };

  const saveNewBrand = () => {
    if (newBrandName.trim().length <= 0) {
      setIsAddingBrand(false);
      return;
    }
    axios.post('/brands', { name: newBrandName })
      .then(({ data }) => {
        setBrands((prevBrands) => [data, ...prevBrands]);
        setIsAddingBrand(false);
      })
      .catch((error) => {
        console.log("Error adding new brand:", error);
        setIsAddingBrand(false);
      });
  };

  const handleNewBrandKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveNewBrand();
    }
  };

  const deleteBrand = () => {
    if (confirmDeleteId !== null) {
      axios.delete(`/brands/${confirmDeleteId}`)
        .then(() => {
          setBrands((prevBrands) =>
            prevBrands.filter((brand) => brand.id !== confirmDeleteId)
          );
          setConfirmDeleteId(null); // Close the confirmation dialog
        })
        .catch((error) => {
          console.log("Error deleting brand:", error);
        });
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null); // Close the confirmation dialog without deleting
  };

  return (
    <div className='manage-page'>
      <div className="d-flex justify-content-between">
        <p className='page-title'>Brands</p>
      </div>

      <Divider />
      <div className="page-content">
        <Table celled>
          <TableHeader>
            <TableRow>
              <TableHeaderCell style={{ width: '50px' }}>ID</TableHeaderCell>
              <TableHeaderCell colSpan={ 2 } className='d-flex align-items-center justify-content-between' style={{ width: 'calc(100% + 62px)' }}> 
                Name
                <Button
                  icon
                  labelPosition='left'
                  primary
                  size='small'
                  floated='right'
                  onClick={addBrandRow}
                >
                  <Icon name='add' /> Add Brand
                </Button>
              </TableHeaderCell>
            </TableRow>
          </TableHeader>


          <TableBody>
            {isAddingBrand && (
              <TableRow>
                <TableCell>New</TableCell>
                <TableCell>
                  <Input
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    onKeyDown={handleNewBrandKeyDown}
                    onBlur={saveNewBrand}
                    autoFocus
                  />
                </TableCell>
                <TableCell>
                  <Button
                    icon
                    color="green"
                    onClick={saveNewBrand}
                    size="small"
                  >
                    <Icon name="check" />
                  </Button>
                </TableCell>
              </TableRow>
            )}
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>{brand.id}</TableCell>
                <TableCell onDoubleClick={() => startEditing(brand.id, brand.name)}>
                  {editingBrandId === brand.id ? (
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => saveEdit(brand.id)}
                      onKeyDown={(e) => handleKeyDown(e, brand.id)}
                      autoFocus
                    />
                  ) : (
                    brand.name
                  )}
                </TableCell>
                <TableCell className="delete-column">
                  <Button
                    icon
                    color="red"
                    onClick={() => setConfirmDeleteId(brand.id)} // Open confirmation dialog
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
          header='Delete Brand'
          content={`Are you sure you want to delete this brand?`}
          onCancel={cancelDelete}
          onConfirm={deleteBrand}
        />
      </div>
    </div>
  );
}
