import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import {
  AppBar,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import { cleanPath } from '../utils/queryParams.utils';
import { AppLink } from './AppLink';
import { ImageWrapper } from './ImageWrapper';

/**
 * Top navigation bar component
 */
export const TopBar: React.FC = () => {
  return (
    <AppBar
      color="default"
      position="static"
      component="nav"
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid',
        borderBottomColor: 'grey.300',
        boxShadow: 'none',
      }}
    >
      <Toolbar>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            flexGrow: 1,
          }}
        >
          <AppLink to="/landing">
            <Button startIcon={<HomeIcon />} variant="outlined" size="small">
              All Pages
            </Button>
          </AppLink>
          <AppLink to="/">
            <ImageWrapper height={60}>
              <img src={cleanPath(`${import.meta.env.BASE_URL}/slac.png`)} />
            </ImageWrapper>
          </AppLink>
          <AppLink to="/">
            <Typography variant="h6" component="div" fontWeight="bold">
              DEPOT Prototype
            </Typography>
          </AppLink>
        </Stack>
        <IconButton size="large" edge="start" color="inherit">
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
