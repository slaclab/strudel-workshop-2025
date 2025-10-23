import { Box, Button, Container, Paper, Stack } from '@mui/material';
import { GridToolbar } from '@mui/x-data-grid';
import { PageHeader } from '../../../components/PageHeader';
import { SciDataGrid } from '../../../components/SciDataGrid';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCompareData } from '../-context/ContextProvider';
import { setSelectedRows } from '../-context/actions';
import { useState } from 'react';
import { BulkEditDialog } from '../../../components/BulkEditDialog';

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
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [addItemMode, setAddItemMode] = useState(false);

  const handleRowClick = (params: any) => {
    // Navigate to item detail page with the row data as search params
    navigate({
      to: '/playground/item-detail',
      search: { data: JSON.stringify(params.row) },
    });
  };

  const handleBulkEditClick = () => {
    setAddItemMode(false);
    setBulkEditOpen(true);
  };

  const handleAddItemClick = () => {
    setAddItemMode(true);
    setBulkEditOpen(true);
  };

  const handleBulkEditClose = () => {
    setBulkEditOpen(false);
    setAddItemMode(false);
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
              {/* Bulk Edit button - only enabled when items are selected */}
              {state.selectedRows.length === 0 && (
                <Button
                  variant="outlined"
                  disabled
                  data-testid="cpd-bulk-edit-button"
                >
                  Bulk Edit
                </Button>
              )}
              {state.selectedRows.length > 0 && (
                <Button
                  variant="contained"
                  data-testid="cpd-bulk-edit-button"
                  onClick={handleBulkEditClick}
                >
                  Bulk Edit ({state.selectedRows.length})
                </Button>
              )}
            </Box>
            <Box>
              {/* Add Item button - opens bulk edit dialog with blank fields */}
              <Button
                variant="contained"
                data-testid="cpd-add-item-button"
                onClick={handleAddItemClick}
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

      {/* Bulk Edit / Add Item Dialog */}
      <BulkEditDialog
        open={bulkEditOpen}
        onClose={handleBulkEditClose}
        selectedData={
          addItemMode
            ? undefined
            : state.data.filter((row) =>
                state.selectedRows.includes(row[state.dataIdField])
              )
        }
      />
    </Box>
  );
}
