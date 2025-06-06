import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
  useTheme,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getCredentials, saveCredentials } from '../utils/secureStorage';

// Import country data from external file
import { countryData } from '../data/countries';

const SettingsDialog = ({ open, onClose, onSave, initialData }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showItuZoneSelector, setShowItuZoneSelector] = useState(false);
  const [isItuFocused, setIsItuFocused] = useState(false);
  const [settings, setSettings] = useState({
    callsign: '',
    operatorName: '',
    gridSquare: '',
    country: '',
    cqZone: '',
    ituZone: '',
    name: '',
    city: '',
    theme: 'dark',
  });

  // Estado para las credenciales seguras
  const [credentials, setCredentials] = useState({
    qrz: { username: '', password: '' },
    hamqth: { username: '', password: '' },
  });

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Estado para el manejo de errores
  const [errors, setErrors] = useState({});

  // Load initial data and credentials
  useEffect(() => {
    const loadData = async () => {
      if (initialData) {
        const { qth, locator, ...rest } = initialData;
        setSettings({
          ...rest,
          city: qth || '',
          gridSquare: locator || '',
        });
      }

      // Cargar credenciales seguras
      try {
        const [qrzCreds, hamQthCreds] = await Promise.all([
          getCredentials('qrz'),
          getCredentials('hamqth'),
        ]);

        setCredentials({
          qrz: qrzCreds || { username: '', password: '' },
          hamqth: hamQthCreds || { username: '', password: '' },
        });
      } catch (error) {
        console.error('Error al cargar credenciales:', error);
      }
    };

    loadData();
  }, [initialData]);

  const validateField = (name, value) => {
    // Skip validation for empty fields except required ones
    if (!value && name !== 'callsign' && name !== 'operatorName') {
      return '';
    }

    switch (name) {
      case 'callsign':
      case 'operatorName':
        if (!/^[A-Z0-9/]*$/i.test(value)) {
          return 'Solo se permiten letras, números y /';
        }
        if (value.length > 15) {
          return 'Máximo 15 caracteres';
        }
        break;

      case 'gridSquare':
        if (value && !/^[A-Za-z]{2}[0-9]{2}[A-Za-z]{0,2}$/i.test(value)) {
          return 'Formato inválido (ej: AA00aa)';
        }
        if (value.length > 6) {
          return 'Máximo 6 caracteres';
        }
        break;

      case 'cqZone':
      case 'ituZone':
        if (value && !/^\d{0,2}$/.test(value)) {
          return 'Solo números';
        }
        if (value && value.length !== 2) {
          return 'Se requieren 2 dígitos';
        }
        break;

      default:
        break;
    }
    return '';
  };

  const handleCancel = () => {
    // Reset to initial data when canceling
    if (initialData) {
      const { qth, locator, ...rest } = initialData;
      setSettings({
        ...rest,
        city: qth || '',
        gridSquare: locator || '',
      });
    }
    setErrors({});
    onClose();
  };

  // La función handleCountryChange ha sido integrada en handleChange

  const handleItuZoneSelect = (e) => {
    const newValue = e.target.value;
    // Create a new settings object with the updated ITU zone
    const newSettings = {
      ...settings,
      ituZone: newValue,
    };
    // Update the settings state
    setSettings(newSettings);
    // Also update the selected country's ITU zone
    if (selectedCountry) {
      setSelectedCountry({
        ...selectedCountry,
        itu: newValue,
      });
    }
    // Close the dropdown
    setShowItuZoneSelector(false);
    setIsItuFocused(false);
  };

  const handleItuFocus = () => {
    if (selectedCountry?.ituZones?.length > 1) {
      setShowItuZoneSelector(true);
      setIsItuFocused(true);
    }
  };

  const handleItuBlur = () => {
    setShowItuZoneSelector(false);
    setIsItuFocused(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Handle special cases for country selection
    if (name === 'country') {
      const selectedCountry = countryData.find((c) => c.name === value);
      if (selectedCountry) {
        setSettings((prev) => ({
          ...prev,
          country: value,
          cqZone: selectedCountry.cqZone || '',
          ituZone: selectedCountry.ituZones?.[0]?.value || '',
        }));
        return;
      }
    } else if (name.startsWith('qrz') || name.startsWith('hamqth')) {
      // Manejar cambios en las credenciales seguras
      const [service, field] = name.split('_');
      setCredentials((prev) => ({
        ...prev,
        [service]: {
          ...prev[service],
          [field]: value,
        },
      }));
      return;
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

    // Validate callsign
    if (!settings.callsign || settings.callsign.trim() === '') {
      newErrors.callsign = 'Indicativo es requerido';
    } else if (settings.callsign.length > 15) {
      newErrors.callsign = 'Máximo 15 caracteres';
    } else if (!/^[A-Z0-9/]+$/i.test(settings.callsign)) {
      newErrors.callsign = 'Solo letras, números y /';
    }

    // Validate operator name
    if (!settings.operatorName || settings.operatorName.trim() === '') {
      newErrors.operatorName = 'Nombre del operador es requerido';
    } else if (settings.operatorName.length > 15) {
      newErrors.operatorName = 'Máximo 15 caracteres';
    } else if (!/^[A-Z0-9/]+$/i.test(settings.operatorName)) {
      newErrors.operatorName = 'Solo letras, números y /';
    }

    // Only update errors if they've changed
    if (JSON.stringify(newErrors) !== JSON.stringify(errors)) {
      setErrors(newErrors);
    }

    // Form is valid if there are no errors and required fields are filled
    const isValid =
      Object.keys(newErrors).length === 0 &&
      settings.callsign?.trim() &&
      settings.operatorName?.trim();

    return isValid;
  };

  const handleSubmit = async () => {
    const isValid = validate();
    console.log('Form submission - isValid:', isValid);
    console.log('Current settings:', settings);
    console.log('Current errors:', errors);

    if (isValid) {
      try {
        // Guardar credenciales de forma segura
        await Promise.all([
          saveCredentials('qrz', credentials.qrz),
          saveCredentials('hamqth', credentials.hamqth),
        ]);

        // Create a new settings object with the correct field names
        const { city, gridSquare, ...rest } = settings;
        const settingsToSave = {
          ...rest,
          qth: city,
          locator: gridSquare,
        };

        console.log('Saving settings:', settingsToSave);
        onSave(settingsToSave);
        onClose();
      } catch (error) {
        console.error('Error al guardar las credenciales:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    } else {
      console.warn('Form validation failed');
    }
  };

  // Check if form is valid for enabling/disabling the save button
  const isFormValid = useMemo(() => {
    // Check if required fields are filled
    const hasCallsign = Boolean(settings.callsign?.trim());
    const hasOperatorName = Boolean(settings.operatorName?.trim());

    // Filter out empty errors
    const activeErrors = Object.entries(errors).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const hasNoErrors = Object.keys(activeErrors).length === 0;

    console.log('isFormValid check:', {
      hasCallsign,
      hasOperatorName,
      hasNoErrors,
      activeErrors,
      allErrors: errors,
    });

    return hasCallsign && hasOperatorName && hasNoErrors;
  }, [settings, errors]);

  const theme = useTheme();

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
          background: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
            src="icon.png"
            alt="WT-Log"
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              boxShadow: 3,
            }}
          />
          <Typography variant="h6" component="div">
            Configuración de la Estación
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'inherit' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="settings tabs"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
                height: 3,
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minWidth: 120,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              },
            }}
          >
            <Tab label="General" />
            <Tab label="Servicios en Línea" />
          </Tabs>
        </Box>
        <Box sx={{ p: 3 }}>
          {activeTab === 0 ? (
            <Box>
              <Box
                sx={{
                  mb: 3,
                  '& .MuiFormLabel-root.Mui-focused': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.light,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.light,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
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

                {/* Tercera línea: País, CQ, ITU */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <FormControl
                    fullWidth
                    margin="dense"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.light,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  >
                    <InputLabel id="country-select-label">País</InputLabel>
                    <Select
                      labelId="country-select-label"
                      id="country-select"
                      value={settings.country}
                      label="País"
                      onChange={handleChange}
                      name="country"
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) {
                          return <em>Selecciona un país</em>;
                        }
                        return selected;
                      }}
                    >
                      <MenuItem disabled value="">
                        <em>Selecciona un país</em>
                      </MenuItem>
                      {countryData.map((country) => (
                        <MenuItem key={country.name} value={country.name}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

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
                        textAlign: 'center',
                        padding: '8.5px 12px',
                        backgroundColor: settings.country ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                      },
                    }}
                    InputProps={{
                      readOnly: !!settings.country,
                    }}
                  />

                  <Box sx={{ position: 'relative', minWidth: '80px' }}>
                    <TextField
                      label="ITU"
                      name="ituZone"
                      value={settings.ituZone || ''}
                      onChange={handleChange}
                      onFocus={handleItuFocus}
                      onBlur={handleItuBlur}
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
                          cursor: selectedCountry?.ituZones?.length > 1 ? 'pointer' : 'default',
                        },
                      }}
                      margin="dense"
                      error={!!errors.ituZone}
                      helperText={errors.ituZone}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-root': {
                          height: '56px',
                        },
                        '& .MuiInputBase-input': {
                          textAlign: 'center',
                          padding: '8.5px 12px',
                          backgroundColor: settings.country ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                        },
                      }}
                      InputProps={{
                        readOnly: true,
                        endAdornment: selectedCountry?.ituZones?.length > 1 && (
                          <Box
                            component="span"
                            sx={{
                              position: 'absolute',
                              right: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              pointerEvents: 'none',
                            }}
                          >
                            ▼
                          </Box>
                        ),
                      }}
                    />
                    {showItuZoneSelector && isItuFocused && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          zIndex: 1,
                          backgroundColor: 'background.paper',
                          boxShadow: 1,
                          borderRadius: 1,
                          mt: 0.5,
                          maxHeight: '200px',
                          overflowY: 'auto',
                        }}
                      >
                        {selectedCountry?.ituZones?.map((zone) => (
                          <Box
                            key={zone.value}
                            onClick={() => {
                              handleItuZoneSelect({ target: { value: zone.value } });
                            }}
                            sx={{
                              padding: '8px 12px',
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'action.hover',
                              },
                            }}
                          >
                            {zone.value}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Cuarta línea: Grid Locator */}
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
                </Box>

                {/* Quinta línea: Selector de tema */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel id="theme-select-label">Tema</InputLabel>
                    <Select
                      labelId="theme-select-label"
                      id="theme-select"
                      value={settings.theme || 'dark'}
                      label="Tema"
                      onChange={handleChange}
                      name="theme"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.light,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    >
                      <MenuItem value="light">Claro</MenuItem>
                      <MenuItem value="dark">Oscuro</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ mb: 3, color: theme.palette.text.primary }}
              >
                Credenciales de Servicios en Línea
              </Typography>

              {/* QRZ.com Section */}
              <Box
                sx={{
                  mb: 4,
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.palette.primary.main,
                  }}
                >
                  <Box
                    component="img"
                    src="https://www.qrz.com/favicon.ico"
                    alt="QRZ"
                    sx={{ width: 20, height: 20, mr: 1 }}
                  />
                  QRZ.com
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Usuario QRZ"
                      name="qrz_username"
                      value={credentials.qrz?.username || ''}
                      onChange={handleChange}
                      margin="normal"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Contraseña QRZ"
                      name="qrz_password"
                      type="password"
                      value={credentials.qrz?.password || ''}
                      onChange={handleChange}
                      margin="normal"
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* HamQTH Section */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.palette.secondary.main,
                  }}
                >
                  <Box
                    component="img"
                    src="https://www.hamqth.com/favicon.ico"
                    alt="HamQTH"
                    sx={{ width: 20, height: 20, mr: 1 }}
                  />
                  HamQTH
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Usuario HamQTH"
                      name="hamqth_username"
                      value={credentials.hamqth?.username || ''}
                      onChange={handleChange}
                      margin="normal"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Contraseña HamQTH"
                      name="hamqth_password"
                      type="password"
                      value={credentials.hamqth?.password || ''}
                      onChange={handleChange}
                      margin="normal"
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Las credenciales se almacenan de forma segura en tu dispositivo local.
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2, gap: 1, justifyContent: 'space-between' }}>
        <Button
          onClick={handleCancel}
          color="inherit"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!isFormValid}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            '&.Mui-disabled': {
              backgroundColor: 'action.disabledBackground',
              color: 'text.disabled',
            },
          }}
        >
          Guardar Cambios
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
    qth: PropTypes.string,
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
