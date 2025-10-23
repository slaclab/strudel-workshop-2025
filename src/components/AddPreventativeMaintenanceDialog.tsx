import React, { useState, useMemo } from 'react';
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Stack,
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useAppState } from '../context/ContextProvider';
import { addPreventativeMaintenance } from '../context/actions';
import { useDataFromSource } from '../hooks/useDataFromSource';

interface AddPreventativeMaintenanceDialogProps {
  open: boolean;
  onClose: () => void;
}

interface ItemOption {
  id: string;
  name: string;
  label: string;
}

export const AddPreventativeMaintenanceDialog: React.FC<
  AddPreventativeMaintenanceDialogProps
> = ({ open, onClose }) => {
  const { dispatch } = useAppState();
  const depotData = useDataFromSource('data/DEPOT (last year).csv');
  const [item, setItem] = useState<ItemOption | null>(null);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [repeatNumber, setRepeatNumber] = useState('2');
  const [repeatUnit, setRepeatUnit] = useState('Week');
  const [startDate, setStartDate] = useState('');
  const [dateDue, setDateDue] = useState('');
  const [personResponsible, setPersonResponsible] = useState('');
  const [instructions, setInstructions] = useState('');

  // Create item options from DEPOT data
  const itemOptions = useMemo<ItemOption[]>(() => {
    if (!depotData) return [];

    return depotData.map((depotItem: any) => ({
      id: depotItem.ID,
      name: depotItem.Nickname || depotItem.ID,
      label: `${depotItem.ID} | ${depotItem.Nickname || 'Unknown'}`,
    }));
  }, [depotData]);

  const handleSubmit = () => {
    // Validate required fields
    if (!item || !title || !startDate || !dateDue || !personResponsible) {
      alert('Please fill in all required fields');
      return;
    }

    // Generate a unique ID
    const id = `pm-${Date.now()}`;

    // Create the new maintenance item
    const newItem = {
      id,
      title,
      item_id: item.id,
      item_name: item.name,
      status,
      repeat_number: parseInt(repeatNumber),
      repeat_unit: repeatUnit,
      start_date: startDate,
      next_due_date: dateDue,
      person_responsible: personResponsible,
      instructions,
    };

    // Dispatch the action to add the item
    dispatch(addPreventativeMaintenance(newItem));

    // Reset form and close
    handleCancel();
  };

  const handleCancel = () => {
    // Reset form and close
    setItem(null);
    setTitle('');
    setStatus('ACTIVE');
    setRepeatNumber('2');
    setRepeatUnit('Week');
    setStartDate('');
    setDateDue('');
    setPersonResponsible('');
    setInstructions('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
        }}
      >
        Add Preventative Maintenance
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          {/* Item */}
          <Autocomplete
            value={item}
            onChange={(event, newValue) => {
              setItem(newValue);
            }}
            options={itemOptions}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Item"
                required
                placeholder="Search for an item..."
              />
            )}
            fullWidth
          />

          {/* Title */}
          <TextField
            fullWidth
            label="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
          />

          {/* Status */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Status
            </Typography>
            <ToggleButtonGroup
              value={status}
              exclusive
              onChange={(e, newStatus) => {
                if (newStatus !== null) {
                  setStatus(newStatus);
                }
              }}
              fullWidth
              size="small"
            >
              <ToggleButton value="ACTIVE">ACTIVE</ToggleButton>
              <ToggleButton value="CANCEL">CANCEL</ToggleButton>
              <ToggleButton value="COMPLETE">COMPLETE</ToggleButton>
              <ToggleButton value="INACTIVE">INACTIVE</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Repeats every */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Repeats every
            </Typography>
            <Stack direction="row" spacing={2}>
              <FormControl sx={{ minWidth: 120 }}>
                <Select
                  value={repeatNumber}
                  onChange={(e) => setRepeatNumber(e.target.value)}
                  size="small"
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                  <MenuItem value="6">6</MenuItem>
                  <MenuItem value="12">12</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <Select
                  value={repeatUnit}
                  onChange={(e) => setRepeatUnit(e.target.value)}
                  size="small"
                >
                  <MenuItem value="Day">Day</MenuItem>
                  <MenuItem value="Week">Week</MenuItem>
                  <MenuItem value="Month">Month</MenuItem>
                  <MenuItem value="Year">Year</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>

          {/* Start Date */}
          <TextField
            fullWidth
            label="Start Date"
            required
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Date Due */}
          <TextField
            fullWidth
            label="Date Due"
            required
            type="date"
            value={dateDue}
            onChange={(e) => setDateDue(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Person(s) Responsible */}
          <FormControl fullWidth required>
            <InputLabel id="person-responsible-label">
              Person(s) Responsible
            </InputLabel>
            <Select
              labelId="person-responsible-label"
              value={personResponsible}
              label="Person(s) Responsible"
              onChange={(e) => setPersonResponsible(e.target.value)}
              required
            >
              <MenuItem value="">
                <em>
                  this will be a multi-select dropdown of users (+ mailing
                  lists?)
                </em>
              </MenuItem>
              <MenuItem value="user1">User 1</MenuItem>
              <MenuItem value="user2">User 2</MenuItem>
              <MenuItem value="user3">User 3</MenuItem>
            </Select>
          </FormControl>

          {/* Instructions */}
          <TextField
            fullWidth
            label="Instructions"
            multiline
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            variant="outlined"
          />

          {/* Attachments */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Attachments
            </Typography>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 1,
                padding: 4,
                textAlign: 'center',
                color: 'text.secondary',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <AttachFileIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body2">
                Drop files here to upload, or browse
              </Typography>
            </Box>
          </Box>
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
