import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  Container,
  Paper,
  Grid,
  Typography,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QsoTable from './components/QsoTable';
import QsoForm from './components/QsoForm';
import AboutDialog from './components/AboutDialog';
import SettingsDialog from './components/SettingsDialog';
import WelcomeDialog from './components/WelcomeDialog';
import NewLogDialog from './components/NewLogDialog';
import LoadLogDialog from './components/LoadLogDialog';
import DeleteLogDialog from './components/DeleteLogDialog';

const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
        light: '#63a4ff',
        dark: '#004ba0',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#dc004e',
        light: '#ff5c8d',
        dark: '#a3003a',
        contrastText: '#ffffff',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#f8f9fa',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
        secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        disabled: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.38)',
      },
      divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: mode === 'dark' ? '#1e1e1e' : '#1976d2',
            color: '#ffffff',
            boxShadow:
              mode === 'dark'
                ? '0px 2px 4px -1px rgba(0,0,0,0.2), ' +
                  '0px 4px 5px 0px rgba(0,0,0,0.14), ' +
                  '0px 1px 10px 0px rgba(0,0,0,0.12)'
                : '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
            border:
              mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.12)'
                : '1px solid rgba(0, 0, 0, 0.12)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 4,
          },
          contained: {
            boxShadow: mode === 'dark' ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 2px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow:
                mode === 'dark' ? '0 2px 6px rgba(0,0,0,0.7)' : '0 2px 4px rgba(0,0,0,0.2)',
            },
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });

