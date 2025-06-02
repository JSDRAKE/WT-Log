import React from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

LogList.propTypes = {
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
  logs: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default function LogList({ logs = [], loading = false, error = null }) {
  // Theme is used for future styling consistency

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">Error al cargar los logs: {error}</Typography>
      </Box>
    );
  }

  if (logs.length === 0) {
    return (
      <Box p={2}>
        <Typography color="text.secondary" align="center">
          No hay logs existentes
        </Typography>
      </Box>
    );
  }

  return (
    <List dense disablePadding>
      {logs.map((log, index) => (
        <React.Fragment key={log.id || index}>
          <ListItem
            key={log.filePath}
            sx={{
              padding: '8px 16px',
              '&:hover': {
                backgroundColor: 'action.hover',
                cursor: 'default',
              },
            }}
          >
            <ListItemText
              primary={
                <Typography variant="subtitle1" noWrap>
                  {log.name}
                </Typography>
              }
              secondary={
                <>
                  {log.createdAt && (
                    <Typography component="span" variant="caption" color="text.secondary">
                      Creado: {format(new Date(log.createdAt), 'PPpp', { locale: es })}
                    </Typography>
                  )}
                  <Typography component="span" variant="caption" color="text.secondary">
                    {log.qsos?.length || 0} QSOs registrados
                  </Typography>
                </>
              }
              secondaryTypographyProps={{ component: 'div' }}
            />
          </ListItem>
          {index < logs.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
}
