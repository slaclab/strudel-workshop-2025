import { Box, Button, Container, Paper, Stack } from '@mui/material';
import { GridToolbar } from '@mui/x-data-grid';
import { PageHeader } from '../../../components/PageHeader';
import { SciDataGrid } from '../../../components/SciDataGrid';
import { AppLink } from '../../../components/AppLink';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCompareData } from '../-context/ContextProvider';
import { setSelectedRows } from '../-context/actions';

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

  const handleRowClick = (params: any) => {
    // Navigate to item detail page with the row data as search params
    navigate({
      to: '/playground/item-detail',
      search: { data: JSON.stringify(params.row) },
    });
  };

  return (
    <Box>
      <PageHeader
        // CUSTOMIZE: the title that displays at the top of the page
        pageTitle="Compare Data App"
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
              <AppLink to="/compare-data/new">
                {/* CUSTOMIZE: the new button text */}
                <Button variant="contained" data-testid="cpd-new-button">
                  Add Item
                </Button>
              </AppLink>
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
    </Box>
  );
}
