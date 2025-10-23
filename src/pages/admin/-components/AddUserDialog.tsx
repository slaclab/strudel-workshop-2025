import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  Box,
  FormControl,
  InputLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { User } from '../index';

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => void;
}

export const AddUserDialog: React.FC<AddUserDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'User' | 'Viewer'>('User');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const handleSubmit = () => {
    if (name && email) {
      onAdd({
        name,
        email,
        role,
        status,
      });
      handleReset();
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setRole('User');
    setStatus('Active');
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Add New User
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            fullWidth
            label="Name*"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            required
          />

          <TextField
            fullWidth
            label="Email*"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            required
          />

          <FormControl fullWidth>
            <InputLabel id="role-label">Role*</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              label="Role*"
              onChange={(e) => setRole(e.target.value as User['role'])}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Viewer">Viewer</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="status-label">Status*</InputLabel>
            <Select
              labelId="status-label"
              value={status}
              label="Status*"
              onChange={(e) => setStatus(e.target.value as User['status'])}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCancel} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!name || !email}
        >
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
};
