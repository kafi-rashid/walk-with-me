import * as React from 'react';
import { useParams } from 'react-router-dom';
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
  Input,
  Menu,
  MenuItem
} from 'semantic-ui-react';
import useAxios from '../../../../shared/axios';

interface Subcategory {
  id: number;
  name: string;
  parentId: number;
}

export default function SubCategories(): React.JSX.Element {
  // Use React Router's useParams to get the parentId from the URL
  const { parentId } = useParams();
  const [subcategories, setSubcategories] = React.useState<Subcategory[]>([]);
  const [editingSubcategoryId, setEditingSubcategoryId] = React.useState<number | null>(null);
  const [editingName, setEditingName] = React.useState<string>('');
  const [newSubcategoryName, setNewSubcategoryName] = React.useState<string>('');
  const [isAddingSubcategory, setIsAddingSubcategory] = React.useState<boolean>(false);
  const axios = useAxios();

  // Fetch subcategories for the given parentId
  React.useEffect(() => {
    if (parentId) {
      axios.get(`/categories/${parentId}/sub-categories`)
        .then(({ data }) => {
          setSubcategories(data);
        })
        .catch((error) => {
          console.log("Error fetching subcategories:", error);
        });
    }
  }, [parentId]);

  const startEditing = (subcategoryId: number, currentName: string) => {
    setEditingSubcategoryId(subcategoryId);
    setEditingName(currentName);
  };

  const saveEdit = (subcategoryId: number) => {
    if (editingName.trim().length === 0) {
        setEditingSubcategoryId(null);
        setEditingName('');
        return;
    }
    axios.put(`/categories/${subcategoryId}`, { name: editingName, parentId })
      .then(() => {
        setSubcategories((prevSubcategories) =>
          prevSubcategories.map((subcategory) =>
            subcategory.id === subcategoryId ? { ...subcategory, name: editingName } : subcategory
          )
        );
        setEditingSubcategoryId(null);
        setEditingName('');
      })
      .catch((error) => {
        console.log("Error updating subcategory:", error);
        setEditingSubcategoryId(null);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent, subcategoryId: number) => {
    if (e.key === 'Enter') {
      saveEdit(subcategoryId);
    }
  };

  const addSubcategoryRow = () => {
    setIsAddingSubcategory(true);
    setNewSubcategoryName('');
  };

  const saveNewSubcategory = () => {
    if (newSubcategoryName.trim().length === 0) {
        setIsAddingSubcategory(false);
        return;
    }
    axios.post('/categories', { name: newSubcategoryName, parentId })
      .then(({ data }) => {
        setSubcategories((prevSubcategories) => [data, ...prevSubcategories]);
        setIsAddingSubcategory(false);
      })
      .catch((error) => {
        console.log("Error adding new subcategory:", error);
        setIsAddingSubcategory(false);
      });
  };

  const handleNewSubcategoryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveNewSubcategory();
    }
  };

  const deleteSubcategory = (subcategoryId: number) => {
    axios.delete(`/categories/${subcategoryId}`)
      .then(() => {
        setSubcategories(subcategories.filter(subcategory => subcategory.id !== subcategoryId));
      })
      .catch((error) => {
        console.log("Error deleting subcategory:", error);
      });
  };

  return (
    <div className='manage-page'>
      <div className="d-flex justify-content-between">
        <p className='page-title'>Sub Categories</p>
      </div>

      <Divider />
      <div className="page-content">
        <Table celled>
          <TableHeader>
            <TableRow>
              <TableHeaderCell style={{ width: '50px' }}>ID</TableHeaderCell>
              <TableHeaderCell colSpan={ 2 } className='d-flex align-items-center justify-content-between' style={{ width: subcategories.length > 0 ? 'calc(100% + 65px)' : '' }}> 
                Name
                <Button
                  icon
                  labelPosition='left'
                  primary
                  size='small'
                  floated='right'
                  onClick={addSubcategoryRow}
                >
                  <Icon name='add' /> Add Subcategory
                </Button>
              </TableHeaderCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isAddingSubcategory && (
              <TableRow>
                <TableCell>New</TableCell>
                <TableCell>
                  <Input
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    onKeyDown={handleNewSubcategoryKeyDown}
                    onBlur={saveNewSubcategory}
                    autoFocus
                  />
                </TableCell>
              </TableRow>
            )}
            {
                subcategories.map((subcategory) => (
                    <TableRow key={subcategory.id}>
                        <TableCell>{subcategory.id}</TableCell>
                        <TableCell onDoubleClick={() => startEditing(subcategory.id, subcategory.name)}>
                        {editingSubcategoryId === subcategory.id ? (
                            <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onBlur={() => saveEdit(subcategory.id)}
                            onKeyDown={(e) => handleKeyDown(e, subcategory.id)}
                            autoFocus
                            />
                        ) : (
                            subcategory.name
                        )}
                        </TableCell>
                        <TableCell style={{ width: '50px' }}>
                        <Button
                            icon
                            color='red'
                            onClick={() => deleteSubcategory(subcategory.id)}
                        >
                            <Icon name='trash' />
                        </Button>
                        </TableCell>
                    </TableRow>
                ))
            }
            {
                !isAddingSubcategory && subcategories.length === 0 && (
                    <TableRow>
                        <TableCell colSpan="2" className='text-center'>No sub-categories found for this category</TableCell>
                    </TableRow>
                )
            }
          </TableBody>

          <TableFooter fullWidth>
            <TableRow>
              <TableHeaderCell colSpan='7'>
                <Menu floated='right' pagination>
                  <MenuItem as='a' icon>
                    <Icon name='chevron left' />
                  </MenuItem>
                  <MenuItem as='a'>1</MenuItem>
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
