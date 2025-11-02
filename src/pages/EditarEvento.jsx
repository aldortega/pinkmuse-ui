// En: frontend/src/pages/EditarEvento.jsx (Ejemplo)

import React from 'react';
import { useParams } from 'react-router-dom'; // Para obtener el ID del evento desde la URL
import ImageUploader from '../components/ImageUploader';

function EditarEvento() {
  // Asumimos que el ID del evento viene de la URL, ej: /eventos/editar/123
  const { eventId } = useParams();
  // const eventId = '123'; // Hardcodeado para el ejemplo, reemplaza con la lógica real

  // Construimos el endpoint específico para este evento.
  // Asegúrate de que la URL base coincida con la de tu API.
  const apiEndpoint = `http://localhost:8000/api/eventos/${eventId}/imagen`;

  // Esta función se ejecutará cuando la imagen se suba correctamente.
  const handleSuccess = (data) => {
    console.log('Datos recibidos del servidor:', data);
    // El backend devuelve un objeto con las rutas de la imagen.
    // Mostramos la ruta PNG como ejemplo.
    const imagePath = data?.ruta_de_la_imagen?.png || 'Ruta no encontrada';
    alert(`¡Éxito! La nueva imagen está en: ${imagePath}`);
  };

  return (
    <div className="editar-evento-page">
      <h1>Editar Evento (ID: {eventId})</h1>
      
      {/* Aquí irían otros campos del formulario del evento (nombre, fecha, etc.) */}
      
      <hr />

      <h2>Subir o Reemplazar Imagen del Evento</h2>
      <ImageUploader
        endpoint={apiEndpoint}
        onUploadSuccess={handleSuccess}
      />
    </div>
  );
}

export default EditarEvento;
