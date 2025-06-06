/**
 * Country data with CQ and ITU zones
 * Data sourced from IARU and CQ/ITU zone maps
 * Last updated: June 2025
 */
export const countryData = [
  // North America
  {
    name: 'United States',
    cqZones: [
      { value: '03', label: '03' },
      { value: '04', label: '04' },
      { value: '05', label: '05' },
      { value: '06', label: '06' },
    ],
    cq: '05', // Valor por defecto para compatibilidad
    itu: '08',
    ituZones: [
      { value: '06', label: '06' },
      { value: '07', label: '07' },
      { value: '08', label: '08' },
      { value: '09', label: '09' },
    ],
  },
  {
    name: 'Canada',
    cq: '02',
    itu: '09',
    ituZones: [
      { value: '02', label: '02' },
      { value: '04', label: '04' },
      { value: '05', label: '05' },
      { value: '09', label: '09' },
    ],
  },
  { name: 'Mexico', cq: '06', itu: '10', ituZones: [{ value: '10', label: '10' }] },

  // Central America & Caribbean
  { name: 'Belize', cq: '07', itu: '11', ituZones: [{ value: '11', label: '11' }] },
  { name: 'Costa Rica', cq: '07', itu: '11', ituZones: [{ value: '11', label: '11' }] },
  { name: 'El Salvador', cq: '07', itu: '11', ituZones: [{ value: '11', label: '11' }] },
  { name: 'Guatemala', cq: '07', itu: '11', ituZones: [{ value: '11', label: '11' }] },
  { name: 'Honduras', cq: '07', itu: '11', ituZones: [{ value: '11', label: '11' }] },
  { name: 'Nicaragua', cq: '07', itu: '11', ituZones: [{ value: '11', label: '11' }] },
  { name: 'Panama', cq: '07', itu: '11', ituZones: [{ value: '11', label: '11' }] },

  // South America
  {
    name: 'Argentina',
    cq: '13',
    itu: '14',
    ituZones: [
      { value: '14', label: '14' },
      { value: '16', label: '16' },
    ],
  },
  { name: 'Bolivia', cq: '10', itu: '12', ituZones: [{ value: '12', label: '12' }] },
  {
    name: 'Brazil',
    cq: '11',
    itu: '15',
    ituZones: [
      { value: '11', label: '11' },
      { value: '13', label: '13' },
      { value: '15', label: '15' },
      { value: '16', label: '16' },
    ],
  },
  { name: 'Chile', cq: '12', itu: '14', ituZones: [{ value: '14', label: '14' }] },
  { name: 'Colombia', cq: '09', itu: '11', ituZones: [{ value: '11', label: '11' }] },
  { name: 'Ecuador', cq: '10', itu: '12', ituZones: [{ value: '12', label: '12' }] },
  { name: 'Paraguay', cq: '11', itu: '14', ituZones: [{ value: '14', label: '14' }] },
  { name: 'Peru', cq: '10', itu: '13', ituZones: [{ value: '13', label: '13' }] },
  { name: 'Uruguay', cq: '13', itu: '14', ituZones: [{ value: '14', label: '14' }] },
  { name: 'Venezuela', cq: '09', itu: '12', ituZones: [{ value: '12', label: '12' }] },

  // Europe
  { name: 'Albania', cq: '15', itu: '28', ituZones: [{ value: '28', label: '28' }] },
  { name: 'Austria', cq: '15', itu: '28', ituZones: [{ value: '28', label: '28' }] },
  { name: 'Belgium', cq: '14', itu: '27', ituZones: [{ value: '27', label: '27' }] },
  { name: 'Bulgaria', cq: '20', itu: '28', ituZones: [{ value: '28', label: '28' }] },
  {
    name: 'France',
    cq: '14',
    itu: '27',
    ituZones: [
      { value: '27', label: '27' },
      { value: '28', label: '28' },
    ],
  },
  { name: 'Germany', cq: '14', itu: '28', ituZones: [{ value: '28', label: '28' }] },
  { name: 'Greece', cq: '20', itu: '28', ituZones: [{ value: '28', label: '28' }] },
  { name: 'Italy', cq: '15', itu: '28', ituZones: [{ value: '28', label: '28' }] },
  { name: 'Netherlands', cq: '14', itu: '27', ituZones: [{ value: '27', label: '27' }] },
  { name: 'Norway', cq: '14', itu: '27', ituZones: [{ value: '27', label: '27' }] },
  { name: 'Poland', cq: '15', itu: '28', ituZones: [{ value: '28', label: '28' }] },
  { name: 'Portugal', cq: '14', itu: '27', ituZones: [{ value: '27', label: '27' }] },
  { name: 'Romania', cq: '20', itu: '28', ituZones: [{ value: '28', label: '28' }] },
  {
    name: 'Russia',
    cq: '16',
    itu: '29',
    ituZones: [
      { value: '17', label: '17' },
      { value: '18', label: '18' },
      { value: '19', label: '19' },
      { value: '20', label: '20' },
      { value: '21', label: '21' },
    ],
  },
  { name: 'Spain', cq: '14', itu: '27', ituZones: [{ value: '27', label: '27' }] },
  { name: 'Sweden', cq: '14', itu: '27', ituZones: [{ value: '27', label: '27' }] },
  { name: 'Switzerland', cq: '14', itu: '28', ituZones: [{ value: '28', label: '28' }] },
  { name: 'Turkey', cq: '20', itu: '28', ituZones: [{ value: '28', label: '28' }] },
  {
    name: 'United Kingdom',
    cq: '14',
    itu: '27',
    ituZones: [
      { value: '27', label: '27' },
      { value: '28', label: '28' },
    ],
  },

  // Africa
  { name: 'Algeria', cq: '33', itu: '37', ituZones: [{ value: '37', label: '37' }] },
  { name: 'Egypt', cq: '34', itu: '38', ituZones: [{ value: '38', label: '38' }] },
  { name: 'Kenya', cq: '37', itu: '41', ituZones: [{ value: '41', label: '41' }] },
  { name: 'Morocco', cq: '33', itu: '37', ituZones: [{ value: '37', label: '37' }] },
  { name: 'Nigeria', cq: '35', itu: '46', ituZones: [{ value: '46', label: '46' }] },
  { name: 'South Africa', cq: '38', itu: '57', ituZones: [{ value: '57', label: '57' }] },
  { name: 'Tunisia', cq: '33', itu: '37', ituZones: [{ value: '37', label: '37' }] },

  // Asia
  {
    name: 'China',
    cq: '24',
    itu: '44',
    ituZones: [
      { value: '33', label: '33' },
      { value: '42', label: '42' },
      { value: '43', label: '43' },
      { value: '44', label: '44' },
    ],
  },
  {
    name: 'India',
    cq: '22',
    itu: '41',
    ituZones: [
      { value: '41', label: '41' },
      { value: '42', label: '42' },
    ],
  },
  {
    name: 'Indonesia',
    cq: '28',
    itu: '54',
    ituZones: [
      { value: '51', label: '51' },
      { value: '54', label: '54' },
      { value: '55', label: '55' },
    ],
  },
  {
    name: 'Japan',
    cq: '25',
    itu: '45',
    ituZones: [
      { value: '45', label: '45' },
      { value: '90', label: '90' },
      { value: '91', label: '91' },
    ],
  },
  { name: 'Malaysia', cq: '28', itu: '54', ituZones: [{ value: '54', label: '54' }] },
  { name: 'Philippines', cq: '27', itu: '50', ituZones: [{ value: '50', label: '50' }] },
  { name: 'Saudi Arabia', cq: '21', itu: '39', ituZones: [{ value: '39', label: '39' }] },
  { name: 'Singapore', cq: '28', itu: '54', ituZones: [{ value: '54', label: '54' }] },
  { name: 'South Korea', cq: '25', itu: '44', ituZones: [{ value: '44', label: '44' }] },
  { name: 'Thailand', cq: '26', itu: '49', ituZones: [{ value: '49', label: '49' }] },

  // Oceania
  {
    name: 'Australia',
    cq: '29',
    itu: '59',
    ituZones: [
      { value: '58', label: '58' },
      { value: '59', label: '59' },
      { value: '60', label: '60' },
    ],
  },
  { name: 'New Zealand', cq: '30', itu: '60', ituZones: [{ value: '60', label: '60' }] },

  // Other regions
  { name: 'Antarctica', cq: '13', itu: '74', ituZones: [{ value: '74', label: '74' }] },
  { name: 'Greenland', cq: '05', itu: '09', ituZones: [{ value: '09', label: '09' }] },
  { name: 'Iceland', cq: '40', itu: '27', ituZones: [{ value: '27', label: '27' }] },
];

// Sort countries alphabetically for better UX
countryData.sort((a, b) => a.name.localeCompare(b.name));

export default countryData;
