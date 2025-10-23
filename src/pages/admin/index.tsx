import { Box, Button, Paper, Stack } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { UserTable } from './-components/UserTable';
import { AddUserDialog } from './-components/AddUserDialog';
import { EditUserDialog } from './-components/EditUserDialog';

export const Route = createFileRoute('/admin/')({
  component: AdminPage,
});

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Viewer';
  status: 'Active' | 'Inactive';
  lastLogin?: string;
  createdAt: string;
}

/**
 * Admin page for user management.
 * Displays a list of users and allows adding, editing, and managing user accounts.
 */
function AdminPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2025-10-23',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'User',
      status: 'Active',
      lastLogin: '2025-10-22',
      createdAt: '2024-02-20',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'Viewer',
      status: 'Inactive',
      lastLogin: '2025-09-15',
      createdAt: '2024-03-10',
    },
  ]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleAddUser = (
    newUser: Omit<User, 'id' | 'createdAt' | 'lastLogin'>
  ) => {
    const user: User = {
      ...newUser,
      id: String(users.length + 1),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, user]);
    setAddDialogOpen(false);
  };

  const handleEditUser = (updatedUser: User) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleOpenEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  return (
    <Box>
      <PageHeader
        pageTitle="User Management"
        description="Manage user accounts, roles, and permissions"
        sx={{
          marginBottom: 2,
          padding: 2,
        }}
        actions={
          <Stack direction="row">
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setAddDialogOpen(true)}
              >
                Add User
              </Button>
            </Box>
          </Stack>
        }
      />
      <Paper
        elevation={0}
        sx={{
          padding: 2,
        }}
      >
        <UserTable
          users={users}
          onEdit={handleOpenEditDialog}
          onDelete={handleDeleteUser}
        />
      </Paper>

      <AddUserDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddUser}
      />

      {selectedUser && (
        <EditUserDialog
          open={editDialogOpen}
          user={selectedUser}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedUser(null);
          }}
          onSave={handleEditUser}
        />
      )}
    </Box>
  );
}
