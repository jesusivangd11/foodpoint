# Guía de FoodPoint (antes Mesana) — Actualizaciones, licencias y página web

Mesana es una **aplicación de escritorio** (Electron): se instala con un `.exe` y
abre en su propia ventana. Desde la **3.2.0 se actualiza sola** en cada equipo.

## Idea clave (lo que nunca cambia)

- **El programa** se instala con el instalador; las actualizaciones lo reinstalan encima.
- **Los datos** (ventas, productos, respaldos, licencia) viven aparte, en
  `%LOCALAPPDATA%\Mesana`. Actualizar **nunca** los toca, y antes de instalar una
  actualización Mesana hace un respaldo.

---

## Cómo funcionan las actualizaciones automáticas (3.2.0 en adelante)

```
 PC de desarrollo                GitHub Releases (repo PÚBLICO)            Cada restaurante
 ────────────────                ─────────────────────────────            ────────────────
 cambias código                  jesusivangd11/mesana-releases            Mesana revisa al abrir
 subes "version"   ── publica ─▶  Mesana-Setup-X.exe + latest.yml  ◀──     y cada 4 horas
 Publicar actualizacion.cmd                                                descarga en 2º plano
                                                                           avisa "X está lista"
 página web  ◀── lee novedades y el botón de descarga ──                  instala al reiniciar
```

- La app usa `electron-updater` (main.js). Revisa 8 s después de abrir y cada 4 h.
- Descarga sola; arriba aparece **"Mesana X está lista — Reiniciar y actualizar"**.
  Si el usuario lo cierra, se instala sola al cerrar Mesana.
- En **Configuración → Actualizaciones** se ve la versión y hay un botón **Buscar ahora**.
- La **página web** lee las mismas Releases: muestra novedades, la campana de
  avisos y el botón de descarga siempre apunta al instalador más nuevo.

### Configuración inicial (una sola vez)

1. En GitHub crea un repositorio **público** llamado `mesana-releases`
   (vacío, solo con un README). Ahí solo van los instaladores; el código sigue
   privado en `mesana`. Tiene que ser público para que los equipos de tus
   clientes puedan descargar sin contraseña.
2. Crea un token: GitHub → Settings → Developer settings → **Fine-grained token**,
   solo para `mesana-releases`, permiso **Contents: Read and write**.
3. Guarda el token en `%USERPROFILE%\.mesana-licencias\github-token.txt`
   (una sola línea). Esa carpeta no está en el repo.

### Publicar una actualización

1. Haz tus cambios y prueba con `npm start`.
2. Sube `"version"` en `package.json` (3.2.0 → 3.2.1). **Siempre** tiene que subir,
   o los equipos no la verán como nueva.
3. Doble clic en **`Publicar actualizacion.cmd`**. Crea el instalador y lo sube a
   GitHub Releases.
4. En GitHub, edita la release y escribe las novedades (lista con `- `). Ese texto
   sale en la app y en la página.

En unas horas todos los equipos la tienen. `Crear instalador.cmd` sigue sirviendo
para generar un `.exe` local sin publicar.

### El último paso manual (solo una vez por equipo)

Los equipos que tienen 3.1.6 o anterior **no** traen el actualizador. Hay que
instalarles la **3.2.0** a mano (USB, como siempre). A partir de ahí, ya no.

---

## Licencias

- **Prueba:** 30 días completos desde que se instala la 3.2.0.
- **Fundador:** si la base de datos tiene ventas anteriores al 22-oct-2026, el
  equipo queda con licencia "Fundador" automáticamente. La PC de trabajo actual
  entra aquí: **no hay que hacerle nada**.
- **Vencida:** al terminar la prueba aparece la pantalla de activación. Los datos
  siguen intactos; solo pide la clave.

Las claves son texto firmado (`MSN1.…`) con una clave privada Ed25519. La app solo
trae la clave pública: puede comprobar una licencia pero no fabricarla. No
necesita internet.

**Clave privada:** `%USERPROFILE%\.mesana-licencias\clave-privada.pem`.
**Respaldo:** ya hay una copia en la USB, carpeta `MESANA - LICENCIAS (NO BORRAR NI COMPARTIR)`. Guarda otra en tu nube. Si se pierde, no podrás emitir
licencias nuevas que funcionen con las versiones ya instaladas. Nunca la subas a GitHub.

### Emitir una licencia

```
node tools/generar-licencia.js --cliente "Tacos Lupita" --plan Pro
node tools/generar-licencia.js --cliente "Café Norte" --plan Mensual --vence 2026-12-31
node tools/generar-licencia.js --cliente "Fonda Rosy" --plan Pro --equipo 1A2B-3C4D-5E6F
```

