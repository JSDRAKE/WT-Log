import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';

const SettingsDialog = ({ open, onClose, onSave, initialData }) => {
  const defaultSettings = useMemo(
    () => ({
      callsign: '',
      operatorName: '',
      gridSquare: '',
      qth: '',
      country: 'Argentina',
      ituZone: '14',
      cqZone: '13',
      name: '',
      city: '',
      locator: '',
    }),
    []
  );

  const [initialSettings, setInitialSettings] = useState({ ...defaultSettings });
  const [settings, setSettings] = useState({ ...defaultSettings });
  const [errors, setErrors] = useState({});

  // Update settings when dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      const newSettings = initialData
        ? { ...defaultSettings, ...initialData }
        : { ...defaultSettings };
      setInitialSettings(newSettings);
      setSettings(newSettings);
      setErrors({});
    }
  }, [open, initialData, defaultSettings]);

  const validateField = (name, value) => {
    if (name === 'callsign' || name === 'operatorName') {
      // Only allow letters, numbers, and forward slashes
      if (!/^[A-Z0-9/]*$/i.test(value)) {
        return 'Solo se permiten letras, números y /';
      }
      // Check max length
      if (value.length > 15) {
        return 'Máximo 15 caracteres';
      }
    } else if (name === 'gridSquare') {
      // Validate Grid Locator format (AA00aa)
      if (value && !/^[A-Za-z]{2}[0-9]{2}[A-Za-z]{0,2}$/i.test(value)) {
        return 'Formato inválido (ej: AA00aa)';
      }
      if (value.length > 6) {
        return 'Máximo 6 caracteres';
      }
    } else if (name === 'cqZone' || name === 'ituZone') {
      // Validate CQ/ITU (exactly 2 digits)
      if (value && !/^\d{0,2}$/.test(value)) {
        return 'Solo números';
      }
      if (value.length > 0 && value.length < 2) {
        return 'Se requieren 2 dígitos';
      }
    }
    return '';
  };

  const handleCancel = () => {
    // Reset to initial settings when canceling
    setSettings({ ...initialSettings });
    setErrors({});
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Field-specific validation and transformation
    if (name === 'callsign' || name === 'operatorName') {
      // Only allow letters, numbers, and forward slashes
      if (!/^[A-Z0-9/]*$/i.test(value)) {
        return; // Don't update the field if invalid character is entered
      }

      // Convert to uppercase for callsign and operatorName
      setSettings((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
    } else if (name === 'gridSquare') {
      // Allow only letters and numbers, convert to uppercase, limit to 6 chars
      const newValue = value
        .replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase()
        .slice(0, 6);
      setSettings((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    } else if (name === 'cqZone' || name === 'ituZone') {
      // Allow only numbers, limit to 2 digits
      const newValue = value.replace(/\D/g, '').slice(0, 2);
      // Only update if we have exactly 0 or 2 digits
      if (newValue.length === 0 || newValue.length === 2) {
        setSettings((prev) => ({
          ...prev,
          [name]: newValue,
        }));
      }
    } else {
      // For all other fields, update as is
      setSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Update validation errors
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Required fields
    if (!settings.callsign) {
      newErrors.callsign = 'Indicativo es requerido';
    } else if (settings.callsign.length > 15) {
      newErrors.callsign = 'Máximo 15 caracteres';
    } else if (!/^[A-Z0-9/]+$/i.test(settings.callsign)) {
      newErrors.callsign = 'Solo letras, números y /';
    }

    if (!settings.operatorName) {
      newErrors.operatorName = 'Nombre del operador es requerido';
    } else if (settings.operatorName.length > 15) {
      newErrors.operatorName = 'Máximo 15 caracteres';
    } else if (!/^[A-Z0-9/]+$/i.test(settings.operatorName)) {
      newErrors.operatorName = 'Solo letras, números y /';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(settings);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configuración de la Estación</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          {/* Primera línea: Estación - Operador */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Estación"
              name="callsign"
              value={settings.callsign}
              onChange={handleChange}
              inputProps={{
                maxLength: 15,
                pattern: '[A-Za-z0-9/]*',
                style: { textTransform: 'uppercase' },
              }}
              fullWidth
              required
              error={!!errors.callsign}
              helperText={errors.callsign}
              margin="dense"
            />
            <TextField
              label="Operador"
              name="operatorName"
              value={settings.operatorName}
              onChange={handleChange}
              inputProps={{
                maxLength: 15,
                pattern: '[A-Za-z0-9/]*',
                style: { textTransform: 'uppercase' },
              }}
              fullWidth
              required
              error={!!errors.operatorName}
              helperText={errors.operatorName}
              margin="dense"
            />
          </Box>

          {/* Segunda línea: Nombre - Ciudad */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Nombre"
              name="name"
              value={settings.name || ''}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Ciudad"
              name="city"
              value={settings.city || ''}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Box>

          {/* Tercera línea: País */}
          <Box sx={{ mb: 2 }}>
            <TextField
              label="País"
              name="country"
              value={settings.country}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Box>

          {/* Cuarta línea: Grid - Locator - CQ - ITU */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Grid Locator"
              name="gridSquare"
              value={settings.gridSquare || ''}
              onChange={handleChange}
              inputProps={{
                maxLength: 6,
                placeholder: 'AA00aa',
                style: {
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  fontFamily: 'monospace',
                  letterSpacing: '0.1em',
                  fontSize: '1.1rem',
                  width: '100%',
                },
              }}
              margin="dense"
              error={!!errors.gridSquare}
              helperText={errors.gridSquare}
              sx={{
                minWidth: '140px',
                '& .MuiInputBase-root': {
                  height: '56px',
                },
                '& .MuiInputBase-input': {
                  padding: '8.5px 12px',
                },
              }}
            />
            <TextField
              label="CQ"
              name="cqZone"
              value={settings.cqZone || ''}
              onChange={handleChange}
              inputProps={{
                maxLength: 2,
                inputMode: 'numeric',
                pattern: '\\d{2}',
                placeholder: '00',
                style: {
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  letterSpacing: '0.2em',
                  width: '100%',
                },
              }}
              margin="dense"
              error={!!errors.cqZone}
              helperText={errors.cqZone}
              sx={{
                minWidth: '80px',
                '& .MuiInputBase-root': {
                  height: '56px',
                },
                '& .MuiInputBase-input': {
                  padding: '8.5px 12px',
                },
              }}
            />
            <TextField
              label="ITU"
              name="ituZone"
              value={settings.ituZone || ''}
              onChange={handleChange}
              inputProps={{
                maxLength: 2,
                inputMode: 'numeric',
                pattern: '\\d{2}',
                placeholder: '00',
                style: {
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  letterSpacing: '0.2em',
                  width: '100%',
                },
              }}
              margin="dense"
              error={!!errors.ituZone}
              helperText={errors.ituZone}
              sx={{
                minWidth: '80px',
                '& .MuiInputBase-root': {
                  height: '56px',
                },
                '& .MuiInputBase-input': {
                  textAlign: 'center',
                  padding: '8.5px 12px',
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={handleCancel}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SettingsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    callsign: PropTypes.string,
    operatorName: PropTypes.string,
    name: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    gridSquare: PropTypes.string,
    locator: PropTypes.string,
    cqZone: PropTypes.string,
    ituZone: PropTypes.string,
  }),
};

SettingsDialog.defaultProps = {
  initialData: {},
};

export default SettingsDialog;
