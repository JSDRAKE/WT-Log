import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
  Divider
} from '@mui/material'
import { format } from 'date-fns'

const BANDAS = [
  '160m',
  '80m',
  '40m',
  '30m',
  '20m',
  '17m',
  '15m',
  '12m',
  '10m',
  '6m',
  '2m',
  '1.25m',
  '70cm',
  '33cm',
  '23cm',
  '13cm',
  '5cm',
  '3cm'
]

const MODOS = [
  'SSB',
  'CW',
  'FT8',
  'FT4',
  'PSK31',
  'RTTY',
  'SSTV',
  'AM',
  'FM',
  'DMR',
  'D-STAR',
  'C4FM',
  'ATV',
  'SSTV',
  'HELL',
  'OLIVIA',
  'JT65',
  'JT9',
  'WSPR'
]

const QsoForm = ({ onSave, qso: initialQso, onClear }) => {
  const [qso, setQso] = useState(() => ({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    callSign: '',
    name: '',
    rstSent: '59',
    rstReceived: '59',
    band: '20m',
    mode: 'SSB',
    qth: '',
    power: '100',
    notes: ''
  }))

  useEffect(() => {
    if (initialQso) {
      setQso({
        ...initialQso,
        date: initialQso.date || format(new Date(), 'yyyy-MM-dd'),
        time: initialQso.time || format(new Date(), 'HH:mm')
      })
    }
  }, [initialQso])

  const handleChange = (e) => {
    const { name, value } = e.target
    setQso((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(qso)
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        {initialQso ? 'Editar Contacto' : 'Nuevo Contacto'}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Fecha"
            type="date"
            name="date"
            value={qso.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true
            }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Hora"
            type="time"
            name="time"
            value={qso.time}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true
            }}
            inputProps={{
              step: 300 // 5 min
            }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Indicativo"
            name="callSign"
            value={qso.callSign}
            onChange={handleChange}
            required
            autoComplete="off"
            autoFocus
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nombre"
            name="name"
            value={qso.name}
            onChange={handleChange}
            autoComplete="off"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="QTH"
            name="qth"
            value={qso.qth}
            onChange={handleChange}
            autoComplete="off"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="band-label">Banda</InputLabel>
            <Select
              name="band"
              value={qso.band}
              onChange={handleChange}
              required
              labelId="band-label"
              label="Banda"
            >
              {BANDAS.map((banda) => (
                <MenuItem key={banda} value={banda}>
                  {banda}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="mode-label">Modo</InputLabel>
            <Select
              name="mode"
              value={qso.mode}
              onChange={handleChange}
              required
              labelId="mode-label"
              label="Modo"
            >
              {MODOS.map((modo) => (
                <MenuItem key={modo} value={modo}>
                  {modo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={4} md={4}>
          <TextField
            fullWidth
            label="RST Enviado"
            name="rstSent"
            value={qso.rstSent}
            onChange={handleChange}
            required
            margin="normal"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={4}>
          <TextField
            fullWidth
            label="RST Recibido"
            name="rstReceived"
            value={qso.rstReceived}
            onChange={handleChange}
            required
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <TextField
            fullWidth
            label="Potencia (W)"
            name="power"
            type="number"
            value={qso.power}
            onChange={handleChange}
            required
            margin="normal"
            inputProps={{
              min: 0,
              step: '0.1'
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notas"
            name="notes"
            value={qso.notes}
            onChange={handleChange}
            multiline
            rows={3}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={onClear}
            disabled={!initialQso}
            fullWidth
            sx={{ mr: 1 }}
          >
            Limpiar
          </Button>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ ml: 1 }}>
            {initialQso ? 'Actualizar' : 'Guardar'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

QsoForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  qso: PropTypes.object,
  onClear: PropTypes.func.isRequired
}

export default QsoForm
