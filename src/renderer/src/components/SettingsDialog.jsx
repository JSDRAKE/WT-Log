import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';

const SettingsDialog = ({ open, onClose, onSave, initialData }) => {
  const [settings, setSettings] = useState({
    callsign: '',
    operatorName: '',
    gridSquare: '',
    qth: '',
    country: 'Argentina',
    ituZone: '14',
    cqZone: '13',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setSettings((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!settings.callsign) newErrors.callsign = 'Indicativo es requerido';
    if (!settings.operatorName) newErrors.operatorName = 'Nombre del operador es requerido';

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
          <Typography variant="subtitle2" gutterBottom>
            Información de la Estación
          </Typography>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr', mb: 2 }}>
            <TextField
              label="Indicativo"
              name="callsign"
              value={settings.callsign}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.callsign}
              helperText={errors.callsign}
              margin="dense"
            />
            <TextField
              label="Cuadrícula Locator"
              name="gridSquare"
              value={settings.gridSquare}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Box>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr', mb: 2 }}>
            <TextField
              label="País"
              name="country"
              value={settings.country}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="QTH"
              name="qth"
              value={settings.qth}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Box>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
            <TextField
              label="Zona ITU"
              name="ituZone"
              value={settings.ituZone}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="dense"
            />
            <TextField
              label="Zona CQ"
              name="cqZone"
              value={settings.cqZone}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="dense"
            />
          </Box>
        </Box>

        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Información del Operador
          </Typography>
          <TextField
            label="Nombre del Operador"
            name="operatorName"
            value={settings.operatorName}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.operatorName}
            helperText={errors.operatorName}
            margin="dense"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose}>Cancelar</Button>
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
    gridSquare: PropTypes.string,
    qth: PropTypes.string,
    country: PropTypes.string,
    ituZone: PropTypes.string,
    cqZone: PropTypes.string,
  }),
};

SettingsDialog.defaultProps = {
  initialData: {},
};

export default SettingsDialog;
