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
  Checkbox,
  Confirm
} from 'semantic-ui-react';
import useAxios from '../../../shared/axios';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  status: string;
  roles: { id: number, name: string }[];
  shippingAddress: { street: string, city: string, state: string, country: string };
  billingAddress: { street: string, city: string, state: string, country: string };
}

export default function Buyers(): React.JSX.Element {
  const [users, setUsers] = React.useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = React.useState<number[]>([]); // State to track selected users
  const [confirmApproveId, setConfirmApproveId] = React.useState<number | null>(null); // State for confirmation
  const axios = useAxios();

  React.useEffect(() => {
    axios.get('/users/role/buyer')
      .then(({ data }) => {
        setUsers(data);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }, []);

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter(id => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  const approveSelectedUsers = () => {
    if (selectedUsers.length === 0) {
      return;
    }
    // API call to approve selected users
    axios.post('/users/approve', selectedUsers)
      .then(() => {
        // Update user statuses after approval
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            selectedUsers.includes(user.id)
              ? { ...user, status: 'APPROVED' }
              : user
          )
        );
        setSelectedUsers([]); // Reset selected users after approval
      })
      .catch((error) => {
        console.log("Error approving users:", error);
      });
  };

  const rejectSelectedUsers = () => {
    if (selectedUsers.length === 0) {
      return;
    }
    // API call to reject selected users
    axios.post('/users/reject', selectedUsers)
      .then(() => {
        // Update user statuses after rejection
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            selectedUsers.includes(user.id)
              ? { ...user, status: 'REJECTED' }
              : user
          )
        );
        setSelectedUsers([]); // Reset selected users after rejection
      })
      .catch((error) => {
        console.log("Error rejecting users:", error);
      });
  };

  const getButtonState = () => {
    if (selectedUsers.length === 0) return { disabled: true, buttonText: '', action: () => {} };

    const selectedUserStatuses = users.filter(user => selectedUsers.includes(user.id)).map(user => user.status);

    const allPending = selectedUserStatuses.every(status => status === 'PENDING');
    const allApproved = selectedUserStatuses.every(status => status === 'APPROVED');
    const hasMixedStatus = !allPending && !allApproved;

    if (hasMixedStatus) {
      return { disabled: true, buttonText: 'Select Only Pending or Approved Users', action: () => {} };
    }

    if (allPending) {
      return { disabled: false, buttonText: 'Approve Selected Users', action: approveSelectedUsers };
    }

    if (allApproved) {
      return { disabled: false, buttonText: 'Reject Selected Users', action: rejectSelectedUsers };
    }

    return { disabled: true, buttonText: '', action: () => {} }; // Default disabled state
  };

  const { disabled, buttonText, action } = getButtonState();

  return (
    <div className='manage-page'>
      <div className="d-flex justify-content-between">
        <p className='page-title'>List of Buyers</p>
      </div>

      <Divider />
      <div className="page-content">
        <Table celled>
          <TableHeader>
            <TableRow>
              <TableHeaderCell style={{ width: '50px' }}></TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Phone</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Roles</TableHeaderCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell style={{ textAlign: 'center' }}>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                  />
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>{user.roles.map(role => role.name).join(', ')}</TableCell>
              </TableRow>
            ))}
          </TableBody>

          {
            buttonText &&
            <TableFooter fullWidth>
              <TableRow>
                <TableHeaderCell colSpan="7">
                  <Button
                    primary
                    floated="right"
                    onClick={action}
                    disabled={disabled}
                  >
                    {buttonText}
                  </Button>
                </TableHeaderCell>
              </TableRow>
            </TableFooter>
          }
        </Table>

        {/* Confirmation Dialog */}
        <Confirm
          open={confirmApproveId !== null}
          header='Approve Users'
          content={`Are you sure you want to approve the selected users?`}
          onCancel={() => setConfirmApproveId(null)} // Close the confirmation dialog
          onConfirm={approveSelectedUsers}
        />
      </div>
    </div>
  );
}
