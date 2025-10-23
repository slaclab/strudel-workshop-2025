import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

const STATE_OPTIONS = [
  'IN USE',
  'SPARE',
  'NEW',
  'MAINT',
  'READY',
  'SALVAGE',
  'RETIRED',
  'INACTIVE',
  'UNKNOWN',
  'TEST USE',
  'TESTER',
];

interface AddLocationDialogProps {
  open: boolean;
  onClose: () => void;
  equipmentId: string;
}

interface LocationFormData {
  state: string;
  location: string;
  locDate: Dayjs | null;
  parent: string;
}

export const AddLocationDialog: React.FC<AddLocationDialogProps> = ({
  open,
  onClose,
  equipmentId,
}) => {
  const [formData, setFormData] = useState<LocationFormData>({
    state: '',
    location: '',
    locDate: null,
    parent: '',
  });
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [parentOptions, setParentOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDepotData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/DEPOT (last year).csv');
        const csvText = await response.text();

        // Parse CSV
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');

        // Find the Location and ID column indices
        const locationIndex = headers.findIndex((h) => h.trim() === 'Location');
        const idIndex = headers.findIndex((h) => h.trim() === 'ID');

        const locations = new Set<string>();
        const ids = new Set<string>();

        // Extract unique locations and IDs
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const columns = lines[i].split(',');

          if (locationIndex !== -1 && columns[locationIndex]) {
            const location = columns[locationIndex].trim();
            if (location) {
              locations.add(location);
            }
          }

          if (idIndex !== -1 && columns[idIndex]) {
            const id = columns[idIndex].trim();
            if (id) {
              ids.add(id);
            }
          }
        }

        setLocationOptions(Array.from(locations).sort());
        setParentOptions(Array.from(ids).sort());
      } catch (error) {
        // Error loading data - options will remain empty
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadDepotData();
    }
  }, [open]);

  const handleSubmit = async () => {
    try {
      // Note: In a real app, this would POST to a backend
      // For now, we'll just show a success message
      alert(
        'Location record added successfully!\n\nIn a production app, this would save to the server.'
      );

      // Reset form and close
      setFormData({
        state: '',
        location: '',
        locDate: null,
        parent: '',
      });
      onClose();
    } catch (error) {
      alert('Error adding location record');
    }
  };

  const isFormValid = formData.state && formData.location && formData.locDate;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Location for {equipmentId}</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              select
              label="State"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              required
              fullWidth
            >
              {STATE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
              fullWidth
            >
              {locationOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Location Date"
                value={formData.locDate}
                onChange={(newValue) =>
                  setFormData({ ...formData, locDate: newValue })
                }
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>

            <TextField
              select
              label="Parent (Optional)"
              value={formData.parent}
              onChange={(e) =>
                setFormData({ ...formData, parent: e.target.value })
              }
              fullWidth
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {parentOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid || loading}
        >
          Add Location
        </Button>
      </DialogActions>
    </Dialog>
  );
};
