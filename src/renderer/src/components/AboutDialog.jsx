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
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  GitHub as GitHubIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import pkg from '../../../../package.json';

const { version } = pkg;

const AboutDialog = ({ open, onClose }) => {
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
          p: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          textAlign: 'center',
        }}
      >
        <Box
          component="img"
          src="icon.png"
          alt="WT-Log"
          sx={{
            width: { xs: 56, sm: 64 },
            height: { xs: 56, sm: 64 },
            mb: { xs: 1.5, sm: 2 },
            borderRadius: '50%',
            border: `3px solid ${theme.palette.primary.contrastText}`,
            boxShadow: theme.shadows[2],
          }}
        />
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 'bold',
            mt: { xs: 0.5, sm: 1 },
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          Acerca de WT-Log
        </Typography>
      </Box>

      <DialogContent sx={{ py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 4 } }}>
        <Typography
          variant="subtitle1"
          sx={{
            mb: { xs: 2, sm: 3 },
            textAlign: 'center',
            fontWeight: 500,
            fontSize: { xs: '0.9375rem', sm: '1rem' },
          }}
        >
          WT-Log v{version}
        </Typography>

        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <CheckCircleOutlineIcon
              color="primary"
              sx={{
                mr: { xs: 1.25, sm: 1.5 },
                mt: 0.5,
                flexShrink: 0,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
            />
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: 1.3,
                }}
              >
                Libro de guardia digital
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  lineHeight: 1.4,
                }}
              >
                Para radioaficionados de todo el mundo
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <CheckCircleOutlineIcon
              color="primary"
              sx={{
                mr: { xs: 1.25, sm: 1.5 },
                mt: 0.5,
                flexShrink: 0,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
            />
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: 1.3,
                }}
              >
                Desarrollado por JSDRAKE - LU9WT
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  lineHeight: 1.4,
                }}
              >
                Contacto: lu9wt@jsdrake.com.ar
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <CheckCircleOutlineIcon
              color="primary"
              sx={{
                mr: { xs: 1.25, sm: 1.5 },
                mt: 0.5,
                flexShrink: 0,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
            />
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: 1.3,
                }}
              >
                Código abierto en GitHub
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  lineHeight: 1.4,
                }}
              >
                Contribuciones y reportes son bienvenidos
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            gap: { xs: 1, sm: 2 },
            mt: { xs: 3, sm: 4 },
            mb: { xs: 1, sm: 2 },
          }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<EmailIcon />}
            onClick={() => window.open('mailto:lu9wt@jsdrake.com.ar')}
            fullWidth={window.innerWidth < 600}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              m: 0,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: 'transparent',
              },
            }}
          >
            Contacto
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<GitHubIcon />}
            onClick={() => window.open('https://github.com/JSDRAKE/WT-Log')}
            fullWidth={window.innerWidth < 600}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              m: 0,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            GitHub
          </Button>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: { xs: 2, sm: 3 },
            fontSize: { xs: '0.6875rem', sm: '0.75rem' },
            lineHeight: 1.4,
          }}
        >
          {new Date().getFullYear()} JSDRAKE - LU9WT. Todos los derechos reservados.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          p: { xs: 2, sm: 3 },
          pt: 0,
          justifyContent: 'center',
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          size="large"
          fullWidth={window.innerWidth < 600}
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
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AboutDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AboutDialog;
