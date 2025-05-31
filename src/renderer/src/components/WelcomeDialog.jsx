import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Divider,
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
          background: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          p: 2,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Box
          component="img"
          src="icon.png"
          alt="WT-Log"
          sx={{
            width: 64,
            height: 64,
            mb: 1,
            borderRadius: '50%',
            border: `3px solid ${theme.palette.background.paper}`,
            boxShadow: theme.shadows[2],
          }}
        />
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mt: 1 }}>
          ¡Bienvenido a WT-Log!
        </Typography>
      </Box>
      
      <DialogContent sx={{ py: 3, px: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 500 }}>
          Configuración inicial requerida
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <CheckCircleOutlineIcon
              color="primary"
              sx={{ mr: 1.5, mt: 0.5, flexShrink: 0 }}
            />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Configura tu estación
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ingresa tu indicativo, nombre y ubicación para comenzar
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <CheckCircleOutlineIcon
              color="primary"
              sx={{ mr: 1.5, mt: 0.5, flexShrink: 0 }}
            />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Personaliza tu experiencia
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ajusta las preferencias según tus necesidades
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <CheckCircleOutlineIcon
              color="primary"
              sx={{ mr: 1.5, mt: 0.5, flexShrink: 0 }}
            />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Comienza a registrar contactos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Todo listo para que inicies tu registro de contactos
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
          La configuración inicial solo tomará unos minutos
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
        <Button
          onClick={onClose}
          color="inherit"
          variant="text"
          sx={{ color: 'text.secondary' }}
        >
          Configurar más tarde
        </Button>
        <Button
          onClick={onConfigure}
          color="primary"
          variant="contained"
          autoFocus
          size="large"
          sx={{
            px: 4,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
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
