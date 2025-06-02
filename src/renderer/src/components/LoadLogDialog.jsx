import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

export default function LoadLogDialog({ open, onClose, onLoad }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  const handleLoad = (log) => {
    onLoad(log);
    onClose();
  };

  useEffect(() => {
    if (open) {
      loadLogs();
    } else {
      // Reset state when dialog is closed
      setLogs([]);
      setError(null);
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
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          textAlign: 'center',
          position: 'relative',
          pt: 4,
          pb: 2,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          Cargar Log Existente
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
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
            {logs.map((log, index) => (
              <Box key={log.filePath}>
                <Box
                  sx={{
                    p: { xs: 1.5, sm: 2 },
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0, mr: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: '0.9375rem', sm: '1rem' },
                        mb: 0.5,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {log.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                        mb: 0.5,
                      }}
                    >
                      {new Date(log.createdAt).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                      }}
                    >
                      {log.qsos?.length || 0} QSOs registrados
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleLoad(log)}
                    sx={{
                      textTransform: 'none',
                      minWidth: '100px',
                      fontWeight: 500,
                      fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                      py: 0.75,
                      px: 2,
                      ml: 1,
                      flexShrink: 0,
                    }}
                  >
                    Cargar
                  </Button>
                </Box>
                {index < logs.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 4 }, pb: { xs: 2, sm: 3 }, pt: 0 }}>
        <Button
          variant="outlined"
          color="inherit"
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
    </Dialog>
  );
}

LoadLogDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLoad: PropTypes.func.isRequired,
};
