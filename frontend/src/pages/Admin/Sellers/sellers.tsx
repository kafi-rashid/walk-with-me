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

interface User {
  id: number;
  name: string;
  registrationDate: string;
  email: string;
  approved: boolean;
  selected: boolean;
}

export default function Sellers(): React.JSX.Element {
  const [users, setUsers] = React.useState<User[]>([
    { id: 1, name: 'John Lilki', registrationDate: 'September 14, 2013', email: 'jhlilk22@yahoo.com', approved: false, selected: false },
    { id: 2, name: 'Jamie Harington', registrationDate: 'January 11, 2014', email: 'jamieharingonton@yahoo.com', approved: false, selected: false },
    { id: 3, name: 'Jill Lewis', registrationDate: 'May 11, 2014', email: 'jilsewris22@yahoo.com', approved: false, selected: false },
  ]);

  const approveRow = () => {
    console.log(users);
  };

  const toggleSelectRow = (id: number) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, selected: !user.selected } : user
    ));
  };

  const isAnyRowSelected = users.some(user => user.selected && !user.approved);

  return (
    <div className='manage-page'>
      <p className='page-title'>Seller Profiles</p>
      <Divider />
      <div className="page-content">
        <Table compact celled>
          <TableHeader>
            <TableRow>
              <TableHeaderCell />
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>E-mail address</TableHeaderCell>
              <TableHeaderCell>Signed Up At</TableHeaderCell>
              <TableHeaderCell>Approved</TableHeaderCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell collapsing>
                  <Checkbox 
                    checked={user.selected} 
                    onChange={() => toggleSelectRow(user.id)} 
                  />
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.registrationDate}</TableCell>
                <TableCell>{user.approved ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter fullWidth>
            <TableRow>
              <TableHeaderCell />
              <TableHeaderCell colSpan='5'>
                <Button
                  floated='right'
                  icon
                  labelPosition='left'
                  primary
                  size='small'
                >
                  <Icon name='user' /> Add Seller
                </Button>
                <Button 
                  size='small' 
                  onClick={ approveRow }
                  disabled={ !isAnyRowSelected }
                >
                  Approve
                </Button>
              </TableHeaderCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
