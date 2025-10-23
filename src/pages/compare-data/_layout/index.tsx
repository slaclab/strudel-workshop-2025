import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import { GridToolbar } from '@mui/x-data-grid';
import { PageHeader } from '../../../components/PageHeader';
import { SciDataGrid } from '../../../components/SciDataGrid';
import { AppLink } from '../../../components/AppLink';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCompareData } from '../-context/ContextProvider';
import { setSelectedRows } from '../-context/actions';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/compare-data/_layout/')({
  component: ScenarioList,
});

/**
 * List page to show comparable items in the compare-data Task Flow.
 * Items in this table are selectable and can be sent to the `<ScenarioComparison>`
 * page to be rendered in the comparison table.
 */
function ScenarioList() {
  const { state, dispatch } = useCompareData();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableNicknames, setAvailableNicknames] = useState<string[]>([]);
  const [selectedNickname, setSelectedNickname] = useState('');
  const [slacId, setSlacId] = useState('');
  const [serial, setSerial] = useState('');
  const [location, setLocation] = useState('');

  const handleRowClick = (params: any) => {
    // Navigate to item detail page with the row data as search params
    navigate({
      to: '/playground/item-detail',
      search: { data: JSON.stringify(params.row) },
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form fields
    setSelectedNickname('');
    setSlacId('');
    setSerial('');
    setLocation('');
  };

  const handleSave = () => {
    // TODO: Implement save logic here
    // Save logic would go here to persist the data
    handleCloseModal();
  };

  /**
   * Load available nicknames from the CSV file
   */
  useEffect(() => {
    const loadNicknames = async () => {
      try {
        const response = await fetch('/data/DEPOT (last year).csv');
        const csvText = await response.text();

        // Parse CSV properly handling quoted fields
        const lines = csvText.split('\n');
        const nicknames = new Set<string>();

        // Skip header row, start from index 1
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Parse CSV line with proper quote handling
          const columns = parseCSVLine(line);
          if (columns.length > 8) {
            const nickname = columns[8].trim();
            if (nickname) {
              nicknames.add(nickname);
            }
          }
        }

        // Convert Set to sorted array
        const sortedNicknames = Array.from(nicknames).sort();
        setAvailableNicknames(sortedNicknames);
      } catch (error) {
        // Error loading nicknames - fail silently
        setAvailableNicknames([]);
      }
    };

    loadNicknames();
  }, []);

  /**
   * Parse a CSV line handling quoted fields with commas
   */
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    // Push the last field
    result.push(current);

    return result;
  };

  return (
    <Box>
      <PageHeader
        // CUSTOMIZE: the title that displays at the top of the page
        pageTitle="DEPOT Items"
        // CUSTOMIZE: the subtitle that displays underneath the title
        description="Description of this app section"
        actions={
          <Stack direction="row">
            <Box>
              {/* CUSTOMIZE: the compare button text */}
              {state.selectedRows.length < 2 && (
                <Button
                  variant="outlined"
                  disabled
                  data-testid="cpd-compare-button"
                >
                  Compare scenarios
                </Button>
              )}
              {state.selectedRows.length > 1 && (
                <AppLink to="/compare-data/compare">
                  <Button variant="contained" data-testid="cpd-compare-button">
                    Compare scenarios ({state.selectedRows.length})
                  </Button>
                </AppLink>
              )}
            </Box>
            <Box>
              {/* CUSTOMIZE: the new button text */}
              <Button
                variant="contained"
                data-testid="cpd-new-button"
                onClick={handleOpenModal}
              >
                Add Item
              </Button>
            </Box>
          </Stack>
        }
        sx={{
          padding: 3,
          backgroundColor: 'white',
        }}
      />
      <Container
        maxWidth="xl"
        sx={{
          paddingTop: 3,
          paddingBottom: 3,
        }}
      >
        <Paper>
          <SciDataGrid
            rows={state.data}
            getRowId={(row) => row[state.dataIdField]}
            columns={state.columns}
            checkboxSelection
            rowSelectionModel={state.selectedRows}
            onRowSelectionModelChange={(rows) =>
              dispatch(setSelectedRows(rows))
            }
            onRowClick={handleRowClick}
            disableDensitySelector
            disableColumnFilter
            initialState={{
              pagination: { paginationModel: { page: 1, pageSize: 25 } },
            }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            sx={{
              '& .MuiDataGrid-toolbarContainer': {
                padding: 2,
                paddingBottom: 0,
              },
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
              },
            }}
          />
        </Paper>
      </Container>

      {/* Add Item Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>New Scenario</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ marginTop: 1 }}>
            <TextField
              label="SLAC ID"
              variant="outlined"
              fullWidth
              placeholder="Enter SLAC ID"
              value={slacId}
              onChange={(e) => setSlacId(e.target.value)}
            />
            <TextField
              label="Serial"
              variant="outlined"
              fullWidth
              placeholder="Enter Serial"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
            />
            <TextField
              select
              label="Nickname"
              variant="outlined"
              fullWidth
              value={selectedNickname}
              onChange={(e) => setSelectedNickname(e.target.value)}
              placeholder="Select Nickname"
            >
              {availableNicknames.map((nickname) => (
                <MenuItem key={nickname} value={nickname}>
                  {nickname}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Location"
              variant="outlined"
              fullWidth
              placeholder="Enter Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="warning">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
            Save Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
