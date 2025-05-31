import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Link,
  Box,
  Divider,
} from '@mui/material';
import pkg from '../../../../package.json';

const { version } = pkg;

const AboutDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Acerca de WT-Log</DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <Typography variant="h5" component="div" gutterBottom>
            WT-Log
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Versión: {version}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Un libro de guardia digital para radioaficionados
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Desarrollado por:
          </Typography>
          <Typography variant="body2" gutterBottom>
            JSDRAKE - LU9WT
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Contacto:{' '}
            <Link href="mailto:lu9wt@jsdrake.com.ar" underline="hover">
              lu9wt@jsdrake.com.ar
            </Link>
          </Typography>
          <Typography variant="body2" gutterBottom>
            Repositorio:{' '}
            <Link
              href="https://github.com/JSDRAKE/WT-Log"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
            >
              github.com/JSDRAKE/WT-Log
            </Link>
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" display="block" color="text.secondary">
            © {new Date().getFullYear()} WT-Log. Todos los derechos reservados.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
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
