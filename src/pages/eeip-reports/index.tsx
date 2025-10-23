import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { createFileRoute } from '@tanstack/react-router';
import { useDataFromSource } from '../../hooks/useDataFromSource';

export const Route = createFileRoute('/EEIP-reports/')({
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
    // TODO: Implement add report dialog
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
