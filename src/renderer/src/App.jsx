import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Paper, Grid } from '@mui/material';
import QsoTable from './components/QsoTable';
import QsoForm from './components/QsoForm';

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
