import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  useTheme,
  Divider,
} from '@mui/material';

const NewLogDialog = ({ open, onClose, onSave }) => {
  const theme = useTheme();
  const [logName, setLogName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    const trimmedName = logName.trim();

    // Validate input
    if (!trimmedName) {
      setError('El nombre es obligatorio');
      return;
    }

    if (trimmedName.length > 25) {
      setError('El nombre no puede tener más de 25 caracteres');
      return;
    }

    // Call the onSave prop with the log data
    onSave({
      name: trimmedName,
      createdAt: new Date().toISOString(),
    });

    // Reset form
    setLogName('');
    setError('');
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
        },
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          textAlign: 'center',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 700,
            mb: 1,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          Crear Nuevo Log
        </Typography>
      </Box>

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              label="Nombre del Log"
              variant="outlined"
              value={logName}
              onChange={(e) => {
                setLogName(e.target.value.slice(0, 25));
                setError('');
              }}
              error={!!error}
              helperText={error || `${logName.length}/25 caracteres`}
              fullWidth
              autoFocus
              sx={{ flexGrow: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                height: '56px',
                px: 3,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Crear Log
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <Divider sx={{ my: 0 }} />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

NewLogDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default NewLogDialog;
