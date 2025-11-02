
import { useState } from 'react';

/**
 * Componente para subir una imagen a un endpoint específico.
 *
 * @param {object} props
 * @param {string} props.endpoint URL del endpoint al que se subirá la imagen.
 * @param {function} props.onUploadSuccess Callback que se ejecuta cuando la imagen se sube con éxito.
 */
function ImageUploader({ endpoint, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState('initial'); // 'initial', 'uploading', 'success', 'error'
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setStatus('initial');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert('Por favor, selecciona un archivo primero.');
      return;
    }

    const formData = new FormData();
    // El nombre "imagen" debe coincidir con el que espera el backend en el controlador.
    formData.append('imagen', selectedFile);

    setStatus('uploading');
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        // No se necesita el header 'Content-Type', el navegador lo establece automáticamente
        // con el boundary correcto para multipart/form-data.
        headers: {
          // Si tu API requiere autenticación, añade el token aquí.
          // 'Authorization': `Bearer ${your_auth_token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al subir la imagen.');
      }

      const result = await response.json();
      setStatus('success');
      console.log('Imagen subida con éxito:', result);

      if (onUploadSuccess) {
        onUploadSuccess(result); // Llama al callback con la respuesta del servidor
      }

    } catch (err) {
      setStatus('error');
      setError(err.message);
      console.error('Error en la subida:', err);
    }
  };

  return (
    <div className="image-uploader">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="file-input">Selecciona una imagen para el evento:</label>
          <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
          />
        </div>
        <button type="submit" disabled={!selectedFile || status === 'uploading'}>
          {status === 'uploading' ? 'Subiendo...' : 'Subir Imagen'}
        </button>
      </form>

      {status === 'success' && <p className="success-message">¡Imagen subida con éxito!</p>}
      {status === 'error' && <p className="error-message">Error: {error}</p>}
    </div>
  );
}

export default ImageUploader;