- `--vence`: la licencia deja de funcionar ese día (para planes mensuales).
- `--equipo`: solo funciona en ese equipo (el cliente ve su ID en
  Configuración → Licencia). Sin esto, la clave sirve en cualquier equipo.
- Todas quedan anotadas en `%USERPROFILE%\.mesana-licencias\licencias-emitidas.csv`.

El cliente la pega en **Configuración → Licencia** (o en la pantalla de activación).

El contrato de licencia (`LICENCIA.txt`) lo muestra el instalador y está también en
`website/licencia.html`.

---

## Página web (`website/`)

Sitio estático (HTML/CSS/JS, sin compilar): `index.html` (inicio, funciones, video,
precios, novedades), `ayuda.html` (guía de uso con buscador) y `licencia.html`.

- **Precios, contacto y repo de releases:** `website/assets/js/config.js`.
  Cambia el correo/WhatsApp de ejemplo antes de publicar.
- **Novedades:** se leen de GitHub Releases; si no hay conexión usa
  `website/novedades.json`.
- **Video:** `website/assets/video/mesana-tutorial.mp4`.
- **Publicarla gratis:** sube la carpeta `website` a Netlify (arrastrar y soltar),
  Vercel o GitHub Pages del repo público `mesana-releases`.

---

## PC de trabajo (instalación manual, como respaldo)

1. Copia `dist-installer\FoodPoint-Setup-X.X.X.exe` a la PC de trabajo (USB).
2. Doble clic → **Siguiente / Instalar**. Tus datos siguen intactos.


---

## Versión 3.3.0 — Mesana ahora es FoodPoint

Todo lo **visible** dice FoodPoint (app, ventana, ícono, accesos directos, instalador
`FoodPoint-Setup-X.exe`, tickets, monitor de cocina, contrato y página web).
Lo **interno** se conservó a propósito para no romper equipos instalados:

| Se quedó igual | Por qué |
|---|---|
| `appId` `com.mesana.pos` | Si cambia, Windows lo trata como otro programa y la actualización automática se rompe. |
| Repo `mesana-releases` | Es de donde los equipos ya instalados buscan actualizaciones. |
| Carpeta de datos `%LOCALAPPDATA%\Mesana` | Equipos existentes la siguen usando; las instalaciones **nuevas** usan `%LOCALAPPDATA%\FoodPoint`. No se mueve para no arriesgar datos. |
| Licencias `MSN1.` e ID de equipo | Cambiarlos invalidaría las licencias ya emitidas. |
| Carpeta `%USERPROFILE%\.mesana-licencias` | Solo en la PC de desarrollo. |

**Accesos directos al actualizar:** electron-builder renombra el acceso "Mesana 3.0"
a "FoodPoint", pero conservaría el destino viejo (`Mesana 3.0.exe`, que se borra).
`build/installer.nsh` (macro `customInstall`) los recrea apuntando a `FoodPoint.exe` y
relanza ese. **Probado** actualizando una instalación real 3.2.1 → 3.3.0 en la PC de
desarrollo: misma carpeta, accesos nuevos funcionando, app reabierta sola, datos intactos.

El nombre de restaurante de fábrica "Mesana" se migra a "FoodPoint" al arrancar.
Al primer inicio en equipos con ventas aparece una vez el aviso "Mesana ahora se llama
FoodPoint". Los colores se quedaron en el verde de siempre (`theme-sage`).

Logo: `assets/img/foodpoint-mark-512.png` (insignia sobre disco crema; el tenedor del logo
es del mismo crema que el fondo, por eso no puede ir sin disco), `foodpoint.ico` (16–256 px).

## Versión 3.2.2 — impresión real y monitor de cocina

Antes de esta versión **no se imprimía nada**: el botón "Enviar a impresora" solo
mostraba un aviso y las IPs de impresoras se guardaban sin usarse.

- **Impresoras** (Configuración → Impresoras): una de *cocina* y una de *caja*.
  Tipo USB/Windows (Electron imprime en silencio, `main.js` → `printer:print`) o de
  red IP (ESC/POS por TCP 9100, `printing.js`). Papel de 80 o 58 mm, copias, prueba.
- **Qué se imprime:** COCINA al enviar; ADICIONAL solo con lo agregado al editar;
  CANCELAR con lo quitado o al cancelar; ticket del cliente al cobrar con F1; la
  cuenta desde el botón Ticket; reimpresión desde la comanda y desde Ventas.
