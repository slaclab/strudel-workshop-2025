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
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';

interface AddItemDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AddItemDialog: React.FC<AddItemDialogProps> = ({
  open,
  onClose,
}) => {
  const [nickname, setNickname] = useState('');
  const [slacId, setSlacId] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = () => {
    // Handle form submission
    onClose();
  };

  const handleCancel = () => {
    // Reset form and close
    setNickname('');
    setSlacId('');
    setSerialNumber('');
    setLocation('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Add Item
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {/* Photo Upload */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Photo
            </Typography>
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                padding: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.secondary',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ImageIcon fontSize="small" />
              <Typography variant="body2">Choose an image...</Typography>
            </Box>
          </Box>

          {/* Nickname */}
          <FormControl fullWidth>
            <InputLabel id="nickname-label">Nickname*</InputLabel>
            <Select
              labelId="nickname-label"
              value={nickname}
              label="Nickname*"
              onChange={(e) => setNickname(e.target.value)}
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              <MenuItem value="nickname1">Nickname 1</MenuItem>
              <MenuItem value="nickname2">Nickname 2</MenuItem>
              <MenuItem value="nickname3">Nickname 3</MenuItem>
            </Select>
          </FormControl>

          {/* SLAC ID */}
          <TextField
            fullWidth
            label="SLAC ID*"
            value={slacId}
            onChange={(e) => setSlacId(e.target.value)}
            variant="outlined"
          />

          {/* Serial Number */}
          <TextField
            fullWidth
            label="Serial Number*"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            variant="outlined"
          />

          {/* Location */}
          <FormControl fullWidth>
            <InputLabel id="location-label">Location</InputLabel>
            <Select
              labelId="location-label"
              value={location}
              label="Location"
              onChange={(e) => setLocation(e.target.value)}
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              <MenuItem value="building15">Building 15</MenuItem>
              <MenuItem value="building34">Building 34</MenuItem>
              <MenuItem value="building35">Building 35</MenuItem>
              <MenuItem value="building52">Building 52</MenuItem>
              <MenuItem value="building53">Building 53</MenuItem>
              <MenuItem
                value=""
                disabled
                sx={{ color: 'primary.main', fontSize: '0.875rem' }}
              >
                + Add new building
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCancel} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
