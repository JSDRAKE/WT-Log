import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
} from '@mui/material';
import { CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material';

const WelcomeDialog = ({ open, onClose, onConfigure }) => {
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
          background: theme.palette.mode === 'dark'
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
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        <Box
          component="img"
          src="icon.png"
          alt="WT-Log"
          sx={{
            width: 64,
            height: 64,
            mb: 2,
            borderRadius: '50%',
            border: `3px solid ${theme.palette.primary.contrastText}`,
            boxShadow: theme.shadows[2],
          }}
        />
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          ¡Bienvenido a WT-Log!
        </Typography>
      </Box>
      
      <DialogContent sx={{ py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 4 } }}>
        <Typography
          variant="subtitle1"
          sx={{
            mb: { xs: 1.5, sm: 2 },
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          Configuración inicial requerida
        </Typography>
        
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <CheckCircleOutlineIcon
              color="primary"
              sx={{ 
                mr: { xs: 1, sm: 1.5 },
                mt: 0.5,
                flexShrink: 0,
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            />
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                Configura tu estación
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
              >
                Ingresa tu indicativo, nombre y ubicación para comenzar
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <CheckCircleOutlineIcon
              color="primary"
              sx={{ 
                mr: { xs: 1, sm: 1.5 },
                mt: 0.5,
                flexShrink: 0,
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            />
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                Personaliza tu experiencia
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
              >
                Ajusta las preferencias según tus necesidades
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <CheckCircleOutlineIcon
              color="primary"
              sx={{ 
                mr: { xs: 1, sm: 1.5 },
                mt: 0.5,
                flexShrink: 0,
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            />
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                Comienza a registrar contactos
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
              >
                Guarda tus contactos de forma organizada
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ my: 2, borderBottom: `1px solid ${theme.palette.divider}` }} />
        
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            mb: 2,
          }}
        >
          La configuración inicial solo tomará unos minutos
        </Typography>
      </DialogContent>
      
      <DialogActions
        sx={{
          p: { xs: 1.5, sm: 2 },
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center',
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth={window.innerWidth < 600}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 4,
            m: 0,
            borderColor: theme.palette.divider,
            '&:hover': {
              borderColor: theme.palette.text.secondary,
              backgroundColor: 'transparent',
            },
          }}
        >
          Configurar más tarde
        </Button>
        <Button
          onClick={onConfigure}
          variant="contained"
          fullWidth={window.innerWidth < 600}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 4,
            m: 0,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Comenzar configuración
        </Button>
      </DialogActions>
    </Dialog>
  );
};

WelcomeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfigure: PropTypes.func.isRequired,
};

export default WelcomeDialog;
