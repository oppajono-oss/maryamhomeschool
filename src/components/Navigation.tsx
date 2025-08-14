import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  BottomNavigation, 
  BottomNavigationAction,
  Box,
  Stack
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimerIcon from '@mui/icons-material/Timer';
import BookIcon from '@mui/icons-material/Book';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import SchoolIcon from '@mui/icons-material/School';

interface NavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  onParentViewOpen: () => void;
  onFocusModeOpen: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentSection, 
  onSectionChange, 
  onParentViewOpen, 
  onFocusModeOpen 
}) => {
  return (
    <>
      {/* Top App Bar */}
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
            <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h5" component="div" color="primary" fontWeight="bold">
              MaryamHomeschool
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CenterFocusStrongIcon />}
              onClick={onFocusModeOpen}
            >
              Focus
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={onParentViewOpen}
            >
              Parent View
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Bottom Navigation */}
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
        <BottomNavigation
          value={currentSection}
          onChange={(_, newValue) => onSectionChange(newValue)}
          sx={{ 
            borderTop: 1, 
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}
        >
          <BottomNavigationAction
            label="Home"
            value="home"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label="Hari Ini"
            value="planner"
            icon={<CalendarTodayIcon />}
          />
          <BottomNavigationAction
            label="Timer"
            value="timer"
            icon={<TimerIcon />}
          />
          <BottomNavigationAction
            label="Journal"
            value="journal"
            icon={<BookIcon />}
          />
          <BottomNavigationAction
            label="Rewards"
            value="rewards"
            icon={<SettingsIcon />}
          />
        </BottomNavigation>
      </Box>
    </>
  );
};

export default Navigation;