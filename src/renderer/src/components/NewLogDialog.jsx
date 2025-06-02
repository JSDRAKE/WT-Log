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

  const handleSubmit = () => {
    if (!logName.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    onSave({
      name: logName.trim(),
      createdAt: new Date().toISOString(),
    });

    // Reset form
    setLogName('');
    setError('');
    onClose();
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
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mt: 2 }}>
          <TextField
            label="Nombre del Log"
            variant="outlined"
            value={logName}
            onChange={(e) => {
              if (e.target.value.length <= 25) {
                setLogName(e.target.value);
                if (error) setError('');
              }
            }}
            inputProps={{ maxLength: 25 }}
            error={!!error}
            helperText={error || `${logName.length}/25 caracteres`}
            autoFocus
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              height: '56px', // Match TextField height
              px: 3,
            }}
          >
            Crear Log
          </Button>
        </Box>
      </DialogContent>

      <Divider sx={{ my: 2 }} />
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
