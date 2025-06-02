import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  IconButton,
  Divider,
  Paper,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import LogList from './LogList';
import { useTheme } from '@mui/material/styles';

export default function NewLogDialog({ open, onClose, onSave }) {
  const [logName, setLogName] = useState('');
  const [error, setError] = useState('');
  const [existingLogs, setExistingLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [logsError, setLogsError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    if (open) {
      loadLogs();
    } else {
      setLogName('');
      setError('');
    }
  }, [open]);

  const loadLogs = async () => {
    try {
      setIsLoadingLogs(true);
      setLogsError(null);
      const logs = await window.electron.ipcRenderer.invoke('get-logs');
      setExistingLogs(logs);
    } catch (err) {
      console.error('Error loading logs:', err);
      setLogsError('Error al cargar los logs');
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const checkLogExists = async (name) => {
    try {
      return await window.electron.ipcRenderer.invoke('log-exists', name);
    } catch (err) {
      console.error('Error checking log existence:', err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = logName.trim();
    if (!name) {
      setError('Por favor ingresa un nombre para el log');
      return;
    }

    if (name.length > 25) {
      setError('El nombre no puede tener más de 25 caracteres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check if log with this name already exists
      const exists = await checkLogExists(name);
      if (exists) {
        setError('Ya existe un log con ese nombre');
        return;
      }

      await onSave({ name });
      await loadLogs(); // Refresh the list after creating a new log
      setLogName('');
      onClose(); // Close the modal after successful creation
    } catch (err) {
      setError(err.message || 'Error al crear el log');
    } finally {
      setIsLoading(false);
    }
  };

  // Log loading is now handled by the parent component
  // through the onSave callback

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
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          position: 'relative',
        }}
      >
        <Typography variant="h5" component="div" sx={{ fontWeight: 500 }}>
          Crear Nuevo Log
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              color: '#fff',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mx: 2,
            mt: 2,
            '& .MuiAlert-message': {
              width: '100%',
            },
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setError('')}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                autoFocus
                margin="dense"
                id="logName"
                label="Nombre del Log"
                type="text"
                fullWidth
                variant="outlined"
                value={logName}
                onChange={(e) => {
                  setLogName(e.target.value);
                  if (error) setError('');
                }}
                inputProps={{ maxLength: 25 }}
                error={!!error}
                helperText={`${logName.length}/25 caracteres`}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.divider,
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={isLoading}
                  sx={{
                    height: '36px',
                    minWidth: '120px',
                    padding: '0 16px',
                    borderRadius: '4px',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    letterSpacing: '0.01em',
                    boxShadow: 'none',
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: theme.palette.action.disabledBackground,
                      color: theme.palette.text.disabled,
                    },
                  }}
                >
                  {isLoading ? 'Creando...' : 'Crear Log'}
                </Button>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Logs existentes ({existingLogs.length})
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                maxHeight: '40vh',
                mb: 2,
                overflow: 'auto',
                borderColor: theme.palette.divider,
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.02)',
              }}
            >
              <LogList logs={existingLogs} loading={isLoadingLogs} error={logsError} />
            </Paper>
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              size="large"
              fullWidth
              onClick={onClose}
              disabled={isLoading}
              sx={{
                height: '48px',
                borderRadius: '4px',
                textTransform: 'none',
                fontWeight: 500,
                borderColor: theme.palette.divider,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

NewLogDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
