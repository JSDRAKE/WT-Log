import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
  Divider,
  IconButton,
} from '@mui/material';
import { Lock, LockOpen, CalendarToday } from '@mui/icons-material';
import { format } from 'date-fns';
import { keyframes } from '@emotion/react';

// Define a subtle pulsing animation
const pulse = keyframes`
  0% { background-color: rgba(0, 0, 0, 0.02); }
  50% { background-color: rgba(0, 0, 0, 0.04); }
  100% { background-color: rgba(0, 0, 0, 0.02); }
`;

// Style for read-only fields with pulse animation
const readOnlyFieldStyle = {
  '& .MuiInputBase-input': {
    animation: `${pulse} 3s ease-in-out infinite`,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.23)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.87)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'primary.main',
  },
};

const BANDAS = [
  '160m',
  '80m',
  '40m',
  '30m',
  '20m',
  '17m',
  '15m',
  '12m',
  '10m',
  '6m',
  '2m',
  '1.25m',
  '70cm',
  '33cm',
  '23cm',
  '13cm',
  '5cm',
  '3cm',
];

const MODOS = [
  'SSB',
  'CW',
  'FT8',
  'FT4',
  'PSK31',
  'RTTY',
  'SSTV',
  'AM',
  'FM',
  'DMR',
  'D-STAR',
  'C4FM',
  'ATV',
  'SSTV',
  'HELL',
  'OLIVIA',
  'JT65',
  'JT9',
  'WSPR',
];

