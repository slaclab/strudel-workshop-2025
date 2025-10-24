import { useState, useMemo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Chip,
  Container,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridComparatorFn } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDataFromSource } from '../../hooks/useDataFromSource';
import { AddPreventativeMaintenanceDialog } from '../../components/AddPreventativeMaintenanceDialog';
import { useAppState } from '../../context/ContextProvider';

export const Route = createFileRoute('/preventative-maintenance/')({
  component: PreventativeMaintenanceList,
});

const dateComparator: GridComparatorFn<string> = (v1, v2) => {
  return dayjs(v1).isAfter(dayjs(v2)) ? 1 : 0;
};

// Status chip colors
const getStatusColor = (
  status: string
): 'success' | 'error' | 'default' | 'warning' => {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'COMPLETE':
      return 'default';
    case 'CANCEL':
      return 'error';
    case 'INACTIVE':
      return 'warning';
    default:
      return 'default';
  }
};

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    width: 200,
    flex: 1,
  },
  {
    field: 'item_id',
    headerName: 'Item',
    width: 180,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={getStatusColor(params.value)}
        size="small"
      />
    ),
  },
  {
    field: 'repeat_schedule',
    headerName: 'Repeats Every',
    width: 150,
    valueGetter: (value, row) => {
      return `${row.repeat_number} ${row.repeat_unit}${row.repeat_number > 1 ? 's' : ''}`;
    },
  },
  {
    field: 'next_due_date',
    headerName: 'Next Due Date',
    sortComparator: dateComparator,
    width: 150,
    valueFormatter: (value) => {
      return value ? dayjs(value).format('MMM D, YYYY') : '';
    },
  },
  {
    field: 'last_completed',
    headerName: 'Last Completed',
    sortComparator: dateComparator,
    width: 150,
    valueFormatter: (value) => {
      return value ? dayjs(value).format('MMM D, YYYY') : 'Never';
    },
  },
  {
    field: 'person_responsible',
    headerName: 'Person Responsible',
    width: 180,
  },
];

/**
 * List view of all preventative maintenance instances.
 */
function PreventativeMaintenanceList() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    itemId: string;
  } | null>(null);
  const dummyData = useDataFromSource(
    'dummy-data/preventative_maintenance.json'
  );
  // Load DEPOT CSV data for item lookups
  const depotData = useDataFromSource('data/DEPOT (last year).csv');
  const { state } = useAppState();
  const navigate = useNavigate();

  // Combine dummy data with context data
  const maintenanceData = useMemo(() => {
    const dummy = dummyData || [];
    const contextItems = state.preventativeMaintenanceItems || [];
    return [...dummy, ...contextItems];
  }, [dummyData, state.preventativeMaintenanceItems]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const row = target.closest('[data-id]');
    if (row) {
      const itemId = row.getAttribute('data-id');
      if (itemId) {
        setContextMenu({
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
          itemId,
        });
      }
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleOpenItemDetails = () => {
    if (contextMenu) {
      // Find the maintenance item that was right-clicked
      const maintenanceItem = maintenanceData.find(
        (item) => item.id === contextMenu.itemId
      );

      if (maintenanceItem && maintenanceItem.item_id && depotData) {
        // Find the matching item in the DEPOT data using useDataFromSource
        const item = depotData.find(
          (depotItem: any) => depotItem.ID === maintenanceItem.item_id
        );

        if (item) {
          // Navigate with the item data
          navigate({
            to: '/compare-data/item-detail',
            search: { data: JSON.stringify(item) },
          });
          handleCloseContextMenu();
          return;
        }
      }

      // Fallback: navigate with empty data if item not found
      navigate({
        to: '/compare-data/item-detail',
        search: { data: JSON.stringify({}) },
      });
      handleCloseContextMenu();
    }
  };

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
            Preventative Maintenance
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Add Maintenance
          </Button>
        </Stack>
        <Paper onContextMenu={handleContextMenu}>
          <DataGrid
            rows={maintenanceData || []}
            getRowId={(row) => row.id}
            columns={columns}
            initialState={{
              sorting: {
                sortModel: [{ field: 'next_due_date', sort: 'asc' }],
              },
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableColumnSelector
            disableRowSelectionOnClick
            autoHeight
            sx={{
              '& .MuiDataGrid-row:hover': {
                cursor: 'pointer',
              },
            }}
          />
        </Paper>
        <Menu
          open={contextMenu !== null}
          onClose={handleCloseContextMenu}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem onClick={handleOpenItemDetails}>Open Item Details</MenuItem>
        </Menu>
      </Stack>

      <AddPreventativeMaintenanceDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
      />
    </Container>
  );
}
