import { simpleCrypto } from './simpleCrypto';

/**
 * Almacena un valor de forma segura en localStorage
 * @param {string} key - Clave para almacenar el valor
 * @param {any} value - Valor a almacenar (será convertido a JSON y cifrado)
 * @returns {boolean} - True si se guardó correctamente
 */
export const setSecureItem = (key, value) => {
  try {
    if (!key) return false;
    const jsonValue = JSON.stringify(value);
    const encrypted = simpleCrypto.encrypt(jsonValue);
    localStorage.setItem(`secure_${key}`, encrypted);
    return true;
  } catch (error) {
    console.error('Error al guardar elemento seguro:', error);
    return false;
  }
};

/**
 * Obtiene un valor almacenado de forma segura
 * @param {string} key - Clave del valor a recuperar
 * @returns {any} - Valor descifrado o null si hay un error
 */
export const getSecureItem = (key) => {
  try {
    if (!key) return null;
    const encrypted = localStorage.getItem(`secure_${key}`);
    if (!encrypted) return null;

    const decrypted = simpleCrypto.decrypt(encrypted);
    return decrypted ? JSON.parse(decrypted) : null;
  } catch (error) {
    console.error('Error al obtener elemento seguro:', error);
    return null;
  }
};

/**
 * Elimina un valor almacenado de forma segura
 * @param {string} key - Clave del valor a eliminar
 */
export const removeSecureItem = (key) => {
  try {
    if (!key) return;
    localStorage.removeItem(`secure_${key}`);
  } catch (error) {
    console.error('Error al eliminar elemento seguro:', error);
  }
};

/**
 * Almacena credenciales de forma segura
 * @param {string} service - Nombre del servicio (ej: 'qrz', 'hamqth')
 * @param {Object} credentials - Objeto con las credenciales {username, password}
 * @returns {boolean} - True si se guardó correctamente
 */
export const saveCredentials = (service, credentials) => {
  return setSecureItem(`creds_${service}`, credentials);
};

/**
 * Obtiene credenciales almacenadas de forma segura
 * @param {string} service - Nombre del servicio
 * @returns {Object|null} - Objeto con {username, password} o null si hay error
 */
export const getCredentials = (service) => {
  return getSecureItem(`creds_${service}`);
};

/**
 * Elimina credenciales almacenadas
 * @param {string} service - Nombre del servicio
 */
export const removeCredentials = (service) => {
  removeSecureItem(`creds_${service}`);
};