const QsoForm = ({ onSave, qso: initialQso, onClear }) => {
  const [isTimeLocked, setIsTimeLocked] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
  });
  const dateInputRef = useRef(null);

  const [qso, setQso] = useState(() => ({
    callSign: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    rstReceived: '59',
    rstSent: '59',
    band: '20m',
    frequency: '',
    mode: 'SSB',
    name: '',
    gridLocator: '',
    cqZone: '',
    ituZone: '',
    qth: '',
    country: '',
    notes: '',
  }));

  // Update date and time every second with UTC when locked
  useEffect(() => {
    if (!isTimeLocked) return; // Don't update if time is manually set

    const updateDateTime = () => {
      const now = new Date();
      // Get UTC date and time
      const utcDateStr = format(now, 'dd/MM/yyyy'); // DD/MM/YYYY format
      const utcTimeStr = now.toISOString().substr(11, 8); // HH:MM:SS in UTC

      setCurrentDateTime({
        date: utcDateStr,
        time: utcTimeStr,
      });

      setQso((prev) => ({
        ...prev,
        date: utcDateStr,
        time: utcTimeStr,
      }));
    };

    // Initial update
    updateDateTime();

    // Update every second
    const intervalId = setInterval(updateDateTime, 1000);

    // Cleanup interval on component unmount or when unlocked
    return () => clearInterval(intervalId);
  }, [isTimeLocked]);

  const getCurrentUTCTime = () => {
    const now = new Date();
    return now.toISOString().substr(11, 8); // Returns UTC time in HH:MM:SS format
  };

  const handleTimeLockToggle = () => {
    const now = new Date();
    const currentDate = format(now, 'yyyy-MM-dd');
    const currentTime = getCurrentUTCTime(); // Get current UTC time

    if (isTimeLocked) {
      // When unlocking, update to current UTC date and time
      setQso((prev) => ({
        ...prev,
        date: currentDate,
        time: currentTime,
      }));
    }
    // Always update currentDateTime to current UTC date and time
    setCurrentDateTime({
      date: currentDate,
      time: currentTime,
    });

    setIsTimeLocked(!isTimeLocked);
  };

  // Format time to ensure HH:MM:SS format
  const formatTimeWithSeconds = (time) => {
    if (!time) return '';
    // Ensure time is in HH:MM:SS format
    const parts = time.split(':');
    if (parts.length === 2) {
      return `${time}:00`; // Add seconds if missing
    } else if (parts.length === 3) {
      // Ensure seconds are two digits
      return parts[0] + ':' + parts[1] + ':' + parts[2].padStart(2, '0');
    }
    return time;
  };

  const handleManualTimeChange = (e) => {
    const { name, value } = e.target;
    setCurrentDateTime((prev) => ({
      ...prev,
      [name]: value,
    }));
    setQso((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (initialQso) {
      setQso({
        ...initialQso,
        date: initialQso.date || format(new Date(), 'yyyy-MM-dd'),
        time: initialQso.time || format(new Date(), 'HH:mm'),
      });
    }
  }, [initialQso]);

  const getBandFromFrequency = (freq) => {
    const frequency = parseFloat(freq);
    if (isNaN(frequency)) return '';

    // Bands in MHz
    const bands = [
      { min: 1.8, max: 2.0, band: '160m' },
      { min: 3.5, max: 4.0, band: '80m' },
      { min: 7.0, max: 7.3, band: '40m' },
      { min: 10.1, max: 10.15, band: '30m' },
      { min: 14.0, max: 14.35, band: '20m' },
      { min: 18.068, max: 18.168, band: '17m' },
      { min: 21.0, max: 21.45, band: '15m' },
      { min: 24.89, max: 24.99, band: '12m' },
      { min: 28.0, max: 29.7, band: '10m' },
      { min: 50.0, max: 54.0, band: '6m' },
      { min: 144.0, max: 148.0, band: '2m' },
      { min: 222.0, max: 225.0, band: '1.25m' },
      { min: 420.0, max: 450.0, band: '70cm' },
      { min: 902.0, max: 928.0, band: '33cm' },
      { min: 1240.0, max: 1300.0, band: '23cm' },
    ];

    const band = bands.find((b) => frequency >= b.min && frequency <= b.max);
    return band ? band.band : '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updates = { [name]: value };

    if (name === 'callSign') {
      // Only allow letters, numbers, and forward slashes, convert to uppercase
      const filteredValue = value.toUpperCase().replace(/[^A-Z0-9/]/g, '');
      // Limit to 15 characters
      updates[name] = filteredValue.slice(0, 15);
    }
    // If frequency changes, update the band
    else if (name === 'frequency' && value) {
      const band = getBandFromFrequency(value);
      if (band) {
        updates.band = band;
      }
    }
    
    setQso((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(qso);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        {initialQso ? 'Editar Contacto' : 'Nuevo Contacto'}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* First Row */}
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Indicativo"
            name="callSign"
            value={qso.callSign}
            onChange={handleChange}
            required
            autoComplete="off"
            autoFocus
            margin="normal"
            size="small"
          />
        </Grid>

        {/* Date Picker */}
        <Grid item xs="auto">
          <Box sx={{ position: 'relative', width: isTimeLocked ? '8.5rem' : '11.5rem' }}>
            <TextField
              label="Fecha"
              type={isTimeLocked ? 'text' : 'date'}
              name="date"
              value={isTimeLocked ? currentDateTime.date : qso.date}
              onChange={handleManualTimeChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputRef={dateInputRef}
              inputProps={{
                style: {
                  width: '100%',
                  fontFamily: 'monospace',
                  cursor: isTimeLocked ? 'default' : 'pointer',
                  paddingRight: isTimeLocked ? '0.5rem' : '2rem',
                },
              }}
              InputProps={{
                readOnly: isTimeLocked,
                sx: isTimeLocked ? readOnlyFieldStyle : {},
                endAdornment: !isTimeLocked && (
                  <Box
                    component="span"
                    onClick={() => dateInputRef.current?.showPicker()}
                    sx={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    <CalendarToday fontSize="small" />
                  </Box>
                ),
              }}
              required
              margin="normal"
              size="small"
            />
          </Box>
        </Grid>

        {/* Time Input */}
        <Grid item xs="auto">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              label="Hora"
              type="time"
              name="time"
              value={formatTimeWithSeconds(isTimeLocked ? currentDateTime.time : qso.time)}
              onChange={handleManualTimeChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 1,
                style: {
                  width: '8rem',
                  fontFamily: 'monospace',
                  cursor: isTimeLocked ? 'default' : 'pointer',
                  paddingRight: '0.5rem',
                },
              }}
              InputProps={{
                readOnly: isTimeLocked,
                sx: isTimeLocked ? readOnlyFieldStyle : {},
              }}
              required
              margin="normal"
              size="small"
            />
            <Box sx={{ ml: 1, mt: 2, display: 'flex', alignItems: 'center' }}>
              <IconButton
                onClick={handleTimeLockToggle}
                size="small"
                title={
                  isTimeLocked ? 'Desbloquear para editar' : 'Bloquear actualización automática'
                }
              >
                {isTimeLocked ? <Lock /> : <LockOpen />}
              </IconButton>
            </Box>
          </Box>
        </Grid>
        <Grid item xs="auto">
          <TextField
            label="RST(r)"
            name="rstReceived"
            value={qso.rstReceived}
            onChange={handleChange}
            inputProps={{
              maxLength: 3,
              style: { width: '4rem', textAlign: 'center' },
            }}
            required
            margin="normal"
            size="small"
          />
        </Grid>
        <Grid item xs="auto">
          <TextField
            label="RST(e)"
            name="rstSent"
            value={qso.rstSent}
            onChange={handleChange}
            inputProps={{
              maxLength: 3,
              style: { width: '4rem', textAlign: 'center' },
            }}
            required
            margin="normal"
            size="small"
          />
        </Grid>
      </Grid>

      {/* Second Row - Banda, Frecuencia, Modo */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth margin="normal" size="small">
            <InputLabel id="band-label">Banda</InputLabel>
            <Select
              name="band"
              value={qso.band}
              onChange={handleChange}
              required
              labelId="band-label"
              label="Banda"
              disabled
              sx={{
                textTransform: 'none',
                '& .MuiSelect-select': {
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  cursor: 'default',
                  paddingRight: '14px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                },
              }}
              IconComponent={() => null}
              MenuProps={{
                disablePortal: true,
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              {BANDAS.map((banda) => (
                <MenuItem key={banda} value={banda}>
                  {banda}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            fullWidth
            label="Frecuencia (MHz)"
            name="frequency"
            type="number"
            value={qso.frequency}
            onChange={handleChange}
            margin="normal"
            size="small"
            inputProps={{
              step: '0.001',
              min: '0',
              placeholder: 'ej: 14.195',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth margin="normal" size="small">
            <InputLabel id="mode-label">Modo</InputLabel>
            <Select
              name="mode"
              value={qso.mode}
              onChange={handleChange}
              required
              labelId="mode-label"
              label="Modo"
            >
              {MODOS.map((modo) => (
                <MenuItem key={modo} value={modo}>
                  {modo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Third Row - Nombre, Grid Locator, Zona CQ, Zona ITU */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Nombre"
            name="name"
            value={qso.name}
            onChange={handleChange}
            autoComplete="off"
            margin="normal"
            size="small"
          />
        </Grid>
        <Grid item xs="auto">
          <TextField
            label="Grid Locator"
            name="gridLocator"
            value={qso.gridLocator}
            onChange={handleChange}
            autoComplete="off"
            margin="normal"
            size="small"
            sx={{
              '& .MuiInputBase-root': {
                width: '8.5rem', // Ancho fijo para 6 caracteres
              },
            }}
            inputProps={{
              maxLength: 6,
              style: {
                fontFamily: 'monospace',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                textAlign: 'center',
                padding: '8.5px 4px',
                width: '100%',
              },
            }}
          />
        </Grid>
        <Grid item xs="auto" sx={{ minWidth: '60px' }}>
          <TextField
            label="CQ"
            name="cqZone"
            value={qso.cqZone}
            onChange={handleChange}
            autoComplete="off"
            margin="normal"
            size="small"
            inputProps={{
              maxLength: 2,
              style: {
                textAlign: 'center',
                padding: '8.5px 4px',
                width: '60px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              },
            }}
            sx={{
              '& .MuiInputBase-root': {
                width: '100%',
              },
              '& .MuiInputBase-input': {
                textAlign: 'center',
                padding: '8.5px 4px',
              },
            }}
          />
        </Grid>
        <Grid item xs="auto" sx={{ minWidth: '80px' }}>
          <TextField
            label="ITU"
            name="ituZone"
            value={qso.ituZone}
            onChange={handleChange}
            autoComplete="off"
            margin="normal"
            size="small"
            inputProps={{
              maxLength: 2,
              style: {
                textAlign: 'center',
                padding: '8.5px 4px',
                width: '60px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              },
            }}
            sx={{
              '& .MuiInputBase-root': {
                width: '100%',
              },
              '& .MuiInputBase-input': {
                textAlign: 'center',
                padding: '8.5px 4px',
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Fourth Row - QTH, País */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <TextField
            fullWidth
            label="QTH"
            name="qth"
            value={qso.qth}
            onChange={handleChange}
            autoComplete="off"
            margin="normal"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <TextField
            fullWidth
            label="País"
            name="country"
            value={qso.country}
            onChange={handleChange}
            autoComplete="off"
            margin="normal"
            size="small"
          />
        </Grid>
      </Grid>

      {/* Fifth Row - Comentario */}
      <Grid container>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Comentario"
            name="notes"
            value={qso.notes}
            onChange={handleChange}
            multiline
            rows={3}
            margin="normal"
            size="small"
          />
        </Grid>
      </Grid>

      {/* Sixth Row - Botones */}
      <Grid container justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            onClick={onClear}
            size="large"
            sx={{ minWidth: '120px' }}
          >
            Limpiar
          </Button>
        </Grid>
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ minWidth: '120px', ml: 1 }}
          >
            Guardar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

QsoForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  qso: PropTypes.object,
  onClear: PropTypes.func.isRequired,
};

export default QsoForm;
