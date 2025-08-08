import moment from 'moment-timezone';

export function convertUtcToAsiaKolkata(utcTime) {
  return moment.utc(utcTime).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss A');
}