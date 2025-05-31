// Country data with CQ and ITU zones
export const countryData = [
  {
    name: 'Argentina',
    cq: '13',
    itu: '14', // Default ITU zone
    ituZones: [
      { value: '14', label: '14' },
      { value: '16', label: '16' },
    ],
  },
  { name: 'United States', cq: '05', itu: '08', ituZones: [{ value: '08', label: '08' }] },
  { name: 'Spain', cq: '14', itu: '27', ituZones: [{ value: '27', label: '27' }] },
  { name: 'Brazil', cq: '11', itu: '15', ituZones: [{ value: '15', label: '15' }] },
  { name: 'Germany', cq: '14', itu: '28', ituZones: [{ value: '28', label: '28' }] },
  { name: 'Japan', cq: '25', itu: '45', ituZones: [{ value: '45', label: '45' }] },
  { name: 'Australia', cq: '29', itu: '59', ituZones: [{ value: '59', label: '59' }] },
  { name: 'Canada', cq: '02', itu: '09', ituZones: [{ value: '09', label: '09' }] },
  { name: 'France', cq: '14', itu: '27', ituZones: [{ value: '27', label: '27' }] },
  { name: 'Italy', cq: '15', itu: '28', ituZones: [{ value: '28', label: '28' }] },
  { name: 'United Kingdom', cq: '14', itu: '27', ituZones: [{ value: '27', label: '27' }] },
  { name: 'Mexico', cq: '06', itu: '10' },
  { name: 'Chile', cq: '12', itu: '14' },
  { name: 'Colombia', cq: '12', itu: '11' },
  { name: 'Peru', cq: '12', itu: '13' },
  { name: 'Uruguay', cq: '13', itu: '14' },
  { name: 'Paraguay', cq: '11', itu: '14' },
  { name: 'Ecuador', cq: '12', itu: '12' },
  { name: 'Venezuela', cq: '09', itu: '12' },
  { name: 'Bolivia', cq: '10', itu: '12' },
];

// Sort countries alphabetically for better UX
countryData.sort((a, b) => a.name.localeCompare(b.name));

export default countryData;