- **Monitor de cocina** (`cocina.html`, servidor aparte en el puerto **4174**, con
  código de 6 dígitos): tickets con cronómetro (ámbar a 10 min, rojo a 20), botón
  Listo/Enterado, deshacer, tachar platillos, sonido. Se abre en el 2.º monitor o en
  una tablet de la misma red (opción "Permitir una tablet…"; Windows pedirá permiso
  de firewall en *Redes privadas*).
- **Tickets de cocina** en la tabla `kitchen_tickets`, aparte de `orders`, porque al
  cobrar la comanda se borra y la cocina debe seguir viéndola hasta marcarla lista.
  La caja consulta `/api/kitchen/estado` cada 5 s y avisa "¡Orden #N lista!".

## Versión 3.2.0 — qué cambia

Instalador: `dist-installer\Mesana-Setup-3.2.0.exe` (el nombre ya no lleva espacios).

**Combos con grupos a elegir**

- Además de lo fijo, un combo puede tener **grupos a elegir** ("Plato fuerte:
  montados o chilaquiles"). Al venderlo se elige el producto y después sus variantes.
- **Armador de combos nuevo:** catálogo a la izquierda, contenido a la derecha. Lo que
  tocas se agrega a la sección marcada, se resalta y se lleva a la vista. Muestra
  cuánto costaría por separado contra el precio del combo.

**Actualizaciones automáticas y licencias** (ver arriba).

**Arreglo:** al enviar una comanda la tarjeta decía "Hace NaN min" hasta reiniciar.
---

## Versión 3.1.6 — qué cambia

Instalador: `dist-installer\Mesana 3.0 Setup 3.1.6.exe`.

**Nada se borra por accidente**

- Al quitar un producto del ticket (bajar de 1 a 0, o la ×) **pregunta primero**.
- Al **cancelar una comanda** pregunta antes, diciendo qué mesa y cuántos artículos.

**Las ventas ya no se eliminan, solo se cancelan**

- Se quitó el botón **"Eliminar venta"**. En su lugar está **"Cancelar venta"**, que
  pregunta antes y **conserva el ticket** en el historial marcado como cancelado,
  con quién lo canceló y a qué hora.
- El servidor también rechaza cualquier intento de borrar una venta. El historial
  queda completo y no se presta a que desaparezca dinero.

**Uber y DiDi bien marcados**

- En las ventas del día, los pedidos por plataforma llevan una **banda de color**
  (verde Uber, naranja DiDi) igual que la banda roja de "CANCELADA", y dice el día
  en que esa plataforma deposita.
- En **Reportes → ventas por forma de pago** cada plataforma sale con su etiqueta
  de color y su día de depósito.

**Cobro en dos pasos**

- Al cobrar se ve el total y dos botones: **"Elegir método de pago"** (efectivo,
  transferencia, tarjeta, Uber o DiDi) y **"2 o más métodos de pago"** (para dividir
  el total; ahí no salen las plataformas, porque ese pedido viene pagado completo).
- Si es efectivo, se escribe con cuánto paga el cliente y el **cambio** sale solo.

**Atajos de teclado (como Eleventa)**

| Tecla | Hace |
|---|---|
| F1  | Cobrar e imprimir ticket |
| F2  | Cobrar sin ticket |
| F3  | Buscar producto |
| F4  | Dashboard |
| F5  | Comandas |
| F6  | Ticket nuevo |
| F7  | Enviar comanda a cocina |
| F8  | Ventas del día |
| F9  | Reportes |
| F12 | Cobrar |
| Esc | Cerrar la ventana abierta |

La lista está siempre a la mano con **F10** o con el botón **⌨ Atajos** del pie de página.

**Los números ya no llevan el cero rayado**

- La fuente de las cifras cambió a una de ancho fijo con el cero limpio, así que las
  columnas de precios siguen alineadas pero sin la raya que ensuciaba la vista.

---

## Versión 3.1.5 — qué cambia

Instalador: `dist-installer\Mesana 3.0 Setup 3.1.5.exe`.

**Ventas por Uber y DiDi**

- Al cobrar, en la lista de formas de pago ahora salen **Uber** y **DiDi**. Se elige
  la plataforma en lugar de efectivo o tarjeta, y el cobro se llena solo con el total.
- Aparece un aviso en el momento del cobro: *"Venta por Uber Eats · deposita los
  lunes · $X NO entra al efectivo de hoy"*. DiDi deposita los **martes**.
- Las ventas por plataforma quedan marcadas con su etiqueta de color en la lista de
  ventas y en el detalle del ticket, para reconocerlas de un vistazo.
- La venta **sí cuenta** en las ventas del día y en los reportes; lo que cambia es de
  dónde viene el dinero.

**Corte de hoy (nuevo, en el Dashboard)**

- Arriba del tablero hay un recuadro partido en dos: **En caja** (efectivo,
  transferencia, tarjeta) y **Por cobrar a plataformas** (Uber y DiDi, cada una con
  el día en que deposita).
- Así, al contar el dinero ya no "falta" efectivo: lo de las plataformas está
  separado y sumado aparte.

**La comanda se manda sola**

- Si le das *Enviar comanda a cocina* y todavía no hay mesa, la eliges y la comanda
  **sale automáticamente**. Ya no hay que volver a presionar el botón.
- Si cancelas la ventana de la mesa, no se manda nada.

**Letra más grande en todo el programa**

- Se subió el tamaño de letra de toda la interfaz (menús, tarjetas, ticket, tablas,
  reportes). Pensado para la pantalla de la PC del trabajo, donde se veía chico.
- La app de escritorio ahora abre con la interfaz **15% más grande** de fábrica, y se
  ajusta en el momento con **Ctrl +** (agrandar), **Ctrl −** (achicar) y **Ctrl 0**
  (volver al tamaño normal). El tamaño que elijas se guarda y se respeta la próxima
  vez que abras el programa, incluso después de reinstalar.

**La cantidad por variante ahora se activa producto por producto**

- En el formulario del producto, abajo de las variantes, está la casilla
  **"Pedir varias variantes de una vez"**.
- Encendida: al agregarlo al ticket se pone la cantidad de cada variante
  (2 de asado, 5 de prensado) en una sola pasada.
- Apagada (como vienen todos los productos existentes): se agrega de uno en uno,
  igual que siempre.

**Fotos: recuadros más grandes y encuadre ajustable**

- Las tarjetas del menú son más grandes y la foto se ve a mayor altura, mucho más clara.
- En el formulario del producto (y del combo), **arrastra la foto dentro del recuadro**
  para elegir qué parte se ve. El recuadro tiene la misma forma que la tarjeta del
  menú, así que lo que ves ahí es exactamente lo que va a salir.
- Botón **Centrar** para volver al encuadre original. El ajuste se guarda por producto
  y se puede cambiar cuando quieras sin volver a subir la foto.

---

## Versión 3.1.4 — qué cambia

Instalador: `dist-installer\Mesana 3.0 Setup 3.1.4.exe`.

**Arreglo: las fotos de productos ya no se borran solas**

- Las fotos pesadas (la mayoría de las tomadas con celular) se rechazaban al
  guardarse y el programa no avisaba: se veían bien en pantalla hasta cerrar la
  app y al día siguiente aparecían sin imagen. Ahora todas se guardan.
- Cada foto se comprime automáticamente antes de guardarse, así que ninguna
  queda fuera por pesada, y si algo falla el programa ahora sí avisa.
- Las fotos en PNG con fondo transparente ya no salen con el fondo negro.
- Editar o cancelar una comanda ya no borra la foto, el precio, el costo, la
  categoría ni las variantes de los productos de esa comanda.
- El logo del negocio (Ajustes) se guardaba igual de mal; también quedó arreglado.

**La mesa ya no se pide antes de capturar**

- Vuelve el flujo de antes: **eliges el producto y entra al ticket de inmediato**.
  El tipo de orden (Comedor o Llevar) y la mesa se eligen después, cuando quieras,
  en el encabezado del ticket.
- Ya no salta la ventana de "Primero elige Comedor o Llevar" a media captura, que
  era lo que hacía lento tomar el pedido.
- La mesa sigue siendo obligatoria, pero **se pide hasta enviar la comanda a cocina**:
  si le das enviar sin haberla elegido, ahí te la pregunta y luego manda el pedido.

**Nuevo: cantidad por variante (se acabó el de uno en uno)**

- Al agregar un producto con variantes, ahora se pone **la cantidad de cada
  variante en una sola pasada**: 2 de asado y 5 de prensado se piden de un jalón,
  sin abrir la ventana siete veces.
- Cada variante tiene su propio **− cantidad +**. Abajo se ve el resumen
  ("2× Asado · 5× Prensado — 7 unidades · $715.00") y el botón dice cuántos vas
  a agregar. En el ticket se agrupan solos: una línea por variante.
- Si solo quieres uno, el flujo es igual de rápido que antes.
- En productos con **varios grupos** de variantes (ej. guisado + extras), se arma
  cada combinación, se le pone cantidad y con **"+ Agregar otra variante"** se
  aparta para armar la siguiente. Todas se agregan juntas al ticket.

**Nuevo: los combos también aceptan foto**

- En AGREGAR/EDITAR COMBO hay un campo "Imagen del combo", igual que en productos.
- La foto se muestra grande en la tarjeta del combo dentro del punto de venta.
  Si el combo no tiene foto, se sigue viendo su ícono.

> Nota: las fotos que ya se habían perdido no se pueden recuperar (nunca llegaron
> a guardarse). Hay que volver a ponerlas una vez instalada esta versión.

---

## Versión 3.1.0 — qué cambia

Instalador: `dist-installer\Mesana 3.0 Setup 3.1.0.exe`.
Se instala encima de la 3.0.0 sin tocar la base de datos.

**Pantalla de Inicio (punto de venta)**

- **Pestañas de tickets** arriba del ticket (estilo Eleventa): se atienden varios
  pedidos a la vez y se salta entre ellos con un clic. **Doble clic** en una pestaña
  para renombrarla (ej. "Dr. Borunda"); la **×** la cierra. Se acabaron los botones
  "Pausar / Pausados".
- Los tickets abiertos **se guardan solos** y sobreviven a cerrar la app.
- **Orden estricto:** primero se elige Comedor (y mesa) o Llevar, y después se agregan
  productos. Una vez configurado el ticket, la mesa ya no se puede cambiar por accidente
  (el botón ✎ del encabezado sirve para corregirla a propósito).
- Ticket más alto, notas plegadas, aviso "▼ hay más productos" cuando la lista sigue
  hacia abajo, y confirmación antes de "Limpiar".
- Las tarjetas de producto **ya no se recortan** cuando hay muchos productos
  (probado con 140). Se quitó la línea de "Stock" del menú; la señal roja "Sin stock"
  se mantiene.

**Combos**

- Si un combo lleva varias piezas del mismo producto con variantes (ej. 3 montados),
  ahora **se configura pieza por pieza**: "Unidad 1 de 3", "Unidad 2 de 3"…
  Botón **"Aplicar la 1ª a todas"** cuando todas van iguales.
- Las piezas iguales se agrupan en la comanda ("2x Montado (Asado)", "1x Montado (Verde)"),
  y eso se refleja en cocina, en el inventario y en el reporte de variantes.

**Reportes de ventas (nuevo, menú FINANZAS → Reportes)**

- Periodos: **Semana actual, Mes actual, Mes anterior, Año actual y Periodo…**
  (rango de fechas a elegir).
- Gráfica de barras con **ventas y ganancia**, y tarjetas de ventas totales, venta
  promedio, ganancia y margen de utilidad.
- Tablas de **ventas por día/mes**, **ventas por categoría** (con %),
  **productos más vendidos** y **ventas por forma de pago**.
- Botón **Exportar CSV** (se abre en Excel).

---

## Instalación por primera vez en la PC de trabajo (viniendo de la 2.0)

1. **Respaldo de seguridad:** copia tu `database.db` actual a una USB
   (está en `%LOCALAPPDATA%\Mesana\database.db`).
2. Ejecuta `Mesana 3.0 Setup 3.0.0.exe` → **Siguiente / Instalar**.
3. Abre Mesana desde el nuevo acceso directo. Reutiliza automáticamente tu base de
   datos de `%LOCALAPPDATA%\Mesana` (la misma que usaba la 2.0).
4. Cuando confirmes que todo está bien, puedes **desinstalar la versión 2.0** vieja
   (Panel de control → Programas, o su desinstalador). Los datos no se tocan.

> **Aviso de Windows SmartScreen:** como el instalador no está firmado con un
> certificado de pago, Windows puede mostrar *"Windows protegió tu PC"*.
> Es normal: clic en **Más información → Ejecutar de todas formas**.

---

## Notas

- **Respaldos automáticos:** el programa guarda una copia de la base cada hora
  (últimas 30) en `%LOCALAPPDATA%\Mesana\backups`. También puedes restaurar un
  respaldo desde la app; al restaurar, Mesana se reinicia sola.
- **Dónde se instala:** por usuario, en
  `%LOCALAPPDATA%\Programs\Mesana 3.0` (no pide permisos de administrador).
- **Desinstalar:** desde *Agregar o quitar programas* de Windows. Desinstalar el
  programa **no borra** tus datos (viven en `%LOCALAPPDATA%\Mesana`).
