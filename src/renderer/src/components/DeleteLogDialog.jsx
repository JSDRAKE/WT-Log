import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
} from '@mui/material';
import { Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';

export default function DeleteLogDialog({ open, onClose, onDelete }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (open) {
      loadLogs();
    } else {
      // Reset state when dialog is closed
      setLogs([]);
      setError(null);
      setSelectedLog(null);
    }
  }, [open]);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const logsData = await window.electron.ipcRenderer.invoke('get-logs');
      setLogs(logsData);
    } catch (err) {
      console.error('Error loading logs:', err);
      setError('Error al cargar los logs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (log) => {
    setSelectedLog(log);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLog) return;

    try {
      setIsDeleting(true);
      await onDelete(selectedLog);
      // Refresh the logs list after deletion
      await loadLogs();
      setSelectedLog(null);
    } catch (err) {
      console.error('Error deleting log:', err);
      setError('Error al eliminar el log');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setSelectedLog(null);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)'
              : '#ffffff',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: theme.palette.error.dark,
          color: theme.palette.error.contrastText,
          textAlign: 'center',
          position: 'relative',
          pt: 4,
          pb: 2,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'inherit',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            mb: 1,
          }}
        >
          Eliminar Log
        </Typography>
        <Typography
          variant="body2"
          sx={{
            opacity: 0.9,
            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
            maxWidth: '80%',
          }}
        >
          Selecciona un log para eliminar
        </Typography>
      </Box>

      <DialogContent sx={{ py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 4 } }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
          >
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress size={24} />
          </Box>
        ) : logs.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{
              py: 3,
              fontSize: { xs: '0.9375rem', sm: '1rem' },
            }}
          >
            No hay logs existentes
          </Typography>
        ) : selectedLog ? (
          <Box>
            <Alert
              severity="warning"
              sx={{
                mb: 3,
                '& .MuiAlert-message': {
                  width: '100%',
                },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1.5 }}>
                {selectedLog.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: '0.875rem',
                  mb: 0.5,
                }}
              >
                {`Creado: ${new Date(selectedLog.createdAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}`}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: '0.875rem',
                  mb: 1.5,
                }}
              >
                {selectedLog.qsos ? selectedLog.qsos.length : 0} QSOs registrados
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'warning.dark' }}>
                ¿Estás seguro de que deseas eliminar este log?
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 'medium' }}>
                Esta acción no se puede deshacer.
              </Typography>
            </Alert>
            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
              <Button
                variant="outlined"
                onClick={handleCancelDelete}
                disabled={isDeleting}
                sx={{
                  textTransform: 'none',
                  minWidth: '100px',
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                startIcon={isDeleting ? <CircularProgress size={20} /> : <DeleteIcon />}
                sx={{
                  textTransform: 'none',
                  minWidth: '120px',
                }}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </Box>
          </Box>
        ) : (
          <Paper
            variant="outlined"
            sx={{
              maxHeight: '50vh',
              overflow: 'auto',
              borderRadius: 1,
              borderColor: theme.palette.divider,
              bgcolor:
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            }}
          >
            <List disablePadding>
              {logs.map((log) => (
                <ListItem
                  key={log.filePath}
                  divider
                  sx={{
                    '&:hover': {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 500,
                          fontSize: { xs: '0.9375rem', sm: '1rem' },
                        }}
                      >
                        {log.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                          }}
                        >
                          {new Date(log.createdAt).toLocaleString()}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                          }}
                        >
                          {log.qsos?.length || 0} QSOs registrados
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="eliminar"
                      onClick={() => handleDeleteClick(log)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </DialogContent>

      {!selectedLog && (
        <DialogActions sx={{ px: { xs: 2, sm: 4 }, pb: { xs: 2, sm: 3 }, pt: 0 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              minWidth: '120px',
              textTransform: 'none',
              fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              borderColor:
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
              '&:hover': {
                borderColor:
                  theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

DeleteLogDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
