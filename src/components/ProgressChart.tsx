import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Box } from '@mui/material';

const ProgressChart: React.FC = () => {
  const studyLogEntries = useSelector((state: RootState) => state.study.studyLogEntries);

  // Calculate daily hours for the current week
  const getDailyHours = () => {
    const dailyHours = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Start from Monday

    studyLogEntries.forEach(entry => {
      const entryDate = new Date(entry.timestamp);
      const daysDiff = Math.floor((entryDate.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 0 && daysDiff < 7) {
        dailyHours[daysDiff] += entry.duration / 60; // Convert minutes to hours
      }
    });

    return dailyHours;
  };

  const data = getDailyHours();
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Box sx={{ width: '100%', height: 200 }}>
      <BarChart
        series={[
          {
            data,
            color: '#4CAF50'
          }
        ]}
        xAxis={[
          {
            data: labels,
            scaleType: 'band'
          }
        ]}
        yAxis={[
          {
            label: 'Hours'
          }
        ]}
        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
      />
    </Box>
  );
};

export default ProgressChart;