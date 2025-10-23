import React, { useState, useEffect } from 'react';
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

interface EditUserDialogProps {
  open: boolean;
  user: User;
  onClose: () => void;
  onSave: (user: User) => void;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  user,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<'Admin' | 'User' | 'Viewer'>(user.role);
  const [status, setStatus] = useState<'Active' | 'Inactive'>(user.status);

  // Update form when user prop changes
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setStatus(user.status);
  }, [user]);

  const handleSubmit = () => {
    if (name && email) {
      onSave({
        ...user,
        name,
        email,
        role,
        status,
      });
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setStatus(user.status);
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
        Edit User
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
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
