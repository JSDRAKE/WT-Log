import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
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
          background: `linear-gradient(145deg, ${alpha(
            theme.palette.background.paper,
            0.9
          )} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: theme.shadows[10],
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor:
            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          textAlign: 'center',
          py: 2,
        }}
      >
        <Typography variant="h3" component="div">
          WT-Log
        </Typography>
        <Typography variant="caption" color="text.secondary">
          v{version}
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Un libro de guardia digital para radioaficionados
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            background:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.primary.main, 0.1)
                : alpha(theme.palette.primary.light, 0.1),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              alt="JSDRAKE"
              sx={{ width: 56, height: 56, mr: 2 }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                JSDRAKE - LU9WT
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Desarrollador
              </Typography>
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" gap={1} mt={2}>
            <Button
              component="a"
              href="mailto:lu9wt@jsdrake.com.ar"
              startIcon={<EmailIcon />}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                color: 'text.primary',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              lu9wt@jsdrake.com.ar
            </Button>

            <Button
              component="a"
              href="https://github.com/JSDRAKE/WT-Log"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<GitHubIcon />}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                color: 'text.primary',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              github.com/JSDRAKE/WT-Log
            </Button>
          </Box>
        </Paper>

        <Box textAlign="center" mt={3}>
          <Typography variant="caption" color="text.secondary">
            {' '}
            {new Date().getFullYear()} WT-Log - Todos los derechos reservados
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            borderRadius: 2,
            py: 1,
            textTransform: 'none',
            fontWeight: 'medium',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: theme.shadows[2],
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
