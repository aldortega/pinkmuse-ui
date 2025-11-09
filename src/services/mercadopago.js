const API_BASE = "http://localhost:8000/api";

// Crear preferencia MP
export async function CrearPreferenciaMercadoPago(items, eventId) {
  try {
    const response = await fetch(`${API_BASE}/preferencias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, event_id: eventId }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creando preferencia:", error);
    return { success: false, message: "Error de conexión con el servidor" };
  }
}

// Crear comprobante desde el pago
export async function procesarPagoYCrearComprobante(payload) {
  try {
    console.log("📤 Payload completo:", JSON.stringify(payload, null, 2));

    const response = await fetch(`${API_BASE}/comprobantes/desde-mercadopago`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    console.log("📥 Respuesta del backend:", json);
    return json;
  } catch (err) {
    console.error("Error al crear comprobante:", err);
    return { success: false, message: err.message };
  }
}
