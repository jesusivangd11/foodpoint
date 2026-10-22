// Datos de la pagina que cambian seguido. Edita aqui, no en el HTML.
window.MESANA_SITE = {
  // Repositorio PUBLICO donde se publican los instaladores (GitHub Releases).
  // Es el mismo que usa la app para actualizarse sola (package.json > build.publish).
  releasesRepo: 'jesusivangd11/mesana-releases',

  // Contacto para ventas y soporte.
  contacto: {
    nombre: 'Jesús',
    ciudad: 'Chihuahua, Chih.',
    email: 'jesus.ivan.gd11@gmail.com',
    telefono: '614 133 6763',
    whatsapp: '526141336763', // 52 + numero a 10 digitos, sin espacios
  },

  // Precios sugeridos en MXN (puedes cambiarlos cuando quieras).
  planes: [
    {
      id: 'prueba', nombre: 'Prueba', precio: 0, periodo: '30 días',
      lema: 'Todo FoodPoint, sin tarjeta.',
      incluye: ['Todas las funciones', 'Actualizaciones automáticas', 'Tus datos se quedan al activar'],
      cta: 'Descargar gratis', accion: 'descargar',
    },
    {
      id: 'mensual', nombre: 'Mensual', precio: 299, periodo: 'al mes',
      lema: 'Para empezar sin inversión.',
      incluye: ['1 equipo', 'Actualizaciones incluidas', 'Soporte directo por WhatsApp'],
      cta: 'Contratar', accion: 'contacto',
    },
    {
      id: 'pro', nombre: 'Pro', precio: 3490, periodo: 'pago único', destacado: true, etiqueta: 'Recomendado',
      lema: 'Tuyo para siempre.',
      incluye: ['Licencia permanente', '12 meses de soporte', 'Actualizaciones de por vida', 'Ayuda para cargar tu menú'],
      cta: 'Comprar licencia', accion: 'contacto',
    },
  ],
};
