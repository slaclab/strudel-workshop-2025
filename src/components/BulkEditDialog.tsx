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
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';

interface BulkEditDialogProps {
  open: boolean;
  onClose: () => void;
  selectedData?: any[];
}

interface RowData {
  id: number;
  photo: File | null;
  nickname: string;
  slacId: string;
  model: string;
  manufacturer: string;
  location: string;
  state: string;
  shop: string;
  class: string;
  lastDate: string;
}

export const BulkEditDialog: React.FC<BulkEditDialogProps> = ({
  open,
  onClose,
  selectedData,
}) => {
  const [rows, setRows] = useState<RowData[]>([
    {
      id: 1,
      photo: null,
      nickname: '',
      slacId: '',
      model: '',
      manufacturer: '',
      location: '',
      state: '',
      shop: '',
      class: '',
      lastDate: '',
    },
  ]);

  // Populate rows when selectedData is provided
  useEffect(() => {
    if (selectedData && selectedData.length > 0) {
      const mappedRows = selectedData.map((item, index) => ({
        id: index + 1,
        photo: null,
        nickname: item.Nickname || '',
        slacId: item.ID || '',
        model: item.Model || '',
        manufacturer: item.Makername || '',
        location: item.Location || '',
        state: item.State || '',
        shop: item.Shop || '',
        class: item.Class || '',
        lastDate: item.LastDate || '',
      }));
      setRows(mappedRows);
    } else {
      // Reset to single empty row when no data selected (Add Item mode)
      setRows([
        {
          id: 1,
          photo: null,
          nickname: '',
          slacId: '',
          model: '',
          manufacturer: '',
          location: '',
          state: '',
          shop: '',
          class: '',
          lastDate: '',
        },
      ]);
    }
  }, [selectedData, open]);

  const handleAddRow = () => {
    const newRow: RowData = {
      id: rows.length + 1,
      photo: null,
      nickname: '',
      slacId: '',
      model: '',
      manufacturer: '',
      location: '',
      state: '',
      shop: '',
      class: '',
      lastDate: '',
    };
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (id: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleFieldChange = (
    id: number,
    field: keyof Omit<RowData, 'id' | 'photo'>,
    value: string
  ) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleSubmit = () => {
    // Handle form submission
    onClose();
  };

  const handleCancel = () => {
    // Reset form and close
    setRows([
      {
        id: 1,
        photo: null,
        nickname: '',
        slacId: '',
        model: '',
        manufacturer: '',
        location: '',
        state: '',
        shop: '',
        class: '',
        lastDate: '',
      },
    ]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Bulk Upload
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ overflowX: 'auto' }}>
          {/* Header Row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                '80px 150px 120px 150px 180px 150px 120px 120px 120px 120px 40px',
              gap: 1,
              mb: 2,
              minWidth: 1400,
            }}
          >
            <Typography variant="body2" fontWeight="500">
              Photo
            </Typography>
            <Typography variant="body2" fontWeight="500">
              Nickname*
            </Typography>
            <Typography variant="body2" fontWeight="500">
              ID*
            </Typography>
            <Typography variant="body2" fontWeight="500">
              Model
            </Typography>
            <Typography variant="body2" fontWeight="500">
              Manufacturer
            </Typography>
            <Typography variant="body2" fontWeight="500">
              Location
            </Typography>
            <Typography variant="body2" fontWeight="500">
              State
            </Typography>
            <Typography variant="body2" fontWeight="500">
              Shop*
            </Typography>
            <Typography variant="body2" fontWeight="500">
              Class
            </Typography>
            <Typography variant="body2" fontWeight="500">
              Last Date
            </Typography>
            <Box></Box>
          </Box>

          {/* Data Rows */}
          {rows.map((row, index) => (
            <Box
              key={row.id}
              sx={{
                display: 'grid',
                gridTemplateColumns:
                  '80px 150px 120px 150px 180px 150px 120px 120px 120px 120px 40px',
                gap: 1,
                mb: 2,
                minWidth: 1400,
                alignItems: 'center',
              }}
            >
              {/* Photo */}
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  bgcolor: 'grey.50',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                <ImageIcon sx={{ color: 'text.secondary', fontSize: 24 }} />
              </Box>

              {/* Nickname */}
              <FormControl fullWidth size="small">
                <Select
                  value={row.nickname}
                  onChange={(e) =>
                    handleFieldChange(row.id, 'nickname', e.target.value)
                  }
                  displayEmpty
                  sx={{ bgcolor: index === 0 ? 'primary.50' : 'white' }}
                >
                  <MenuItem value="">
                    <em style={{ color: '#999' }}>Select</em>
                  </MenuItem>
                  <MenuItem value="nickname1">Nickname 1</MenuItem>
                  <MenuItem value="nickname2">Nickname 2</MenuItem>
                  <MenuItem value="nickname3">Nickname 3</MenuItem>
                </Select>
              </FormControl>

              {/* SLAC ID */}
              <TextField
                fullWidth
                size="small"
                value={row.slacId}
                onChange={(e) =>
                  handleFieldChange(row.id, 'slacId', e.target.value)
                }
                sx={{ bgcolor: index === 0 ? 'primary.50' : 'white' }}
              />

              {/* Model */}
              <TextField
                fullWidth
                size="small"
                value={row.model}
                onChange={(e) =>
                  handleFieldChange(row.id, 'model', e.target.value)
                }
              />

              {/* Manufacturer */}
              <TextField
                fullWidth
                size="small"
                value={row.manufacturer}
                onChange={(e) =>
                  handleFieldChange(row.id, 'manufacturer', e.target.value)
                }
              />

              {/* Location */}
              <TextField
                fullWidth
                size="small"
                value={row.location}
                onChange={(e) =>
                  handleFieldChange(row.id, 'location', e.target.value)
                }
              />

              {/* State */}
              <TextField
                fullWidth
                size="small"
                value={row.state}
                onChange={(e) =>
                  handleFieldChange(row.id, 'state', e.target.value)
                }
              />

              {/* Shop */}
              <TextField
                fullWidth
                size="small"
                value={row.shop}
                onChange={(e) =>
                  handleFieldChange(row.id, 'shop', e.target.value)
                }
              />

              {/* Class */}
              <TextField
                fullWidth
                size="small"
                value={row.class}
                onChange={(e) =>
                  handleFieldChange(row.id, 'class', e.target.value)
                }
              />

              {/* Last Date */}
              <TextField
                fullWidth
                size="small"
                value={row.lastDate}
                onChange={(e) =>
                  handleFieldChange(row.id, 'lastDate', e.target.value)
                }
              />

              {/* Delete Button */}
              <IconButton
                size="small"
                onClick={() => handleDeleteRow(row.id)}
                disabled={rows.length === 1}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ))}

          {/* Add Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddRow}
            sx={{ mt: 2 }}
          >
            Add
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
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
