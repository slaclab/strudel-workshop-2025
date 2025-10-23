import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { createFileRoute } from '@tanstack/react-router';
import { useDataFromSource } from '../../hooks/useDataFromSource';

export const Route = createFileRoute('/eeip-reports/')({
  component: EEIPReportsList,
});

const columns: GridColDef[] = [
  {
    field: 'report_id',
    headerName: 'Report ID',
    width: 200,
    flex: 1,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 200,
    flex: 1,
  },
  {
    field: 'non_depot',
    headerName: 'Non Depot',
    width: 200,
    flex: 1,
  },
];

const inspectorColumns: GridColDef[] = [
  {
    field: 'person_id',
    headerName: 'Person ID',
    width: 120,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 180,
    flex: 1,
  },
  {
    field: 'sid_status',
    headerName: 'Sid Status',
    width: 120,
  },
  {
    field: 'short_desc',
    headerName: 'Short Desc',
    width: 150,
  },
  {
    field: 'course_num',
    headerName: 'Course Num',
    width: 120,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
  },
  {
    field: 'phone',
    headerName: 'Phone',
    width: 140,
  },
];

/**
 * List view of all EEIP reports.
 */
function EEIPReportsList() {
  const [searchAll, setSearchAll] = useState('');
  const [searchReportId, setSearchReportId] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchNonDepot, setSearchNonDepot] = useState('');
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [inspectorsModalOpen, setInspectorsModalOpen] = useState(false);
  const [addReportModalOpen, setAddReportModalOpen] = useState(false);

  // Form state for Add Report modal
  const [formData, setFormData] = useState({
    nickname: '',
    inspMethod: '',
    frameType: '',
    systemType: '',
    appliance: '',
    controller: '',
    machinery: '',
    prototype: '',
    comment: '',
    description: '',
    inspectionResults: '',
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  // CUSTOMIZE: list view data source
  const reportsData = useDataFromSource('dummy-data/eeip_reports.json');
  const inspectorsData = useDataFromSource('dummy-data/eeip_inspectors.json');

  const handleSearch = () => {
    if (!reportsData) {
      setFilteredRows([]);
      return;
    }

    let filtered = [...reportsData];

    // Filter by "all columns" search
    if (searchAll.trim()) {
      const searchLower = searchAll.toLowerCase();
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchLower)
        )
      );
    }

    // Filter by Report ID
    if (searchReportId.trim()) {
      const searchLower = searchReportId.toLowerCase();
      filtered = filtered.filter((row) =>
        String(row.report_id).toLowerCase().includes(searchLower)
      );
    }

    // Filter by Status
    if (searchStatus.trim()) {
      const searchLower = searchStatus.toLowerCase();
      filtered = filtered.filter((row) =>
        String(row.status).toLowerCase().includes(searchLower)
      );
    }

    // Filter by Non Depot
    if (searchNonDepot.trim()) {
      const searchLower = searchNonDepot.toLowerCase();
      filtered = filtered.filter((row) =>
        String(row.non_depot).toLowerCase().includes(searchLower)
      );
    }

    setFilteredRows(filtered);
  };

  const handleAddReport = () => {
    setAddReportModalOpen(true);
  };

  const handleCloseAddReport = () => {
    setAddReportModalOpen(false);
    // Reset form
    setFormData({
      nickname: '',
      inspMethod: '',
      frameType: '',
      systemType: '',
      appliance: '',
      controller: '',
      machinery: '',
      prototype: '',
      comment: '',
      description: '',
      inspectionResults: '',
    });
    setAttachments([]);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments(Array.from(event.target.files));
    }
  };

  const handleSubmitReport = () => {
    // TODO: Submit the form data to backend
    // formData contains all form fields
    // attachments contains uploaded files
    handleCloseAddReport();
  };

  const handleOpenInspectors = () => {
    setInspectorsModalOpen(true);
  };

  const handleCloseInspectors = () => {
    setInspectorsModalOpen(false);
  };

  // Initialize filtered rows when data loads
  useState(() => {
    if (reportsData) {
      setFilteredRows(reportsData);
    }
  });

  const displayRows =
    filteredRows.length > 0 ||
    searchAll ||
    searchReportId ||
    searchStatus ||
    searchNonDepot
      ? filteredRows
      : reportsData || [];

  return (
    <Container
      maxWidth="xl"
      sx={{
        marginBottom: 3,
        marginTop: 3,
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" component="h1">
            Electrical Equipment Inspection Program (EEIP) Reports
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonIcon />}
            onClick={handleOpenInspectors}
          >
            EEIP Inspectors
          </Button>
        </Stack>

        {/* Search Fields */}
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search All Columns"
                value={searchAll}
                onChange={(e) => setSearchAll(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Report ID"
                value={searchReportId}
                onChange={(e) => setSearchReportId(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Status"
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Non Depot"
                value={searchNonDepot}
                onChange={(e) => setSearchNonDepot(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1.5}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
              >
                Go
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={1.5}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddReport}
              >
                Add Report
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Data Table */}
        <Paper>
          <DataGrid
            rows={displayRows}
            getRowId={(row) => row.report_id}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            disableColumnSelector
            disableRowSelectionOnClick
            autoHeight
          />
        </Paper>
      </Stack>

      {/* Add Report Modal */}
      <Dialog
        open={addReportModalOpen}
        onClose={handleCloseAddReport}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Add EEIP Report</Typography>
            <IconButton onClick={handleCloseAddReport} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Nickname Dropdown */}
            <FormControl fullWidth>
              <InputLabel>Nickname</InputLabel>
              <Select
                value={formData.nickname}
                label="Nickname"
                onChange={(e) => handleFormChange('nickname', e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {/* Add nickname options here as needed */}
              </Select>
            </FormControl>

            {/* Insp Method Dropdown */}
            <FormControl fullWidth>
              <InputLabel>Insp Method</InputLabel>
              <Select
                value={formData.inspMethod}
                label="Insp Method"
                onChange={(e) => handleFormChange('inspMethod', e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Visual">Visual</MenuItem>
                <MenuItem value="Infrared">Infrared</MenuItem>
                <MenuItem value="Ultrasonic">Ultrasonic</MenuItem>
                <MenuItem value="Combined">Combined</MenuItem>
              </Select>
            </FormControl>

            {/* Frame Type and System Type */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Frame Type</InputLabel>
                  <Select
                    value={formData.frameType}
                    label="Frame Type"
                    onChange={(e) =>
                      handleFormChange('frameType', e.target.value)
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Type A">Type A</MenuItem>
                    <MenuItem value="Type B">Type B</MenuItem>
                    <MenuItem value="Type C">Type C</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>System Type</InputLabel>
                  <Select
                    value={formData.systemType}
                    label="System Type"
                    onChange={(e) =>
                      handleFormChange('systemType', e.target.value)
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Primary">Primary</MenuItem>
                    <MenuItem value="Secondary">Secondary</MenuItem>
                    <MenuItem value="Backup">Backup</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* 2x2 Radio Button Section */}
            <Paper sx={{ p: 2 }} variant="outlined">
              <Typography variant="subtitle2" gutterBottom>
                Equipment Classification
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <FormLabel>Appliance</FormLabel>
                    <RadioGroup
                      row
                      value={formData.appliance}
                      onChange={(e) =>
                        handleFormChange('appliance', e.target.value)
                      }
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <FormLabel>Controller</FormLabel>
                    <RadioGroup
                      row
                      value={formData.controller}
                      onChange={(e) =>
                        handleFormChange('controller', e.target.value)
                      }
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <FormLabel>Machinery</FormLabel>
                    <RadioGroup
                      row
                      value={formData.machinery}
                      onChange={(e) =>
                        handleFormChange('machinery', e.target.value)
                      }
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <FormLabel>Prototype</FormLabel>
                    <RadioGroup
                      row
                      value={formData.prototype}
                      onChange={(e) =>
                        handleFormChange('prototype', e.target.value)
                      }
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {/* Comment */}
            <TextField
              fullWidth
              label="Comment"
              multiline
              rows={2}
              value={formData.comment}
              onChange={(e) => handleFormChange('comment', e.target.value)}
            />

            {/* Description */}
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
            />

            {/* Inspection Results */}
            <TextField
              fullWidth
              label="Inspection Results"
              multiline
              rows={3}
              value={formData.inspectionResults}
              onChange={(e) =>
                handleFormChange('inspectionResults', e.target.value)
              }
            />

            {/* Attachments Upload */}
            <Paper sx={{ p: 2 }} variant="outlined">
              <Stack spacing={1}>
                <Typography variant="subtitle2">Attachments</Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadFileIcon />}
                >
                  Upload Files
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileUpload}
                  />
                </Button>
                {attachments.length > 0 && (
                  <Stack spacing={0.5}>
                    {attachments.map((file, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        color="text.secondary"
                      >
                        {file.name}
                      </Typography>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Paper>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseAddReport}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitReport}>
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* EEIP Inspectors Modal */}
      <Dialog
        open={inspectorsModalOpen}
        onClose={handleCloseInspectors}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">EEIP Inspectors</Typography>
            <IconButton onClick={handleCloseInspectors} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DataGrid
            rows={inspectorsData || []}
            getRowId={(row) => row.person_id}
            columns={inspectorColumns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableColumnSelector
            disableRowSelectionOnClick
            autoHeight
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
