import { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { AddItemDialog } from '../../components/AddItemDialog';

export const Route = createFileRoute('/playground/add-item-demo')({
  component: AddItemDemo,
});

function AddItemDemo() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Add Item Dialog Demo
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Click the button below to open the Add Item dialog
        </Typography>
        <Button variant="contained" size="large" onClick={handleOpen}>
          Open Add Item Dialog
        </Button>
      </Box>

      <AddItemDialog open={open} onClose={handleClose} />
    </Container>
  );
}
