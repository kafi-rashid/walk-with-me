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
  Confirm, // Import Confirm component
} from 'semantic-ui-react';
import useAxios from '../../../../shared/axios';
import { NavLink } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
}

export default function Categories(): React.JSX.Element {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [editingCategoryId, setEditingCategoryId] = React.useState<number | null>(null);
  const [editingName, setEditingName] = React.useState<string>('');
  const [newCategoryName, setNewCategoryName] = React.useState<string>('');
  const [isAddingCategory, setIsAddingCategory] = React.useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null); // State for confirmation
  const axios = useAxios();

  React.useEffect(() => {
    axios.get('/categories/primary-categories')
      .then(({ data }) => {
        setCategories(data);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }, []);

  const startEditing = (categoryId: number, currentName: string) => {
    setEditingCategoryId(categoryId);
    setEditingName(currentName);
  };

  const saveEdit = (categoryId: number) => {
    if (editingName.trim().length <= 0) {
      setEditingCategoryId(null);
      setEditingName('');
      return;
    }
    axios.put(`/categories/${categoryId}`, { name: editingName })
      .then(() => {
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === categoryId ? { ...category, name: editingName } : category
          )
        );
        setEditingCategoryId(null);
        setEditingName('');
      })
      .catch((error) => {
        console.log("Error updating category:", error);
        setEditingCategoryId(null);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent, categoryId: number) => {
    if (e.key === 'Enter') {
      saveEdit(categoryId);
    }
  };

  const addCategoryRow = () => {
    setIsAddingCategory(true);
    setNewCategoryName('');
  };

  const saveNewCategory = () => {
    if (newCategoryName.trim().length <= 0) {
      setIsAddingCategory(false);
      return;
    }
    axios.post('/categories', { name: newCategoryName })
      .then(({ data }) => {
        setCategories((prevCategories) => [data, ...prevCategories]);
        setIsAddingCategory(false);
      })
      .catch((error) => {
        console.log("Error adding new category:", error);
        setIsAddingCategory(false);
      });
  };

  const handleNewCategoryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveNewCategory();
    }
  };

  const deleteCategory = () => {
    if (confirmDeleteId !== null) {
      axios.delete(`/categories/${confirmDeleteId}`)
        .then(() => {
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== confirmDeleteId)
          );
          setConfirmDeleteId(null); // Close the confirmation dialog
        })
        .catch((error) => {
          console.log("Error deleting category:", error);
        });
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null); // Close the confirmation dialog without deleting
  };

  return (
    <div className='manage-page'>
      <div className="d-flex justify-content-between">
        <p className='page-title'>Categories</p>
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
                  onClick={addCategoryRow}
                >
                  <Icon name='add' /> Add Category
                </Button>
              </TableHeaderCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isAddingCategory && (
              <TableRow>
                <TableCell>New</TableCell>
                <TableCell>
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={handleNewCategoryKeyDown}
                    onBlur={saveNewCategory}
                    autoFocus
                  />
                </TableCell>
              </TableRow>
            )}
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell onDoubleClick={() => startEditing(category.id, category.name)}>
                  {
                    editingCategoryId === category.id ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={() => saveEdit(category.id)}
                        onKeyDown={(e) => handleKeyDown(e, category.id)}
                        autoFocus
                      />
                    ) :
                    <NavLink className='anchor' to={ '/admin/categories/' + category.id }>{ category.name }</NavLink>
                  }
                </TableCell>
                <TableCell style={{ width: '50px' }}>
                  <Button
                    icon
                    color="red"
                    onClick={() => setConfirmDeleteId(category.id)} // Open confirmation dialog
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
          header='Delete Category'
          content={`Are you sure you want to delete this category?`}
          onCancel={cancelDelete}
          onConfirm={deleteCategory}
        />
      </div>
    </div>
  );
}
