import { IconButton, Chip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SciDataGrid } from '../../../components/SciDataGrid';
import { User } from '../index';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
}) => {
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
      flex: 1,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (params) => {
        const colorMap = {
          Admin: 'error',
          User: 'primary',
          Viewer: 'default',
        } as const;
        return (
          <Chip
            label={params.value}
            color={colorMap[params.value as keyof typeof colorMap]}
            size="small"
          />
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        return (
          <Chip
            label={params.value}
            color={params.value === 'Active' ? 'success' : 'default'}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: 'lastLogin',
      headerName: 'Last Login',
      width: 150,
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 150,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              size="small"
              onClick={() => onEdit(params.row as User)}
              aria-label="edit user"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(params.row.id)}
              aria-label="delete user"
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <SciDataGrid
      rows={users}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10 },
        },
      }}
      pageSizeOptions={[5, 10, 25]}
      disableRowSelectionOnClick
      autoHeight
    />
  );
};