function App() {
  const [qsos, setQsos] = useState([]);
  const [currentQso, setCurrentQso] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({ theme: 'dark' });
  const [currentLog, setCurrentLog] = useState(null);
  // Keep logs state for future use when we implement log listing in the main UI
  // eslint-disable-next-line no-unused-vars
  const [logs, setLogs] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [newLogOpen, setNewLogOpen] = useState(false);
  const [loadLogOpen, setLoadLogOpen] = useState(false);
  const [deleteLogOpen, setDeleteLogOpen] = useState(false);

  // Handle menu actions
  useEffect(() => {
    const handleMenuAction = (_, action) => {
      switch (action) {
        case 'new-log':
          setNewLogOpen(true);
          break;
        case 'load-log':
          setLoadLogOpen(true);
          break;
        case 'delete-log':
          setDeleteLogOpen(true);
          break;
        case 'settings':
          setSettingsOpen(true);
          break;
        case 'about':
          setAboutOpen(true);
          break;
        default:
          break;
      }
    };

    window.electron.ipcRenderer.on('menu-action', handleMenuAction);
    return () => {
      window.electron.ipcRenderer.removeListener('menu-action', handleMenuAction);
    };
  }, []);

  useEffect(() => {
    // Load settings when component mounts
    const loadSettings = async () => {
      try {
        const savedSettings = await window.electron.ipcRenderer.invoke('load-settings');
        if (savedSettings) {
          setSettings(savedSettings);
          // Check if settings are empty (new installation)
          const isEmpty = !savedSettings.callsign && !savedSettings.operatorName;
          setShowWelcomeModal(isEmpty);
        } else {
          // No settings found, show welcome modal
          setShowWelcomeModal(true);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setSnackbar({
          open: true,
          message: 'Error al cargar la configuración',
          severity: 'error',
        });
        // If there's an error, still show the welcome modal
        setShowWelcomeModal(true);
      }
    };

    loadSettings();

    // Listen for menu actions
    const handleMenuAction = (_, action) => {
      if (action === 'open-settings') {
        setSettingsOpen(true);
      } else if (action === 'new-log') {
        setNewLogOpen(true);
      } else if (action === 'load-log') {
        setLoadLogOpen(true);
      }
    };

    // Listen for the 'open-about' event from the main process
    const handleOpenAbout = () => setAboutOpen(true);

    window.electron.ipcRenderer.on('open-about', handleOpenAbout);
    window.electron.ipcRenderer.on('menu-action', handleMenuAction);

    // Clean up event listeners when the component unmounts
    return () => {
      window.electron.ipcRenderer.removeListener('open-about', handleOpenAbout);
      window.electron.ipcRenderer.removeListener('menu-action', handleMenuAction);
    };
  }, []);

  const handleNewLog = async (logData) => {
    try {
      const newLog = await window.electron.ipcRenderer.invoke('create-log', {
        name: logData.name,
        settings: settings || {},
      });
      setCurrentLog(newLog);
      setQsos([]);
      setSnackbar({
        open: true,
        message: `Log "${logData.name}" creado correctamente`,
        severity: 'success',
      });
      // Don't close the dialog here - we'll let the user see the new log in the list
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error al crear el log: ${error.message}`,
        severity: 'error',
      });
      throw error; // Re-throw to let the dialog handle the error
    }
  };

  const handleLoadLog = async (log) => {
    try {
      const logContent = await window.electron.ipcRenderer.invoke('load-log', log.filePath);
      setCurrentLog(logContent);
      setQsos(logContent.qsos || []);
      setLoadLogOpen(false);
      setSnackbar({
        open: true,
        message: `Log "${log.name}" cargado correctamente`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Error loading log:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar el log',
        severity: 'error',
      });
    }
  };

  const handleDeleteLog = async (log) => {
    try {
      await window.electron.ipcRenderer.invoke('delete-log', log.filePath);

      // If the deleted log is the currently loaded one, clear the current log
      if (currentLog && currentLog.filePath === log.filePath) {
        setCurrentLog(null);
        setQsos([]);
      }

      setSnackbar({
        open: true,
        message: `Log "${log.name}" eliminado correctamente`,
        severity: 'success',
      });

      return true; // Indicate success
    } catch (error) {
      console.error('Error deleting log:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar el log',
        severity: 'error',
      });
      return false; // Indicate failure
    }
  };

  const handleSaveSettings = async (newSettings) => {
    try {
      await window.electron.ipcRenderer.invoke('save-settings', newSettings);
      setSettings((prevSettings) => ({
        ...prevSettings,
        ...newSettings,
      }));
      setSnackbar({
        open: true,
        message: 'Configuración guardada correctamente',
        severity: 'success',
      });
      // Close the welcome modal if it's open
      setShowWelcomeModal(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSnackbar({
        open: true,
        message: 'Error al guardar la configuración',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleAboutClose = () => {
    setAboutOpen(false);
  };

  const handleSaveQso = (qso) => {
    if (currentQso) {
      // Actualizar QSO existente
      setQsos(qsos.map((q) => (q.id === currentQso.id ? { ...q, ...qso } : q)));
    } else {
      // Agregar nuevo QSO
      setQsos([...qsos, { ...qso, id: Date.now() }]);
    }
    setCurrentQso(null);
  };

  const handleDeleteQso = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este contacto?')) {
      setQsos(qsos.filter((q) => q.id !== id));
    }
  };

  // Get current theme based on settings
  const currentTheme = getTheme(settings?.theme || 'dark');

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Title bar for the window */}
        <Box
          sx={{
            '-webkit-app-region': 'drag',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            px: 2,
          }}
        >
          <Typography variant="subtitle1" component="div">
            WT-Log - Libro de Guardia
          </Typography>
        </Box>
        <AboutDialog open={aboutOpen} onClose={handleAboutClose} />
        <SettingsDialog
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onSave={handleSaveSettings}
          initialData={settings}
        />
        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={(event, reason) => {
            // No cerrar al hacer clic fuera del Snackbar
            if (reason === 'clickaway') {
              return;
            }
            handleCloseSnackbar();
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ '& .MuiAlert-action': { paddingLeft: 0 } }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              width: '100%',
              '& .MuiAlert-message': {
                display: 'flex',
                alignItems: 'center',
                flexGrow: 1,
              },
            }}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseSnackbar}
                sx={{ p: 0.5, ml: 1 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Welcome/Configuration Modal */}
        <WelcomeDialog
          open={showWelcomeModal}
          onClose={() => setShowWelcomeModal(false)}
          onConfigure={() => {
            setShowWelcomeModal(false);
            setSettingsOpen(true);
          }}
        />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, mb: 3, position: 'sticky', top: 20 }}>
                {settings && (
                  <QsoForm
                    onSave={handleSaveQso}
                    qso={currentQso}
                    onClear={() => setCurrentQso(null)}
                  />
                )}
                <NewLogDialog
                  open={newLogOpen}
                  onClose={() => setNewLogOpen(false)}
                  onSave={handleNewLog}
                  onLoad={handleLoadLog}
                  logs={logs}
                />
                <LoadLogDialog
                  open={loadLogOpen}
                  onClose={() => setLoadLogOpen(false)}
                  onLoad={handleLoadLog}
                />
                <DeleteLogDialog
                  open={deleteLogOpen}
                  onClose={() => setDeleteLogOpen(false)}
                  onDelete={handleDeleteLog}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2 }}>
                <QsoTable
                  qsos={qsos}
                  onEdit={(qso) => setCurrentQso(qso)}
                  onDelete={handleDeleteQso}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
