// Servir la interfaz HTML cuando se accede a la Web App
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Registro de Clientes')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Función que recibe el objeto formulario y guarda los datos en Google Sheets
 * @param {Object} formData - Objeto con los datos del cliente
 * @return {Object} Estado de la operación
 */
function registrarCliente(formData) {
  try {
    // Abrir la hoja de cálculo activa
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var nombrePestana = "Clientes";
    var sheet = ss.getSheetByName(nombrePestana);
    
    // Si la pestaña no existe, se crea y se colocan los encabezados
    if (!sheet) {
      sheet = ss.insertSheet(nombrePestana);
      sheet.appendRow(["Fecha de Registro", "Usuario / Cliente", "Contraseña / PIN", "Correo Contacto"]);
      sheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#e0e0e0");
    }
    
    // Validar que los campos principales no lleguen vacíos
    if (!formData.usuario || !formData.password) {
      return { success: false, message: "El usuario y la contraseña son obligatorios." };
    }
    
    // Capturar la fecha actual en formato legible
    var fechaRegistro = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    
    // Insertar la nueva fila ordenada al final
    sheet.appendRow([
      fechaRegistro,
      formData.usuario.trim(),
      formData.password,
      formData.correo ? formData.correo.trim() : "N/A"
    ]);
    
    // Ajustar automáticamente el ancho de las columnas
    sheet.autoResizeColumns(1, 4);
    
    return { success: true, message: "Cliente registrado con éxito." };
    
  } catch (error) {
    return { success: false, message: "Error al guardar: " + error.toString() };
  }
}
