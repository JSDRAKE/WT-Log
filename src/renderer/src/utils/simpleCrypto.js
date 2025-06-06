// Clave de cifrado - En producción, considera usar una clave más segura o una variable de entorno
const ENCRYPTION_KEY = 'wt-log-secure-key-2023' + window.location.hostname;

export const simpleCrypto = {
  // Función para cifrar texto
  encrypt(str) {
    if (!str) return '';
    try {
      let result = '';
      for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
        result += String.fromCharCode(charCode);
      }
      return btoa(result); // Convertir a base64
    } catch (error) {
      console.error('Error al cifrar:', error);
      return '';
    }
  },

  // Función para descifrar texto
  decrypt(encodedStr) {
    if (!encodedStr) return '';
    try {
      const str = atob(encodedStr); // Decodificar base64
      let result = '';
      for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (error) {
      console.error('Error al descifrar:', error);
      return '';
    }
  },
};
