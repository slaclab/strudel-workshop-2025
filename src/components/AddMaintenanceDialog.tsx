import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface MaintenanceRecord {
  maintDate: string;
  repairType: string;
  reportedProblem: string;
  fix: string;
}

interface AddMaintenanceDialogProps {
  open: boolean;
  onClose: () => void;
  equipmentId: string;
  onSubmit: (record: MaintenanceRecord) => void;
}

export const AddMaintenanceDialog: React.FC<AddMaintenanceDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [maintenanceDate, setMaintenanceDate] = useState('');
  const [repairType, setRepairType] = useState('');
  const [reportedProblem, setReportedProblem] = useState('');
  const [fix, setFix] = useState('');

  const handleSubmit = () => {
    // Handle form submission
    const newRecord: MaintenanceRecord = {
      maintDate: maintenanceDate,
      repairType,
      reportedProblem,
      fix,
    };

    onSubmit(newRecord);

    // Reset form and close
    setMaintenanceDate('');
    setRepairType('');
    setReportedProblem('');
    setFix('');
    onClose();
  };

  const handleCancel = () => {
    // Reset form and close
    setMaintenanceDate('');
    setRepairType('');
    setReportedProblem('');
    setFix('');
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
        Add Maintenance Record
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {/* Maintenance Date */}
          <TextField
            fullWidth
            label="Maintenance Date*"
            type="date"
            value={maintenanceDate}
            onChange={(e) => setMaintenanceDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />

          {/* Repair Type */}
          <FormControl fullWidth>
            <InputLabel id="repair-type-label">Repair Type*</InputLabel>
            <Select
              labelId="repair-type-label"
              value={repairType}
              label="Repair Type*"
              onChange={(e) => setRepairType(e.target.value)}
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              <MenuItem value="INSPECT">Inspect</MenuItem>
              <MenuItem value="REPAIR">Repair</MenuItem>
              <MenuItem value="REPLACE">Replace</MenuItem>
              <MenuItem value="CALIBRATE">Calibrate</MenuItem>
              <MenuItem value="CLEAN">Clean</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </Select>
          </FormControl>

          {/* Reported Problem */}
          <TextField
            fullWidth
            label="Reported Problem*"
            value={reportedProblem}
            onChange={(e) => setReportedProblem(e.target.value)}
            variant="outlined"
            multiline
            rows={3}
            placeholder="Describe the problem or issue..."
          />

          {/* Fix/Solution */}
          <TextField
            fullWidth
            label="Fix/Solution*"
            value={fix}
            onChange={(e) => setFix(e.target.value)}
            variant="outlined"
            multiline
            rows={3}
            placeholder="Describe the solution or repair performed..."
          />
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
