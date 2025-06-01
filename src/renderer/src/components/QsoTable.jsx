import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Tooltip, Box } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const QsoTable = ({ qsos, onEdit, onDelete }) => {
  const columns = [
    {
      field: 'date',
      headerName: 'Fecha',
      width: 120,
      valueFormatter: (params) => {
        return format(new Date(params.value), 'dd/MM/yyyy', { locale: es });
      },
    },
    {
      field: 'time',
      headerName: 'Hora',
      width: 100,
      valueFormatter: (params) => {
        return format(new Date(`2000-01-01T${params.value}`), 'HH:mm');
      },
    },
    { field: 'callSign', headerName: 'Indicativo', width: 130 },
    { field: 'name', headerName: 'Nombre', width: 180 },
    { field: 'rstSent', headerName: 'RST Enviado', width: 120 },
    { field: 'rstReceived', headerName: 'RST Recibido', width: 130 },
    { field: 'band', headerName: 'Banda', width: 100 },
    { field: 'mode', headerName: 'Modo', width: 100 },
    { field: 'qth', headerName: 'QTH', width: 150 },
    { field: 'power', headerName: 'Potencia (W)', width: 120 },
    { field: 'notes', headerName: 'Notas', flex: 1 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => onEdit(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton size="small" onClick={() => onDelete(params.row.id)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: '70vh', width: '100%' }}>
      <DataGrid
        rows={qsos}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
        localeText={{
          noRowsLabel: 'No hay contactos registrados',
          footerRowSelected: (count) =>
            count !== 1
              ? `${count.toLocaleString()} contactos seleccionados`
              : '1 contacto seleccionado',
        }}
      />
    </Box>
  );
};

QsoTable.propTypes = {
  qsos: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default QsoTable;
