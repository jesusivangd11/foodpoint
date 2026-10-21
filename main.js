// Mesana 3.0 — Proceso principal de Electron.
// Levanta el servidor interno (Express + SQLite) y lo muestra en una ventana
// de escritorio propia. No abre cmd ni navegador.
const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

// --- Actualizaciones automaticas ---
// Cada equipo revisa solo si hay version nueva en GitHub Releases (ver "publish"
// en package.json), la descarga en segundo plano y avisa en la interfaz. Se
// instala cuando el usuario pulsa "Reiniciar y actualizar" o, si no lo hace, al
// cerrar Mesana. Los datos viven en %LOCALAPPDATA%\Mesana y no se tocan.
const UPDATE_CHECK_EVERY_MS = 4 * 60 * 60 * 1000;
let updateState = { status: 'idle' };
let autoUpdater = null;

function sendUpdateState(patch) {
  updateState = { ...updateState, ...patch };
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('update:status', updateState);
}

function setupAutoUpdates() {
  // En desarrollo (npm start) no hay instalador que actualizar.
  if (!app.isPackaged) {
    updateState = { status: 'dev' };
    return;
  }
  try {
    ({ autoUpdater } = require('electron-updater'));
  } catch (err) {
    updateState = { status: 'error', message: 'Modulo de actualizaciones no disponible' };
    return;
  }
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('checking-for-update', () => sendUpdateState({ status: 'checking', message: null }));
  autoUpdater.on('update-not-available', () => sendUpdateState({ status: 'up-to-date', checkedAt: new Date().toISOString() }));
  autoUpdater.on('update-available', (info) => sendUpdateState({
    status: 'downloading', version: info.version, notes: releaseNotesText(info.releaseNotes), percent: 0,
  }));
  autoUpdater.on('download-progress', (p) => sendUpdateState({ status: 'downloading', percent: Math.round(p.percent || 0) }));
  autoUpdater.on('update-downloaded', (info) => sendUpdateState({
    status: 'ready', version: info.version, notes: releaseNotesText(info.releaseNotes), percent: 100,
  }));
  autoUpdater.on('error', (err) => {
    // Sin internet o GitHub caido: no es grave, se reintenta en la siguiente revision.
    console.error('[update]', err && err.message);
    sendUpdateState({ status: 'error', message: 'No se pudo revisar si hay actualizaciones (¿sin internet?).' });
  });

  const check = () => autoUpdater.checkForUpdates().catch(() => {});
  setTimeout(check, 8000);
  setInterval(check, UPDATE_CHECK_EVERY_MS);
}

function releaseNotesText(notes) {
  if (!notes) return '';
  const text = Array.isArray(notes) ? notes.map(n => n.note || '').join('\n') : String(notes);
  return text.replace(/<[^>]+>/g, ' ').replace(/[ \t]+/g, ' ').trim().slice(0, 600);
}

ipcMain.handle('app:version', () => app.getVersion());
ipcMain.handle('update:state', () => updateState);
ipcMain.handle('update:check', async () => {
  if (!autoUpdater) return updateState;
  try { await autoUpdater.checkForUpdates(); } catch (e) { /* el evento 'error' ya avisa */ }
  return updateState;
});
ipcMain.handle('update:install', () => {
  if (!autoUpdater || updateState.status !== 'ready') return false;
  // isSilent=true: sin asistente del instalador; isForceRunAfter=true: reabre Mesana al terminar.
  setImmediate(() => autoUpdater.quitAndInstall(true, true));
  return true;
});

// --- Impresoras de Windows (USB o compartidas) ---
// La pagina arma el ticket en HTML; aqui se imprime en silencio, sin el dialogo
// de Windows, en la impresora elegida y al ancho del rollo (80 o 58 mm).
ipcMain.handle('printer:list', async () => {
  if (!mainWindow) return [];
  const list = await mainWindow.webContents.getPrintersAsync();
  return list.map((p) => ({ name: p.name, displayName: p.displayName || p.name, isDefault: !!p.isDefault }));
});

ipcMain.handle('printer:print', async (_event, { deviceName, html, anchoMm = 80, copias = 1 }) => {
  if (!deviceName) throw new Error('Elige una impresora en Configuración.');
  const win = new BrowserWindow({ show: false, webPreferences: { sandbox: true, contextIsolation: true } });
  try {
    await win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
    const alturaPx = await win.webContents.executeJavaScript('document.documentElement.scrollHeight', true).catch(() => 1200);
    const micras = (mm) => Math.round(mm * 1000);
    const altoMm = Math.max(60, Math.ceil(alturaPx * 25.4 / 96) + 12);
    await new Promise((resolve, reject) => {
      win.webContents.print({
        silent: true,
        deviceName,
        printBackground: true,
        copies: Math.max(1, Math.min(5, Number(copias) || 1)),
        margins: { marginType: 'none' },
        pageSize: { width: micras(Number(anchoMm) === 58 ? 58 : 80), height: micras(altoMm) },
      }, (ok, motivo) => (ok ? resolve() : reject(new Error(motivo || 'La impresora no aceptó el trabajo.'))));
    });
    return true;
  } finally {
    win.destroy();
  }
});

// --- Monitor de cocina en esta misma computadora ---
// Se abre en la segunda pantalla si hay una conectada (la que mira la cocina).
let kitchenWindow = null;
ipcMain.handle('kitchen:open', (_event, url) => {
  if (!/^http:\/\/127\.0\.0\.1:\d+\/\?codigo=\d+$/.test(String(url))) return false;
  if (kitchenWindow && !kitchenWindow.isDestroyed()) {
    kitchenWindow.focus();
    return true;
  }
  const { screen } = require('electron');
  const pantallas = screen.getAllDisplays();
  const principal = screen.getPrimaryDisplay();
  const destino = pantallas.find((d) => d.id !== principal.id) || principal;
  kitchenWindow = new BrowserWindow({
    x: destino.bounds.x + 40,
    y: destino.bounds.y + 40,
    width: 1280,
    height: 800,
    title: 'Mesana · Cocina',
    icon: path.join(__dirname, 'mesana.ico'),
    autoHideMenuBar: true,
    backgroundColor: '#101712',
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });
  kitchenWindow.setMenu(null);
  if (destino.id !== principal.id) kitchenWindow.setFullScreen(true);
  else kitchenWindow.maximize();
  kitchenWindow.on('closed', () => { kitchenWindow = null; });
  kitchenWindow.loadURL(url);
  return true;
});

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
    setupAutoUpdates();
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
      preload: path.join(__dirname, 'preload.js'),
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
