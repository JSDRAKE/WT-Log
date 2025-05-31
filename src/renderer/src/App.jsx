import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Paper, Grid, Typography } from '@mui/material';
import QsoTable from './components/QsoTable';
import QsoForm from './components/QsoForm';
import AboutDialog from './components/AboutDialog';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [qsos, setQsos] = useState([]);
  const [currentQso, setCurrentQso] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    // Listen for the 'open-about' event from the main process
    const handleOpenAbout = () => setAboutOpen(true);
    window.electron.ipcRenderer.on('open-about', handleOpenAbout);

    // Clean up the event listener when the component unmounts
    return () => {
      window.electron.ipcRenderer.removeListener('open-about', handleOpenAbout);
    };
  }, []);

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

  return (
    <ThemeProvider theme={darkTheme}>
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
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, mb: 3, position: 'sticky', top: 20 }}>
                <QsoForm
                  onSave={handleSaveQso}
                  qso={currentQso}
                  onClear={() => setCurrentQso(null)}
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
