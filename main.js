// Mesana 3.0 — Proceso principal de Electron.
// Levanta el servidor interno (Express + SQLite) y lo muestra en una ventana
// de escritorio propia. No abre cmd ni navegador.
const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

// --- Tamaño de la interfaz (zoom) ---
// La PC del trabajo tiene pantalla grande y el programa se veía chico y lejano.
// Arranca un poco ampliado y se puede ajustar con Ctrl + / Ctrl - / Ctrl 0.
// La preferencia se guarda junto a los datos, no en la carpeta del programa,
// para que no se pierda al reinstalar.
// Arranca al 100%: la letra ya subio en el CSS y encimar zoom lo dejaba enorme.
// Quien necesite mas (pantallas grandes o vista cansada) lo sube con Ctrl + y se guarda.
const ZOOM_POR_DEFECTO = 1.0;
const ZOOM_MIN = 0.8;
const ZOOM_MAX = 2.0;

function rutaZoom() {
  const dir = process.env.MESANA_DATA_DIR
    || path.join(process.env.LOCALAPPDATA || app.getPath('userData'), 'Mesana');
  return path.join(dir, 'zoom.json');
}

function leerZoom() {
  try {
    const raw = JSON.parse(fs.readFileSync(rutaZoom(), 'utf8'));
    const z = Number(raw.zoom);
    if (Number.isFinite(z) && z >= ZOOM_MIN && z <= ZOOM_MAX) return z;
  } catch (e) { /* sin preferencia guardada: se usa la de fábrica */ }
  return ZOOM_POR_DEFECTO;
}

function guardarZoom(z) {
  try {
    fs.mkdirSync(path.dirname(rutaZoom()), { recursive: true });
    fs.writeFileSync(rutaZoom(), JSON.stringify({ zoom: z }));
  } catch (e) {
    console.error('[zoom] no se pudo guardar:', e.message);
  }
}

function aplicarZoom(z) {
  if (!mainWindow) return;
  const valor = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Number(z.toFixed(2))));
  mainWindow.webContents.setZoomFactor(valor);
  guardarZoom(valor);
}

function cambiarZoom(paso) {
  if (!mainWindow) return;
  aplicarZoom(mainWindow.webContents.getZoomFactor() + paso);
}

// --- Una sola instancia ---
// Si Mesana ya está abierta, un segundo doble-clic enfoca la ventana existente
// en vez de arrancar otro servidor en el mismo puerto.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    Menu.setApplicationMenu(null); // sin barra de menú: se ve como app nativa

    // Arrancar el servidor interno ANTES de abrir la ventana.
    try {
      const { start } = require('./server');
      await start({
        // Cuando la app pide reiniciarse (p. ej. tras restaurar un respaldo),
        // relanzamos el proceso en vez de matarlo.
        onRestartRequested: () => { app.relaunch(); app.exit(0); },
      });
    } catch (err) {
      const msg = err && err.code === 'EADDRINUSE'
        ? 'Mesana ya está en uso (puerto 4173 ocupado).\nCierra la otra ventana e intenta de nuevo.'
        : 'No se pudo iniciar Mesana:\n' + (err && err.message ? err.message : String(err));
      dialog.showErrorBox('Mesana 3.0', msg);
      app.exit(1);
      return;
    }

    createWindow();
  });

  app.on('window-all-closed', () => {
    app.quit();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    title: 'Mesana 3.0',
    icon: path.join(__dirname, 'mesana.ico'),
    autoHideMenuBar: true,
    backgroundColor: '#ffffff',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // El zoom se fija cuando la página termina de cargar; si se pone antes,
  // Chromium lo descarta al navegar.
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.setZoomFactor(leerZoom());
  });

  // Mostrar ya maximizada y sin parpadeo blanco.
  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  mainWindow.on('closed', () => { mainWindow = null; });

  registrarAtajosZoom(mainWindow);
  mainWindow.loadURL('http://127.0.0.1:4173/index.html');
}

// Atajos para agrandar o achicar la interfaz sobre la marcha.
// Se escuchan en la ventana (no en todo Windows) para no robarle las teclas
// a otros programas cuando Mesana esta en segundo plano.
function registrarAtajosZoom(win) {
  win.webContents.on('before-input-event', (event, input) => {
    // Nota: el menu de la app esta desactivado (Menu.setApplicationMenu(null)),
    // asi que F12 no abre las herramientas de desarrollo y queda libre para que
    // Mesana la use como "Cobrar".
    if (input.type !== 'keyDown' || !input.control || input.alt) return;
    const tecla = String(input.key || '');
    if (tecla === '=' || tecla === '+') {
      cambiarZoom(0.05); event.preventDefault();
    } else if (tecla === '-' || tecla === '_') {
      cambiarZoom(-0.05); event.preventDefault();
    } else if (tecla === '0') {
      aplicarZoom(ZOOM_POR_DEFECTO); event.preventDefault();
    }
  });
}
