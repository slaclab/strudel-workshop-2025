import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  IconButton,
  Tabs,
  Tab,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  AvatarGroup,
  Stack,
} from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BuildIcon from '@mui/icons-material/Build';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';

export const Route = createFileRoute('/playground/item-detail')({
  component: ItemDetail,
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`detail-tabpanel-${index}`}
      aria-labelledby={`detail-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function ItemDetail() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Stub data
  const itemDetails = {
    slacId: 'RACK14',
    nickname: 'NODENAME-LOGICAL',
    maker: 'SLAC NATIONAL ACCELERATOR LAB',
    model: 'NODENAME',
    revision: '',
    serial: 'RACK14',
    caterShop: 'NODENAME-LOGICAL',
    subsystem: 'RACK14',
    drawing: '',
  };

  const attachments = [
    { id: 1, name: 'document1.pdf' },
    { id: 2, name: 'document2.pdf' },
  ];

  const locations = [
    {
      state: 'IN USE',
      location: 'B02 - S20 20-5B',
      locDate: '06/24/16',
      parent: 'RFS 20-5B',
    },
    {
      state: 'IN USE',
      location: 'B02 - S20 20-5B',
      locDate: '06/24/16',
      parent: 'RFS 20-5B',
    },
  ];

  const maintenanceRecords = [
    {
      maintDate: '09/04/15',
      repairType: 'INSPECT',
      reportedProblem: 'Found resistors R18, R31, R111 are wrong value',
      fix: 'Replaced R18, R31, R111 = 100K. Replaced C20',
    },
    {
      maintDate: '09/04/15',
      repairType: 'INSPECT',
      reportedProblem: 'Found resistors R18, R31, R111 are wrong value',
      fix: 'Replaced R18, R31, R111 = 100K. Replaced C20',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            RACK 14
          </Typography>
          <Chip
            label="CUE Risk"
            color="primary"
            variant="outlined"
            size="small"
          />
          <Chip label="EEIP" variant="outlined" size="small" />
        </Stack>
      </Box>

      {/* Main Content Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr 300px',
          gap: 3,
          mb: 4,
        }}
      >
        {/* Left Column - Images */}
        <Box>
          <Card
            sx={{
              width: '100%',
              height: 300,
              bgcolor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Typography color="text.secondary">No Image</Typography>
          </Card>
          <Stack direction="row" spacing={1}>
            <Card
              sx={{
                width: 70,
                height: 70,
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
            <Card
              sx={{
                width: 70,
                height: 70,
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <AddIcon color="action" />
            </Card>
          </Stack>
        </Box>

        {/* Center Column - Details */}
        <Box>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Details" />
            <Tab label="Additional Info" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <Stack spacing={2}>
              <DetailRow label="SLAC ID" value={itemDetails.slacId} />
              <DetailRow label="Nickname" value={itemDetails.nickname} />
              <DetailRow label="Maker" value={itemDetails.maker} />
              <DetailRow label="Model" value={itemDetails.model} />
              <DetailRow label="Revision" value={itemDetails.revision} />
              <DetailRow label="Serial" value={itemDetails.serial} />
              <DetailRow label="Cater Shop" value={itemDetails.caterShop} />
              <DetailRow label="Subsystem" value={itemDetails.subsystem} />
              <DetailRow label="Drawing" value={itemDetails.drawing} />
            </Stack>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Typography color="text.secondary">
              Additional information content here
            </Typography>
          </TabPanel>
        </Box>

        {/* Right Column - Attachments */}
        <Box>
          <Box
            sx={{
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="h6">Attachments</Typography>
              <IconButton size="small">
                <AddIcon />
              </IconButton>
            </Stack>
            <Stack spacing={2}>
              {attachments.map((attachment) => (
                <Stack
                  key={attachment.id}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <InsertDriveFileIcon color="action" />
                  <Box sx={{ flex: 1 }}>
                    <Button size="small">View</Button>
                    <Button size="small" color="error">
                      Delete
                    </Button>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Location Section */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <LocationOnIcon />
            <Typography variant="h6">Location</Typography>
          </Stack>
          <Button startIcon={<OpenInNewIcon />} size="small">
            View Profile
          </Button>
        </Stack>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>State</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Loc Date</TableCell>
                <TableCell>Parent</TableCell>
                <TableCell width={50}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locations.map((location, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Chip label={location.state} color="success" size="small" />
                  </TableCell>
                  <TableCell>{location.location}</TableCell>
                  <TableCell>{location.locDate}</TableCell>
                  <TableCell>{location.parent}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button startIcon={<AddIcon />} size="small">
            Add Location
          </Button>
        </Box>
      </Card>

      {/* Maintenance Section */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <BuildIcon />
            <Typography variant="h6">Maintenance</Typography>
          </Stack>
          <Button startIcon={<OpenInNewIcon />} size="small" color="primary">
            View Scheduled
          </Button>
        </Stack>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Maint Date</TableCell>
                <TableCell>Repair Type</TableCell>
                <TableCell>
                  Reported Problem
                  <IconButton size="small">
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell>
                  Fix
                  <IconButton size="small">
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell width={50}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {maintenanceRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.maintDate}</TableCell>
                  <TableCell>{record.repairType}</TableCell>
                  <TableCell>{record.reportedProblem}</TableCell>
                  <TableCell>{record.fix}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button startIcon={<AddIcon />} size="small">
            Add Maintenance
          </Button>
        </Box>
      </Card>

      {/* Footer */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}
      >
        <Typography variant="body2" color="text.secondary">
          Modified By: Minh Vu 11/09/2021 13:46
        </Typography>
        <AvatarGroup>
          <Avatar sx={{ bgcolor: 'success.main', width: 40, height: 40 }}>
            J
          </Avatar>
          <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
            M
          </Avatar>
        </AvatarGroup>
        <Typography variant="body2" color="text.secondary">
          Created By: Thuy Vu 06/05/2019 08:30
        </Typography>
      </Stack>
    </Container>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <Stack direction="row" spacing={2}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ minWidth: 120, fontWeight: 500 }}
      >
        {label}
      </Typography>
      <Typography variant="body2">{value || '-'}</Typography>
    </Stack>
  );
}
