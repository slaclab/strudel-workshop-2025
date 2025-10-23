import { Button, Container, Stack } from '@mui/material';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/playground/')({
  component: Playground,
});

/**
 * A blank canvas to test out content and components
 */
function Playground() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <Container
      maxWidth="xl"
      /**
       * Style STRUDEL and MUI components using the `sx` prop.
       */
      sx={{
        marginBottom: 3,
        marginTop: 3,
      }}
    >
      {/**
       * Add your own components here!
       * See MUI's component library: https://mui.com/material-ui/all-components/
       */}
      <h1>Playground</h1>
      <p>Testing commits</p>
      <Stack
        direction="column"
        spacing={3}
        sx={{
          alignItems: 'flex-start',
          marginBottom: 4,
        }}
      >
        <Link to="/playground/add-item-demo">
          <Button variant="contained" color="primary">
            View Add Item Dialog Demo
          </Button>
        </Link>
        <Link to="/playground/item-detail" search={{ data: undefined }}>
          <Button variant="contained" color="primary">
            View Item Detail Page
          </Button>
        </Link>
        <Link to="/monitor-activities/preventative-maintenance">
          <Button variant="contained" color="primary">
            View Preventative Maintenance
          </Button>
        </Link>
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: 'center',
        }}
      >
        <Button variant="contained" onClick={handleIncrement}>
          Increment
        </Button>
        <p>{count}</p>
      </Stack>
    </Container>
  );
}
