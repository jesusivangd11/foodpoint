// ===================== CONSTANTS =====================
const STORAGE_KEY = 'mesana-pos-state-v2';
const DEFAULT_TAX_RATE = 16;

const THEMES = [
  { key: 'theme-foodpoint', color: '#6E7339', label: 'FoodPoint' },
  { key: 'theme-sage', color: '#6B8F71', label: 'Sage' },
  { key: 'theme-slate', color: '#5A7A9A', label: 'Slate' },
  { key: 'theme-terracota', color: '#9A6050', label: 'Terracota' },
  { key: 'theme-dusk', color: '#7A6A9A', label: 'Dusk' },
  { key: 'theme-gold', color: '#9A7A30', label: 'Gold' },
  { key: 'theme-steel', color: '#5A6A7A', label: 'Steel' },
];

const MESAS = ['Mesa 1', 'Mesa 2', 'Mesa 3'];

// Biblioteca de iconos de linea (contenido interno del SVG, viewBox 0 0 24 24).
// Se guarda solo el ID del icono por categoria/combo; el SVG se arma con iconSvg().
const ICON_PATHS = {
  utensils: `<path d="M3 2v7a2 2 0 002 2h2a2 2 0 002-2V2"/><path d="M6 2v20"/><path d="M19 2a4 4 0 00-4 4v6a2 2 0 002 2h2"/><path d="M19 14v8"/>`,
  steak: `<path d="M7 5c3-1.5 7-1 9 1.5s1.5 6.5-1.5 8.5-7.5 2-9.5-1S4 6.5 7 5z"/><circle cx="9.5" cy="10" r="1.8"/>`,
  drink: `<path d="M9 11h6"/><path d="M12 11v8"/><path d="M8 22h8"/><path d="M7 11h10v-1a5 5 0 00-10 0v1z"/><path d="M19 6a2 2 0 100-4 2 2 0 000 4z"/>`,
  cake: `<path d="M6 13h12v7a1 1 0 01-1 1H7a1 1 0 01-1-1v-7z"/><path d="M6 13c0-2 1-3 3-3 1 0 2 .5 3 2 1-1.5 2-2 3-2 2 0 3 1 3 3"/><path d="M12 5l1.5 2-1.5 1L10.5 7z"/>`,
  bowl: `<path d="M3 12a9 9 0 0018 0H3z"/><path d="M5 16h14"/><path d="M14 8c0-1 1-1 1-2.5C15 4 14 3.5 14 3"/><path d="M11 8c0-1 1-1 1-2.5C12 4 11 3.5 11 3"/>`,
  chefhat: `<path d="M6 13.87A4 4 0 017.4 6a5 5 0 019.2 0 4 4 0 011.4 7.87"/><path d="M6 13v5a1 1 0 001 1h10a1 1 0 001-1v-5"/>`,
  coffee: `<path d="M4 8h13v4a5 5 0 01-5 5H9a5 5 0 01-5-5V8z"/><path d="M17 9h2a2 2 0 010 4h-2"/><path d="M8 2v2M11 2v2M14 2v2"/><path d="M4 21h13"/>`,
  beer: `<path d="M6 8h8v11a1 1 0 01-1 1H7a1 1 0 01-1-1V8z"/><path d="M14 10h2a2 2 0 012 2v2a2 2 0 01-2 2h-2"/><path d="M6 8a2.5 2.5 0 012-2.4A2.5 2.5 0 0110 4a2.5 2.5 0 012 .8A2.5 2.5 0 0114 8"/><path d="M8.5 12v4M11.5 12v4"/>`,
  wine: `<path d="M7 3h10l-1 6a4 4 0 01-8 0L7 3z"/><path d="M12 13v5"/><path d="M8.5 21h7"/>`,
  bottle: `<path d="M10 2h4"/><path d="M10.5 2v3l-1.2 1.6A3 3 0 008.5 9v10a1 1 0 001 1h5a1 1 0 001-1V9a3 3 0 00-.8-2L13.5 5V2"/><path d="M8.5 12h7"/>`,
  taco: `<path d="M3 16a9 9 0 0118 0"/><path d="M3.5 16h17a3 3 0 01-3 2.5H6.5a3 3 0 01-3-2.5z"/><path d="M9 13.5l.5 2M12.5 13v2.5M16 13.5l-.5 2"/>`,
  pizza: `<path d="M4 7l8 14 8-14a22 22 0 00-16 0z"/><path d="M4 7a22 22 0 0116 0"/><circle cx="10.5" cy="11" r="1"/><circle cx="13.5" cy="14" r="1"/>`,
  burger: `<path d="M4 10a8 8 0 0116 0z"/><path d="M4 13.5h16"/><path d="M5 17h14a2 2 0 01-2 2H7a2 2 0 01-2-2z"/>`,
  egg: `<path d="M12 3c-3.3 0-6 5-6 9a6 6 0 0012 0c0-4-2.7-9-6-9z"/>`,
  fish: `<path d="M3 12c3-4 8-5 11-5s5 2 6 5c-1 3-3 5-6 5s-8-1-11-5z"/><path d="M20 8l1.5-1v10L20 16"/><circle cx="8" cy="11" r="0.7" fill="currentColor"/>`,
  salad: `<path d="M4 20C4 12 11 5 20 4c1 9-5 16-13 16a6 6 0 01-3-.8z"/><path d="M5 19c3-4 7-8 12-10"/>`,
  iceCream: `<path d="M8 9a4 4 0 018 0"/><path d="M7.5 9h9l-4.5 11.5L7.5 9z"/><path d="M9.2 13h5.6M10.4 16h3.2"/>`,
  bread: `<path d="M5 11a3 3 0 013-3h8a3 3 0 013 3c0 1.1-.9 2-2 2v6a1 1 0 01-1 1H8a1 1 0 01-1-1v-6a2 2 0 01-2-2z"/><path d="M9.5 13v4M12 13v4M14.5 13v4"/>`,
  apple: `<path d="M12 8c-1.2-2.2-4.2-3-6-1s-1.2 6.2.8 9.2C8 18 9 20.5 12 20.5s4-2.5 5.2-4.3c2-3 2.8-7 1-9s-5-.9-6.2 1.3z"/><path d="M12 8V5a2.5 2.5 0 012.5-2.5"/>`,
  pepper: `<path d="M6 19c7 1 12-4 12-10.5"/><path d="M14 5c.3-1.8 2.2-2.8 4-2"/>`,
  noodles: `<path d="M4 10h16"/><path d="M5 10a7 7 0 0014 0"/><path d="M14 3l4 5M18 3l-4 5"/>`,
  cheese: `<path d="M3 13l13-6 5 4v5a1 1 0 01-1 1H4a1 1 0 01-1-1v-3z"/><path d="M3 13l18 1"/><circle cx="8" cy="15" r="1"/><circle cx="14" cy="14" r="1"/>`,
  sandwich: `<path d="M3 9l9-4 9 4-9 4-9-4z"/><path d="M3 13l9 4 9-4"/><path d="M3 9v2M21 9v2"/>`,
  donut: `<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/><path d="M7 7.5l.5.5M16.5 8l-.5.5M8 16l.5-.5"/>`,
  star: `<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5z"/>`,
  fire: `<path d="M12 3c.8 3.2 3.8 4.3 3.8 8.2a3.8 3.8 0 01-7.6 0c0-1 .4-1.9 1-2.6C9.5 10 12 8.2 12 3z"/><path d="M10.8 19.5a2.6 2.6 0 002.4 0"/>`,
  grid: `<rect x="4" y="4" width="7" height="7" rx="1.2"/><rect x="13" y="4" width="7" height="7" rx="1.2"/><rect x="4" y="13" width="7" height="7" rx="1.2"/><rect x="13" y="13" width="7" height="7" rx="1.2"/>`,
};

const DEFAULT_ICON_PATH = `<circle cx="12" cy="12" r="9"/><path d="M8.5 14a3.5 3.5 0 007 0"/><circle cx="9" cy="10" r="0.5" fill="currentColor"/><circle cx="15" cy="10" r="0.5" fill="currentColor"/>`;

// Iconos que aparecen en el selector (categorias y combos).
const ICON_CHOICES = ['utensils','steak','drink','cake','bowl','chefhat','coffee','beer','wine','bottle','taco','pizza','burger','egg','fish','salad','iceCream','bread','apple','pepper','noodles','cheese','sandwich','donut','star','fire','grid'];

function iconSvg(id, size = 18) {
  const inner = (id && ICON_PATHS[id]) ? ICON_PATHS[id] : DEFAULT_ICON_PATH;
  return `<svg width="${size}" height="${size}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

function categoryIconId(catName) {
  const c = (state.categories || []).find(cat => cat.name === catName);
  return c && c.icon ? c.icon : null;
}

function categorySvg(catName, size = 18) {
  return iconSvg(categoryIconId(catName), size);
}

// Genera el selector de iconos (cuadricula) + un input oculto con el ID elegido.
function iconPickerHtml(selectedId, hiddenId) {
  return `<input type="hidden" id="${hiddenId}" value="${selectedId || ''}">
    <div class="icon-picker">
      ${ICON_CHOICES.map(id => `<button type="button" class="icon-opt ${id === selectedId ? 'selected' : ''}" data-icon="${id}" onclick="pickIcon(this, '${hiddenId}')">${iconSvg(id, 22)}</button>`).join('')}
    </div>`;
}

function pickIcon(btn, hiddenId) {
  const wrap = btn.closest('.icon-picker');
  if (wrap) wrap.querySelectorAll('.icon-opt').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const input = document.getElementById(hiddenId);
  if (input) input.value = btn.dataset.icon;
}

const NAVICONS = {
  pos: `<svg class="ni-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path stroke-linecap="round" d="M8 21h8M12 17v4"/></svg>`,
  comandas: `<svg class="ni-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h4"/></svg>`,
  products: `<svg class="ni-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`,
  categories: `<svg class="ni-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 11a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM4 17a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z"/></svg>`,
  combos: `<svg class="ni-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>`,
  inventory: `<svg class="ni-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
  users: `<svg class="ni-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  dashboard: `<svg class="ni-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
  finances: `<svg class="ni-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  sales: `<svg class="ni-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>`,
  reports: `<svg class="ni-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17V9m4 8V5m4 12v-6M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>`,
  settings: `<svg class="ni-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>`,
};

const NAV_OWNER = [
  { sec: 'VENTAS' },
  { id: 'pos', label: 'Inicio' },
  { id: 'comandas', label: 'Comandas', badge: true },
  { sec: 'ADMINISTRACION' },
  { id: 'products', label: 'Productos' },
  { id: 'categories', label: 'Categorías' },
  { id: 'combos', label: 'Combos' },
  { id: 'users', label: 'Usuarios' },
  { sec: 'FINANZAS' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'reports', label: 'Reportes' },
  { id: 'finances', label: 'Finanzas' },
  { id: 'sales', label: 'Ventas' },
  { sec: 'SISTEMA' },
  { id: 'settings', label: 'Configuracion' },
];

const NAV_EMP = [
  { sec: 'VENTAS' },
  { id: 'pos', label: 'Inicio' },
  { id: 'comandas', label: 'Comandas', badge: true },
  { id: 'settings', label: 'Configuracion' },
];

const PAGE_TITLES = {
  pos: 'Inicio',
  comandas: 'Comandas en Espera',
  products: 'Gestion de Productos',
  categories: 'Gestión de Categorías',
  combos: 'Gestión de Combos',
  inventory: 'Control de Inventario',
  users: 'Usuarios',
  dashboard: 'Dashboard',
  reports: 'Reportes de Ventas',
  finances: 'Finanzas',
  sales: 'Reporte de Ventas',
  settings: 'Configuracion',
};

// ===================== STATE =====================
let state = createDefaultState();
let currentUser = null;
let currentOrder = createEmptyOrder();
let posCategory = 'Todos';
let productSearch = '';
let editingComandaId = null;
// Ticket abierto (pestana) actualmente cargado en currentOrder. null = ticket nuevo aun sin guardar.
let activeTicketId = null;
let ticketSaveTimer = null;
let pendingDeleteEmail = null;
let salesSelectedDate = '';
let salesSelectedId = null;
let salesSearchTerm = '';
let salesTab = 'sales';
let salesMovements = [];
let movementsSelectedTicket = null;
let clockTimer = null;
let productConfigContext = null;

// ===================== DATA =====================
function createDefaultProducts() {
  return [];
}

function createDefaultEmployees() {
  return [];
}

function createDefaultSalesRecords() {
  return [];
}

function createDefaultCommandas() {
  return [];
}

function buildSaleRecordFromSeed(id, completedAtMs, mesa, type, waiter, items) {
  const totals = calculateTotals(items, DEFAULT_TAX_RATE);
  const completedAt = new Date(completedAtMs).toISOString();
  return {
    id,
    createdAt: completedAt,
    completedAt,
    type,
    mesa,
    comensales: type === 'llevar' ? 1 : 2,
    waiter,
    notes: '',
    paymentMethod: 'Efectivo',
    status: 'Pagado',
    items: clone(items),
    subtotal: totals.subtotal,
    tax: totals.tax,
    total: totals.total,
    cost: totals.cost,
  };
}

function buildCommandaSeed(id, createdAtMs, mesa, type, waiter, comensales, notes, items) {
  return {
    id,
    createdAt: new Date(createdAtMs).toISOString(),
    updatedAt: new Date(createdAtMs).toISOString(),
    type,
    mesa,
    comensales,
    notes,
    waiter,
    items: clone(items),
  };
}

function createDefaultState() {
  return {
    owner: {
      name: 'Jesus Garcia',
      email: 'admin@foodpoint.mx',
      pass: 'admin123',
      label: 'Propietario',
    },
    employees: createDefaultEmployees(),
    products: createDefaultProducts(),
    commandas: createDefaultCommandas(),
    parkedOrders: [],
    salesRecords: createDefaultSalesRecords(),
    categories: [
      { id: 1, name: 'Platos Fuertes' },
      { id: 2, name: 'Bebidas' },
      { id: 3, name: 'Postres' },
      { id: 4, name: 'Entradas' }
    ],
    combos: [],
    settings: {
      restaurantName: 'FoodPoint',
      rfc: 'XAXX010101000',
      address: 'Av. Principal #100, Chihuahua, Chih.',
      phone: '',
      logoDataUrl: '',
      ticketFooter: 'Gracias por su preferencia',
      currency: 'MXN - Peso Mexicano',
      kitchenPrinter: '192.168.1.101:9100',
      cashPrinter: '192.168.1.102:9100',
      theme: 'theme-foodpoint',
      dailyOrderCounter: 0,
      lastOrderDate: '',
    },
  };
}

function createEmptyOrder() {
  return {
    items: [],
    type: null,
    mesa: 'Mesa 1',
    comensales: 2,
    notes: '',
    customName: '',
  };
}

function resetOrder() {
  editingComandaId = null;
  activeTicketId = null;
  currentOrder = createEmptyOrder();
}

// ===================== API =====================
async function loadDataFromAPI() {
  try {
    const [productsRes, ordersRes, salesRes, usersRes, settingsRes, categoriesRes, combosRes, parkedRes] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/orders'),
      fetch('/api/sales'),
      fetch('/api/users'),
      fetch('/api/settings'),
      fetch('/api/categories'),
      fetch('/api/combos'),
      fetch('/api/parked')
    ]);
    state.products = await productsRes.json();
    state.commandas = await ordersRes.json();
    state.salesRecords = await salesRes.json();
    const users = await usersRes.json();
    state.owner = users.find(u => u.role === 'Propietario') || {};
    state.employees = users.filter(u => u.role !== 'Propietario');
    state.settings = await settingsRes.json();
    state.categories = await categoriesRes.json();
    state.combos = await combosRes.json();
    try { state.parkedOrders = parkedRes.ok ? await parkedRes.json() : []; } catch { state.parkedOrders = []; }
    // Cargar el primer ticket abierto como activo (o uno vacio si no hay).
    if (editingComandaId === null) loadFirstOrEmpty();
    // Check and reset daily counter if new day
    const today = new Date().toISOString().split('T')[0];
    if (state.settings.lastOrderDate !== today) {
      state.settings.dailyOrderCounter = 0;
      state.settings.lastOrderDate = today;
      // Save updated settings
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.settings)
      });
    }
  } catch (error) {
    console.error('Error loading data from API:', error);
    // Fallback to defaults if API fails
    state = createDefaultState();
  }
}

// ===================== STORAGE =====================
function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return normalizeState(JSON.parse(stored));
    }
  } catch (error) {
    console.warn('No se pudo leer el estado guardado.', error);
  }
  return normalizeState(migrateLegacyState());
}

function migrateLegacyState() {
  const next = createDefaultState();
  try {
    const legacyName = localStorage.getItem('restaurantName');
    const legacyEmployees = JSON.parse(localStorage.getItem('customEmployees') || '[]');
    const legacyPasswords = JSON.parse(localStorage.getItem('customPasswords') || '{}');

    if (legacyName) next.settings.restaurantName = legacyName;

    if (Array.isArray(legacyEmployees) && legacyEmployees.length) {
      next.employees = legacyEmployees.map((employee, index) => ({
        name: employee.name || `Empleado ${index + 1}`,
        email: employee.email || `empleado${index + 1}@foodpoint.mx`,
        role: employee.role || 'Mesero',
        status: employee.status || 'Activo',
        since: employee.since || formatDateISO(new Date()),
        pass: legacyPasswords[employee.email] || employee.pass || 'emp123',
        isDefault: false,
      }));
    }

    if (legacyPasswords['admin@mesana.mx']) {
      next.owner.pass = legacyPasswords['admin@mesana.mx'];
    }
  } catch (error) {
    console.warn('No se pudo migrar el estado anterior.', error);
  }
  return next;
}

function normalizeState(raw) {
  const base = createDefaultState();
  const safe = raw && typeof raw === 'object' ? raw : {};
  return {
    owner: {
      ...base.owner,
      ...(safe.owner || {}),
    },
    employees: normalizeEmployees(safe.employees || base.employees),
    products: normalizeProducts(safe.products || base.products),
    commandas: normalizeCommandas(safe.commandas || base.commandas),
    salesRecords: normalizeSalesRecords(safe.salesRecords || base.salesRecords),
    settings: {
      ...base.settings,
      ...(safe.settings || {}),
    },
  };
}

function normalizeEmployees(items) {
  return (Array.isArray(items) ? items : []).map((employee, index) => ({
    name: employee.name || `Empleado ${index + 1}`,
    email: employee.email || `empleado${index + 1}@foodpoint.mx`,
    role: employee.role || 'Mesero',
    status: employee.status || 'Activo',
    since: employee.since || formatDateISO(new Date()),
    pass: employee.pass || 'emp123',
    isDefault: Boolean(employee.isDefault),
  }));
}

function normalizeProducts(items) {
  return (Array.isArray(items) ? items : []).map((product, index) => ({
    id: Number.isFinite(Number(product.id)) ? Number(product.id) : Date.now() + index,
    name: product.name || `Producto ${index + 1}`,
    cat: product.cat || 'Platos Fuertes',
    price: toMoney(product.price),
    cost: toMoney(product.cost),
    stock: toInt(product.stock),
  }));
}

function normalizeCommandas(items) {
  return (Array.isArray(items) ? items : []).map((comanda, index) => ({
    id: Number.isFinite(Number(comanda.id)) ? Number(comanda.id) : Date.now() + index,
    createdAt: comanda.createdAt || new Date().toISOString(),
    updatedAt: comanda.updatedAt || comanda.createdAt || new Date().toISOString(),
    type: comanda.type === 'llevar' ? 'llevar' : 'comedor',
    mesa: comanda.mesa || 'Mesa 1',
    comensales: Math.max(1, toInt(comanda.comensales || 1)),
    notes: comanda.notes || '',
    waiter: comanda.waiter || 'Sin asignar',
    items: normalizeProductsInOrder(comanda.items),
  }));
}

function normalizeSalesRecords(items) {
  return (Array.isArray(items) ? items : []).map((sale, index) => {
    const normalizedItems = normalizeProductsInOrder(sale.items);
    const totals = calculateTotals(normalizedItems, 0);
    return {
      id: Number.isFinite(Number(sale.id)) ? Number(sale.id) : Date.now() + index,
      createdAt: sale.createdAt || sale.completedAt || new Date().toISOString(),
      completedAt: sale.completedAt || sale.createdAt || new Date().toISOString(),
      type: sale.type === 'llevar' ? 'llevar' : 'comedor',
      mesa: sale.mesa || 'Mostrador',
      comensales: Math.max(1, toInt(sale.comensales || 1)),
      notes: sale.notes || '',
      waiter: sale.waiter || 'Sin asignar',
      paymentMethod: sale.paymentMethod || 'Efectivo',
      status: sale.status || 'Pagado',
      items: normalizedItems,
      subtotal: toMoney(sale.subtotal || totals.subtotal),
      tax: 0,
      total: toMoney(sale.subtotal || totals.subtotal),
      cost: toMoney(sale.cost || totals.cost),
    };
  });
}

function normalizeProductsInOrder(items) {
  return (Array.isArray(items) ? items : []).map((item) => {
    const normalized = {
      uid: item.uid || createItemUid(),
      id: Number(item.id),
      name: item.name || 'Producto',
      cat: item.cat || 'Platos Fuertes',
      qty: Math.max(1, toInt(item.qty || 1)),
      price: toMoney(item.price),
      cost: toMoney(item.cost),
      notes: item.notes || '',
      variantLabel: item.variantLabel || '',
      variantKey: item.variantKey || '',
    };
    // Conservar el ajuste manual de precio para poder resaltarlo en ventas y movimientos.
    if (item.priceEdited) {
      normalized.priceEdited = true;
      normalized.originalPrice = toMoney(item.originalPrice);
      normalized.priceNote = item.priceNote || '';
    }
    return normalized;
  });
}



// ===================== HELPERS =====================
function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsv(value) {
  return JSON.stringify(String(value ?? '')).replace(/</g, '\\u003c');
}

function fmt(number) {
  return Number(number || 0).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function toMoney(value) {
  return Number(Number(value || 0).toFixed(2));
}

function toInt(value) {
  return Math.max(0, parseInt(value, 10) || 0);
}

function clampTax(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return DEFAULT_TAX_RATE;
  return Math.min(100, Math.max(0, num));
}

function formatDateISO(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function formatDateTime(dateValue) {
  return new Date(dateValue).toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatShortDate(dateValue) {
  return new Date(dateValue).toLocaleDateString('es-MX');
}

function formatTime(dateValue) {
  return new Date(dateValue).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

function toLocalDateStr(dateValue) {
  const d = new Date(dateValue);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// Desglose del dinero de un conjunto de ventas, pensado para el corte de caja:
// separa lo que de verdad esta en la caja de lo que cada plataforma debe depositar.
function getPaymentBreakdown(sales) {
  const porMetodo = new Map();
  (sales || []).filter(s => s.status !== 'Cancelado').forEach(sale => {
    const list = Array.isArray(sale.payments) && sale.payments.length
      ? sale.payments
      : [{ method: sale.paymentMethod || 'Efectivo', amount: sale.total || 0 }];
    list.forEach(p => {
      const method = p.method || 'Otro';
      const entry = porMetodo.get(method) || { method, amount: 0, count: 0 };
      entry.amount += p.amount || 0;
      entry.count += 1;
      porMetodo.set(method, entry);
    });
  });
  const filas = [...porMetodo.values()].sort((a, b) => b.amount - a.amount);
  const plataformas = filas.filter(f => isPlatformMethod(f.method));
  const local = filas.filter(f => !isPlatformMethod(f.method));
  return {
    filas,
    local,
    plataformas,
    efectivo: toMoney(local.filter(f => f.method === 'Efectivo').reduce((s, f) => s + f.amount, 0)),
    enCaja: toMoney(local.reduce((s, f) => s + f.amount, 0)),
    porCobrar: toMoney(plataformas.reduce((s, f) => s + f.amount, 0)),
    total: toMoney(filas.reduce((s, f) => s + f.amount, 0)),
  };
}

function getSalesByDate(dateStr) {
  return state.salesRecords
    .filter(s => toLocalDateStr(s.completedAt) === dateStr)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
}

function formatShortTime(dateValue) {
  return new Date(dateValue).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Logo de FoodPoint (insignia redonda). El nombre de la funcion se conserva porque
// se usa en varios lugares; ya no es un SVG sino la imagen de la marca.
function getBrandMarkSvg(size) {
  return `<img class="fp-mark" src="assets/img/foodpoint-mark-512.png" alt="FoodPoint" style="width:100%;height:100%">`;
}

function getBrandMarkSvgAnterior(size, strokeWidth) {
  return `<svg width="${size}" height="${size}" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" stroke="#fff" stroke-width="1.3" opacity="0.45"/><path d="M6.5 16.5V8L12 13.5L17.5 8V16.5" stroke="#fff" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="4.8" r="1.05" fill="#fff"/></svg>`;
}

function renderBrandMarkMarkup(size) {
  const logo = state.settings.logoDataUrl;
  if (logo) {
    return `<img src="${logo}" alt="Logo del restaurante" style="width:${size}px;height:${size}px;object-fit:cover;border-radius:10px;display:block">`;
  }
  return getBrandMarkSvg(size, size <= 22 ? '2.2' : '2');
}

function renderTicketLogoMarkup() {
  if (!state.settings.logoDataUrl) return '';
  return `<div style="text-align:center;margin-bottom:8px"><img src="${state.settings.logoDataUrl}" alt="Logo" style="width:58px;height:58px;object-fit:cover;border-radius:10px"></div>`;
}

function createItemUid() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function minutesAgo(dateValue) {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(dateValue).getTime()) / 60000));
  return `${minutes} min`;
}

function calculateTotals(items, explicitTaxRate) {
  const subtotal = items.reduce((sum, item) => sum + toMoney(item.price) * toInt(item.qty), 0);
  const cost = items.reduce((sum, item) => sum + toMoney(item.cost) * toInt(item.qty), 0);
  return {
    subtotal: toMoney(subtotal),
    tax: 0,
    total: toMoney(subtotal),
    cost: toMoney(cost),
  };
}

function productById(id) {
  return state.products.find((product) => product.id === Number(id));
}

function getEmployeeByEmail(email) {
  return state.employees.find((employee) => employee.email.toLowerCase() === String(email).toLowerCase());
}

function getAccountByEmail(email) {
  const normalized = String(email || '').trim().toLowerCase();
  if (normalized === state.owner.email.toLowerCase()) {
    return {
      email: state.owner.email,
      pass: state.owner.pass,
      role: 'owner',
      name: state.owner.name,
      label: state.owner.label,
    };
  }
  const employee = getEmployeeByEmail(normalized);
  if (!employee || employee.status !== 'Activo') return null;
  return {
    email: employee.email,
    pass: employee.pass,
    role: 'employee',
    name: employee.name,
    label: employee.role,
  };
}

function getCurrentActivePage() {
  const active = document.querySelector('.nav-item.active');
  return active ? active.id.replace('nav-', '') : 'pos';
}

function refreshCurrentPage() {
  const page = getCurrentActivePage();
  renderPage(page);
  if (page === 'comandas') updateBadge();
}

function createOrderItemSnapshot(product, qty) {
  return {
    uid: createItemUid(),
    id: product.id,
    name: product.name,
    cat: product.cat,
    qty,
    price: toMoney(product.price),
    cost: toMoney(product.cost),
    notes: '',
    variantLabel: '',
    variantKey: '',
  };
}

function getEditingComanda() {
  return state.commandas.find((comanda) => comanda.id === editingComandaId) || null;
}

function getEditingReservedQty(productId) {
  const editing = getEditingComanda();
  if (!editing) return 0;
  const item = editing.items.find((entry) => entry.id === Number(productId));
  return item ? item.qty : 0;
}

function getAvailableStock(productId) {
  // Inventario retirado: los productos NO se controlan por existencias.
  // Siempre estan disponibles para agregarse a un ticket, sin importar el stock.
  return Infinity;
}

function validateOrderStock(items) {
  const totalsByProduct = {};
  items.forEach(item => {
    if (item.isCombo) {
      item.comboItems.forEach(comboItem => {
        totalsByProduct[comboItem.id] = (totalsByProduct[comboItem.id] || 0) + comboItem.qty * item.qty;
      });
    } else {
      totalsByProduct[item.id] = (totalsByProduct[item.id] || 0) + item.qty;
    }
  });
  for (const [productId, qty] of Object.entries(totalsByProduct)) {
    const available = getAvailableStock(Number(productId));
    if (qty > available) {
      const product = productById(Number(productId));
      return {
        ok: false,
        message: `${product?.name || 'Producto'}: solo hay ${available} disponible(s).`,
      };
    }
  }
  return { ok: true };
}

function setProductsStockFromOrderDiff(previousItems, nextItems) {
  const previousTotals = previousItems.reduce((acc, item) => {
    acc[item.id] = (acc[item.id] || 0) + item.qty;
    return acc;
  }, {});
  const nextTotals = nextItems.reduce((acc, item) => {
    acc[item.id] = (acc[item.id] || 0) + item.qty;
    return acc;
  }, {});
  const allIds = new Set([...Object.keys(previousTotals), ...Object.keys(nextTotals)]);
  allIds.forEach((id) => {
    const previousQty = previousTotals[id] || 0;
    const nextQty = nextTotals[id] || 0;
    const difference = nextQty - previousQty;
    const product = productById(Number(id));
    if (!product || difference === 0) return;
    if (difference > 0) product.stock = Math.max(0, product.stock - difference);
    else product.stock += Math.abs(difference);
  });
}

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function getCurrentWeekRange() {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);
  return { start, end };
}

function getSalesInRange(range) {
  const target = range === 'today' ? getTodayRange() : getCurrentWeekRange();
  return state.salesRecords.filter((sale) => {
    const date = new Date(sale.completedAt);
    return date >= target.start && date <= target.end && sale.status === 'Pagado';
  });
}

function getSalesHistory() {
  const labels = [];
  const series = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    const daySales = state.salesRecords.filter((sale) => {
      const date = new Date(sale.completedAt);
      return sale.status === 'Pagado' && date >= day && date < next;
    });
    labels.push(day.toLocaleDateString('es-MX', { weekday: 'short' }));
    series.push({
      day: labels[labels.length - 1],
      revenue: toMoney(daySales.reduce((sum, sale) => sum + sale.total, 0)),
      orders: daySales.length,
    });
  }
  return series;
}

function getTopProducts(limit) {
  const map = new Map();
  state.salesRecords.forEach((sale) => {
    if (sale.status !== 'Pagado') return;
    sale.items.forEach((item) => {
      const entry = map.get(item.name) || {
        name: item.name,
        cat: item.cat,
        qty: 0,
        revenue: 0,
      };
      entry.qty += item.qty;
      entry.revenue += item.qty * item.price;
      map.set(item.name, entry);
    });
  });
  return [...map.values()]
    .sort((a, b) => b.qty - a.qty || b.revenue - a.revenue)
    .slice(0, limit);
}

function getTopVariants(limit) {
  const map = new Map();
  const addVariant = (name, variantLabel, qty, price) => {
    if (!variantLabel) return;
    const key = `${name} · ${variantLabel}`;
    const entry = map.get(key) || { label: key, name, variantLabel, qty: 0, revenue: 0 };
    entry.qty += qty;
    entry.revenue += qty * (price || 0);
    map.set(key, entry);
  };
  state.salesRecords.forEach((sale) => {
    if (sale.status !== 'Pagado') return;
    const items = Array.isArray(sale.items)
      ? sale.items
      : (typeof sale.items === 'string' ? (() => { try { return JSON.parse(sale.items); } catch { return []; } })() : []);
    items.forEach((item) => {
      addVariant(item.name, item.variantLabel, item.qty, item.price);
      if (item.isCombo && Array.isArray(item.comboItems)) {
        item.comboItems.forEach((ci) => addVariant(ci.name || '', ci.variantLabel, (ci.qty || 1) * (item.qty || 1), 0));
      }
    });
  });
  return [...map.values()]
    .sort((a, b) => b.qty - a.qty || b.revenue - a.revenue)
    .slice(0, limit);
}

function getCategorySalesBreakdown() {
  const totals = {};
  let grandTotal = 0;
  state.salesRecords.forEach((sale) => {
    if (sale.status !== 'Pagado') return;
    sale.items.forEach((item) => {
      const amount = item.qty * item.price;
      totals[item.cat] = (totals[item.cat] || 0) + amount;
      grandTotal += amount;
    });
  });
  return Object.entries(totals)
    .map(([category, amount]) => ({
      category,
      amount,
      pct: grandTotal ? Math.round((amount / grandTotal) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

function getSalesSummary(range) {
  const sales = getSalesInRange(range);
  const revenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const cost = sales.reduce((sum, sale) => sum + sale.cost, 0);
  return {
    sales,
    revenue: toMoney(revenue),
    cost: toMoney(cost),
    tax: 0,
    profit: toMoney(revenue - cost),
    orders: sales.length,
  };
}

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

// ===================== LOGIN =====================
function fillAccount(user, pass) {
  document.getElementById('loginUser').value = user;
  document.getElementById('loginPass').value = pass;
}

async function doLogin() {
  const email = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value.trim();
  const account = getAccountByEmail(email);
  if (!account || account.pass !== pass) {
    document.getElementById('loginErr').style.display = 'block';
    return;
  }
  document.getElementById('loginErr').style.display = 'none';
  currentUser = account;
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  await initApp();
  await enforceLicense();
}

document.addEventListener('keydown', (event) => {
  const loginScreen = document.getElementById('loginScreen');
  if (event.key === 'Enter' && loginScreen && !loginScreen.classList.contains('hidden')) {
    doLogin();
  }
});

function logout() {
  currentUser = null;
  resetOrder();
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  document.getElementById('loginErr').style.display = 'none';
}

// ===================== INIT =====================
async function initApp() {
  document.getElementById('sbUser').innerHTML = `<strong style="color:rgba(255,255,255,0.9)">${esc(currentUser.name)}</strong><br>${esc(currentUser.label)}`;
  syncBranding();
  buildNav();
  buildThemeSwitcher();
  await applyTheme(state.settings.theme || 'theme-foodpoint', true);
  posCategory = 'Todos';
  productSearch = '';
  salesView = 'today';
  resetOrder();
  renderBarraAtajos();
  navigateTo('pos');
  startClock();
  loadPrintConfig();
  startKitchenPolling();
}

function syncBranding() {
  const restaurantName = state.settings.restaurantName || 'FoodPoint';
  document.getElementById('sbName').textContent = restaurantName;
  document.getElementById('brandName').textContent = restaurantName;
  const loginBrandMark = document.getElementById('loginBrandMark');
  const sidebarBrandMark = document.getElementById('sidebarBrandMark');
  if (loginBrandMark) loginBrandMark.innerHTML = renderBrandMarkMarkup(26);
  if (sidebarBrandMark) sidebarBrandMark.innerHTML = renderBrandMarkMarkup(20);
  document.getElementById('footerBrand').innerHTML = `by <span>ditto</span>`;
  document.getElementById('footerBrand2').innerHTML = `&copy; 2026 <span>${esc(restaurantName)}</span> — Punto de Venta para Restaurantes`;
}

function buildNav() {
  const nav = currentUser.role === 'owner' ? NAV_OWNER : NAV_EMP;
  const element = document.getElementById('sbNav');
  element.innerHTML = '';
  nav.forEach((item) => {
    if (item.sec) {
      element.innerHTML += `<div class="nav-sec">${esc(item.sec)}</div>`;
      return;
    }
    const badge = item.badge && state.commandas.length > 0
      ? `<span class="nav-badge" id="cmdBadge">${state.commandas.length}</span>`
      : '';
    element.innerHTML += `<div class="nav-item" id="nav-${item.id}" onclick="navigateTo('${item.id}')">
      ${NAVICONS[item.id] || ''}
      ${esc(item.label)}${badge}
    </div>`;
  });
}

function buildThemeSwitcher() {
  const container = document.getElementById('themeSwatch');
  container.innerHTML = '';
  THEMES.forEach((theme) => {
    const swatch = document.createElement('div');
    swatch.className = `t-swatch${theme.key === state.settings.theme ? ' active' : ''}`;
    swatch.style.background = theme.color;
    swatch.title = theme.label;
    swatch.onclick = () => applyTheme(theme.key);
    container.appendChild(swatch);
  });
}

async function applyTheme(key, silent) {
  const app = document.getElementById('app');
  THEMES.forEach((theme) => app.classList.remove(theme.key));
  app.classList.add(key);
  state.settings.theme = key;
  try {
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.settings)
    });
  } catch (error) {
    console.error('Error saving theme:', error);
  }
  document.querySelectorAll('.t-swatch').forEach((swatch, index) => {
    swatch.classList.toggle('active', THEMES[index].key === key);
  });
  if (!silent) {
    const theme = THEMES.find((entry) => entry.key === key);
    showToast(`Tema aplicado: ${theme ? theme.label : key}`, 'success');
  }
}

function updateBadge() {
  const badge = document.getElementById('cmdBadge');
  if (badge) {
    if (state.commandas.length > 0) badge.textContent = state.commandas.length;
    else badge.remove();
    return;
  }
  if (state.commandas.length > 0) {
    const nav = document.getElementById('nav-comandas');
    if (nav) nav.innerHTML += `<span class="nav-badge" id="cmdBadge">${state.commandas.length}</span>`;
  }
}

function navigateTo(id) {
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.remove('active'));
  const target = document.getElementById(`nav-${id}`);
  if (target) target.classList.add('active');
  document.getElementById('topbarTitle').textContent = PAGE_TITLES[id] || state.settings.restaurantName;
  const showSearch = ['pos', 'products', 'inventory'].includes(id);
  document.getElementById('gSearchBar').style.display = showSearch ? 'flex' : 'none';
  if (!showSearch) document.getElementById('gSearch').value = '';
  // El ticket en curso (currentOrder) y el contexto de edicion se preservan al
  // navegar entre interfaces. Solo se limpian con resetOrder() (tras enviar /
  // completar / cancelar) o con clearOrder() (boton de limpiar la orden).
  renderPage(id);
}

function renderPage(id) {
  const content = document.getElementById('mainContent');
  try {
  switch (id) {
    case 'pos':
      content.innerHTML = buildPOS();
      updateScrollHint();
      break;
    case 'comandas':
      content.innerHTML = buildComandas();
      break;
    case 'products':
      content.innerHTML = buildProducts();
      break;
    case 'categories':
      content.innerHTML = buildCategories();
      break;
    case 'combos':
      content.innerHTML = buildCombos();
      break;
    case 'inventory':
      content.innerHTML = buildInventory();
      break;
    case 'users':
      content.innerHTML = buildUsers();
      break;
    case 'dashboard':
      content.innerHTML = buildDashboard();
      break;
    case 'reports':
      content.innerHTML = buildReports();
      break;
    case 'finances':
      content.innerHTML = buildFinances();
      break;
    case 'sales':
      content.innerHTML = buildSales();
      (async () => {
        try {
          const res = await fetch('/api/sales');
          if (res.ok) {
            const rows = await res.json();
            // Merge: assign DB ids to in-memory records that lack them,
            // and add any DB records not already in memory (e.g. from other sessions).
            const inMemoryByTicket = new Map(state.salesRecords.map(s => [s.ticketNumber, s]));
            rows.forEach(row => {
              const mem = inMemoryByTicket.get(row.ticketNumber);
              if (mem) {
                if (mem.id == null) mem.id = row.id;
              } else {
                state.salesRecords.push(row);
              }
            });
            const listEl = document.getElementById('salesListPanel');
            if (listEl) listEl.innerHTML = renderSalesListHTML();
            const sumEl = document.getElementById('salesDaySummary');
            if (sumEl) sumEl.innerHTML = renderSalesDaySummaryHTML();
          }
        } catch {}
        loadSalesMovements();
      })();
      break;
    case 'settings':
      content.innerHTML = buildSettings();
      if (currentUser.role === 'owner') {
        loadBackups();
        loadLicenseAndUpdates();
        loadPrintSettings();
      }
      break;
    default:
      content.innerHTML = buildPOS();
      break;
  }
  } catch (err) {
    console.error('Error al renderizar la seccion', id, err);
    content.innerHTML = `<div style="padding:48px;text-align:center;color:var(--stone)">No se pudo cargar esta sección.</div>`;
  }
}

function catIcon(category) {
  return `<div class="mi-icon" style="color:var(--accent-dark)">${categorySvg(category)}</div>`;
}

// ===================== POS =====================
// Contenido del encabezado del ticket (titulo, tipo, mesa, comensales).
// Extraido para poder refrescarlo en vivo cuando cambia el tipo o la mesa.
const SVG_COMEDOR = '<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7a2 2 0 002 2h2a2 2 0 002-2V2"/><path d="M6 2v20"/><path d="M19 2a4 4 0 00-4 4v6a2 2 0 002 2h2"/><path d="M19 14v8"/></svg>';
const SVG_LLEVAR = '<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 8.5h13l-1 11.5a1.5 1.5 0 01-1.5 1.4H8a1.5 1.5 0 01-1.5-1.4l-1-11.5z"/><path d="M9 8.5V7a3 3 0 016 0v1.5"/></svg>';

function renderOrderHeaderInner() {
  const isEditing = editingComandaId !== null;
  const title = isEditing ? `Editando Orden #${editingComandaId}` : `Orden #${state.settings.dailyOrderCounter + 1}`;
  const isComedor = currentOrder.type === 'comedor';
  const configured = currentOrder.type === 'llevar' || (isComedor && currentOrder.mesa);

  // Ticket ya configurado: encabezado compacto de solo lectura. El tipo y la mesa
  // se eligen al abrir el ticket, no se cambian a media captura (usar ✎ para corregir).
  if (configured) {
    return `
      <div class="order-head-compact">
        <span class="ohc-badge ${isComedor ? 'comedor' : 'llevar'}">
          ${isComedor ? SVG_COMEDOR : SVG_LLEVAR}
          ${isComedor ? esc(currentOrder.mesa) : 'Para llevar'}
        </span>
        ${isComedor ? `
          <div class="ohc-pax" title="Comensales">
            <button class="cc-btn" onclick="changeComensales(-1)">-</button>
            <span class="cc-num" id="ccNum">${currentOrder.comensales}</span>
            <button class="cc-btn" onclick="changeComensales(1)">+</button>
            <span class="ohc-pax-label">pax</span>
          </div>` : ''}
        <span class="ohc-title">${esc(title)}</span>
        <button class="ohc-edit" onclick="changeOrderSetup()" title="Cambiar tipo o mesa de este ticket">✎</button>
      </div>`;
  }

  // Ticket sin configurar: aqui se elige tipo y mesa, en cualquier momento antes de enviar.
  const orderHint = !currentOrder.type
    ? 'Puedes capturar productos y elegir esto antes de enviar'
    : 'Selecciona la mesa de este pedido';
  return `
    <div class="order-head-setup">
    <div class="order-top">
      <span class="order-title">${esc(title)}</span>
    </div>
    <div class="type-toggle type-toggle-full">
      <button class="type-btn type-comedor ${isComedor ? 'active' : ''}" onclick="prepareOrderType('comedor')">
        ${SVG_COMEDOR}
        Comedor
      </button>
      <button class="type-btn type-llevar ${currentOrder.type === 'llevar' ? 'active' : ''}" onclick="prepareOrderType('llevar')">
        ${SVG_LLEVAR}
        Llevar
      </button>
    </div>
    <div class="order-hint">${esc(orderHint)}</div>
    <div id="mesaSection" style="${isComedor ? '' : 'display:none'}">
      <div class="mesa-label">Mesa</div>
      <div class="mesa-chips">
        ${MESAS.map((mesa) => `<div class="mesa-chip ${currentOrder.mesa === mesa ? 'selected' : ''}" onclick="selectMesa('${mesa}')">${mesa}</div>`).join('')}
      </div>
    </div>
    </div>`;
}

// Corregir tipo/mesa de un ticket ya configurado (accion deliberada desde el boton ✎).
function changeOrderSetup() {
  openOrderTypeModal();
}

function refreshOrderHeader() {
  const el = document.getElementById('orderHeader');
  if (el) el.innerHTML = renderOrderHeaderInner();
}

function buildPOS() {
  const isEditing = editingComandaId !== null;
  return `<div class="pos-layout">
    <div class="menu-section">
      <div class="cat-tabs" id="catTabs">
        ${['Todos', ...state.categories.map(c => c.name)].map((category) => `
          <div class="cat-tab ${category === posCategory ? 'active' : ''}" onclick="setPosCategory('${category}')"><span class="cat-tab-ic">${category === 'Todos' ? iconSvg('grid', 15) : categorySvg(category, 15)}</span>${esc(category)}</div>
        `).join('')}
      </div>
      <div class="menu-grid" id="menuGrid">${renderMenuItems()}</div>
    </div>
    <div class="order-panel">
      ${renderTicketTabs()}
      <div class="order-header" id="orderHeader">${renderOrderHeaderInner()}</div>
      <div class="order-items-wrap">
        <div class="order-items" id="orderItems" onscroll="updateScrollHint()">${renderOrderItems()}</div>
        <div class="scroll-hint" id="scrollHint" onclick="scrollOrderItems()"><span>▼ hay más productos</span></div>
      </div>
      <div class="order-notes ${currentOrder.notes ? 'open' : ''}" id="orderNotesBox">
        <button class="notes-toggle" onclick="toggleOrderNotes()">
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h10M4 18h7"/></svg>
          Notas especiales
          <span class="nt-caret">▾</span>
        </button>
        <textarea id="orderNotes" placeholder="Sin cebolla, extra picante..." oninput="currentOrder.notes=this.value">${esc(currentOrder.notes)}</textarea>
      </div>
      <div class="order-totals" id="orderTotals">${renderTotals()}</div>
      <div class="order-actions">
        ${isEditing ? `
          <button class="btn btn-primary btn-full" onclick="updateComanda()">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            Actualizar comanda
          </button>
          <div style="display:flex;gap:7px;margin-top:7px">
            <button class="btn btn-secondary" style="flex:1" onclick="cancelEdit()">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              Cancelar edicion
            </button>
            <button class="btn btn-danger" style="flex:1" onclick="clearOrder()">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              Limpiar
            </button>
          </div>
        ` : `
          <button class="btn btn-primary btn-full" onclick="sendComanda()">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            Enviar comanda a cocina
          </button>
          <div style="display:flex;gap:7px;margin-top:7px">
            <button class="btn btn-secondary" style="flex:1" onclick="showTicket()">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a1 1 0 001-1v-4H8v4a1 1 0 001 1zm1-11V5a1 1 0 011-1h2a1 1 0 011 1v1M9 7h6M9 11h4"/></svg>
              Ticket
            </button>
            <button class="btn btn-danger" style="flex:1" onclick="clearOrder()">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              Limpiar
            </button>
          </div>
        `}
      </div>
    </div>
  </div>`;
}

function openOrderTypeModal() {
  if (document.querySelector('.modal-overlay.open:not([id])')) return;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.innerHTML = `<div class="modal" style="width:480px;">
    <div class="modal-header"><h3>¿Para comer aquí o para llevar?</h3></div>
    <div class="modal-body" style="display:flex;flex-direction:column;gap:16px;padding:30px 20px;">
      <button class="order-type-btn order-type-comedor" onclick="prepareOrderType('comedor')">
        <div class="order-type-icon">
          <svg width="52" height="52" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v7a2 2 0 002 2h2a2 2 0 002-2V2"/>
            <path d="M6 2v20"/>
            <path d="M19 2a4 4 0 00-4 4v6a2 2 0 002 2h2"/>
            <path d="M19 14v8"/>
          </svg>
        </div>
        <div class="order-type-content">
          <div class="order-type-title">Para comer aquí</div>
          <div class="order-type-desc">Servicio en comedor</div>
        </div>
      </button>
      <button class="order-type-btn order-type-llevar" onclick="prepareOrderType('llevar')">
        <div class="order-type-icon">
          <svg width="52" height="52" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5.5 8.5h13l-1 11.5a1.5 1.5 0 01-1.5 1.4H8a1.5 1.5 0 01-1.5-1.4l-1-11.5z"/>
            <path d="M9 8.5V7a3 3 0 016 0v1.5"/>
            <path d="M5.5 8.5l1-2.5a1.2 1.2 0 011.1-.7h8.8a1.2 1.2 0 011.1.7l1 2.5"/>
            <path d="M9.5 13c.7-.5 1.5-.7 2.5-.7s1.8.2 2.5.7"/>
          </svg>
        </div>
        <div class="order-type-content">
          <div class="order-type-title">Para llevar</div>
          <div class="order-type-desc">Empaque para llevar</div>
        </div>
      </button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
}

function prepareOrderType(type) {
  closeCurrentModal();
  if (type === 'llevar') {
    currentOrder.type = 'llevar';
    currentOrder.mesa = 'Mostrador';
    currentOrder.comensales = 1;
    refreshOrderPanel();
    trySendAfterSetup();
    return;
  }
  currentOrder.type = 'comedor';
  // No asignar mesa por defecto: si el usuario cierra el modal sin elegir, la mesa
  // queda sin definir y se le volvera a pedir al agregar un producto.
  currentOrder.mesa = null;
  currentOrder.comensales = 2;
  refreshOrderPanel();
  openMesaSelectionModal();
}

function openMesaSelectionModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.innerHTML = `<div class="modal" style="width:440px;max-width:92vw">
    <div class="modal-header"><h3>Selecciona la mesa</h3><button class="modal-close" onclick="cancelOrderSetup()">×</button></div>
    <div class="modal-body" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;padding:18px 20px">
      ${MESAS.map((mesa) => `<button class="btn btn-secondary" style="flex:1 1 120px;min-width:120px;" onclick="selectMesaAndContinue('${mesa}')">${mesa}</button>`).join('')}
    </div>
    <div class="modal-body" style="padding:0 20px 16px;text-align:center;font-size:12.5px;color:var(--stone-light)">Puedes cerrar y elegir la mesa después, en el encabezado del ticket.</div>
  </div>`;
  document.body.appendChild(overlay);
}

function selectMesaAndContinue(mesa) {
  currentOrder.mesa = mesa;
  closeCurrentModal();
  refreshOrderHeader();
  openComensalesModal();
}

function openComensalesModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.innerHTML = `<div class="modal">
    <div class="modal-header"><h3>¿Cuántas personas serán?</h3></div>
    <div class="modal-body" style="display:flex;align-items:center;justify-content:center;gap:10px;">
      <button class="btn btn-secondary" onclick="adjustPax(-1)">-</button>
      <span id="paxCount" style="font-size:24px;font-weight:700">${currentOrder.comensales}</span>
      <button class="btn btn-secondary" onclick="adjustPax(1)">+</button>
    </div>
    <div class="modal-footer" style="display:flex;gap:10px;">
      <button class="btn btn-secondary btn-full" onclick="cancelOrderSetup()">Cancelar</button>
      <button class="btn btn-primary btn-full" onclick="confirmPax()">Continuar</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
}

function adjustPax(delta) {
  currentOrder.comensales = Math.max(1, currentOrder.comensales + delta);
  const paxCount = document.getElementById('paxCount');
  if (paxCount) paxCount.textContent = currentOrder.comensales;
}

function confirmPax() {
  closeCurrentModal();
  refreshOrderPanel();
  // Si se venia de pulsar "Enviar comanda", sale sola ahora que ya hay mesa y pax.
  trySendAfterSetup();
}

// Cierra TODAS las ventanas emergentes flotantes (las creadas dinamicamente, que no
// tienen id). Nunca toca los modales estaticos del HTML (que si tienen id), asi que es
// seguro llamarla siempre. Esto evita que un overlay quede "pegado" encima bloqueando
// la escritura y los clics de toda la aplicacion.
function closeCurrentModal() {
  document.querySelectorAll('.modal-overlay:not([id])').forEach((el) => el.remove());
}

// Modal de confirmacion reutilizable (advertencia antes de acciones destructivas).
function openConfirmModal({ title, message, confirmText = 'Sí, continuar', cancelText = 'Cancelar', danger = true, onConfirm }) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.innerHTML = `<div class="modal" style="width:420px;max-width:92vw">
    <div class="modal-header"><h3>${esc(title)}</h3></div>
    <div class="modal-body" style="padding:18px 20px;font-size:14.5px;color:var(--stone);line-height:1.55">${esc(message)}</div>
    <div class="modal-footer" style="display:flex;gap:10px;padding:0 20px 18px">
      <button class="btn btn-secondary btn-full" data-role="cancel">${esc(cancelText)}</button>
      <button class="btn ${danger ? 'btn-danger' : 'btn-primary'} btn-full" data-role="ok">${esc(confirmText)}</button>
    </div>
  </div>`;
  overlay.querySelector('[data-role="cancel"]').onclick = () => overlay.remove();
  overlay.querySelector('[data-role="ok"]').onclick = () => { overlay.remove(); if (onConfirm) onConfirm(); };
  document.body.appendChild(overlay);
}


function renderMenuItems(filter) {
  const term = String(filter || '').trim().toLowerCase();
  const empty = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--stone);font-size:14px">Sin productos</div>`;

  // Búsqueda: resultados planos (productos + combos)
  if (term) {
    const prods = state.products.filter(p => p.name.toLowerCase().includes(term));
    const combos = state.combos.filter(c => c.name.toLowerCase().includes(term));
    const cards = [...prods.map(productCardHtml), ...combos.map(comboCardHtml)];
    return cards.length ? cards.join('') : empty;
  }

  // Categoría específica: solo sus productos
  if (posCategory !== 'Todos') {
    const prods = state.products.filter(p => p.cat === posCategory);
    return prods.length ? prods.map(productCardHtml).join('') : empty;
  }

  // "Todos": separado por categoría (encabezado de ancho completo) + sección de combos
  const head = (title, icon) => `<div class="menu-cat-head"><span class="menu-cat-ic">${icon}</span>${esc(title)}</div>`;
  let html = '';
  state.categories.forEach(cat => {
    const prods = state.products.filter(p => p.cat === cat.name);
    if (!prods.length) return;
    html += head(cat.name, categorySvg(cat.name, 15)) + prods.map(productCardHtml).join('');
  });
  const knownCats = new Set(state.categories.map(c => c.name));
  const orphans = state.products.filter(p => !knownCats.has(p.cat));
  if (orphans.length) html += head('Otros', iconSvg('utensils', 15)) + orphans.map(productCardHtml).join('');
  if (state.combos.length) html += head('Combos', iconSvg('grid', 15)) + state.combos.map(comboCardHtml).join('');
  return html || empty;
}

function productCardHtml(item) {
  const displayStock = getAvailableStock(item.id);
  const outOfStock = displayStock <= 0;
  const media = item.image
    ? `<div class="mi-media"><img src="${item.image}" alt="${esc(item.name)}" style="object-position:${esc(item.imagePos || DEFAULT_IMAGE_POS)}"></div>`
    : `<div class="mi-media mi-media-icon">${categorySvg(item.cat, 40)}</div>`;
  return `
    <div class="menu-item ${outOfStock ? 'out-of-stock' : ''}" onclick="addToOrder(${item.id})">
      ${outOfStock ? '<span class="oos-badge">Sin stock</span>' : ''}
      ${media}
      <div class="mi-name">${esc(item.name)}</div>
      <div class="mi-price">$${fmt(item.price)} MXN</div>
    </div>
  `;
}

function comboCardHtml(combo) {
  const media = combo.image
    ? `<div class="mi-media"><img src="${combo.image}" alt="${esc(combo.name)}" style="object-position:${esc(combo.imagePos || DEFAULT_IMAGE_POS)}"></div>`
    : `<div class="mi-media mi-media-icon">${iconSvg(combo.icon, 40)}</div>`;
  return `
    <div class="menu-item combo-item" onclick="addComboToOrder(${combo.id})">
      ${media}
      <div class="mi-name">${esc(combo.name)}</div>
      <div class="mi-price">$${fmt(combo.price)} MXN</div>
      <div class="mi-desc">${esc(combo.description || 'Combo')}</div>
    </div>
  `;
}

function renderOrderItems() {
  if (!currentOrder.items.length) {
    return `<div class="order-empty">
      <div class="oe-icon"><svg width="44" height="44" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" style="color:var(--stone-light)"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg></div>
      <p>Selecciona productos del menu</p>
    </div>`;
  }
  return currentOrder.items.map((item, index) => `
    <div class="order-item">
      <div class="oi-qctrl">
        <button class="oi-qbtn" onclick="changeQty(${index},-1)">-</button>
        <span class="oi-qty">${item.qty}</span>
        <button class="oi-qbtn" onclick="changeQty(${index},1)">+</button>
      </div>
      <div class="oi-info">
        <div class="oi-line1">
          <span class="oi-name">${esc(item.name)}</span>
          <span class="oi-total">$${fmt(item.price * item.qty)}</span>
        </div>
        ${item.variantLabel ? `<div class="oi-variant">${esc(item.variantLabel)}</div>` : ''}
        <div class="oi-meta">
          <span class="oi-uprice">${item.priceEdited
            ? `<s>$${fmt(item.originalPrice)}</s> <b>$${fmt(item.price)}</b> c/u`
            : `$${fmt(item.price)} c/u`}</span>
          <button class="oi-linkbtn" onclick="openItemNotesModal(${index})">Notas</button>
          <button class="oi-linkbtn ${item.priceEdited ? 'edited' : ''}" onclick="openItemPriceModal(${index})">${item.priceEdited ? 'Precio ✎' : 'Precio'}</button>
        </div>
        ${item.priceEdited ? `<div class="oi-price-chip">${priceEditLabel(item)}</div>` : ''}
        ${item.isCombo && item.comboItems?.length ? `<div class="oi-combo">${item.comboItems.map(ci => `• ${ci.qty}x ${esc(ci.name || '')}${ci.variantLabel ? ` (${esc(ci.variantLabel)})` : ''}`).join('<br>')}</div>` : ''}
        ${item.notes ? `<div class="oi-note">Nota: ${esc(item.notes)}</div>` : ''}
      </div>
      <button class="oi-del" onclick="removeFromOrder(${index})">×</button>
    </div>
  `).join('');
}

function renderTotals() {
  const totals = calculateTotals(currentOrder.items);
  return `
    <div class="tot-row total"><span>TOTAL</span><span class="tot-currency">$${fmt(totals.total)} MXN</span></div>
  `;
}

function setPosCategory(category) {
  posCategory = category;
  document.querySelectorAll('.cat-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.textContent === category);
  });
  const grid = document.getElementById('menuGrid');
  if (grid) {
    grid.innerHTML = renderMenuItems(document.getElementById('gSearch')?.value || '');
    grid.scrollTop = 0;
  }
}

function setOrderType(type) {
  currentOrder.type = type;
  if (type === 'llevar') {
    currentOrder.mesa = 'Mostrador';
    currentOrder.comensales = Math.max(1, currentOrder.comensales);
  } else if (currentOrder.mesa === 'Mostrador') {
    currentOrder.mesa = 'Mesa 1';
  }
  document.querySelectorAll('.type-btn').forEach((button) => button.classList.toggle('active',
    (type === 'comedor' && button.textContent.includes('Comedor'))
    || (type === 'llevar' && button.textContent.includes('Llevar'))));
  const mesaSection = document.getElementById('mesaSection');
  const comensalesRow = document.getElementById('comensalesRow');
  if (mesaSection) mesaSection.style.display = type === 'llevar' ? 'none' : 'block';
  if (comensalesRow) {
    comensalesRow.style.opacity = type === 'llevar' ? '0.4' : '1';
    comensalesRow.style.pointerEvents = type === 'llevar' ? 'none' : 'auto';
  }
}

function selectMesa(mesa) {
  currentOrder.mesa = mesa;
  refreshOrderPanel();
  // Si habia un envio pendiente, elegir la mesa aqui tambien lo dispara.
  trySendAfterSetup();
}

function changeComensales(delta) {
  currentOrder.comensales = Math.max(1, currentOrder.comensales + delta);
  const value = document.getElementById('ccNum');
  if (value) value.textContent = currentOrder.comensales;
  persistActiveTicket();
}

function logComandaAction(description, extra) {
  if (!editingComandaId) return;
  const comanda = state.commandas.find(c => c.ticketNumber === editingComandaId);
  const mesa = comanda ? (comanda.type === 'llevar' ? 'Llevar' : comanda.mesa) : '';
  fetch('/api/movements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'comanda_action',
      description: `Comanda #${editingComandaId}${mesa ? ' (' + mesa + ')' : ''}: ${description}`,
      user: currentUser.name,
      timestamp: new Date().toISOString(),
      data: JSON.stringify({ ticketNumber: editingComandaId, mesa, ...extra })
    })
  }).catch(() => {});
}

// Exige elegir primero el tipo (Comedor/Llevar) y, si es comedor, la mesa,
// ANTES de poder agregar productos. Si falta algo, abre el modal correspondiente
// y NO agrega el producto: el usuario configura primero y luego agrega.
// Cuando se pulsa "Enviar comanda" y falta el tipo o la mesa, se piden al vuelo y
// la comanda sale sola al terminar: no hay que volver a pulsar el boton.
let pendingSendAfterSetup = false;

function trySendAfterSetup() {
  if (!pendingSendAfterSetup) return;
  if (!currentOrder.type) return;
  if (currentOrder.type === 'comedor' && !currentOrder.mesa) return;
  pendingSendAfterSetup = false;
  sendComanda();
}

// Si el usuario cancela la configuracion, se olvida el envio pendiente.
function cancelOrderSetup() {
  pendingSendAfterSetup = false;
  closeCurrentModal();
}

// Tipo y mesa ya NO se piden para capturar productos: frenaba la toma del pedido.
// Se piden al enviar la comanda, que es cuando de verdad hace falta saber a donde va.
function ensureOrderReady() {
  if (!currentOrder.type) {
    showToast('Elige Comedor o Llevar para enviar', 'error');
    openOrderTypeModal();
    return false;
  }
  if (currentOrder.type === 'comedor' && !currentOrder.mesa) {
    showToast('Selecciona la mesa para enviar', 'error');
    openMesaSelectionModal();
    return false;
  }
  return true;
}

function addToOrder(id) {
  const product = productById(id);
  if (!product) return;
  if (getProductVariants(product).length > 0) {
    openProductConfigModal(product);
    return;
  }
  const existing = currentOrder.items.find((item) => item.id === id && !item.notes && !item.variantKey);
  const nextQty = existing ? existing.qty + 1 : 1;
  const available = getAvailableStock(id);
  if (nextQty > available) {
    showToast(`Stock insuficiente para ${product.name}`, 'error');
    return;
  }
  if (existing) existing.qty = nextQty;
  else currentOrder.items.push(createOrderItemSnapshot(product, 1));
  logComandaAction(`agregó 1x ${product.name}`, { action: 'add', item: product.name });
  refreshOrderPanel();
}

// Un combo guarda dos tipos de renglon en `items`:
//   fijo:   { id, qty, name }  -> siempre va (p.ej. 1 refresco)
//   grupo:  { type: 'choice', label, qty, options: [{ id, name }] }
//           -> el cliente elige `qty` de entre las opciones (Plato fuerte: montados o chilaquiles)
// Al venderse, cada grupo se resuelve al producto elegido, asi que la comanda, los
// reportes y el inventario siguen recibiendo comboItems normales { id, qty, name, variantLabel }.
function isComboChoice(ci) {
  return !!ci && ci.type === 'choice';
}

function comboChoiceProducts(ci) {
  return (ci.options || []).map(o => productById(o.id)).filter(Boolean);
}

function comboItemNeedsConfig(ci) {
  return isComboChoice(ci) || getProductVariants(productById(ci.id)).length > 0;
}

function addComboToOrder(id) {
  const combo = state.combos.find(c => c.id === id);
  if (!combo) return;
  // Inventario retirado: ya no se valida stock de los productos del combo.
  if (combo.items.some(comboItemNeedsConfig)) {
    openComboConfigModal(combo);
  } else {
    const comboOrderItem = {
      id: `combo-${id}`,
      name: combo.name,
      price: combo.price,
      qty: 1,
      isCombo: true,
      comboItems: combo.items.map(ci => ({ ...ci, name: ci.name || productById(ci.id)?.name || '' })),
    };
    currentOrder.items.push(comboOrderItem);
    refreshOrderPanel();
  }
}

function comboVariantGroupsHtml(index, unit, groups) {
  return groups.map((group, gi) => `
    <div class="combo-cfg-group">
      <div class="combo-cfg-glabel">
        ${esc(group.name)} — elige ${group.minSelect === group.maxSelect ? group.minSelect : `${group.minSelect}–${group.maxSelect}`}
      </div>
      <div class="combo-cfg-opts">
        ${group.options.map(opt => `
          <button type="button" class="cat-tab combo-order-opt"
            data-item="${index}" data-unit="${unit}" data-group="${gi}" data-opt="${esc(opt.name)}"
            onclick="toggleComboOrderOpt(${index},${unit},${gi},${group.maxSelect},this)">
            ${esc(opt.name)}
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function openComboConfigModal(combo) {
  // Lo que no hay que elegir se muestra arriba como recordatorio de que ya va incluido.
  const plain = combo.items.filter(ci => !comboItemNeedsConfig(ci));
  const toConfig = combo.items
    .map((ci, index) => ({ ci, index }))
    .filter(({ ci }) => comboItemNeedsConfig(ci));

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.dataset.modalType = 'comboConfig';
  overlay.innerHTML = `<div class="modal">
    <div class="modal-header">
      <h3>Configura: ${esc(combo.name)}</h3>
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
    </div>
    <div class="modal-body combo-cfg-body">
      ${plain.length ? `<div class="combo-cfg-includes"><strong>Ya incluye:</strong> ${plain.map(ci => `${ci.qty}x ${esc(ci.name || productById(ci.id)?.name || '')}`).join(' · ')}</div>` : ''}
      ${toConfig.map(({ ci, index }) => {
        // Cada pieza se configura por separado: 3 montados pueden llevar guisos distintos
        // y asi se refleja en la comanda de cocina y en el descuento de inventario.
        const units = Math.max(1, ci.qty || 1);
        const choice = isComboChoice(ci);
        const product = choice ? null : productById(ci.id);
        const title = choice ? (ci.label || 'A elegir') : product.name;
        return `
        <div class="combo-cfg-item">
          <div class="combo-cfg-head">
            ${choice ? '<span class="combo-cfg-badge">Elige</span>' : ''}
            <span class="combo-cfg-title">${esc(title)}${units > 1 ? ` × ${units}` : ''}</span>
            ${units > 1 ? `<button type="button" class="combo-cfg-copy" onclick="copyComboUnitConfig(${index},${units})">Aplicar la 1ª a todas</button>` : ''}
          </div>
          ${Array.from({ length: units }, (_, u) => `
            <div class="combo-cfg-unit" id="ccu-${index}-${u}" data-choice="">
              ${units > 1 ? `<div class="combo-cfg-unit-label">${choice ? `${esc(title)} ${u + 1} de ${units}` : `Unidad ${u + 1} de ${units}`}</div>` : ''}
              ${choice ? `
                <div class="combo-cfg-opts combo-choice-opts">
                  ${comboChoiceProducts(ci).map(p => `
                    <button type="button" class="cat-tab combo-choice-opt" data-pid="${p.id}"
                      onclick="pickComboChoice(${index},${u},${p.id})">${esc(p.name)}</button>
                  `).join('')}
                </div>
                <div class="combo-cfg-vars" id="ccv-${index}-${u}"></div>
              ` : comboVariantGroupsHtml(index, u, getProductVariants(product))}
            </div>
          `).join('')}
        </div>`;
      }).join('')}
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
      <button class="btn btn-primary" onclick="confirmComboConfig(${combo.id})">Agregar al pedido</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);

  // Un grupo con una sola opcion no tiene nada que elegir: se deja marcada.
  toConfig.forEach(({ ci, index }) => {
    if (!isComboChoice(ci)) return;
    const options = comboChoiceProducts(ci);
    if (options.length !== 1) return;
    for (let u = 0; u < Math.max(1, ci.qty || 1); u++) pickComboChoice(index, u, options[0].id);
  });
}

// Elegir el producto de un grupo despliega SUS variantes (guiso, salsa...) debajo.
function pickComboChoice(index, unit, productId) {
  const box = document.getElementById(`ccu-${index}-${unit}`);
  if (!box || box.dataset.choice === String(productId)) return;
  box.dataset.choice = String(productId);
  box.querySelectorAll('.combo-choice-opt').forEach(b => b.classList.toggle('active', b.dataset.pid === String(productId)));
  const vars = document.getElementById(`ccv-${index}-${unit}`);
  if (vars) vars.innerHTML = comboVariantGroupsHtml(index, unit, getProductVariants(productById(productId)));
}

function comboUnitOpts(itemIndex, unit, groupIndex) {
  return document.querySelectorAll(`.combo-order-opt[data-item="${itemIndex}"][data-unit="${unit}"][data-group="${groupIndex}"]`);
}

function toggleComboOrderOpt(itemIndex, unit, groupIndex, maxSelect, btn) {
  const siblings = comboUnitOpts(itemIndex, unit, groupIndex);
  if (btn.classList.contains('active')) {
    btn.classList.remove('active');
  } else if (maxSelect === 1) {
    siblings.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  } else if ([...siblings].filter(b => b.classList.contains('active')).length < maxSelect) {
    btn.classList.add('active');
  } else {
    showToast(`Máximo ${maxSelect} opciones`, 'error');
  }
}

// Atajo: repetir en todas las piezas lo que se eligio en la primera
// (el producto del grupo, si lo hay, y sus variantes).
function copyComboUnitConfig(itemIndex, units) {
  const firstChoice = document.getElementById(`ccu-${itemIndex}-0`)?.dataset.choice;
  const first = document.querySelectorAll(`.combo-order-opt[data-item="${itemIndex}"][data-unit="0"]`);
  const chosen = new Set([...first].filter(b => b.classList.contains('active')).map(b => `${b.dataset.group}|${b.dataset.opt}`));
  for (let u = 1; u < units; u++) {
    if (firstChoice) pickComboChoice(itemIndex, u, Number(firstChoice));
    document.querySelectorAll(`.combo-order-opt[data-item="${itemIndex}"][data-unit="${u}"]`).forEach(b => {
      b.classList.toggle('active', chosen.has(`${b.dataset.group}|${b.dataset.opt}`));
    });
  }
}

function confirmComboConfig(comboId) {
  const combo = state.combos.find(c => c.id === comboId);
  if (!combo) return;
  let valid = true;
  const fail = (msg) => {
    if (valid) showToast(msg, 'error');
    valid = false;
  };
  const comboItems = [];
  combo.items.forEach((ci, index) => {
    const units = Math.max(1, ci.qty || 1);
    if (!comboItemNeedsConfig(ci)) {
      comboItems.push({ id: ci.id, qty: units, name: ci.name || productById(ci.id)?.name || '', variantLabel: '', variantKey: '' });
      return;
    }
    const choice = isComboChoice(ci);
    // Una configuracion por pieza; al final se agrupan las piezas que quedaron iguales
    // (p.ej. "Montado x2 (Asado)" + "Montado x1 (Verde)").
    const byKey = new Map();
    for (let u = 0; u < units; u++) {
      const unitTag = units > 1 ? ` (${u + 1} de ${units})` : '';
      const productId = choice ? Number(document.getElementById(`ccu-${index}-${u}`)?.dataset.choice) : ci.id;
      const product = productById(productId);
      if (!product) {
        fail(`Falta elegir "${ci.label || 'opción'}"${unitTag}`);
        continue;
      }
      const name = choice ? product.name : (ci.name || product.name);
      const labelParts = [];
      const keyParts = [];
      let unitOk = true;
      getProductVariants(product).forEach((group, gi) => {
        const selected = [...comboUnitOpts(index, u, gi)].filter(b => b.classList.contains('active')).map(b => b.dataset.opt);
        if (group.minSelect > 0 && selected.length < group.minSelect) {
          fail(`Falta elegir "${group.name}" en ${name}${unitTag}`);
          unitOk = false;
          return;
        }
        if (selected.length) labelParts.push(selected.join(' + '));
        keyParts.push(selected.slice().sort().join('|'));
      });
      if (!unitOk) continue;
      const variantKey = keyParts.join('||');
      const mapKey = `${product.id}::${variantKey}`;
      const entry = byKey.get(mapKey);
      if (entry) entry.qty += 1;
      else byKey.set(mapKey, { id: product.id, qty: 1, name, variantLabel: labelParts.join(' · '), variantKey });
    }
    byKey.forEach(entry => comboItems.push(entry));
  });
  if (!valid) return;
  document.querySelector('.modal-overlay[data-modal-type="comboConfig"]')?.remove();
  currentOrder.items.push({
    id: `combo-${combo.id}`,
    name: combo.name,
    price: combo.price,
    qty: 1,
    isCombo: true,
    comboItems,
  });
  refreshOrderPanel();
}

function changeQty(index, delta) {
  const item = currentOrder.items[index];
  if (!item) return;
  const nextQty = item.qty + delta;
  if (nextQty <= 0) {
    // Bajar de 1 a 0 saca el producto del ticket: se confirma para que no se
    // pierda un producto por un clic de mas.
    confirmarQuitarDelTicket(index);
    return;
  }
  const otherQty = currentOrder.items
    .filter((_, itemIndex) => itemIndex !== index && currentOrder.items[itemIndex].id === item.id)
    .reduce((sum, entry) => sum + entry.qty, 0);
  if (nextQty + otherQty > getAvailableStock(item.id)) {
    showToast(`Stock insuficiente para ${item.name}`, 'error');
    return;
  }
  const prev = item.qty;
  item.qty = nextQty;
  logComandaAction(`${delta > 0 ? 'aumentó' : 'redujo'} ${item.name}: ${prev}→${nextQty}`, { action: 'qty_change', item: item.name, from: prev, to: nextQty });
  refreshOrderPanel();
}

// Quita de verdad el renglon del ticket (ya confirmado).
function quitarDelTicket(index) {
  const item = currentOrder.items[index];
  if (!item) return;
  logComandaAction(`quitó ${item.qty}x ${item.name}`, { action: 'remove', item: item.name });
  currentOrder.items.splice(index, 1);
  refreshOrderPanel();
}

// Pregunta antes de sacar el producto del ticket.
function confirmarQuitarDelTicket(index) {
  const item = currentOrder.items[index];
  if (!item) return;
  const nombre = item.variantLabel ? `${item.name} (${item.variantLabel})` : item.name;
  openConfirmModal({
    title: '¿Quitar del ticket?',
    message: `Se va a quitar ${item.qty > 1 ? item.qty + '× ' : ''}${nombre} del ticket.`,
    confirmText: 'Sí, quitar',
    cancelText: 'No, dejarlo',
    danger: true,
    onConfirm: () => quitarDelTicket(index),
  });
}

function removeFromOrder(index) {
  confirmarQuitarDelTicket(index);
}

function openItemNotesModal(index) {
  const item = currentOrder.items[index];
  if (!item) return;
  document.getElementById('itemNotesIndex').value = index;
  document.getElementById('itemNotesSub').textContent = `Producto: ${item.name}`;
  document.getElementById('itemNotesInput').value = item.notes || '';
  openModal('itemNotesModal');
}

function closeItemNotesModal() {
  document.getElementById('itemNotesIndex').value = '';
  document.getElementById('itemNotesInput').value = '';
  closeModal('itemNotesModal');
}

function saveItemNotes() {
  const index = Number(document.getElementById('itemNotesIndex').value);
  const item = currentOrder.items[index];
  if (!item) return;
  item.notes = document.getElementById('itemNotesInput').value.trim();
  closeItemNotesModal();
  refreshOrderPanel();
}

// ===================== CAMBIO DE PRECIO / DESCUENTO POR PRODUCTO =====================
// Precio base = precio del catalogo (con variantes ya aplicadas), antes de cualquier ajuste manual.
function itemBasePrice(item) {
  return item.priceEdited ? toMoney(item.originalPrice) : toMoney(item.price);
}

// Etiqueta corta para un producto con precio ajustado (descuento o cambio de precio).
function priceEditLabel(item) {
  const base = toMoney(item.originalPrice);
  const now = toMoney(item.price);
  const diff = now - base;
  const reason = item.priceNote ? ` · ${esc(item.priceNote)}` : '';
  if (diff < 0) {
    const pct = base > 0 ? Math.round((-diff / base) * 100) : 0;
    return `Descuento −$${fmt(-diff)}${pct ? ` (${pct}%)` : ''}${reason}`;
  }
  if (diff > 0) {
    return `Precio +$${fmt(diff)}${reason}`;
  }
  return `Precio ajustado${reason}`;
}

function openItemPriceModal(index) {
  const item = currentOrder.items[index];
  if (!item) return;
  const base = itemBasePrice(item);
  const modal = document.createElement('div');
  modal.className = 'modal-overlay open';
  modal.dataset.modalType = 'itemPrice';
  modal.innerHTML = `<div class="modal">
    <div class="modal-header">
      <h3>Precio del producto</h3>
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
    </div>
    <div class="modal-body">
      <div style="font-size:14px;color:var(--charcoal);font-weight:600;margin-bottom:2px">${esc(item.name)}</div>
      ${item.variantLabel ? `<div style="font-size:13px;color:var(--stone);margin-bottom:8px">${esc(item.variantLabel)}</div>` : ''}
      <div style="font-size:13px;color:var(--stone);margin-bottom:12px">Precio de catálogo: <strong style="font-family:var(--mono);color:var(--charcoal)">$${fmt(base)}</strong></div>
      <div class="form-group">
        <label>Nuevo precio unitario</label>
        <input type="number" id="itemPriceInput" min="0" step="0.5" value="${toMoney(item.price)}" oninput="updateItemPricePreview(${base})">
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
        <button type="button" class="btn btn-secondary btn-sm" onclick="applyItemDiscount(${base}, 0.10)">−10%</button>
        <button type="button" class="btn btn-secondary btn-sm" onclick="applyItemDiscount(${base}, 0.15)">−15%</button>
        <button type="button" class="btn btn-secondary btn-sm" onclick="applyItemDiscount(${base}, 0.20)">−20%</button>
        <button type="button" class="btn btn-secondary btn-sm" onclick="applyItemDiscount(${base}, 0.50)">−50%</button>
        <button type="button" class="btn btn-secondary btn-sm" onclick="applyItemDiscount(${base}, 0)">Restaurar</button>
      </div>
      <div class="form-group">
        <label>Motivo (opcional)</label>
        <input type="text" id="itemPriceReason" maxlength="60" placeholder="Ej. remate, producto dañado, cortesía" value="${item.priceNote ? esc(item.priceNote) : ''}">
      </div>
      <div id="itemPricePreview" style="font-size:13.5px;color:var(--accent-dark);font-weight:600;min-height:18px"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
      <button class="btn btn-primary" onclick="saveItemPrice(${index})">Guardar</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  updateItemPricePreview(base);
  const input = document.getElementById('itemPriceInput');
  input.focus();
  input.select();
}

function applyItemDiscount(base, pct) {
  const input = document.getElementById('itemPriceInput');
  if (!input) return;
  input.value = toMoney(base * (1 - pct));
  updateItemPricePreview(base);
}

function updateItemPricePreview(base) {
  const preview = document.getElementById('itemPricePreview');
  const input = document.getElementById('itemPriceInput');
  if (!preview || !input) return;
  const now = toMoney(parseFloat(input.value) || 0);
  const diff = now - toMoney(base);
  if (Math.abs(diff) < 0.005) {
    preview.textContent = 'Sin cambio (precio de catálogo)';
    preview.style.color = 'var(--stone)';
  } else if (diff < 0) {
    const pct = base > 0 ? Math.round((-diff / base) * 100) : 0;
    preview.textContent = `Descuento de $${fmt(-diff)}${pct ? ` (${pct}%)` : ''} por unidad`;
    preview.style.color = 'var(--accent-dark)';
  } else {
    preview.textContent = `Aumento de $${fmt(diff)} por unidad`;
    preview.style.color = 'var(--amber)';
  }
}

function saveItemPrice(index) {
  const item = currentOrder.items[index];
  if (!item) return;
  const base = itemBasePrice(item);
  const input = document.getElementById('itemPriceInput');
  let newPrice = toMoney(parseFloat(input.value));
  if (!isFinite(newPrice) || newPrice < 0) newPrice = 0;
  const reason = (document.getElementById('itemPriceReason')?.value || '').trim();
  const prevPrice = item.price;

  if (Math.abs(newPrice - base) < 0.005) {
    // Volvió al precio de catálogo: quitar el ajuste.
    item.price = base;
    delete item.priceEdited;
    delete item.originalPrice;
    delete item.priceNote;
  } else {
    item.originalPrice = base;
    item.price = newPrice;
    item.priceEdited = true;
    item.priceNote = reason;
  }

  // Registrar el cambio en movimientos si se está editando una comanda existente.
  if (item.price !== prevPrice && editingComandaId) {
    const desc = item.priceEdited
      ? `cambió precio de ${item.name}: $${fmt(base)} → $${fmt(item.price)}${reason ? ` (${reason})` : ''}`
      : `restauró precio de ${item.name} a $${fmt(base)}`;
    logComandaAction(desc, { action: 'price', item: item.name, from: base, to: item.price, reason });
  }

  document.querySelector('.modal-overlay[data-modal-type="itemPrice"]')?.remove();
  refreshOrderPanel();
  showToast(item.priceEdited ? 'Precio ajustado' : 'Precio restaurado', 'success');
}

function getProductVariants(product) {
  // Las variantes vienen SOLO de lo que el usuario configura en el producto.
  return Array.isArray(product?.variants) ? product.variants : [];
}

function openProductConfigModal(product) {
  const groups = getProductVariants(product);
  if (groups.length === 0) return;
  const cloned = groups.map(g => ({ ...g, options: g.options.map(o => ({ ...o })) }));
  // Pedir varias variantes de una vez es OPCIONAL y se activa producto por producto
  // con la casilla del formulario. Si esta apagada, el producto se agrega de uno en
  // uno como siempre.
  const allowMulti = !!product.qtyByVariant;
  // Modo CANTIDADES: un solo grupo con exactamente una opcion por unidad (el caso
  // tipico: el guisado del burrito). Ahi cada variante lleva su propia cantidad y se
  // piden 2 de asado y 5 de prensado de una sola pasada.
  // Con varios grupos, o si una unidad admite varias opciones, "2 de asado" ya no
  // describe una unidad completa: se arma cada combinacion y se le pone cantidad.
  const qtyMode = allowMulti
    && cloned.length === 1
    && Number(cloned[0].maxSelect) === 1
    && Number(cloned[0].minSelect) === 1;
  productConfigContext = {
    productId: product.id,
    groups: cloned,
    allowMulti,
    qtyMode,
    quantities: {},                   // modo cantidades: opcion -> unidades
    selections: cloned.map(() => []), // modo combinacion: la linea que se esta armando
    lineQty: 1,
    lines: [],                        // modo combinacion: combinaciones ya apartadas
  };
  document.getElementById('productConfigTitle').textContent = `Configurar ${product.name}`;
  document.getElementById('productConfigSub').textContent = qtyMode
    ? 'Elige cuántos quieres de cada variante'
    : (allowMulti ? 'Arma cada variante y ponle su cantidad' : 'Selecciona las opciones del producto');
  document.getElementById('productConfigNotes').value = '';
  renderProductConfigGroups();
  openModal('productConfigModal');
}

function closeProductConfigModal() {
  productConfigContext = null;
  document.getElementById('productConfigNotes').value = '';
  document.getElementById('productConfigSummary').textContent = '';
  closeModal('productConfigModal');
}

// ----- Modo cantidades (una variante por unidad) -----
function optionQty(name) {
  return Number(productConfigContext?.quantities[name]) || 0;
}

function changeOptionQty(name, delta) {
  if (!productConfigContext) return;
  productConfigContext.quantities[name] = Math.max(0, optionQty(name) + delta);
  renderProductConfigGroups();
}

// Al escribir no se repinta todo: se perderia el foco del recuadro.
function setOptionQty(name, value, el) {
  if (!productConfigContext) return;
  const qty = Math.max(0, Math.floor(Number(value) || 0));
  productConfigContext.quantities[name] = qty;
  const row = el?.closest('.vc-qty-row');
  if (row) row.classList.toggle('active', qty > 0);
  updateProductConfigSummary();
}

// ----- Modo combinacion (varios grupos) -----
function toggleVariantOption(groupIndex, optName) {
  if (!productConfigContext) return;
  const group = productConfigContext.groups[groupIndex];
  const selections = productConfigContext.selections[groupIndex];
  const idx = selections.indexOf(optName);
  if (idx >= 0) {
    selections.splice(idx, 1);
  } else if (group.maxSelect === 1) {
    productConfigContext.selections[groupIndex] = [optName];
  } else if (selections.length < group.maxSelect) {
    selections.push(optName);
  } else {
    selections.shift();
    selections.push(optName);
  }
  renderProductConfigGroups();
}

function changeLineQty(delta) {
  if (!productConfigContext) return;
  productConfigContext.lineQty = Math.max(1, productConfigContext.lineQty + delta);
  renderProductConfigGroups();
}

function setLineQty(value, el) {
  if (!productConfigContext) return;
  productConfigContext.lineQty = Math.max(1, Math.floor(Number(value) || 1));
  updateProductConfigSummary();
}

// Aparta la combinacion que se acaba de armar y deja el formulario libre para otra.
function addVariantLine() {
  const ctx = productConfigContext;
  if (!ctx) return;
  const error = validateVariantLine(ctx.selections);
  if (error) { showToast(error, 'error'); return; }
  const { label } = variantLineParts(ctx.selections);
  ctx.lines.push({ selections: ctx.selections.map(s => s.slice()), qty: ctx.lineQty, label });
  ctx.selections = ctx.groups.map(() => []);
  ctx.lineQty = 1;
  renderProductConfigGroups();
}

function removeVariantLine(index) {
  if (!productConfigContext) return;
  productConfigContext.lines.splice(index, 1);
  renderProductConfigGroups();
}

// ----- Comun a los dos modos -----
// Etiqueta, clave y ajuste de precio de una combinacion de opciones.
function variantLineParts(selections) {
  const ctx = productConfigContext;
  const labelParts = selections.map(sel => sel.length ? sel.join(' + ') : '').filter(Boolean);
  const keyParts = selections.map(arr => arr.slice().sort().join('|'));
  let delta = 0;
  ctx.groups.forEach((group, gi) => {
    (selections[gi] || []).forEach(name => {
      const opt = group.options.find(o => o.name === name);
      if (opt) delta += Number(opt.priceDelta) || 0;
    });
  });
  return { label: labelParts.join(' · '), key: keyParts.join('||'), delta };
}

function validateVariantLine(selections) {
  const ctx = productConfigContext;
  for (let gi = 0; gi < ctx.groups.length; gi++) {
    const group = ctx.groups[gi];
    const sel = selections[gi] || [];
    if (sel.length < group.minSelect) return `Selecciona al menos ${group.minSelect} en "${group.name}"`;
    if (sel.length > group.maxSelect) return `Máximo ${group.maxSelect} en "${group.name}"`;
  }
  return '';
}

// Lineas que se agregarian al ticket: cada una es una combinacion con su cantidad.
function configuredLines() {
  const ctx = productConfigContext;
  if (!ctx) return [];
  if (ctx.qtyMode) {
    return ctx.groups[0].options
      .filter(opt => optionQty(opt.name) > 0)
      .map(opt => ({ selections: [[opt.name]], qty: optionQty(opt.name) }));
  }
  // Sin la casilla activada el producto se agrega de uno en uno, como siempre.
  if (!ctx.allowMulti) {
    return [{ selections: ctx.selections.map(s => s.slice()), qty: 1 }];
  }
  const lines = ctx.lines.map(l => ({ selections: l.selections, qty: l.qty }));
  // La combinacion en pantalla cuenta aunque no se haya apartado con el boton.
  if (ctx.selections.some(sel => sel.length > 0) || !lines.length) {
    lines.push({ selections: ctx.selections.map(s => s.slice()), qty: ctx.lineQty });
  }
  return lines;
}

function renderProductConfigGroups() {
  if (!productConfigContext) return;
  const container = document.getElementById('productConfigGroups');
  if (!container) return;
  container.innerHTML = productConfigContext.qtyMode
    ? renderQtyModeHtml()
    : renderComboModeHtml();
  updateProductConfigSummary();
}

function variantDeltaText(delta) {
  if (!delta) return '';
  return delta > 0 ? `+$${fmt(delta)}` : `-$${fmt(Math.abs(delta))}`;
}

function renderQtyModeHtml() {
  const group = productConfigContext.groups[0];
  return `<div class="vc-group">
    <div class="vc-group-head">
      <div class="vc-group-name">${esc(group.name)}</div>
      <div class="vc-group-rule">Pon la cantidad de cada variante</div>
    </div>
    <div class="vc-qty-list">
      ${group.options.map(opt => {
        const qty = optionQty(opt.name);
        const delta = Number(opt.priceDelta) || 0;
        return `<div class="vc-qty-row ${qty > 0 ? 'active' : ''}">
          <div class="vc-qty-info">
            <span class="vc-qty-name">${esc(opt.name)}</span>
            ${delta !== 0 ? `<span class="vc-delta">${variantDeltaText(delta)}</span>` : ''}
          </div>
          <div class="vc-qty-ctrl">
            <button type="button" class="vc-qty-btn" ${qty === 0 ? 'disabled' : ''} onclick='changeOptionQty(${jsv(opt.name)}, -1)'>−</button>
            <input class="vc-qty-input" type="number" min="0" inputmode="numeric" value="${qty}"
              oninput='setOptionQty(${jsv(opt.name)}, this.value, this)' onchange="renderProductConfigGroups()">
            <button type="button" class="vc-qty-btn" onclick='changeOptionQty(${jsv(opt.name)}, 1)'>+</button>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function renderComboModeHtml() {
  const ctx = productConfigContext;
  const groupsHtml = ctx.groups.map((group, gi) => {
    const selected = ctx.selections[gi];
    const rule = group.minSelect === group.maxSelect
      ? `Elige ${group.maxSelect}`
      : `Elige entre ${group.minSelect} y ${group.maxSelect}`;
    return `<div class="vc-group">
      <div class="vc-group-head">
        <div class="vc-group-name">${esc(group.name)}</div>
        <div class="vc-group-rule">${rule} · ${selected.length}/${group.maxSelect} seleccionados</div>
      </div>
      <div class="vc-options">
        ${group.options.map(opt => {
          const isSel = selected.includes(opt.name);
          const delta = Number(opt.priceDelta) || 0;
          return `<button type="button" class="vc-option ${isSel ? 'selected' : ''}" onclick='toggleVariantOption(${gi}, ${jsv(opt.name)})'>
            <span>${esc(opt.name)}</span>
            ${delta !== 0 ? `<span class="vc-delta">${variantDeltaText(delta)}</span>` : ''}
          </button>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');

  const linesHtml = ctx.lines.length ? `<div class="vc-lines">
    <div class="vc-lines-title">Variantes apartadas</div>
    ${ctx.lines.map((line, i) => `<div class="vc-line">
      <span class="vc-line-qty">${line.qty}×</span>
      <span class="vc-line-label">${esc(line.label || 'Sin opciones')}</span>
      <button type="button" class="vc-line-del" onclick="removeVariantLine(${i})" title="Quitar">×</button>
    </div>`).join('')}
  </div>` : '';

  // Los controles de cantidad solo aparecen en los productos donde se activo la opcion.
  if (!ctx.allowMulti) return groupsHtml;

  return groupsHtml + `<div class="vc-addline">
    <div class="vc-qty-ctrl">
      <span class="vc-qty-label">Cantidad</span>
      <button type="button" class="vc-qty-btn" ${ctx.lineQty <= 1 ? 'disabled' : ''} onclick="changeLineQty(-1)">−</button>
      <input class="vc-qty-input" type="number" min="1" inputmode="numeric" value="${ctx.lineQty}"
        oninput="setLineQty(this.value, this)" onchange="renderProductConfigGroups()">
      <button type="button" class="vc-qty-btn" onclick="changeLineQty(1)">+</button>
    </div>
    <button type="button" class="btn btn-secondary btn-sm" onclick="addVariantLine()">+ Agregar otra variante</button>
  </div>` + linesHtml;
}

function updateProductConfigSummary() {
  const ctx = productConfigContext;
  const box = document.getElementById('productConfigSummary');
  const btn = document.getElementById('productConfigAddBtn');
  if (!ctx || !box) return;
  const product = productById(ctx.productId);

  // Producto normal (sin la opcion activada): resumen clasico de las opciones elegidas.
  if (!ctx.allowMulti) {
    const partes = ctx.groups.map((group, gi) => {
      const sel = ctx.selections[gi];
      return sel.length ? `${group.name}: ${sel.join(', ')}` : `${group.name}: pendiente`;
    });
    const delta = variantLineParts(ctx.selections).delta;
    const deltaTxt = delta !== 0 ? ` · Ajuste: ${delta > 0 ? '+' : '-'}$${fmt(Math.abs(delta))}` : '';
    box.textContent = partes.join(' · ') + deltaTxt;
    if (btn) btn.textContent = 'Agregar al ticket';
    return;
  }

  const lines = configuredLines().filter(l => l.qty > 0 && !validateVariantLine(l.selections));
  const total = lines.reduce((sum, l) => sum + l.qty, 0);
  if (!total) {
    box.textContent = ctx.qtyMode
      ? 'Aún no eliges cantidades'
      : 'Selecciona las opciones del producto';
    if (btn) btn.textContent = 'Agregar al ticket';
    return;
  }
  const base = product ? toMoney(product.price) : 0;
  let importe = 0;
  const partes = lines.map(line => {
    const { label, delta } = variantLineParts(line.selections);
    importe += (base + delta) * line.qty;
    return `${line.qty}× ${label || 'sin variante'}`;
  });
  box.textContent = `${partes.join('  ·  ')}  —  ${total} ${total === 1 ? 'unidad' : 'unidades'} · $${fmt(toMoney(importe))}`;
  if (btn) btn.textContent = total === 1 ? 'Agregar al ticket' : `Agregar ${total} al ticket`;
}

function saveConfiguredProduct() {
  if (!productConfigContext) return;
  const product = productById(productConfigContext.productId);
  if (!product) return;

  const lines = configuredLines().filter(line => line.qty > 0);
  if (!lines.length) {
    showToast(productConfigContext.qtyMode
      ? 'Pon la cantidad de al menos una variante'
      : 'Selecciona las opciones del producto', 'error');
    return;
  }
  for (const line of lines) {
    const error = validateVariantLine(line.selections);
    if (error) { showToast(error, 'error'); return; }
  }

  const notes = document.getElementById('productConfigNotes').value.trim();
  lines.forEach(line => {
    const { label, key, delta } = variantLineParts(line.selections);
    // Las unidades iguales se juntan en una sola linea del ticket, igual que antes.
    const existing = currentOrder.items.find((item) => item.id === product.id && item.variantKey === key && item.notes === notes);
    if (existing) {
      existing.qty += line.qty;
    } else {
      const item = createOrderItemSnapshot(product, line.qty);
      item.price = toMoney(item.price + delta);
      item.variantLabel = label;
      item.variantKey = key;
      item.notes = notes;
      currentOrder.items.push(item);
    }
  });

  const total = lines.reduce((sum, line) => sum + line.qty, 0);
  closeProductConfigModal();
  refreshOrderPanel();
  if (total > 1) showToast(`${total} × ${product.name} agregados`, 'success');
}
function refreshOrderPanel() {
  const orderItems = document.getElementById('orderItems');
  if (orderItems) orderItems.innerHTML = renderOrderItems();
  const totals = document.getElementById('orderTotals');
  if (totals) totals.innerHTML = renderTotals();
  updateMenuStock();
  refreshOrderHeader();
  const notes = document.getElementById('orderNotes');
  if (notes && notes.value !== currentOrder.notes) notes.value = currentOrder.notes;
  refreshTicketTabs();
  updateScrollHint();
  persistActiveTicket();
}

// Actualiza el stock mostrado en el menu sin reconstruir el grid (evita recargar imagenes / parpadeo).
function updateMenuStock() {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;
  state.products.forEach((p) => {
    const card = grid.querySelector(`.menu-item[onclick="addToOrder(${p.id})"]`);
    if (!card) return;
    const avail = getAvailableStock(p.id);
    const stockEl = card.querySelector('.mi-stock');
    if (stockEl) stockEl.textContent = `Stock: ${avail}`;
    const out = avail <= 0;
    card.classList.toggle('out-of-stock', out);
    let badge = card.querySelector('.oos-badge');
    if (out && !badge) {
      badge = document.createElement('span');
      badge.className = 'oos-badge';
      badge.textContent = 'Sin stock';
      card.insertBefore(badge, card.firstChild);
    } else if (!out && badge) {
      badge.remove();
    }
  });
}

// Muestra la senal de "hay mas productos abajo" cuando la lista se puede desplazar.
// Sin productos nunca se muestra (el estado vacio no es contenido desplazable).
function updateScrollHint() {
  const el = document.getElementById('orderItems');
  const hint = document.getElementById('scrollHint');
  if (!el || !hint) return;
  const moreBelow = currentOrder.items.length > 0
    && (el.scrollHeight - el.clientHeight - el.scrollTop) > 8;
  hint.classList.toggle('show', moreBelow);
}

// Las notas ocupan espacio que casi siempre se prefiere para los productos:
// se muestran plegadas y se abren solo cuando hacen falta.
function toggleOrderNotes() {
  const box = document.getElementById('orderNotesBox');
  if (!box) return;
  const opening = !box.classList.contains('open');
  box.classList.toggle('open', opening);
  if (opening) document.getElementById('orderNotes')?.focus();
  updateScrollHint();
}

function scrollOrderItems() {
  const el = document.getElementById('orderItems');
  if (el) el.scrollBy({ top: Math.max(160, el.clientHeight * 0.7), behavior: 'smooth' });
}

function clearOrder() {
  // Vaciar sin productos no requiere confirmacion.
  if (!currentOrder.items.length) { doClearOrder(); return; }
  openConfirmModal({
    title: 'Limpiar ticket',
    message: '¿Seguro que quieres vaciar este ticket? Se quitarán todos los productos y no se puede deshacer.',
    confirmText: 'Sí, limpiar',
    danger: true,
    onConfirm: doClearOrder,
  });
}

function doClearOrder() {
  const keepEditContext = editingComandaId !== null;
  currentOrder = createEmptyOrder();
  if (keepEditContext) {
    currentOrder.type = 'comedor';
    currentOrder.mesa = 'Mesa 1';
    currentOrder.comensales = 2;
  }
  refreshOrderPanel();
}

// ===================== TICKETS ABIERTOS (barra estilo Eleventa) =====================
// state.parkedOrders = todos los tickets abiertos persistidos. El ticket activo
// vive en currentOrder + activeTicketId (null = ticket nuevo aun sin guardar).

// Etiqueta automatica de una orden segun tipo/mesa.
function autoTicketLabel(order) {
  if (!order || !order.type) return 'Nuevo';
  return order.type === 'llevar' ? 'Llevar' : (order.mesa || 'Mesa');
}

// Etiqueta a mostrar en la pestana: nombre personalizado o la automatica.
function ticketTabLabel(t) {
  return (t && t.customName && t.customName.trim()) ? t.customName.trim() : autoTicketLabel(t);
}

// Payload comun para POST/PUT de un ticket abierto.
function ticketPayload(o) {
  return {
    label: autoTicketLabel(o),
    customName: (o.customName && o.customName.trim()) || null,
    type: o.type || 'comedor',
    mesa: o.mesa || '',
    comensales: o.comensales || 1,
    notes: o.notes || '',
    waiter: (currentUser && currentUser.name) || '',
    items: (o.items || []).map((item) => ({ ...item })),
  };
}

// Renderiza la barra de pestanas de tickets abiertos.
function renderTicketTabs() {
  return `<div class="ticket-tabs" id="ticketTabs">${renderTicketTabsInner()}</div>`;
}

// Contenido interno de la barra (se actualiza sin reemplazar el contenedor, evita parpadeo).
function renderTicketTabsInner() {
  // Al editar una comanda existente no se muestran las pestanas.
  if (editingComandaId !== null) return '';
  const tabs = state.parkedOrders.map((t) => {
    const isActive = t.id === activeTicketId;
    const src = isActive ? currentOrder : t;
    const count = (src.items || []).reduce((s, i) => s + (i.qty || 0), 0);
    return ticketTabHtml(t.id, ticketTabLabel(src), count, isActive);
  });
  if (activeTicketId == null) {
    const count = currentOrder.items.reduce((s, i) => s + (i.qty || 0), 0);
    tabs.push(ticketTabHtml('new', ticketTabLabel(currentOrder), count, true));
  }
  return `${tabs.join('')}<button class="ticket-tab-add" onclick="newTicket()" title="Nuevo ticket">+</button>`;
}

function ticketTabHtml(id, label, count, active) {
  const key = id === 'new' ? 'new' : id;
  const arg = id === 'new' ? 'null' : id;
  return `<div class="ticket-tab ${active ? 'active' : ''}" data-id="${key}" onclick="switchTicket(${arg})" ondblclick="renameTicket(${arg})" title="Doble clic para renombrar">
    <span class="tt-label">${esc(label)}</span>
    ${id !== 'new' ? `<span class="tt-close" onclick="event.stopPropagation();closeTicketTab(${id})" title="Cerrar ticket">×</span>` : ''}
  </div>`;
}

function refreshTicketTabs() {
  const el = document.getElementById('ticketTabs');
  if (el) el.innerHTML = renderTicketTabsInner();
}

// Copia los datos vivos de currentOrder a su entrada en state.parkedOrders.
function syncActiveTicketEntry() {
  if (activeTicketId == null) return;
  const e = state.parkedOrders.find((t) => t.id === activeTicketId);
  if (!e) return;
  e.type = currentOrder.type;
  e.mesa = currentOrder.mesa;
  e.comensales = currentOrder.comensales;
  e.notes = currentOrder.notes;
  e.customName = (currentOrder.customName && currentOrder.customName.trim()) || null;
  e.items = currentOrder.items.map((i) => ({ ...i }));
}

async function postActiveTicket() {
  const payload = ticketPayload(currentOrder);
  try {
    const res = await fetch('/api/parked', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const { id, createdAt } = await res.json();
    const entry = { id, createdAt, ...payload };
    state.parkedOrders.push(entry);
    activeTicketId = id;
    return entry;
  } catch (error) {
    console.error('Error al guardar ticket:', error);
  }
}

async function putTicket(entry) {
  try {
    await fetch(`/api/parked/${entry.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketPayload(entry)),
    });
  } catch (error) {
    console.error('Error al actualizar ticket:', error);
  }
}

// Autoguardado del ticket activo (con debounce). immediate=true guarda al instante.
function persistActiveTicket(immediate) {
  if (editingComandaId !== null) return;
  if (ticketSaveTimer) { clearTimeout(ticketSaveTimer); ticketSaveTimer = null; }
  const run = async () => {
    ticketSaveTimer = null;
    if (activeTicketId != null) {
      syncActiveTicketEntry();
      const e = state.parkedOrders.find((t) => t.id === activeTicketId);
      if (e) await putTicket(e);
    } else if (currentOrder.items.length) {
      await postActiveTicket();
      refreshTicketTabs();
    }
  };
  if (immediate) return run();
  ticketSaveTimer = setTimeout(run, 600);
}

// Guarda el ticket activo antes de cambiar de pestana o crear otro.
async function commitActiveTicket() {
  if (ticketSaveTimer) { clearTimeout(ticketSaveTimer); ticketSaveTimer = null; }
  if (editingComandaId !== null) return;
  if (activeTicketId != null) {
    syncActiveTicketEntry();
    const e = state.parkedOrders.find((t) => t.id === activeTicketId);
    if (e) await putTicket(e);
  } else if (currentOrder.items.length) {
    await postActiveTicket();
  }
}

// Carga una entrada de ticket a currentOrder.
function loadTicketEntry(entry) {
  editingComandaId = null;
  currentOrder = {
    items: (entry.items || []).map((item) => ({ ...item })),
    type: entry.type || 'comedor',
    mesa: entry.mesa || 'Mesa 1',
    comensales: entry.comensales || 2,
    notes: entry.notes || '',
    customName: entry.customName || '',
  };
  activeTicketId = entry.id;
}

// Carga el primer ticket abierto disponible, o uno vacio si no hay.
function loadFirstOrEmpty() {
  const next = state.parkedOrders[0];
  if (next) loadTicketEntry(next);
  else { editingComandaId = null; currentOrder = createEmptyOrder(); activeTicketId = null; }
}

// Cambia a otra pestana de ticket.
async function switchTicket(id) {
  if (id == null || id === activeTicketId) return;
  await commitActiveTicket();
  const entry = state.parkedOrders.find((t) => t.id === id);
  if (!entry) { refreshOrderPanel(); return; }
  loadTicketEntry(entry);
  refreshOrderPanel();
}

// Crea un ticket nuevo (vacio) y lo hace activo.
async function newTicket() {
  // Evita abrir varios tickets vacios: primero hay que ponerle productos al actual.
  if (!currentOrder.items.length) {
    showToast('Agrega productos a este ticket antes de abrir otro', 'error');
    return;
  }
  await commitActiveTicket();
  editingComandaId = null;
  currentOrder = createEmptyOrder();
  activeTicketId = null;
  refreshOrderPanel();
  // Orden estricto: pedir Comedor/Llevar (y mesa) antes de agregar productos.
  openOrderTypeModal();
}

// Cierra/descarta un ticket abierto por completo (boton × de la pestana).
function closeTicketTab(id) {
  const isActive = id === activeTicketId;
  const entry = state.parkedOrders.find((t) => t.id === id);
  const count = isActive
    ? currentOrder.items.reduce((s, i) => s + (i.qty || 0), 0)
    : ((entry && entry.items) || []).reduce((s, i) => s + (i.qty || 0), 0);
  const doClose = async () => {
    try { await fetch(`/api/parked/${id}`, { method: 'DELETE' }); } catch {}
    const idx = state.parkedOrders.findIndex((t) => t.id === id);
    if (idx !== -1) state.parkedOrders.splice(idx, 1);
    if (isActive) loadFirstOrEmpty();
    refreshOrderPanel();
  };
  if (count) {
    openConfirmModal({
      title: 'Cerrar ticket',
      message: 'Este ticket tiene productos. ¿Cerrarlo y descartar todo lo que lleva?',
      confirmText: 'Sí, cerrar',
      danger: true,
      onConfirm: doClose,
    });
  } else {
    doClose();
  }
}

// Cierra el ticket activo tras enviarlo a cocina (ya dejo de estar abierto).
async function closeActiveTicket() {
  if (ticketSaveTimer) { clearTimeout(ticketSaveTimer); ticketSaveTimer = null; }
  if (activeTicketId != null) {
    try { await fetch(`/api/parked/${activeTicketId}`, { method: 'DELETE' }); } catch {}
    const idx = state.parkedOrders.findIndex((t) => t.id === activeTicketId);
    if (idx !== -1) state.parkedOrders.splice(idx, 1);
  }
  loadFirstOrEmpty();
}

// Renombra una pestana con un input inline.
function renameTicket(id) {
  if (editingComandaId !== null) return;
  const tabsEl = document.getElementById('ticketTabs');
  if (!tabsEl) return;
  const key = (id == null) ? 'new' : String(id);
  const tab = tabsEl.querySelector(`.ticket-tab[data-id="${key}"]`);
  if (!tab) return;
  const isActiveTicket = (id == null) || (id === activeTicketId);
  const currentName = isActiveTicket
    ? (currentOrder.customName || autoTicketLabel(currentOrder))
    : (() => { const e = state.parkedOrders.find((t) => t.id === id); return e ? ticketTabLabel(e) : ''; })();
  const input = document.createElement('input');
  input.className = 'ticket-tab-input';
  input.value = currentName;
  input.maxLength = 24;
  tab.innerHTML = '';
  tab.appendChild(input);
  input.focus();
  input.select();
  let done = false;
  const cancel = () => { if (done) return; done = true; refreshTicketTabs(); };
  const commit = () => {
    if (done) return; done = true;
    applyTicketName(id, input.value.trim());
  };
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
    else if (e.key === 'Escape') { e.preventDefault(); cancel(); }
  });
  input.addEventListener('blur', commit);
}

function applyTicketName(id, name) {
  const clean = name || '';
  if (id == null || id === activeTicketId) {
    currentOrder.customName = clean;
    if (activeTicketId != null) { syncActiveTicketEntry(); persistActiveTicket(true); }
    else if (currentOrder.items.length) { persistActiveTicket(true); }
  } else {
    const e = state.parkedOrders.find((t) => t.id === id);
    if (e) { e.customName = clean || null; putTicket(e); }
  }
  refreshTicketTabs();
}

async function sendComanda() {
  if (!currentOrder.items.length) {
    showToast('Agrega productos a la orden', 'error');
    return;
  }
  // Aqui si es obligatorio saber si es comedor (y que mesa) o para llevar.
  // Si falta, se pide y la comanda se manda sola al terminar (ver trySendAfterSetup).
  if (!ensureOrderReady()) { pendingSendAfterSetup = true; return; }
  pendingSendAfterSetup = false;
  const validation = validateOrderStock(currentOrder.items);
  if (!validation.ok) {
    showToast(validation.message, 'error');
    return;
  }
  state.settings.dailyOrderCounter += 1;
  const ticketNumber = state.settings.dailyOrderCounter;
  const ticketDate = new Date().toISOString().split('T')[0];
  const newItems = currentOrder.items.map((item) => ({ ...item }));
  newItems.forEach((item) => {
    if (item.isCombo) {
      // Adjust stock for combo items
      item.comboItems.forEach(comboItem => {
        const product = productById(comboItem.id);
        if (product) product.stock = Math.max(0, product.stock - comboItem.qty * item.qty);
      });
    } else {
      const product = productById(item.id);
      if (product) product.stock = Math.max(0, product.stock - item.qty);
    }
  });
  const orderData = {
    ticketNumber,
    ticketDate,
    type: currentOrder.type,
    mesa: currentOrder.type === 'llevar' ? 'Mostrador' : currentOrder.mesa,
    comensales: currentOrder.type === 'llevar' ? 1 : currentOrder.comensales,
    notes: currentOrder.notes.trim(),
    waiter: currentUser.name,
    items: newItems,
  };
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const { id } = await res.json();
    orderData.id = id;
    // El servidor pone la hora real, pero sin ella aqui la tarjeta decia "Hace NaN min".
    orderData.createdAt = orderData.createdAt || new Date().toISOString();
    orderData.updatedAt = orderData.createdAt;
    state.commandas.push(orderData);
    // A cocina: se registra para el monitor y se imprime (sin detener la venta).
    enviarTicketCocina(orderData, 'nueva', orderData.items);
    // Save settings
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.settings)
    });
    // Log new order with product detail
    const itemList = newItems.map(i => `${i.qty}x ${i.name}`).join(', ');
    fetch('/api/movements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'create_order',
        description: `Nueva comanda #${ticketNumber} (${orderData.type === 'llevar' ? 'Llevar' : orderData.mesa}): ${itemList}`,
        user: currentUser.name,
        timestamp: new Date().toISOString(),
        data: JSON.stringify({ ticketNumber, mesa: orderData.mesa, type: orderData.type, items: newItems })
      })
    });
    showToast(`Comanda #${ticketNumber} enviada a cocina`, 'success');
    await closeActiveTicket();
    refreshOrderPanel();
    updateBadge();
  } catch (error) {
    console.error('Error sending comanda:', error);
    showToast('Error al enviar comanda', 'error');
  }
}

async function updateComanda() {
  if (!currentOrder.items.length) {
    showToast('Agrega productos a la orden', 'error');
    return;
  }
  const index = state.commandas.findIndex((comanda) => comanda.ticketNumber === editingComandaId);
  if (index === -1) return;
  const validation = validateOrderStock(currentOrder.items);
  if (!validation.ok) {
    showToast(validation.message, 'error');
    return;
  }

  const previous = state.commandas[index].items;
  const next = currentOrder.items.map((item) => ({ ...item }));
  setProductsStockFromOrderDiff(previous, next);

  const updatedComanda = {
    ...state.commandas[index],
    items: next,
    type: currentOrder.type,
    mesa: currentOrder.type === 'llevar' ? 'Mostrador' : currentOrder.mesa,
    comensales: currentOrder.type === 'llevar' ? 1 : currentOrder.comensales,
    notes: currentOrder.notes.trim(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await fetch(`/api/orders/${state.commandas[index].id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedComanda)
    });
    // Update stock in API
    for (const item of next) {
      const product = productById(item.id);
      if (product) {
        await fetch(`/api/products/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock: product.stock })
        });
      }
    }
    state.commandas[index] = updatedComanda;
    const cambiosCocina = diffItemsCocina(previous, next);
    if (cambiosCocina.agregados.length) enviarTicketCocina(updatedComanda, 'adicional', cambiosCocina.agregados);
    if (cambiosCocina.quitados.length) enviarTicketCocina(updatedComanda, 'cancelada', cambiosCocina.quitados);

    // Log edit with before/after diff
    const added = next.filter(n => !previous.find(p => p.id === n.id)).map(i => `+${i.qty}x ${i.name}`);
    const removed = previous.filter(p => !next.find(n => n.id === p.id)).map(i => `-${i.qty}x ${i.name}`);
    const changed = next.filter(n => { const p = previous.find(pr => pr.id === n.id); return p && p.qty !== n.qty; })
      .map(i => { const p = previous.find(pr => pr.id === i.id); return `${i.name} ${p.qty}→${i.qty}`; });
    const diffParts = [...added, ...removed, ...changed];
    const diffStr = diffParts.length ? diffParts.join(', ') : 'sin cambios en productos';
    fetch('/api/movements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'edit_order',
        description: `Edición comanda #${editingComandaId}: ${diffStr}`,
        user: currentUser.name,
        timestamp: new Date().toISOString(),
        data: JSON.stringify({ ticketNumber: editingComandaId, previousItems: previous, newItems: next })
      })
    });

    showToast(`Comanda #${editingComandaId} actualizada`, 'success');
    resetOrder();
    updateBadge();
    navigateTo('comandas');
  } catch (error) {
    console.error('Error updating comanda:', error);
    showToast('Error al actualizar comanda', 'error');
  }
}

function cancelEdit() {
  resetOrder();
  navigateTo('comandas');
}

function showTicket() {
  if (!currentOrder.items.length) {
    showToast('Agrega productos primero', 'error');
    return;
  }
  const totals = calculateTotals(currentOrder.items);
  const now = new Date();
  const restaurantName = esc(state.settings.restaurantName);
  const address = esc(state.settings.address || '');
  const phone = esc(state.settings.phone || '');
  const rfc = esc(state.settings.rfc || '');
  document.getElementById('ticketContent').innerHTML = `
    <div class="ticket-preview">
      ${renderTicketLogoMarkup()}
      <h3>${restaurantName.toUpperCase()}</h3>
      ${address ? `<div class="t-sub">${address}</div>` : ''}
      ${phone ? `<div class="t-sub">Tel. ${phone}</div>` : ''}
      ${rfc ? `<div class="t-sub">RFC ${rfc}</div>` : ''}
      <div class="t-sub">${formatShortDate(now)} · ${formatShortTime(now)}</div>
      <div class="t-div"></div>
      <div class="t-row"><span>${currentOrder.type === 'llevar' ? 'PARA LLEVAR' : (currentOrder.mesa ? `COMEDOR - ${esc(currentOrder.mesa)}` : 'COMEDOR')}</span><span>${currentOrder.type === 'llevar' ? 1 : currentOrder.comensales} pax</span></div>
      <div class="t-div"></div>
      ${currentOrder.items.map((item) => `
        <div class="t-row"><span>${item.qty}x ${esc(item.name)}</span><span>$${fmt(item.price * item.qty)}</span></div>
        ${item.variantLabel ? `<div class="t-footer" style="text-align:left">${esc(item.variantLabel)}</div>` : ''}
        ${item.isCombo && item.comboItems?.length ? item.comboItems.map(ci => `<div class="t-footer" style="text-align:left">• ${ci.qty}x ${esc(ci.name || '')}${ci.variantLabel ? ` (${esc(ci.variantLabel)})` : ''}</div>`).join('') : ''}
        ${item.notes ? `<div class="t-footer" style="text-align:left">Nota: ${esc(item.notes)}</div>` : ''}
      `).join('')}
      <div class="t-div"></div>
      <div class="t-row bold"><span>TOTAL</span><span>$${fmt(totals.total)} MXN</span></div>
      <div class="t-div"></div>
      <div class="t-footer">Atendido por: ${esc(currentUser.name)}</div>
      ${currentOrder.notes ? `<div class="t-footer">Notas: ${esc(currentOrder.notes)}</div>` : ''}
      <div class="t-footer">${esc(state.settings.ticketFooter || 'Gracias por su visita')}</div>
    </div>
  `;
  openModal('ticketModal');
}

async function printTicket() {
  if (!currentOrder.items.length) return;
  const ok = await imprimirDocumento('caja', docCuenta(currentOrder));
  if (ok) {
    showToast('Cuenta enviada a la impresora', 'success');
    closeModal('ticketModal');
  }
}

// ===================== COMANDAS =====================
function buildComandas() {
  if (!state.commandas.length) {
    return `<div style="text-align:center;padding:90px 40px;color:var(--stone)">
      <div style="margin-bottom:20px;opacity:0.2"><svg width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.1"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></div>
      <div style="font-size:22px;font-weight:700;color:var(--charcoal);letter-spacing:-0.3px">Sin comandas pendientes</div>
      <div style="font-size:16px;margin-top:8px;color:var(--stone)">Las nuevas ordenes apareceran aqui automaticamente</div>
    </div>`;
  }
  const sorted = comandasEnOrden();
  return `<div>
    <div class="page-header"><h2>Comandas Activas <span class="live-dot"></span></h2><span style="font-size:14px;color:var(--stone)">${sorted.length} pendiente(s)</span></div>
    <div class="comandas-hint">Usa las flechas ← → ↑ ↓ para moverte entre comandas y <kbd>Enter</kbd> para cobrar la seleccionada.</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:13px">
      ${sorted.map((comanda) => `
        <div class="comanda-card card${comanda.id === comandaSelId ? ' seleccionada' : ''}" data-comanda-id="${comanda.id}"
          onclick="seleccionarComanda(${comanda.id})"
          style="padding:17px;border-top:3px solid ${comanda.type === 'llevar' ? 'var(--amber)' : 'var(--accent)'}">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:9px">
            <span style="font-size:15px;font-weight:700;color:var(--sidebar-bg)">Orden <span class="order-num">#${comanda.ticketNumber}</span></span>
            <span class="badge ${comanda.type === 'llevar' ? 'badge-amber' : 'badge-green'}">${comanda.type === 'llevar' ? 'Para llevar' : esc(comanda.mesa)}</span>
          </div>
          <div style="margin-bottom:9px">
            ${estadoCocinaHtml(comanda)}
          </div>
          <div style="font-size:12.5px;color:var(--stone);margin-bottom:8px">Hace ${minutesAgo(comanda.createdAt)} · ${esc(comanda.waiter)} · ${comanda.comensales} pax · <button type="button" class="link-reprint" onclick="event.stopPropagation(); reimprimirComanda(${comanda.id})">Reimprimir</button></div>
          <div style="border-top:1px solid var(--stone-pale);padding-top:8px;margin-bottom:8px">
            ${comanda.items.map((item) => `
              <div style="padding:2px 0;font-size:13.5px">
                <div style="display:flex;align-items:center;gap:8px"><span style="font-weight:700;color:var(--accent-dark);font-family:var(--mono);min-width:18px">${item.qty}x</span>${esc(item.name)}</div>
                ${item.variantLabel ? `<div style="font-size:13px;font-weight:700;color:#4A4843;margin-left:26px">${esc(item.variantLabel)}</div>` : ''}
                ${item.isCombo && item.comboItems?.length ? `<div style="font-size:12px;color:var(--stone);margin-left:26px;line-height:1.7">${item.comboItems.map(ci => `• ${ci.qty}x ${esc(ci.name || '')}${ci.variantLabel ? ` (${esc(ci.variantLabel)})` : ''}`).join('<br>')}</div>` : ''}
                ${item.notes ? `<div style="font-size:12px;color:var(--accent-dark);margin-left:26px">Nota: ${esc(item.notes)}</div>` : ''}
              </div>
            `).join('')}
          </div>
          ${comanda.notes ? `<div style="font-size:12px;background:var(--accent-mist);color:var(--accent-dark);padding:5px 9px;border-radius:6px;margin-bottom:8px">${esc(comanda.notes)}</div>` : ''}
          <div style="display:flex;gap:7px">
            <button class="btn btn-secondary btn-sm" style="flex:1" onclick="editComanda(${comanda.id})">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              Editar
            </button>
            <button class="btn btn-primary btn-sm" style="flex:1" onclick="completeComanda(${comanda.id})">Completar</button>
            <button class="btn btn-danger btn-sm" onclick="confirmarCancelarComanda(${comanda.id})">Cancelar</button>
          </div>
        </div>
      `).join('')}
    </div>
  </div>`;
}

function editComanda(id) {
  const comanda = state.commandas.find((entry) => entry.id === id);
  if (!comanda) return;
  editingComandaId = comanda.ticketNumber;
  activeTicketId = null;
  currentOrder = {
    items: comanda.items.map((item) => ({ ...item })),
    type: comanda.type,
    mesa: comanda.type === 'llevar' ? 'Mostrador' : comanda.mesa,
    comensales: comanda.comensales,
    notes: comanda.notes,
    customName: '',
  };
  navigateTo('pos');
}

// Al "Completar" se abre el modal de cobro (metodo de pago + cambio).
function completeComanda(id) {
  openPaymentModal(id);
}

let paymentDraft = null;

// Plataformas de reparto: el cliente ya pago en la app, asi que ese dinero NO entra
// a la caja del dia. La plataforma lo deposita despues, cada una en su dia.
// La venta si cuenta como venta del dia; lo que cambia es de donde sale el dinero.
const DELIVERY_PLATFORMS = {
  Uber: { label: 'Uber Eats', depositDay: 'lunes' },
  Didi: { label: 'DiDi Food', depositDay: 'martes' },
};
const PAYMENT_METHODS = ['Efectivo', 'Transferencia', 'Tarjeta', 'Uber', 'Didi'];

function isPlatformMethod(method) {
  return Object.prototype.hasOwnProperty.call(DELIVERY_PLATFORMS, method);
}

// Plataforma de una venta (o null si fue un cobro normal en el local).
function salePlatform(sale) {
  if (!sale) return null;
  const list = Array.isArray(sale.payments) && sale.payments.length
    ? sale.payments
    : [{ method: sale.paymentMethod || '' }];
  const found = list.map(p => p.method).find(isPlatformMethod);
  return found || null;
}

// ===================== COBRO =====================
// El cobro arranca preguntando lo unico que importa: si es UN metodo de pago o
// varios. Las plataformas (Uber/DiDi) solo aparecen en el camino de un metodo,
// porque ese pedido viene pagado completo desde la app.
const PAYMENT_METHODS_SIMPLES = ['Efectivo', 'Transferencia', 'Tarjeta'];

function openPaymentModal(id) {
  const comanda = state.commandas.find((c) => c.id === id);
  if (!comanda) return;
  const totals = calculateTotals(comanda.items);
  paymentDraft = {
    comandaId: id,
    ticketNumber: comanda.ticketNumber,
    total: toMoney(totals.total),
    paso: 'inicio',   // inicio | uno | varios
    metodo: null,     // metodo elegido en el paso "uno"
    recibido: null,   // efectivo: con cuanto paga el cliente
    lines: null,      // renglones del paso "varios"
  };
  document.getElementById('paymentModal')?.remove();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'paymentModal';
  overlay.innerHTML = `<div class="modal" style="width:480px;max-width:94vw">
    <div class="modal-header">
      <h3>Cobro · Comanda #${comanda.ticketNumber}</h3>
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
    </div>
    <div class="modal-body" style="padding:18px" id="payBody"></div>
  </div>`;
  document.body.appendChild(overlay);
  renderPaymentModal();
}

function paymentTotalHtml() {
  return `<div class="pay-total">
    <div class="pay-total-label">Total a cobrar</div>
    <div class="pay-total-value">$${fmt(paymentDraft.total)}</div>
  </div>`;
}

function renderPaymentModal() {
  const body = document.getElementById('payBody');
  if (!body || !paymentDraft) return;
  if (paymentDraft.paso === 'inicio') body.innerHTML = renderPasoInicio();
  else if (paymentDraft.paso === 'uno') body.innerHTML = renderPasoUnMetodo();
  else { body.innerHTML = renderPasoVarios(); renderPaymentLines(); paymentRecalc(); }
  // Deja el foco en la primera opcion para poder usar flechas y Enter de inmediato.
  if (paymentDraft.paso !== 'varios') enfocarPrimerBoton();
}

function renderPasoInicio() {
  return paymentTotalHtml() + `<div class="pay-choice">
    <button type="button" class="pay-choice-btn primary" onclick="paymentIrA('uno')">
      <span class="pcb-title">Elegir método de pago</span>
      <span class="pcb-desc">Efectivo, transferencia, tarjeta, Uber o DiDi</span>
    </button>
    <button type="button" class="pay-choice-btn" onclick="paymentIrA('varios')">
      <span class="pcb-title">2 o más métodos de pago</span>
      <span class="pcb-desc">Dividir el total; por ejemplo una parte en efectivo y otra con tarjeta</span>
    </button>
  </div>`;
}

function paymentIrA(paso) {
  if (!paymentDraft) return;
  paymentDraft.paso = paso;
  if (paso === 'varios' && !paymentDraft.lines) {
    paymentDraft.lines = [{ method: 'Efectivo', amount: Number(paymentDraft.total.toFixed(2)) }];
  }
  if (paso === 'inicio') { paymentDraft.metodo = null; paymentDraft.recibido = null; }
  renderPaymentModal();
}

function botonVolver() {
  return `<button type="button" class="pay-back" onclick="paymentIrA('inicio')">‹ Regresar</button>`;
}

// --- Un solo metodo de pago ---
function renderPasoUnMetodo() {
  const d = paymentDraft;
  const botones = PAYMENT_METHODS.map((m) => {
    const plat = isPlatformMethod(m);
    const sel = d.metodo === m ? ' selected' : '';
    const clase = plat ? ' plataforma ' + m.toLowerCase() : '';
    return `<button type="button" class="pay-method${clase}${sel}" onclick='paymentElegirMetodo(${jsv(m)})'>
      ${esc(plat ? DELIVERY_PLATFORMS[m].label : m)}</button>`;
  }).join('');

  let detalle = '';
  if (d.metodo === 'Efectivo') {
    const recibido = d.recibido == null ? '' : d.recibido;
    const cambio = Math.max(0, (parseFloat(d.recibido) || 0) - d.total);
    detalle = `<div class="pay-detail">
      <label class="pay-detail-label">¿Con cuánto paga? <span>(déjalo vacío si paga justo)</span></label>
      <input class="pay-cash-input" id="payRecibido" type="number" min="0" step="1" inputmode="decimal"
        value="${recibido}" oninput="paymentRecibidoCambio(this.value)" placeholder="${fmt(d.total)}">
      <div class="pay-change"><span>Cambio</span><span id="payCambioUno">$${fmt(cambio)}</span></div>
    </div>`;
  } else if (d.metodo && isPlatformMethod(d.metodo)) {
    const info = DELIVERY_PLATFORMS[d.metodo];
    detalle = `<div class="pay-platform-note">
      <div class="ppn-row"><span class="pay-badge ${d.metodo.toLowerCase()}">${esc(d.metodo)}</span>
        <span>Venta por <strong>${esc(info.label)}</strong> · deposita los <strong>${info.depositDay}</strong></span></div>
      <div class="ppn-foot">$${fmt(d.total)} NO entra al efectivo de hoy; la plataforma lo deposita después.</div>
    </div>`;
  } else if (d.metodo) {
    detalle = `<div class="pay-detail pay-detail-simple">Se cobra el total completo con ${esc(d.metodo)}.</div>`;
  }

  const falta = d.metodo === 'Efectivo' && d.recibido != null && parseFloat(d.recibido) + 0.001 < d.total;
  const listo = !!d.metodo && !falta;
  return botonVolver() + paymentTotalHtml() + `
    <div class="pay-methods">${botones}</div>
    ${detalle}
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn btn-secondary" style="flex:1" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
      <button id="payConfirmBtn" class="btn btn-primary" style="flex:2" ${listo ? '' : 'disabled'} onclick="confirmPayment()">Confirmar y completar</button>
    </div>`;
}

function paymentElegirMetodo(metodo) {
  if (!paymentDraft) return;
  paymentDraft.metodo = metodo;
  paymentDraft.recibido = null;
  renderPaymentModal();
  if (metodo === 'Efectivo') document.getElementById('payRecibido')?.focus();
}

// Al escribir no se repinta todo: se perderia el foco del recuadro.
function paymentRecibidoCambio(valor) {
  if (!paymentDraft) return;
  paymentDraft.recibido = valor === '' ? null : parseFloat(valor);
  const cambio = Math.max(0, (parseFloat(paymentDraft.recibido) || 0) - paymentDraft.total);
  const el = document.getElementById('payCambioUno');
  if (el) el.textContent = `$${fmt(cambio)}`;
  const falta = paymentDraft.recibido != null && paymentDraft.recibido + 0.001 < paymentDraft.total;
  const btn = document.getElementById('payConfirmBtn');
  if (btn) btn.disabled = falta;
}

// --- Varios metodos de pago (aqui no entran las plataformas) ---
function renderPasoVarios() {
  return botonVolver() + paymentTotalHtml() + `
    <div id="payLines"></div>
    <button id="payAddBtn" class="btn btn-secondary btn-sm btn-full" style="margin-bottom:14px" onclick="paymentAddLine()">+ Agregar otro método</button>
    <div style="background:var(--surface-alt);border-radius:var(--r);padding:12px 14px;font-size:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>Pagado</span><span id="payPagado" style="font-weight:700;font-family:var(--mono)">$0.00</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>Restante</span><span id="payRestante" style="font-weight:700;font-family:var(--mono)">$0.00</span></div>
      <div style="display:flex;justify-content:space-between"><span style="font-weight:700">Cambio</span><span id="payCambio" style="font-weight:800;font-family:var(--mono);color:var(--accent-dark);font-size:16px">$0.00</span></div>
    </div>
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn btn-secondary" style="flex:1" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
      <button id="payConfirmBtn" class="btn btn-primary" style="flex:2" onclick="confirmPayment()">Confirmar y completar</button>
    </div>`;
}

function renderPaymentLines() {
  const container = document.getElementById('payLines');
  if (!container || !paymentDraft || !paymentDraft.lines) return;
  container.innerHTML = paymentDraft.lines.map((line, i) => `
    <div style="display:flex;gap:7px;margin-bottom:8px;align-items:center">
      <select onchange="paymentRecalc()" id="payMethod${i}" style="flex:1;border:1px solid var(--stone-pale);border-radius:var(--r);padding:8px;font-size:14px;background:var(--surface);color:var(--charcoal)">
        ${PAYMENT_METHODS_SIMPLES.map((m) => `<option value="${m}" ${m === line.method ? 'selected' : ''}>${m}</option>`).join('')}
      </select>
      <div style="position:relative;flex:1">
        <span style="position:absolute;left:9px;top:50%;transform:translateY(-50%);color:var(--stone);font-size:14px">$</span>
        <input type="number" min="0" step="1" id="payAmt${i}" value="${line.amount != null ? line.amount : ''}" oninput="paymentRecalc()" style="width:100%;border:1px solid var(--stone-pale);border-radius:var(--r);padding:8px 8px 8px 20px;font-size:14px;font-family:var(--mono);background:var(--surface);color:var(--charcoal)">
      </div>
      ${paymentDraft.lines.length > 1 ? `<button class="btn btn-danger btn-sm" onclick="paymentRemoveLine(${i})" style="padding:6px 9px">×</button>` : ''}
    </div>
  `).join('');
}

function paymentSyncFromDOM() {
  if (!paymentDraft || !paymentDraft.lines) return;
  paymentDraft.lines.forEach((line, i) => {
    const m = document.getElementById(`payMethod${i}`);
    const a = document.getElementById(`payAmt${i}`);
    if (m) line.method = m.value;
    if (a) line.amount = a.value === '' ? null : parseFloat(a.value);
  });
}

function paymentAddLine() {
  if (!paymentDraft || !paymentDraft.lines || paymentDraft.lines.length >= 3) return;
  paymentSyncFromDOM();
  const paid = paymentDraft.lines.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);
  const remaining = Math.max(0, paymentDraft.total - paid);
  const used = paymentDraft.lines.map((l) => l.method);
  const nextMethod = PAYMENT_METHODS_SIMPLES.find((m) => !used.includes(m)) || 'Efectivo';
  paymentDraft.lines.push({ method: nextMethod, amount: remaining ? Number(remaining.toFixed(2)) : null });
  renderPaymentLines();
  paymentRecalc();
}

function paymentRemoveLine(i) {
  if (!paymentDraft || !paymentDraft.lines) return;
  paymentSyncFromDOM();
  paymentDraft.lines.splice(i, 1);
  renderPaymentLines();
  paymentRecalc();
}

function paymentRecalc() {
  if (!paymentDraft || !paymentDraft.lines) return;
  paymentSyncFromDOM();
  const paid = paymentDraft.lines.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);
  const remaining = Math.max(0, paymentDraft.total - paid);
  const change = Math.max(0, paid - paymentDraft.total);
  const pagadoEl = document.getElementById('payPagado');
  const restEl = document.getElementById('payRestante');
  const cambioEl = document.getElementById('payCambio');
  if (pagadoEl) pagadoEl.textContent = `$${fmt(paid)}`;
  if (restEl) { restEl.textContent = `$${fmt(remaining)}`; restEl.style.color = remaining > 0.001 ? 'var(--rose)' : 'var(--stone)'; }
  if (cambioEl) cambioEl.textContent = `$${fmt(change)}`;
  const addBtn = document.getElementById('payAddBtn');
  if (addBtn) addBtn.style.display = paymentDraft.lines.length >= 3 ? 'none' : 'block';
  const confirmBtn = document.getElementById('payConfirmBtn');
  if (confirmBtn) confirmBtn.disabled = remaining > 0.001;
}

// imprimir = true cobra y abre el ticket para mandarlo a la impresora (F1).
async function confirmPayment(imprimir) {
  if (!paymentDraft) return;
  const d = paymentDraft;
  let payments = [];
  let change = 0;

  if (d.paso === 'uno') {
    if (!d.metodo) return;
    const recibido = d.recibido == null ? d.total : (parseFloat(d.recibido) || 0);
    if (d.metodo === 'Efectivo' && recibido + 0.001 < d.total) {
      showToast('El pago no cubre el total', 'error');
      return;
    }
    if (d.metodo === 'Efectivo') change = Math.max(0, recibido - d.total);
    payments = [{ method: d.metodo, amount: Number(d.total.toFixed(2)) }];
  } else {
    paymentSyncFromDOM();
    const paid = (d.lines || []).reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);
    if (paid + 0.001 < d.total) {
      showToast('El pago no cubre el total', 'error');
      return;
    }
    change = Math.max(0, paid - d.total);
    payments = (d.lines || [])
      .filter((l) => (parseFloat(l.amount) || 0) > 0)
      .map((l) => ({ method: l.method, amount: Number((parseFloat(l.amount) || 0).toFixed(2)) }));
  }

  const methodSummary = [...new Set(payments.map((p) => p.method))].join(' + ') || 'Efectivo';
  const cashReceived = d.paso === 'uno'
    ? (d.metodo === 'Efectivo' ? (d.recibido == null ? d.total : parseFloat(d.recibido)) : 0)
    : payments.filter((p) => p.method === 'Efectivo').reduce((s, p) => s + p.amount, 0);
  const paymentInfo = {
    paymentMethod: methodSummary,
    payments,
    amountReceived: cashReceived || null,
    change: Number(change.toFixed(2)),
  };
  const id = d.comandaId;
  const ticketNumber = d.ticketNumber;
  document.getElementById('paymentModal')?.remove();
  paymentDraft = null;
  await finalizeSale(id, paymentInfo);
  if (imprimir) {
    if (!printConfig) await loadPrintConfig();
    const venta = state.salesRecords.find((s) => s.ticketNumber === ticketNumber);
    // Con impresora de caja sale el ticket directo; sin ella se muestra en Ventas como antes.
    if (venta && impresoraLista('caja')) imprimirTicketVenta(venta);
    else mostrarTicketDeVenta(ticketNumber);
  }
}

// Abre el ticket de una venta ya cobrada para mandarlo a la impresora.
function mostrarTicketDeVenta(ticketNumber) {
  const venta = state.salesRecords.find(s => s.ticketNumber === ticketNumber);
  if (!venta) { showToast('La venta se registró, pero no se encontró su ticket', 'error'); return; }
  salesSelectedId = venta.id != null ? venta.id : `tn-${venta.ticketNumber}`;
  navigateTo('sales');
  showToast(`Venta #${ticketNumber} cobrada · ticket listo para imprimir`, 'success');
}

async function finalizeSale(id, paymentInfo) {
  const index = state.commandas.findIndex((comanda) => comanda.id === id);
  if (index === -1) return;
  const comanda = state.commandas[index];
  const totals = calculateTotals(comanda.items);
  const saleData = {
    ticketNumber: comanda.ticketNumber,
    ticketDate: comanda.ticketDate,
    createdAt: comanda.createdAt,
    completedAt: new Date().toISOString(),
    type: comanda.type,
    mesa: comanda.type === 'llevar' ? 'Mostrador' : comanda.mesa,
    comensales: comanda.comensales,
    notes: comanda.notes,
    waiter: comanda.waiter,
    paymentMethod: paymentInfo.paymentMethod,
    payments: paymentInfo.payments,
    amountReceived: paymentInfo.amountReceived,
    change: paymentInfo.change,
    status: 'Pagado',
    items: comanda.items.map((item) => ({ ...item })),
    subtotal: totals.subtotal,
    tax: totals.tax,
    total: totals.total,
    cost: totals.cost,
  };
  try {
    const saleRes = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saleData)
    });
    const saleJson = await saleRes.json();
    if (!saleRes.ok) throw new Error(saleJson.error || 'Error al guardar venta');
    if (saleJson.id) saleData.id = saleJson.id;
    await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    state.salesRecords.unshift(saleData);
    state.commandas.splice(index, 1);
    if (editingComandaId === comanda.ticketNumber) {
      resetOrder();
    }
    updateBadge();
    renderPage('comandas');
    const changeMsg = paymentInfo.change > 0 ? ` · Cambio $${fmt(paymentInfo.change)}` : '';
    showToast(`Comanda #${comanda.ticketNumber} cobrada (${paymentInfo.paymentMethod})${changeMsg}`, 'success');
  } catch (error) {
    console.error('Error completing comanda:', error);
    showToast('Error al completar comanda', 'error');
  }
}

// Cancelar una comanda la saca de cocina y la deja registrada como cancelada:
// se pregunta antes para que no se vaya un pedido por un clic.
function confirmarCancelarComanda(id) {
  const comanda = state.commandas.find((c) => c.id === id);
  if (!comanda) return;
  const donde = comanda.type === 'llevar' ? 'Para llevar' : comanda.mesa;
  const articulos = comanda.items.reduce((sum, i) => sum + i.qty, 0);
  openConfirmModal({
    title: `¿Cancelar la comanda #${comanda.ticketNumber}?`,
    message: `${donde} · ${articulos} artículo(s). Se quita de cocina y queda registrada como cancelada en las ventas del día.`,
    confirmText: 'Sí, cancelar la comanda',
    cancelText: 'No, regresar',
    danger: true,
    onConfirm: () => cancelComanda(id),
  });
}

async function cancelComanda(id) {
  const index = state.commandas.findIndex((comanda) => comanda.id === id);
  if (index === -1) return;
  const comanda = state.commandas[index];
  comanda.items.forEach((item) => {
    const product = productById(item.id);
    if (product) product.stock += item.qty;
  });
  try {
    await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    enviarTicketCocina(comanda, 'cancelada', comanda.items);

    // Save as cancelled sale so it's visible in the sales report
    const totals = calculateTotals(comanda.items);
    const saleData = {
      ticketNumber: comanda.ticketNumber,
      ticketDate: comanda.ticketDate,
      createdAt: comanda.createdAt,
      completedAt: new Date().toISOString(),
      type: comanda.type,
      mesa: comanda.type === 'llevar' ? 'Mostrador' : comanda.mesa,
      comensales: comanda.comensales,
      notes: comanda.notes,
      waiter: comanda.waiter,
      paymentMethod: '—',
      status: 'Cancelado',
      items: comanda.items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      cost: totals.cost,
    };
    const saleRes = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saleData)
    });
    const saleJson = await saleRes.json();
    if (saleJson.id) saleData.id = saleJson.id;
    state.salesRecords.unshift(saleData);

    // Log with product detail
    const itemList = comanda.items.map(i => `${i.qty}x ${i.name}`).join(', ');
    await fetch('/api/movements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'cancel_order',
        description: `Cancelación de comanda #${comanda.ticketNumber}: ${itemList}`,
        user: currentUser.name,
        timestamp: new Date().toISOString(),
        data: JSON.stringify({ ticketNumber: comanda.ticketNumber, mesa: comanda.mesa, type: comanda.type, items: comanda.items })
      })
    });

    // Update stock in API
    for (const item of comanda.items) {
      const product = productById(item.id);
      if (product) {
        await fetch(`/api/products/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock: product.stock })
        });
      }
    }
    state.commandas.splice(index, 1);
    if (editingComandaId === comanda.ticketNumber) {
      resetOrder();
    }
    updateBadge();
    renderPage('comandas');
    showToast(`Comanda #${comanda.ticketNumber} cancelada`, 'success');
  } catch (error) {
    console.error('Error canceling comanda:', error);
    showToast('Error al cancelar comanda', 'error');
  }
}

// ===================== PRODUCTS =====================
function buildProducts() {
  if (currentUser.role !== 'owner') return restricted();
  const filtered = state.products.filter((product) => (
    !productSearch
    || product.name.toLowerCase().includes(productSearch.toLowerCase())
    || product.cat.toLowerCase().includes(productSearch.toLowerCase())
  ));
  return `<div>
    <div class="page-header">
      <h2>Gestion de Productos</h2>
      <button class="btn btn-primary" onclick="openProductModal()">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
        Agregar producto
      </button>
    </div>
    <div class="filter-row">
      <div class="search-bar" style="max-width:280px">
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/></svg>
        <input type="text" placeholder="Buscar producto o categoria..." value="${esc(productSearch)}" oninput="productSearch=this.value;navigateTo('products')">
      </div>
      <span style="font-size:13.5px;color:var(--stone)">${filtered.length} producto(s) · ${state.products.length} total</span>
    </div>
    ${filtered.length === 0 ? `<div style="text-align:center;padding:50px;color:var(--stone)"><p style="font-size:15px;font-weight:600">No hay productos aun</p><p style="font-size:14px;margin-top:4px">Agrega el primero con el boton de arriba</p></div>` : `
    <table class="data-table">
      <thead><tr><th>Nombre</th><th>Categoria</th><th>Precio MXN</th><th>Costo MXN</th><th>Margen</th><th>Acciones</th></tr></thead>
      <tbody>${filtered.map((product) => {
        const margin = product.price > 0 ? (((product.price - product.cost) / product.price) * 100).toFixed(0) : '0';
        return `<tr>
          <td><div style="display:flex;align-items:center;gap:10px"><div style="width:32px;height:32px;background:var(--accent-mist);border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--accent-dark)">${categorySvg(product.cat)}</div><strong>${esc(product.name)}</strong></div></td>
          <td><span class="badge badge-sky">${esc(product.cat)}</span></td>
          <td style="font-family:var(--mono);font-weight:700;color:var(--accent-dark)">$${fmt(product.price)}</td>
          <td style="font-family:var(--mono);color:var(--stone)">$${fmt(product.cost)}</td>
          <td><span class="profit-badge profit-up">↑ ${margin}%</span></td>
          <td><div style="display:flex;gap:6px">
            <button class="btn btn-amber btn-sm" onclick="openProductModal(${product.id})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Eliminar</button>
          </div></td>
        </tr>`;
      }).join('')}</tbody>
    </table>`}
  </div>`;
}

function openProductModal(id) {
  const product = id ? productById(id) : null;
  document.getElementById('pModalTitle').textContent = product ? 'Editar Producto' : 'Agregar Producto';
  document.getElementById('pModalSub').textContent = product ? `Editando: ${product.name}` : 'Completa los datos del nuevo producto';
  document.getElementById('pName').value = product?.name || '';
  document.getElementById('pPrice').value = product?.price || '';
  document.getElementById('pCost').value = product?.cost || '';
  document.getElementById('pEditId').value = product?.id || '';
  const categorySelect = document.getElementById('pCat');
  categorySelect.innerHTML = state.categories.map((category) => `
    <option value="${esc(category.name)}">${esc(category.name)}</option>
  `).join('');
  categorySelect.value = product?.cat || state.categories[0]?.name || '';
  const variants = Array.isArray(product?.variants) ? product.variants.map(g => ({
    name: g.name || '',
    minSelect: Number(g.minSelect) || 0,
    maxSelect: Number(g.maxSelect) || 1,
    options: Array.isArray(g.options) ? g.options.map(o => ({ name: o.name || '', priceDelta: Number(o.priceDelta) || 0 })) : [],
  })) : [];
  const pImageFileEl = document.getElementById('pImageFile');
  if (pImageFileEl) pImageFileEl.value = '';
  document.getElementById('pImageData').value = product?.image || '';
  document.getElementById('pImagePos').value = product?.imagePos || DEFAULT_IMAGE_POS;
  document.getElementById('pQtyByVariant').checked = !!product?.qtyByVariant;
  renderProductImagePreview(product?.image || '');
  window.productVariantBuilder = variants;
  renderProductVariantGroups();
  openModal('productModal');
}

function renderProductVariantGroups() {
  const container = document.getElementById('pVariantGroups');
  if (!container) return;
  const groups = window.productVariantBuilder || [];
  if (groups.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:14px 8px;color:var(--stone);font-size:13px">Sin variantes. Pulsa "Grupo de variante" para agregar opciones (ej. tamaño, guisos, salsas).</div>`;
    return;
  }
  container.innerHTML = groups.map((group, gi) => `
    <div class="variant-group">
      <div class="vg-top">
        <div class="vg-name">
          <span class="vg-mini-label">Nombre del grupo</span>
          <input type="text" value="${esc(group.name)}" placeholder="Ej. Guiso, Tamaño, Salsa" oninput="updateVariantGroup(${gi}, 'name', this.value)">
        </div>
        <div class="vg-minmax">
          <div class="vg-num-input">
            <span class="vg-mini-label">Mín.</span>
            <input type="number" min="0" value="${group.minSelect}" oninput="updateVariantGroup(${gi}, 'minSelect', this.value)">
          </div>
          <div class="vg-num-input">
            <span class="vg-mini-label">Máx.</span>
            <input type="number" min="1" value="${group.maxSelect}" oninput="updateVariantGroup(${gi}, 'maxSelect', this.value)">
          </div>
        </div>
        <button type="button" class="vg-remove" onclick="removeVariantGroup(${gi})" title="Eliminar grupo">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"/></svg>
        </button>
      </div>
      <div class="vg-options">
        ${group.options.map((opt, oi) => `
          <div class="vg-option">
            <input type="text" value="${esc(opt.name)}" placeholder="Nombre de la opción" oninput="updateVariantOption(${gi}, ${oi}, 'name', this.value)">
            <input type="number" step="0.5" class="vg-opt-price" value="${opt.priceDelta}" placeholder="+\$" oninput="updateVariantOption(${gi}, ${oi}, 'priceDelta', this.value)" title="Diferencia de precio (puede ser 0 o negativa)">
            <button type="button" class="vg-option-rm" onclick="removeVariantOption(${gi}, ${oi})" title="Eliminar opción">×</button>
          </div>
        `).join('')}
        <button type="button" class="vg-add-opt" onclick="addVariantOption(${gi})">+ Agregar opción</button>
      </div>
    </div>
  `).join('');
}

function addVariantGroup() {
  if (!Array.isArray(window.productVariantBuilder)) window.productVariantBuilder = [];
  window.productVariantBuilder.push({
    name: '',
    minSelect: 1,
    maxSelect: 1,
    options: [{ name: '', priceDelta: 0 }, { name: '', priceDelta: 0 }],
  });
  renderProductVariantGroups();
}

function removeVariantGroup(index) {
  if (!Array.isArray(window.productVariantBuilder)) return;
  window.productVariantBuilder.splice(index, 1);
  renderProductVariantGroups();
}

function updateVariantGroup(index, field, value) {
  const group = window.productVariantBuilder?.[index];
  if (!group) return;
  if (field === 'minSelect' || field === 'maxSelect') {
    group[field] = Math.max(field === 'minSelect' ? 0 : 1, Number(value) || 0);
  } else {
    group[field] = value;
  }
}

function addVariantOption(groupIndex) {
  const group = window.productVariantBuilder?.[groupIndex];
  if (!group) return;
  group.options.push({ name: '', priceDelta: 0 });
  renderProductVariantGroups();
}

function removeVariantOption(groupIndex, optIndex) {
  const group = window.productVariantBuilder?.[groupIndex];
  if (!group) return;
  group.options.splice(optIndex, 1);
  renderProductVariantGroups();
}

function updateVariantOption(groupIndex, optIndex, field, value) {
  const opt = window.productVariantBuilder?.[groupIndex]?.options?.[optIndex];
  if (!opt) return;
  if (field === 'priceDelta') opt.priceDelta = Number(value) || 0;
  else opt[field] = value;
}

function collectProductVariants() {
  const groups = Array.isArray(window.productVariantBuilder) ? window.productVariantBuilder : [];
  return groups
    .map(g => ({
      name: (g.name || '').trim(),
      minSelect: Math.max(0, Number(g.minSelect) || 0),
      maxSelect: Math.max(1, Number(g.maxSelect) || 1),
      options: (g.options || [])
        .filter(o => (o.name || '').trim() !== '')
        .map(o => ({ name: o.name.trim(), priceDelta: Number(o.priceDelta) || 0 })),
    }))
    .filter(g => g.name && g.options.length > 0);
}

// ===================== FOTOS (PRODUCTOS, COMBOS Y LOGO) =====================
// Tope del data URL ya comprimido. El servidor acepta hasta 25 MB, pero mantener
// las fotos ligeras evita inflar la base de datos y los respaldos, y que el menu
// tarde en pintar cuando hay muchos productos.
const IMAGE_MAX_CHARS = 140 * 1024;

// Convierte cualquier foto a un JPEG compacto y devuelve el data URL.
// - Fondo blanco: un PNG con transparencia salia con el fondo en negro.
// - Baja calidad y despues tamano hasta entrar en IMAGE_MAX_CHARS, para que
//   ninguna foto se quede sin guardar por pesada.
function processImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Selecciona una imagen válida'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo cargar la imagen'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('No se pudo procesar la imagen'));
      img.onload = () => {
        const render = (maxSide, quality) => {
          let w = img.naturalWidth || img.width;
          let h = img.naturalHeight || img.height;
          if (!w || !h) throw new Error('sin dimensiones');
          if (w > maxSide || h > maxSide) {
            const scale = Math.min(maxSide / w, maxSide / h);
            w = Math.max(1, Math.round(w * scale));
            h = Math.max(1, Math.round(h * scale));
          }
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          return canvas.toDataURL('image/jpeg', quality);
        };
        try {
          let out = '';
          for (const maxSide of [600, 480, 380, 300]) {
            for (const quality of [0.82, 0.7, 0.6, 0.5]) {
              out = render(maxSide, quality);
              if (out.length <= IMAGE_MAX_CHARS) return resolve(out);
            }
          }
          resolve(out);
        } catch (e) {
          reject(new Error('No se pudo procesar la imagen'));
        }
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  });
}

// ----- Encuadre de la foto -----
// La foto se guarda completa y aparte se guarda QUE PARTE se ve en la tarjeta,
// como un object-position ("50% 30%"). Asi se puede reajustar cuando se quiera
// sin volver a subir la imagen.
const DEFAULT_IMAGE_POS = '50% 50%';

function parseImagePos(pos) {
  const m = String(pos || '').match(/(-?[\d.]+)%\s+(-?[\d.]+)%/);
  if (!m) return { x: 50, y: 50 };
  return { x: clampPct(parseFloat(m[1])), y: clampPct(parseFloat(m[2])) };
}

function clampPct(n) {
  return Math.min(100, Math.max(0, Number.isFinite(n) ? n : 50));
}

function formatImagePos({ x, y }) {
  return `${Math.round(x)}% ${Math.round(y)}%`;
}

// Vista previa compartida por el formulario de producto y el de combo.
// Con imagen se vuelve arrastrable para elegir el encuadre.
function renderImagePreview(previewId, removeBtnId, dataUrl, posInputId) {
  const box = document.getElementById(previewId);
  const rm = document.getElementById(removeBtnId);
  if (!box) return;
  if (dataUrl) {
    const pos = posInputId ? (document.getElementById(posInputId)?.value || DEFAULT_IMAGE_POS) : DEFAULT_IMAGE_POS;
    box.innerHTML = `<img src="${dataUrl}" alt="preview" style="object-position:${esc(pos)}">`;
    box.classList.add('has-img');
    if (posInputId) {
      box.classList.add('encuadrable');
      box.title = 'Arrastra la foto para elegir qué parte se ve';
      attachFrameDrag(box, posInputId);
    }
    if (rm) rm.style.display = '';
  } else {
    box.innerHTML = `<span>Sin imagen</span>`;
    box.classList.remove('has-img', 'encuadrable');
    box.removeAttribute('title');
    if (rm) rm.style.display = 'none';
  }
}

// Arrastrar dentro del recuadro mueve el encuadre. Se usa el tamano del recuadro
// como referencia: recorrerlo completo va de 0% a 100%.
function attachFrameDrag(box, posInputId) {
  if (box.dataset.dragReady === posInputId) return;
  box.dataset.dragReady = posInputId;
  let dragging = false;
  let startX = 0, startY = 0, startPos = null;

  box.addEventListener('pointerdown', (e) => {
    const img = box.querySelector('img');
    if (!img) return;
    dragging = true;
    startX = e.clientX; startY = e.clientY;
    startPos = parseImagePos(document.getElementById(posInputId)?.value);
    box.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  box.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const img = box.querySelector('img');
    const input = document.getElementById(posInputId);
    if (!img || !input) return;
    const rect = box.getBoundingClientRect();
    // Se invierte: arrastrar la foto hacia abajo muestra la parte de arriba.
    const next = {
      x: clampPct(startPos.x - ((e.clientX - startX) / Math.max(1, rect.width)) * 100),
      y: clampPct(startPos.y - ((e.clientY - startY) / Math.max(1, rect.height)) * 100),
    };
    const value = formatImagePos(next);
    input.value = value;
    img.style.objectPosition = value;
  });

  const stop = (e) => {
    if (!dragging) return;
    dragging = false;
    try { box.releasePointerCapture(e.pointerId); } catch (err) { /* ya liberado */ }
  };
  box.addEventListener('pointerup', stop);
  box.addEventListener('pointercancel', stop);
}

function centrarEncuadreProducto() {
  const input = document.getElementById('pImagePos');
  if (!input) return;
  input.value = DEFAULT_IMAGE_POS;
  renderProductImagePreview(document.getElementById('pImageData').value);
}

function centrarEncuadreCombo() {
  const input = document.getElementById('cImagePos');
  if (!input) return;
  input.value = DEFAULT_IMAGE_POS;
  renderComboImagePreview(document.getElementById('cImageData').value);
}

async function handleProductImage(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const dataUrl = await processImageFile(file);
    document.getElementById('pImageData').value = dataUrl;
    // Foto nueva: el encuadre arranca centrado.
    const pos = document.getElementById('pImagePos');
    if (pos) pos.value = DEFAULT_IMAGE_POS;
    renderProductImagePreview(dataUrl);
  } catch (error) {
    showToast(error.message, 'error');
    event.target.value = '';
  }
}

function removeProductImage() {
  document.getElementById('pImageData').value = '';
  const f = document.getElementById('pImageFile');
  if (f) f.value = '';
  renderProductImagePreview('');
}

function renderProductImagePreview(dataUrl) {
  renderImagePreview('pImagePreview', 'pImageRemoveBtn', dataUrl, 'pImagePos');
  const hint = document.getElementById('pFrameHint');
  if (hint) hint.style.display = dataUrl ? '' : 'none';
  const center = document.getElementById('pImageCenterBtn');
  if (center) center.style.display = dataUrl ? '' : 'none';
}

async function handleComboImage(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const dataUrl = await processImageFile(file);
    document.getElementById('cImageData').value = dataUrl;
    if (window.comboBuilderState) window.comboBuilderState.image = dataUrl;
    const pos = document.getElementById('cImagePos');
    if (pos) pos.value = DEFAULT_IMAGE_POS;
    renderComboImagePreview(dataUrl);
  } catch (error) {
    showToast(error.message, 'error');
    event.target.value = '';
  }
}

function removeComboImage() {
  document.getElementById('cImageData').value = '';
  if (window.comboBuilderState) window.comboBuilderState.image = null;
  const f = document.getElementById('cImageFile');
  if (f) f.value = '';
  renderComboImagePreview('');
}

function renderComboImagePreview(dataUrl) {
  renderImagePreview('cImagePreview', 'cImageRemoveBtn', dataUrl, 'cImagePos');
  const hint = document.getElementById('cFrameHint');
  if (hint) hint.style.display = dataUrl ? '' : 'none';
  const center = document.getElementById('cImageCenterBtn');
  if (center) center.style.display = dataUrl ? '' : 'none';
}

// Mensaje entendible cuando el servidor rechaza una peticion.
async function apiError(res) {
  try {
    const data = await res.json();
    if (data && data.error) return data.error;
  } catch (e) { /* la respuesta no era JSON */ }
  return `El servidor rechazó el guardado (${res.status})`;
}

async function saveProduct() {
  const id = document.getElementById('pEditId').value;
  const data = {
    name: document.getElementById('pName').value.trim(),
    price: toMoney(document.getElementById('pPrice').value),
    cost: toMoney(document.getElementById('pCost').value),
    cat: document.getElementById('pCat').value,
    // Inventario retirado: el stock ya no se captura ni se controla; se conserva 0 por compatibilidad.
    stock: (id ? (productById(Number(id))?.stock ?? 0) : 0),
    variants: collectProductVariants(),
    image: document.getElementById('pImageData').value || null,
    imagePos: document.getElementById('pImagePos').value || null,
    qtyByVariant: document.getElementById('pQtyByVariant').checked ? 1 : 0,
  };

  if (!data.name || data.price <= 0) {
    showToast('Completa nombre y precio valido', 'error');
    return;
  }
  if (data.cost > data.price) {
    showToast('El costo no puede ser mayor al precio', 'error');
    return;
  }
  for (const group of data.variants) {
    if (group.minSelect > group.maxSelect) {
      showToast(`En "${group.name}" el mínimo no puede ser mayor al máximo`, 'error');
      return;
    }
    if (group.maxSelect > group.options.length) {
      showToast(`"${group.name}" no tiene suficientes opciones para máx. ${group.maxSelect}`, 'error');
      return;
    }
  }

  try {
    if (id) {
      // Comprobar la respuesta: si el servidor rechaza el guardado (por ejemplo una
      // imagen demasiado pesada) hay que avisar, no darlo por bueno y perder el cambio.
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await apiError(res));
      const index = state.products.findIndex((product) => product.id === Number(id));
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...data };
      }
      showToast(`"${data.name}" actualizado`, 'success');
    } else {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await apiError(res));
      const { id: newId } = await res.json();
      data.id = newId;
      state.products.push(data);
      showToast(`"${data.name}" agregado`, 'success');
    }
    closeModal('productModal');
    navigateTo('products');
  } catch (error) {
    console.error('Error saving product:', error);
    showToast(error.message || 'Error al guardar producto', 'error');
  }
}

async function deleteProduct(id) {
  const product = productById(id);
  if (!product) return;
  const isInUse = state.commandas.some((comanda) => comanda.items.some((item) => item.id === id));
  if (isInUse) {
    showToast('No puedes eliminar un producto en una comanda activa', 'error');
    return;
  }
  if (!confirm(`¿Eliminar "${product.name}"?`)) return;
  try {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    state.products = state.products.filter((entry) => entry.id !== id);
    showToast('Producto eliminado', 'success');
    navigateTo('products');
  } catch (error) {
    console.error('Error deleting product:', error);
    showToast('Error al eliminar producto', 'error');
  }
}

// ===================== CATEGORIES =====================
function buildCategories() {
  if (currentUser.role !== 'owner') return restricted();
  return `<div>
    <div class="page-header">
      <h2>Gestión de Categorías</h2>
      <button class="btn btn-primary" onclick="openCategoryModal()">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
        Agregar categoría
      </button>
    </div>
    <p style="color:var(--stone);font-size:13.5px;margin:-4px 0 14px">Usa las flechas para definir el orden en que las categorías aparecen en el punto de venta.</p>
    <table class="data-table">
      <thead><tr><th style="width:70px">Orden</th><th>Ícono</th><th>Nombre</th><th>Productos</th><th>Acciones</th></tr></thead>
      <tbody>${state.categories.map((category, index) => {
        const productCount = state.products.filter(p => p.cat === category.name).length;
        const isFirst = index === 0;
        const isLast = index === state.categories.length - 1;
        return `<tr>
          <td><div style="display:flex;gap:4px">
            <button class="btn btn-secondary btn-sm cat-move" onclick="moveCategory(${category.id}, -1)" ${isFirst ? 'disabled' : ''} title="Subir">▲</button>
            <button class="btn btn-secondary btn-sm cat-move" onclick="moveCategory(${category.id}, 1)" ${isLast ? 'disabled' : ''} title="Bajar">▼</button>
          </div></td>
          <td><span class="tbl-ic" style="color:var(--accent-dark)">${iconSvg(category.icon, 20)}</span></td>
          <td><strong>${esc(category.name)}</strong></td>
          <td>${productCount} productos</td>
          <td><div style="display:flex;gap:6px">
            <button class="btn btn-amber btn-sm" onclick="openCategoryModal(${category.id})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.id})">Eliminar</button>
          </div></td>
        </tr>`;
      }).join('')}</tbody>
    </table>
  </div>`;
}

function openCategoryModal(id = null) {
  const category = id ? state.categories.find(c => c.id === id) : null;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay open';
  modal.dataset.modalType = 'category';
  modal.innerHTML = `<div class="modal">
    <div class="modal-header">
      <h3>${category ? 'Editar' : 'Agregar'} Categoría</h3>
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Nombre de la categoría</label>
        <input type="text" id="catName" value="${category ? esc(category.name) : ''}" placeholder="Ej. Platos Fuertes">
      </div>
      <div class="form-group">
        <label>Ícono</label>
        ${iconPickerHtml(category?.icon, 'catIconPick')}
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
      <button class="btn btn-primary" onclick="saveCategory(${id || 'null'})">Guardar</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  document.getElementById('catName').focus();
}

async function saveCategory(id) {
  const name = document.getElementById('catName').value.trim();
  const icon = document.getElementById('catIconPick')?.value || null;
  if (!name) {
    showToast('El nombre es requerido', 'error');
    return;
  }
  try {
    if (id) {
      await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, icon })
      });
      const category = state.categories.find(c => c.id === id);
      if (category) { category.name = name; category.icon = icon; }
    } else {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, icon })
      });
      const newCat = await res.json();
      state.categories.push({ id: newCat.id, name, icon });
    }
    document.querySelector('.modal-overlay[data-modal-type="category"]')?.remove();
    renderPage('categories');
    showToast('Categoría guardada', 'success');
  } catch (error) {
    console.error('Error saving category:', error);
    showToast('Error al guardar categoría', 'error');
  }
}

async function deleteCategory(id) {
  if (!confirm('¿Eliminar esta categoría? Los productos en esta categoría no se eliminarán.')) return;
  try {
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    state.categories = state.categories.filter(c => c.id !== id);
    renderPage('categories');
    showToast('Categoría eliminada', 'success');
  } catch (error) {
    console.error('Error deleting category:', error);
    showToast('Error al eliminar categoría', 'error');
  }
}

// Mueve una categoria una posicion arriba (-1) o abajo (1) y guarda el orden.
async function moveCategory(id, dir) {
  const index = state.categories.findIndex(c => c.id === id);
  if (index === -1) return;
  const target = index + dir;
  if (target < 0 || target >= state.categories.length) return;
  // Reordenar en memoria (optimista) para que la interfaz responda al instante.
  const list = state.categories;
  [list[index], list[target]] = [list[target], list[index]];
  renderPage('categories');
  try {
    await fetch('/api/categories/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: list.map(c => c.id) })
    });
  } catch (error) {
    console.error('Error reordering categories:', error);
    showToast('Error al guardar el orden', 'error');
  }
}

function comboContentSummary(combo) {
  const items = combo.items || [];
  const fixed = items.filter(ci => !isComboChoice(ci)).reduce((s, ci) => s + (ci.qty || 1), 0);
  const groups = items.filter(isComboChoice);
  const parts = [];
  if (fixed) parts.push(`${fixed} fijo${fixed === 1 ? '' : 's'}`);
  groups.forEach(g => parts.push(`${esc(g.label)}: ${g.options.length} opciones`));
  return parts.join('<br>') || '—';
}

function buildCombos() {
  if (currentUser.role !== 'owner') return restricted();
  return `<div>
    <div class="page-header">
      <h2>Gestión de Combos</h2>
      <button class="btn btn-primary" onclick="openComboModal()">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
        Agregar combo
      </button>
    </div>
    <table class="data-table">
      <thead><tr><th>Ícono</th><th>Nombre</th><th>Precio</th><th>Contenido</th><th>Acciones</th></tr></thead>
      <tbody>${state.combos.map((combo) => `
        <tr>
          <td><span class="tbl-ic" style="color:var(--accent-dark)">${iconSvg(combo.icon, 20)}</span></td>
          <td><strong>${esc(combo.name)}</strong><div class="mi-desc" style="margin-top:4px">${esc(combo.description || '')}</div></td>
          <td>$${fmt(combo.price)} MXN</td>
          <td>${comboContentSummary(combo)}</td>
          <td><div style="display:flex;gap:6px">
            <button class="btn btn-amber btn-sm" onclick="openComboModal(${combo.id})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deleteCombo(${combo.id})">Eliminar</button>
          </div></td>
        </tr>
      `).join('')}</tbody>
    </table>
  </div>`;
}

// Armador de combos: catalogo a la izquierda, contenido del combo a la derecha.
// Tocar un producto lo agrega a la seccion marcada como destino ("Incluye siempre"
// o un grupo a elegir), y el renglon recien agregado se resalta y se lleva a la vista
// para que no se pierda entre los demas.
function openComboModal(id = null) {
  const combo = id ? state.combos.find(c => c.id === id) : null;
  const items = combo?.items || [];
  window.comboBuilderState = {
    id: combo?.id || null,
    name: combo?.name || '',
    price: combo?.price || 0,
    description: combo?.description || '',
    icon: combo?.icon || null,
    image: combo?.image || null,
    imagePos: combo?.imagePos || DEFAULT_IMAGE_POS,
    fixed: items.filter(ci => !isComboChoice(ci)).map(ci => ({ id: ci.id, qty: ci.qty || 1, name: ci.name || '' })),
    groups: items.filter(isComboChoice).map(g => ({
      label: g.label || '',
      qty: g.qty || 1,
      options: (g.options || []).map(o => ({ id: o.id, name: o.name || '' })),
    })),
    target: 'fixed', // 'fixed' o el indice del grupo que recibe lo que se toque en el catalogo
    search: '',
    cat: 'Todos',
    flash: null,     // renglon recien agregado, para resaltarlo
  };
  const st = window.comboBuilderState;
  const comboImage = st.image;
  const comboImagePos = st.imagePos;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay open';
  modal.dataset.modalType = 'combo';
  modal.innerHTML = `<div class="modal cb-modal">
    <div class="modal-header">
      <h3>${combo ? 'Editar' : 'Agregar'} combo</h3>
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
    </div>
    <div class="cb-top">
      <div class="form-group">
        <label class="form-label" for="comboName">Nombre del combo</label>
        <input class="form-input" type="text" id="comboName" value="${esc(st.name)}" placeholder="Ej. Combo Familiar">
      </div>
      <div class="form-group cb-top-price">
        <label class="form-label" for="comboPrice">Precio del combo (MXN)</label>
        <input class="form-input" id="comboPrice" type="number" min="0" value="${esc(st.price)}" oninput="renderComboSummary()">
      </div>
    </div>
    <div class="cb-tabs" role="tablist">
      <button type="button" class="cb-tab active" data-tab="items" onclick="setComboTab('items')">¿Qué incluye?</button>
      <button type="button" class="cb-tab" data-tab="look" onclick="setComboTab('look')">Descripción, ícono y foto</button>
    </div>
    <div class="cb-pane" data-pane="items">
      <div class="cb-split">
        <section class="cb-catalog">
          <div class="cb-target" id="cbTarget"></div>
          <input class="form-input" type="search" id="cbSearch" placeholder="Buscar producto…" oninput="comboCatalogFilter('search', this.value)">
          <div class="cb-cats" id="cbCats"></div>
          <div class="cb-cat-list" id="cbCatalog"></div>
        </section>
        <section class="cb-build">
          <div class="cb-build-list" id="comboItemsList"></div>
          <div class="cb-summary" id="cbSummary"></div>
        </section>
      </div>
    </div>
    <div class="cb-pane" data-pane="look" hidden>
      <div class="form-group">
        <label class="form-label" for="comboDesc">Descripción</label>
        <input class="form-input" type="text" id="comboDesc" value="${esc(st.description)}" placeholder="Opcional. Ej. Plato fuerte + bebida + postre">
      </div>
      <div class="form-group">
        <label class="form-label">Ícono</label>
        ${iconPickerHtml(st.icon, 'comboIconPick')}
      </div>
      <div class="form-group">
        <label class="form-label">Imagen del combo (opcional)</label>
        <div class="p-image-row">
          <div class="p-image-preview ${comboImage ? 'has-img encuadrable' : ''}" id="cImagePreview">${comboImage ? `<img src="${comboImage}" alt="preview" style="object-position:${esc(comboImagePos)}">` : '<span>Sin imagen</span>'}</div>
          <div class="p-image-actions">
            <input class="form-input" type="file" id="cImageFile" accept="image/*" onchange="handleComboImage(event)">
            <div class="p-frame-hint" id="cFrameHint" style="display:${comboImage ? '' : 'none'}">✥ Arrastra la foto para elegir qué parte se ve</div>
            <div style="display:flex;gap:7px;flex-wrap:wrap">
              <button type="button" class="btn btn-secondary btn-sm" id="cImageCenterBtn" onclick="centrarEncuadreCombo()" style="display:${comboImage ? '' : 'none'}">Centrar</button>
              <button type="button" class="btn btn-secondary btn-sm" id="cImageRemoveBtn" onclick="removeComboImage()" style="display:${comboImage ? '' : 'none'}">Quitar imagen</button>
            </div>
            <div class="p-image-hint">El recuadro es del mismo tamaño que la tarjeta del menú: lo que ves ahí es lo que se verá.</div>
          </div>
        </div>
        <input type="hidden" id="cImageData" value="${comboImage || ''}">
        <input type="hidden" id="cImagePos" value="${esc(comboImagePos)}">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
      <button class="btn btn-primary" onclick="saveCombo(${id || 'null'})">Guardar combo</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  renderComboCatalog();
  renderComboBuilderItems();
  // Deja la vista previa lista para arrastrar el encuadre.
  renderComboImagePreview(comboImage || '');
  if (!combo) document.getElementById('comboName')?.focus();
}

function setComboTab(tab) {
  const modal = document.querySelector('.modal-overlay[data-modal-type="combo"]');
  if (!modal) return;
  modal.querySelectorAll('.cb-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  modal.querySelectorAll('.cb-pane').forEach(p => { p.hidden = p.dataset.pane !== tab; });
}

function comboThumbHtml(product, size = 22) {
  if (product?.image) return `<span class="cb-thumb"><img src="${product.image}" alt="" style="object-position:${esc(product.imagePos || DEFAULT_IMAGE_POS)}"></span>`;
  return `<span class="cb-thumb">${categorySvg(product?.cat, size)}</span>`;
}

function comboTargetName() {
  const st = window.comboBuilderState;
  if (st.target === 'fixed') return 'Incluye siempre';
  return st.groups[st.target]?.label.trim() || `Grupo a elegir ${st.target + 1}`;
}

function comboCatalogFilter(key, value) {
  window.comboBuilderState[key] = value;
  renderComboCatalog();
}

function renderComboCatalog() {
  const st = window.comboBuilderState;
  const list = document.getElementById('cbCatalog');
  if (!st || !list) return;
  const group = st.target === 'fixed' ? null : st.groups[st.target];

  document.getElementById('cbTarget').innerHTML = `
    <span class="cb-target-label">Lo que toques se agrega a</span>
    <span class="cb-target-name ${group ? 'is-group' : ''}">${esc(comboTargetName())}</span>`;

  const usedCats = new Set(state.products.map(p => p.cat));
  const cats = ['Todos', ...state.categories.map(c => c.name).filter(n => usedCats.has(n))];
  document.getElementById('cbCats').innerHTML = cats.map(c => `
    <button type="button" class="cb-cat ${st.cat === c ? 'active' : ''}" onclick="comboCatalogFilter('cat', ${esc(JSON.stringify(c))})">${esc(c)}</button>
  `).join('');

  const term = st.search.trim().toLowerCase();
  const products = state.products.filter(p =>
    (st.cat === 'Todos' || p.cat === st.cat) && (!term || p.name.toLowerCase().includes(term)));
  if (!products.length) {
    list.innerHTML = `<div class="cb-empty">No hay productos${term ? ` que coincidan con "${esc(st.search)}"` : ''}.</div>`;
    return;
  }
  list.innerHTML = products.map(p => {
    let mark = '+';
    let inTarget = false;
    if (group) {
      inTarget = group.options.some(o => o.id === p.id);
      if (inTarget) mark = '✓';
    } else {
      const fixed = st.fixed.find(f => f.id === p.id);
      if (fixed) { inTarget = true; mark = `×${fixed.qty}`; }
    }
    const hasVariants = getProductVariants(p).length > 0;
    return `<button type="button" class="cb-prod ${inTarget ? 'in' : ''}" onclick="comboCatalogPick(${p.id})"
        title="${group ? (inTarget ? 'Quitar de las opciones' : 'Agregar como opción') : 'Agregar al combo'}">
      ${comboThumbHtml(p)}
      <span class="cb-prod-txt">
        <span class="cb-prod-name">${esc(p.name)}</span>
        <span class="cb-prod-meta">$${fmt(p.price)}${hasVariants ? ' · con variantes' : ''}</span>
      </span>
      <span class="cb-prod-mark">${mark}</span>
    </button>`;
  }).join('');
}

function comboCatalogPick(productId) {
  const st = window.comboBuilderState;
  const product = productById(productId);
  if (!st || !product) return;
  if (st.target === 'fixed') {
    const existing = st.fixed.find(f => f.id === productId);
    if (existing) existing.qty += 1;
    else st.fixed.push({ id: productId, qty: 1, name: product.name });
    st.flash = `f-${productId}`;
  } else {
    const group = st.groups[st.target];
    if (!group) return;
    const at = group.options.findIndex(o => o.id === productId);
    if (at !== -1) {
      group.options.splice(at, 1);
      st.flash = null;
    } else {
      group.options.push({ id: productId, name: product.name });
      st.flash = `g${st.target}-${productId}`;
    }
  }
  renderComboBuilderItems();
  renderComboCatalog();
}

// Cambia la seccion destino sin redibujar todo, para no quitarle el foco
// al nombre del grupo mientras se escribe.
function setComboTarget(target) {
  const st = window.comboBuilderState;
  if (!st || st.target === target) return;
  if (target !== 'fixed' && !st.groups[target]) return;
  st.target = target;
  document.querySelectorAll('#comboItemsList .cb-sec').forEach(sec => {
    sec.classList.toggle('is-target', sec.dataset.target === String(target));
  });
  renderComboCatalog();
}

function comboStepperHtml(value, onMinus, onPlus) {
  return `<span class="cb-step">
    <button type="button" onclick="${onMinus}" aria-label="Menos">−</button>
    <span class="cb-step-val">${value}</span>
    <button type="button" onclick="${onPlus}" aria-label="Más">+</button>
  </span>`;
}

function renderComboBuilderItems() {
  const st = window.comboBuilderState;
  const list = document.getElementById('comboItemsList');
  if (!st || !list) return;
  const isTarget = (t) => String(st.target) === String(t) ? 'is-target' : '';

  const fixedRows = st.fixed.map((item, index) => {
    const product = productById(item.id);
    return `<div class="cb-row ${st.flash === `f-${item.id}` ? 'flash' : ''}" data-k="f-${item.id}">
      ${comboThumbHtml(product, 18)}
      <span class="cb-row-name">${esc(product?.name || item.name)}</span>
      ${comboStepperHtml(item.qty, `changeComboFixedQty(${index},-1)`, `changeComboFixedQty(${index},1)`)}
      <button type="button" class="cb-del" onclick="removeComboItem(${index})" title="Quitar del combo">×</button>
    </div>`;
  }).join('');

  const groupsHtml = st.groups.map((group, gi) => `
    <div class="cb-sec cb-group ${isTarget(gi)}" data-target="${gi}" onclick="setComboTarget(${gi})">
      <div class="cb-sec-head">
        <span class="cb-badge">A elegir</span>
        <input class="cb-group-label" type="text" value="${esc(group.label)}" placeholder="Nombre del grupo (ej. Plato fuerte)"
          oninput="renameComboGroup(${gi}, this.value)">
        <button type="button" class="cb-del" onclick="event.stopPropagation(); removeComboGroup(${gi})" title="Eliminar grupo">×</button>
      </div>
      <div class="cb-group-qty">
        Lleva ${comboStepperHtml(group.qty, `changeComboGroupQty(${gi},-1)`, `changeComboGroupQty(${gi},1)`)}
        <span>${group.qty === 1 ? 'y se elige entre:' : 'y cada uno se elige entre:'}</span>
      </div>
      <div class="cb-chips">
        ${group.options.length ? group.options.map((opt, oi) => `
          <span class="cb-chip ${st.flash === `g${gi}-${opt.id}` ? 'flash' : ''}" data-k="g${gi}-${opt.id}">
            ${esc(productById(opt.id)?.name || opt.name)}
            <button type="button" onclick="event.stopPropagation(); removeComboGroupOption(${gi},${oi})" title="Quitar opción">×</button>
          </span>`).join('')
        : '<span class="cb-sec-empty">Toca en el catálogo los productos que el cliente puede elegir.</span>'}
      </div>
    </div>`).join('');

  list.innerHTML = `
    <div class="cb-sec ${isTarget('fixed')}" data-target="fixed" onclick="setComboTarget('fixed')">
      <div class="cb-sec-head">
        <span class="cb-sec-title">Incluye siempre</span>
        <span class="cb-sec-count">${st.fixed.reduce((s, f) => s + f.qty, 0) || ''}</span>
      </div>
      ${fixedRows || '<div class="cb-sec-empty">Toca un producto del catálogo para agregarlo. Si el cliente puede escoger entre varios, usa un grupo a elegir.</div>'}
    </div>
    ${groupsHtml}
    <button type="button" class="cb-add-group" onclick="addComboGroup()">
      <strong>+ Agregar grupo a elegir</strong>
      <span>Ej. Plato fuerte: montados o chilaquiles. Al vender se elige uno y luego sus variantes.</span>
    </button>`;

  renderComboSummary();
  if (st.flash) {
    list.querySelector(`[data-k="${st.flash}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    st.flash = null;
  }
}

function renderComboSummary() {
  const st = window.comboBuilderState;
  const box = document.getElementById('cbSummary');
  if (!st || !box) return;
  const price = Number(document.getElementById('comboPrice')?.value) || 0;
  let min = 0;
  let max = 0;
  st.fixed.forEach(f => {
    const p = Number(productById(f.id)?.price) || 0;
    min += p * f.qty;
    max += p * f.qty;
  });
  st.groups.forEach(g => {
    const prices = g.options.map(o => Number(productById(o.id)?.price) || 0);
    if (!prices.length) return;
    min += Math.min(...prices) * g.qty;
    max += Math.max(...prices) * g.qty;
  });
  const separate = min === max ? `$${fmt(min)}` : `$${fmt(min)} – $${fmt(max)}`;
  const saving = price > 0 && price < min ? `<span class="cb-sum-save">Ahorro ${min === max ? '' : 'desde '}$${fmt(min - price)}</span>` : '';
  box.innerHTML = `
    <span>Por separado: <strong>${separate}</strong></span>
    <span>Combo: <strong>$${fmt(price)}</strong></span>
    ${saving}`;
}

function changeComboFixedQty(index, delta) {
  const item = window.comboBuilderState.fixed[index];
  if (!item) return;
  if (item.qty + delta <= 0) return removeComboItem(index);
  item.qty += delta;
  renderComboBuilderItems();
  renderComboCatalog();
}

function removeComboItem(index) {
  window.comboBuilderState.fixed.splice(index, 1);
  renderComboBuilderItems();
  renderComboCatalog();
}

function addComboGroup() {
  const st = window.comboBuilderState;
  st.groups.push({ label: '', qty: 1, options: [] });
  st.target = st.groups.length - 1;
  renderComboBuilderItems();
  renderComboCatalog();
  const inputs = document.querySelectorAll('#comboItemsList .cb-group-label');
  const input = inputs[inputs.length - 1];
  input?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  input?.focus();
}

function renameComboGroup(index, value) {
  const group = window.comboBuilderState.groups[index];
  if (!group) return;
  group.label = value;
  if (window.comboBuilderState.target === index) {
    const name = document.querySelector('#cbTarget .cb-target-name');
    if (name) name.textContent = comboTargetName();
  }
}

function changeComboGroupQty(index, delta) {
  const group = window.comboBuilderState.groups[index];
  if (!group) return;
  group.qty = Math.max(1, group.qty + delta);
  renderComboBuilderItems();
}

function removeComboGroup(index) {
  const st = window.comboBuilderState;
  const group = st.groups[index];
  if (!group) return;
  if (group.options.length && !confirm(`¿Eliminar el grupo "${group.label || 'a elegir'}"?`)) return;
  st.groups.splice(index, 1);
  if (st.target === index) st.target = 'fixed';
  else if (typeof st.target === 'number' && st.target > index) st.target -= 1;
  renderComboBuilderItems();
  renderComboCatalog();
}

function removeComboGroupOption(groupIndex, optionIndex) {
  window.comboBuilderState.groups[groupIndex]?.options.splice(optionIndex, 1);
  renderComboBuilderItems();
  renderComboCatalog();
}

async function saveCombo(id) {
  const name = document.getElementById('comboName').value.trim();
  const description = document.getElementById('comboDesc').value.trim();
  const price = Number(document.getElementById('comboPrice').value) || 0;
  const icon = document.getElementById('comboIconPick')?.value || null;
  const image = document.getElementById('cImageData')?.value || null;
  const imagePos = document.getElementById('cImagePos')?.value || null;
  const st = window.comboBuilderState;
  const emptyGroup = st.groups.findIndex(g => !g.options.length);
  const items = [
    ...st.fixed.map(item => ({
      id: item.id,
      qty: item.qty,
      name: item.name || productById(item.id)?.name || '',
    })),
    ...st.groups.map((g, gi) => ({
      type: 'choice',
      label: g.label.trim() || `Elige ${gi + 1}`,
      qty: g.qty,
      options: g.options.map(o => ({ id: o.id, name: productById(o.id)?.name || o.name })),
    })),
  ];
  if (!name) return showToast('El nombre del combo es requerido', 'error');
  if (emptyGroup !== -1) {
    setComboTab('items');
    setComboTarget(emptyGroup);
    return showToast(`El grupo "${st.groups[emptyGroup].label || 'a elegir'}" no tiene opciones`, 'error');
  }
  if (!items.length) return showToast('Agrega al menos un producto al combo', 'error');
  try {
    const payload = { name, description, price, items, icon, image, imagePos };
    const res = await fetch(id ? `/api/combos/${id}` : '/api/combos', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await apiError(res));
    const result = await res.json();
    const updatedCombo = { id: id || result.id, name, description, price, items, icon, image, imagePos };
    if (id) {
      const index = state.combos.findIndex((combo) => combo.id === id);
      if (index !== -1) state.combos[index] = updatedCombo;
    } else {
      state.combos.push(updatedCombo);
    }
    document.querySelector('.modal-overlay[data-modal-type="combo"]')?.remove();
    renderPage('combos');
    showToast('Combo guardado', 'success');
  } catch (error) {
    console.error('Error saving combo:', error);
    showToast(error.message || 'Error al guardar combo', 'error');
  }
}

async function deleteCombo(id) {
  if (!confirm('¿Eliminar este combo?')) return;
  try {
    await fetch(`/api/combos/${id}`, { method: 'DELETE' });
    state.combos = state.combos.filter((combo) => combo.id !== id);
    renderPage('combos');
    showToast('Combo eliminado', 'success');
  } catch (error) {
    console.error('Error deleting combo:', error);
    showToast('Error al eliminar combo', 'error');
  }
}

// ===================== INVENTORY =====================
function buildInventory() {
  if (currentUser.role !== 'owner') return restricted();
  if (!state.products.length) {
    return `<div>
      <div class="page-header"><h2>Control de Inventario</h2></div>
      <div style="text-align:center;padding:60px;color:var(--stone)">
        <p style="font-size:15px;font-weight:600">Sin productos registrados</p>
        <p style="font-size:14px;margin-top:4px">Agrega productos desde la seccion <strong>Productos</strong> para gestionar el inventario.</p>
      </div>
    </div>`;
  }
  return `<div>
    <div class="page-header">
      <h2>Control de Inventario</h2>
      <span style="font-size:14px;color:var(--stone)">${state.products.length} producto(s) registrado(s)</span>
    </div>
    <table class="data-table">
      <thead><tr><th>Producto</th><th>Categoria</th><th>Stock Actual</th><th>Nivel</th><th>Ajuste rapido</th></tr></thead>
      <tbody>${state.products.map((product) => {
        const pct = Math.min(100, (product.stock / 100) * 100);
        const level = pct > 50 ? 'high' : pct > 20 ? 'mid' : 'low';
        const badge = pct > 50 ? 'badge-green' : pct > 20 ? 'badge-amber' : 'badge-red';
        const label = pct > 50 ? 'Bueno' : pct > 20 ? 'Bajo' : 'Critico';
        return `<tr>
          <td><div style="display:flex;align-items:center;gap:9px"><div style="width:30px;height:30px;background:var(--accent-mist);border-radius:7px;display:flex;align-items:center;justify-content:center;color:var(--accent-dark)">${categorySvg(product.cat)}</div><strong>${esc(product.name)}</strong></div></td>
          <td><span class="badge badge-sky">${esc(product.cat)}</span></td>
          <td><span class="badge ${badge}" style="font-family:var(--mono)">${product.stock} uds</span></td>
          <td style="width:170px">
            <div class="inv-bar"><div class="inv-fill ${level}" style="width:${pct}%"></div></div>
            <div style="font-size:11px;color:var(--stone);margin-top:2px">${label}</div>
          </td>
          <td>
            <div class="stock-adj">
              <button class="sadj-btn" onclick="adjustStock1(${product.id},-1)">-</button>
              <input class="sadj-input" id="sadj-${product.id}" type="number" value="1" min="1">
              <button class="sadj-btn" onclick="adjustStock1(${product.id},1)">+</button>
              <button class="sadj-apply" onclick="applyAdj(${product.id})">Aplicar</button>
            </div>
          </td>
        </tr>`;
      }).join('')}</tbody>
    </table>
  </div>`;
}

async function adjustStock1(id, delta) {
  const product = productById(id);
  if (!product) return;
  product.stock = Math.max(0, product.stock + delta);
  try {
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: product.stock })
    });
    showToast(`${product.name}: ${product.stock} uds`, 'success');
    navigateTo('inventory');
  } catch (error) {
    console.error('Error updating stock:', error);
    showToast('Error al actualizar stock', 'error');
  }
}

async function applyAdj(id) {
  const input = document.getElementById(`sadj-${id}`);
  const qty = Math.max(1, toInt(input?.value));
  const product = productById(id);
  if (!product) return;
  product.stock = Math.max(0, product.stock + qty);
  try {
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: product.stock })
    });
    showToast(`${product.name}: +${qty} -> ${product.stock} uds`, 'success');
    navigateTo('inventory');
  } catch (error) {
    console.error('Error updating stock:', error);
    showToast('Error al actualizar stock', 'error');
  }
}

// ===================== USERS =====================
function buildUsers() {
  if (currentUser.role !== 'owner') return restricted();
  const allUsers = [
    {
      name: state.owner.name,
      email: state.owner.email,
      role: 'Propietario',
      status: 'Activo',
      since: '2024-01-15',
      isDefault: true,
    },
    ...state.employees,
  ];
  return `<div>
    <div class="page-header"><h2>Gestion de Usuarios</h2>
      <button class="btn btn-primary" onclick="openAddEmployeeModal()">
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
        Agregar empleado
      </button>
    </div>
    <table class="data-table">
      <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Desde</th><th>Acciones</th></tr></thead>
      <tbody>${allUsers.map((user) => `<tr>
        <td><strong>${esc(user.name)}</strong></td>
        <td style="color:var(--stone);font-size:13px">${esc(user.email)}</td>
        <td><span class="badge ${user.role === 'Propietario' ? 'badge-green' : user.role === 'Cajero' ? 'badge-sky' : 'badge-amber'}">${esc(user.role)}</span></td>
        <td><span class="badge ${user.status === 'Activo' ? 'badge-green' : 'badge-red'}">${esc(user.status)}</span></td>
        <td style="color:var(--stone);font-size:13px">${esc(user.since)}</td>
        <td><div style="display:flex;gap:6px">
          ${user.role === 'Propietario' ? '<span style="font-size:13px;color:var(--stone)">Propietario</span>' : `
            <button class="btn btn-amber btn-sm" onclick="openEditEmployeeModal(${jsv(user.email)})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="openDeleteConfirm(${jsv(user.email)},${jsv(user.name)})">Eliminar</button>
          `}
        </div></td>
      </tr>`).join('')}</tbody>
    </table>
    ${state.employees.length === 0 ? `<div style="text-align:center;padding:40px;color:var(--stone)">
      <p>No hay empleados registrados. <strong style="cursor:pointer;color:var(--accent)" onclick="openAddEmployeeModal()">Agregar el primero -></strong></p>
    </div>` : ''}
  </div>`;
}

function openAddEmployeeModal() {
  document.getElementById('muTitle').textContent = 'Agregar empleado';
  document.getElementById('muSub').textContent = 'Crea una nueva cuenta de empleado';
  document.getElementById('muName').value = '';
  document.getElementById('muEmail').value = '';
  document.getElementById('muRole').value = 'Mesero';
  document.getElementById('muPass').value = '';
  document.getElementById('muEditEmail').value = '';
  hideUserError();
  openModal('manageUsersModal');
}

function openEditEmployeeModal(email) {
  const employee = getEmployeeByEmail(email);
  if (!employee) return;
  document.getElementById('muTitle').textContent = 'Editar empleado';
  document.getElementById('muSub').textContent = `Actualiza la cuenta de ${employee.name}`;
  document.getElementById('muName').value = employee.name;
  document.getElementById('muEmail').value = employee.email;
  document.getElementById('muRole').value = employee.role;
  document.getElementById('muPass').value = employee.pass;
  document.getElementById('muEditEmail').value = employee.email;
  hideUserError();
  openModal('manageUsersModal');
}

function generatePassword() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let pass = '';
  for (let index = 0; index < 8; index += 1) {
    pass += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  document.getElementById('muPass').value = pass;
}

function showUserError(message) {
  const error = document.getElementById('userErr');
  error.textContent = message;
  error.style.display = 'block';
}

function hideUserError() {
  const error = document.getElementById('userErr');
  error.textContent = '';
  error.style.display = 'none';
}

async function saveEmployee() {
  const name = document.getElementById('muName').value.trim();
  const email = document.getElementById('muEmail').value.trim().toLowerCase();
  const role = document.getElementById('muRole').value;
  const pass = document.getElementById('muPass').value.trim();
  const editingEmail = document.getElementById('muEditEmail').value.trim().toLowerCase();

  if (!name || !email || !pass) {
    showUserError('Completa todos los campos.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showUserError('Ingresa un correo valido.');
    return;
  }
  if (pass.length < 6) {
    showUserError('La contrasena debe tener al menos 6 caracteres.');
    return;
  }
  if (email === state.owner.email.toLowerCase() && email !== editingEmail) {
    showUserError('Ese correo ya pertenece al propietario.');
    return;
  }
  const duplicate = state.employees.find((employee) => employee.email.toLowerCase() === email && employee.email.toLowerCase() !== editingEmail);
  if (duplicate) {
    showUserError('Ya existe un empleado con ese correo.');
    return;
  }

  try {
    if (editingEmail) {
      const index = state.employees.findIndex((employee) => employee.email.toLowerCase() === editingEmail);
      if (index === -1) return;
      const updatedEmployee = {
        ...state.employees[index],
        name,
        email,
        role,
        pass,
      };
      await fetch(`/api/users/${state.employees[index].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEmployee)
      });
      state.employees[index] = updatedEmployee;
      if (currentUser && currentUser.email.toLowerCase() === editingEmail) {
        currentUser = {
          ...currentUser,
          email,
          name,
          label: role,
        };
      }
      showToast('Empleado actualizado', 'success');
    } else {
      const newEmployee = {
        name,
        email,
        role,
        status: 'Activo',
        since: formatDateISO(new Date()),
        pass,
        isDefault: false,
      };
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee)
      });
      const { id } = await res.json();
      newEmployee.id = id;
      state.employees.push(newEmployee);
      showToast('Empleado agregado', 'success');
    }
    closeModal('manageUsersModal');
    navigateTo('users');
  } catch (error) {
    console.error('Error saving employee:', error);
    showToast('Error al guardar empleado', 'error');
  }
}

function openDeleteConfirm(email, name) {
  pendingDeleteEmail = email;
  document.getElementById('deleteMsg').textContent = `Se eliminara la cuenta de ${name}.`;
  openModal('confirmDeleteModal');
}

async function confirmDelete() {
  if (!pendingDeleteEmail) return;
  const employee = state.employees.find((employee) => employee.email.toLowerCase() === pendingDeleteEmail.toLowerCase());
  if (!employee) return;
  try {
    await fetch(`/api/users/${employee.id}`, { method: 'DELETE' });
    state.employees = state.employees.filter(e => e.id !== employee.id);
    pendingDeleteEmail = null;
    closeModal('confirmDeleteModal');
    navigateTo('users');
    showToast(`Empleado eliminado: ${employee.name}`, 'success');
  } catch (error) {
    console.error('Error deleting employee:', error);
    showToast('Error al eliminar empleado', 'error');
  }
}

// ===================== DASHBOARD =====================
// Tarjeta de corte: cuanto deberia haber en la caja y cuanto esta por depositar
// cada plataforma. Sin esto, el dinero de Uber/Didi hacia "faltar" efectivo al cortar.
function renderCorteHTML(corte) {
  if (!corte.total) return '';
  const fila = (f) => {
    const plat = isPlatformMethod(f.method) ? DELIVERY_PLATFORMS[f.method] : null;
    return `<div class="corte-row">
      <span class="corte-method">
        ${plat ? `<span class="pay-badge ${f.method.toLowerCase()}">${esc(f.method)}</span>` : esc(f.method)}
        ${plat ? `<span class="corte-day">deposita los ${plat.depositDay}</span>` : ''}
      </span>
      <span class="corte-amount">$${fmt(f.amount)}</span>
    </div>`;
  };
  return `<div class="corte-card">
    <div class="corte-head">
      <span class="corte-title">Corte de hoy</span>
      <span class="corte-total">Ventas del día $${fmt(corte.total)}</span>
    </div>
    <div class="corte-cols">
      <div class="corte-col">
        <div class="corte-col-head">En caja</div>
        ${corte.local.length ? corte.local.map(fila).join('') : '<div class="corte-empty">Sin cobros en el local</div>'}
        <div class="corte-row corte-sum"><span>Total en caja</span><span class="corte-amount">$${fmt(corte.enCaja)}</span></div>
      </div>
      <div class="corte-col plataformas">
        <div class="corte-col-head">Por cobrar a plataformas</div>
        ${corte.plataformas.length ? corte.plataformas.map(fila).join('') : '<div class="corte-empty">Sin ventas por plataforma</div>'}
        <div class="corte-row corte-sum"><span>No entra hoy</span><span class="corte-amount">$${fmt(corte.porCobrar)}</span></div>
      </div>
    </div>
  </div>`;
}

function buildDashboard() {
  if (currentUser.role !== 'owner') return restricted();
  const today = getSalesSummary('today');
  const week = getSalesSummary('week');
  const averageTicket = week.orders ? week.revenue / week.orders : 0;
  const history = getSalesHistory();
  const topProducts = getTopProducts(5);
  const maxRevenue = Math.max(1, ...history.map((entry) => entry.revenue));
  const categories = getCategorySalesBreakdown().slice(0, 3);
  const categoryColors = ['var(--accent)', 'var(--amber)', 'var(--rose)'];
  const corte = getPaymentBreakdown(today.sales);

  return `<div>
    ${renderCorteHTML(corte)}
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-label">Ventas hoy</div><div class="stat-value">$${fmt(today.revenue)}</div><div class="stat-sub">${today.orders} orden(es) pagada(s)</div></div>
      <div class="stat-card amber"><div class="stat-label">Ordenes activas</div><div class="stat-value">${state.commandas.length}</div><div class="stat-sub">${state.commandas.length ? 'Pendientes en cocina/caja' : 'Sin pendientes'}</div></div>
      <div class="stat-card rose"><div class="stat-label">Ticket promedio</div><div class="stat-value">$${fmt(averageTicket)}</div><div class="stat-sub">Ultimos 7 dias</div></div>
      <div class="stat-card sky"><div class="stat-label">Total semana</div><div class="stat-value">$${fmt(week.revenue)}</div><div class="stat-sub">${week.orders} venta(s) registradas</div></div>
    </div>
    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-title">Ventas por dia - semana actual</div>
        <div class="bar-chart">
          ${history.map((entry) => `<div class="bar-col">
            <div class="bar-val">$${Math.round(entry.revenue / 1000)}k</div>
            <div class="bar" style="height:${Math.max(8, Math.floor((entry.revenue / maxRevenue) * 110))}px"></div>
            <div class="bar-label">${esc(entry.day)}</div>
          </div>`).join('')}
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Ventas por categoria</div>
        ${categories.length ? categories.map((entry, index) => `
          <div class="legend-item"><div class="legend-dot" style="background:${categoryColors[index] || 'var(--accent)'}"></div>${esc(entry.category)} ${entry.pct}%</div>
        `).join('') : '<div style="font-size:13px;color:var(--stone)">Sin ventas registradas</div>'}
      </div>
    </div>
    <div style="margin-top:16px">
      <div class="section-title">Productos mas vendidos</div>
      <table class="data-table">
        <thead><tr><th>Producto</th><th>Unidades</th><th>Ingresos MXN</th></tr></thead>
        <tbody>${(topProducts.length ? topProducts : [{ name: 'Sin ventas', cat: 'Platos Fuertes', qty: 0, revenue: 0 }]).map((product) => `
          <tr><td><div style="display:flex;align-items:center;gap:8px"><div style="width:28px;height:28px;background:var(--accent-mist);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--accent-dark)">${categorySvg(product.cat)}</div>${esc(product.name)}</div></td>
          <td style="font-family:var(--mono)">${product.qty}</td>
          <td style="font-family:var(--mono);color:var(--accent-dark);font-weight:700">$${fmt(product.revenue)}</td></tr>
        `).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

// ===================== REPORTES DE VENTAS =====================
// Periodo activo del reporte: week | month | prevmonth | year | custom
let reportRange = 'week';
let reportFrom = '';
let reportTo = '';

const REPORT_TABS = [
  { key: 'today', label: 'Hoy' },
  { key: 'week', label: 'Semana actual' },
  { key: 'month', label: 'Mes actual' },
  { key: 'prevmonth', label: 'Mes anterior' },
  { key: 'year', label: 'Año actual' },
  { key: 'custom', label: 'Periodo...' },
];

function startOfDay(date) { const d = new Date(date); d.setHours(0, 0, 0, 0); return d; }
function endOfDay(date) { const d = new Date(date); d.setHours(23, 59, 59, 999); return d; }

// Devuelve el rango de fechas del periodo elegido y si se agrupa por dia o por mes.
function getReportPeriod() {
  const now = new Date();
  if (reportRange === 'today') {
    return { start: startOfDay(now), end: endOfDay(now), unit: 'day' };
  }
  if (reportRange === 'month') {
    return { start: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)), end: endOfDay(now), unit: 'day' };
  }
  if (reportRange === 'prevmonth') {
    return {
      start: startOfDay(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
      end: endOfDay(new Date(now.getFullYear(), now.getMonth(), 0)),
      unit: 'day',
    };
  }
  if (reportRange === 'year') {
    return { start: startOfDay(new Date(now.getFullYear(), 0, 1)), end: endOfDay(now), unit: 'month' };
  }
  if (reportRange === 'custom') {
    const start = startOfDay(reportFrom ? new Date(`${reportFrom}T00:00:00`) : now);
    const end = endOfDay(reportTo ? new Date(`${reportTo}T00:00:00`) : now);
    const days = Math.round((end - start) / 86400000);
    return { start, end, unit: days > 92 ? 'month' : 'day' };
  }
  // Semana actual: de lunes a hoy.
  const start = startOfDay(now);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return { start, end: endOfDay(now), unit: 'day' };
}

function reportPeriodLabel() {
  const tab = REPORT_TABS.find(t => t.key === reportRange);
  return tab ? tab.label.replace('...', ' seleccionado') : 'Periodo';
}

function reportBucketLabel(key, unit) {
  if (unit === 'month') {
    const [year, month] = key.split('-').map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString('es-MX', { month: 'short' });
  }
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' });
}

function getReportData() {
  const period = getReportPeriod();
  const sales = state.salesRecords.filter((sale) => {
    if (sale.status !== 'Pagado') return false;
    const date = new Date(sale.completedAt);
    return date >= period.start && date <= period.end;
  });

  const revenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  const cost = sales.reduce((sum, sale) => sum + (sale.cost || 0), 0);

  const buckets = new Map();
  const cats = new Map();
  const prods = new Map();
  const pays = new Map();
  const vars = new Map();

  // Acumula variantes vendidas (guisos, sabores, etc.) del periodo, incluidas las de combos.
  const addVariant = (name, variantLabel, qty, price) => {
    if (!variantLabel) return;
    const key = `${name} · ${variantLabel}`;
    const entry = vars.get(key) || { label: key, qty: 0, revenue: 0 };
    entry.qty += qty || 0;
    entry.revenue += (qty || 0) * (price || 0);
    vars.set(key, entry);
  };

  sales.forEach((sale) => {
    const date = new Date(sale.completedAt);
    const key = period.unit === 'month'
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      : toLocalDateStr(date);
    const bucket = buckets.get(key) || { key, revenue: 0, cost: 0, orders: 0 };
    bucket.revenue += sale.total || 0;
    bucket.cost += sale.cost || 0;
    bucket.orders += 1;
    buckets.set(key, bucket);

    const items = Array.isArray(sale.items) ? sale.items : [];
    items.forEach((item) => {
      const amount = (item.price || 0) * (item.qty || 0);
      const catName = item.isCombo ? 'Combos' : (item.cat || 'Sin categoría');
      const cat = cats.get(catName) || { name: catName, qty: 0, revenue: 0 };
      cat.qty += item.qty || 0;
      cat.revenue += amount;
      cats.set(catName, cat);

      const prodName = item.name || 'Sin nombre';
      const prod = prods.get(prodName) || { name: prodName, cat: catName, qty: 0, revenue: 0 };
      prod.qty += item.qty || 0;
      prod.revenue += amount;
      prods.set(prodName, prod);

      // Variantes elegidas (incluye las piezas de un combo, cada una con su guiso/sabor).
      addVariant(item.name, item.variantLabel, item.qty, item.price);
      if (item.isCombo && Array.isArray(item.comboItems)) {
        item.comboItems.forEach((ci) => addVariant(ci.name || '', ci.variantLabel, (ci.qty || 1) * (item.qty || 1), 0));
      }
    });

    // Una venta puede llevar varios pagos (efectivo + tarjeta, etc.).
    const list = Array.isArray(sale.payments) && sale.payments.length
      ? sale.payments
      : [{ method: sale.paymentMethod || 'Efectivo', amount: sale.total || 0 }];
    list.forEach((payment) => {
      const method = payment.method || 'Otro';
      const entry = pays.get(method) || { method, amount: 0, count: 0 };
      entry.amount += payment.amount || 0;
      entry.count += 1;
      pays.set(method, entry);
    });
  });

  const series = [...buckets.values()]
    .sort((a, b) => (a.key < b.key ? -1 : 1))
    .map(entry => ({ ...entry, profit: entry.revenue - entry.cost, label: reportBucketLabel(entry.key, period.unit) }));

  const byRevenue = (a, b) => b.revenue - a.revenue;
  const categories = [...cats.values()].sort(byRevenue);
  const catTotal = categories.reduce((sum, c) => sum + c.revenue, 0);

  return {
    period,
    sales,
    revenue: toMoney(revenue),
    cost: toMoney(cost),
    profit: toMoney(revenue - cost),
    margin: revenue ? (revenue - cost) / revenue * 100 : 0,
    orders: sales.length,
    average: sales.length ? toMoney(revenue / sales.length) : 0,
    series,
    categories: categories.map(c => ({ ...c, pct: catTotal ? Math.round(c.revenue / catTotal * 100) : 0 })),
    products: [...prods.values()].sort((a, b) => b.qty - a.qty || b.revenue - a.revenue).slice(0, 12),
    variants: [...vars.values()].sort((a, b) => b.qty - a.qty || b.revenue - a.revenue).slice(0, 12),
    payments: [...pays.values()].sort((a, b) => b.amount - a.amount),
  };
}

function setReportRange(range) {
  reportRange = range;
  if (range === 'custom' && !reportFrom) {
    const now = new Date();
    reportFrom = toLocalDateStr(new Date(now.getFullYear(), now.getMonth(), 1));
    reportTo = toLocalDateStr(now);
  }
  renderPage('reports');
}

function setReportFrom(value) { reportFrom = value; renderPage('reports'); }
function setReportTo(value) { reportTo = value; renderPage('reports'); }

function buildReports() {
  if (currentUser.role !== 'owner') return restricted();
  const data = getReportData();
  const fmtDate = d => d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  const maxBar = Math.max(1, ...data.series.map(s => s.revenue));
  // Con muchas barras las cifras encima se encinan: se dejan solo en periodos cortos
  // (el importe exacto siempre esta en la tabla y en el tooltip de la barra).
  const showBarValues = data.series.length <= 12;

  return `<div class="report-page">
    <div class="rep-head">
      <div>
        <div class="rep-title">Resumen de ventas — ${esc(reportPeriodLabel())}</div>
        <div class="rep-sub">${esc(fmtDate(data.period.start))} al ${esc(fmtDate(data.period.end))}</div>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="exportReport()">
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
        Exportar CSV
      </button>
    </div>

    <div class="rep-tabs">
      ${REPORT_TABS.map(tab => `
        <button class="rep-tab ${reportRange === tab.key ? 'active' : ''}" onclick="setReportRange('${tab.key}')">${esc(tab.label)}</button>
      `).join('')}
      ${reportRange === 'custom' ? `
        <span class="rep-dates">
          <input type="date" value="${esc(reportFrom)}" onchange="setReportFrom(this.value)">
          <span>a</span>
          <input type="date" value="${esc(reportTo)}" onchange="setReportTo(this.value)">
        </span>` : ''}
    </div>

    ${!data.orders ? `
      <div class="rep-empty">
        <svg width="42" height="42" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" style="color:var(--stone-light)"><path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M4 4h16v16H4z"/></svg>
        <p>No hay ventas pagadas en este periodo.</p>
      </div>
    ` : `
      <div class="chart-card" style="margin-bottom:16px">
        <div class="rep-legend">
          <span><i style="background:var(--accent)"></i> Ventas</span>
          <span><i style="background:var(--accent-dark)"></i> Ganancia</span>
        </div>
        <div class="rep-chart">
          ${data.series.map(entry => `
            <div class="rep-col" title="${esc(entry.label)}: $${fmt(entry.revenue)} en ${entry.orders} venta(s)">
              <div class="rep-bars">
                <div class="rep-bar ventas" style="height:${Math.max(3, Math.round(entry.revenue / maxBar * 130))}px"></div>
                <div class="rep-bar ganancia" style="height:${Math.max(3, Math.round(Math.max(0, entry.profit) / maxBar * 130))}px"></div>
              </div>
              ${showBarValues ? `<div class="rep-col-val">$${fmt(entry.revenue)}</div>` : ''}
              <div class="rep-col-label">${esc(entry.label)}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card"><div class="stat-label">Ventas totales</div><div class="stat-value">$${fmt(data.revenue)}</div><div class="stat-sub">${data.orders} venta(s)</div></div>
        <div class="stat-card sky"><div class="stat-label">Venta promedio</div><div class="stat-value">$${fmt(data.average)}</div><div class="stat-sub">Ticket promedio del periodo</div></div>
        <div class="stat-card amber"><div class="stat-label">Ganancia</div><div class="stat-value">$${fmt(data.profit)}</div><div class="stat-sub">Ventas menos costo</div></div>
        <div class="stat-card rose"><div class="stat-label">Margen de utilidad</div><div class="stat-value">${data.margin.toFixed(2)}%</div><div class="stat-sub">Promedio del periodo</div></div>
      </div>

      <div class="rep-grid">
        <div>
          <div class="section-title">Ventas por ${data.period.unit === 'month' ? 'mes' : 'día'}</div>
          <table class="data-table">
            <thead><tr><th>${data.period.unit === 'month' ? 'Mes' : 'Día'}</th><th>Ventas</th><th>Ganancia</th><th>Tickets</th></tr></thead>
            <tbody>
              ${data.series.map(entry => `<tr>
                <td><strong>${esc(entry.label)}</strong></td>
                <td style="font-family:var(--mono);color:var(--accent-dark);font-weight:700">$${fmt(entry.revenue)}</td>
                <td style="font-family:var(--mono)">$${fmt(entry.profit)}</td>
                <td style="font-family:var(--mono)">${entry.orders}</td>
              </tr>`).join('')}
              <tr class="rep-total"><td><strong>Total</strong></td>
                <td style="font-family:var(--mono)"><strong>$${fmt(data.revenue)}</strong></td>
                <td style="font-family:var(--mono)"><strong>$${fmt(data.profit)}</strong></td>
                <td style="font-family:var(--mono)"><strong>${data.orders}</strong></td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <div class="section-title">Ventas por categoría</div>
          <table class="data-table">
            <thead><tr><th>Categoría</th><th>Unidades</th><th>Importe</th><th>%</th></tr></thead>
            <tbody>
              ${data.categories.map(cat => `<tr>
                <td><strong>${esc(cat.name)}</strong></td>
                <td style="font-family:var(--mono)">${cat.qty}</td>
                <td style="font-family:var(--mono);color:var(--accent-dark);font-weight:700">$${fmt(cat.revenue)}</td>
                <td style="width:96px">
                  <div class="rep-pct"><div class="rep-pct-bar" style="width:${cat.pct}%"></div><span>${cat.pct}%</span></div>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="rep-grid" style="margin-top:16px">
        <div>
          <div class="section-title">Productos más vendidos — ${esc(reportPeriodLabel())}</div>
          <table class="data-table">
            <thead><tr><th>#</th><th>Producto</th><th>Unidades</th><th>Importe</th></tr></thead>
            <tbody>
              ${data.products.map((product, index) => `<tr>
                <td style="font-family:var(--mono);color:var(--stone);width:28px">${index + 1}</td>
                <td><strong>${esc(product.name)}</strong><div style="font-size:12px;color:var(--stone)">${esc(product.cat || '')}</div></td>
                <td style="font-family:var(--mono);font-weight:700">${product.qty}</td>
                <td style="font-family:var(--mono);color:var(--accent-dark)">$${fmt(product.revenue)}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div>
          <div class="section-title">Variantes más vendidas — ${esc(reportPeriodLabel())}</div>
          ${data.variants.length ? `
          <table class="data-table">
            <thead><tr><th>#</th><th>Variante</th><th>Unidades</th></tr></thead>
            <tbody>
              ${data.variants.map((variant, index) => `<tr>
                <td style="font-family:var(--mono);color:var(--stone);width:28px">${index + 1}</td>
                <td><strong>${esc(variant.label)}</strong></td>
                <td style="font-family:var(--mono);font-weight:700">${variant.qty}</td>
              </tr>`).join('')}
            </tbody>
          </table>` : `<div style="padding:18px;text-align:center;color:var(--stone);font-size:14px;background:var(--surface);border-radius:var(--r-sm)">Sin ventas con variantes en este periodo.</div>`}
        </div>
      </div>

      <div style="margin-top:16px">
        <div class="section-title">Ventas por forma de pago</div>
        <table class="data-table">
          <thead><tr><th>Forma de pago</th><th>Movimientos</th><th>Importe</th></tr></thead>
          <tbody>
            ${data.payments.map(payment => {
              const plat = isPlatformMethod(payment.method) ? DELIVERY_PLATFORMS[payment.method] : null;
              return `<tr>
              <td>
                ${plat
                  ? `<span class="pay-badge ${payment.method.toLowerCase()}">${esc(payment.method)}</span>
                     <span style="font-size:11px;color:var(--stone);margin-left:6px">${esc(plat.label)} · deposita los ${plat.depositDay}</span>`
                  : `<strong>${esc(payment.method)}</strong>`}
              </td>
              <td style="font-family:var(--mono)">${payment.count}</td>
              <td style="font-family:var(--mono);color:var(--accent-dark);font-weight:700">$${fmt(payment.amount)}</td>
            </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    `}
  </div>`;
}

function exportReport() {
  const data = getReportData();
  const q = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const lines = [];
  lines.push(`Reporte de ventas;${reportPeriodLabel()}`);
  lines.push(`Del;${toLocalDateStr(data.period.start)};Al;${toLocalDateStr(data.period.end)}`);
  lines.push('');
  lines.push('Ventas totales;Tickets;Venta promedio;Ganancia;Margen %');
  lines.push([data.revenue, data.orders, data.average, data.profit, data.margin.toFixed(2)].join(';'));
  lines.push('');
  lines.push(`${data.period.unit === 'month' ? 'Mes' : 'Dia'};Ventas;Ganancia;Tickets`);
  data.series.forEach(e => lines.push([q(e.label), e.revenue, e.profit, e.orders].join(';')));
  lines.push('');
  lines.push('Categoria;Unidades;Importe;Porcentaje');
  data.categories.forEach(c => lines.push([q(c.name), c.qty, c.revenue, `${c.pct}%`].join(';')));
  lines.push('');
  lines.push('Producto;Categoria;Unidades;Importe');
  data.products.forEach(p => lines.push([q(p.name), q(p.cat), p.qty, p.revenue].join(';')));
  lines.push('');
  lines.push('Variante mas vendida;Unidades');
  data.variants.forEach(v => lines.push([q(v.label), v.qty].join(';')));
  lines.push('');
  lines.push('Forma de pago;Movimientos;Importe');
  data.payments.forEach(p => lines.push([q(p.method), p.count, p.amount].join(';')));
  downloadTextFile(`reporte-${reportRange}-${toLocalDateStr(new Date())}.csv`, `﻿${lines.join('\n')}`, 'text/csv;charset=utf-8');
  showToast('Reporte exportado', 'success');
}

// ===================== FINANCES =====================
function buildFinances() {
  if (currentUser.role !== 'owner') return restricted();
  const summary = getSalesSummary('week');
  const revenue = summary.revenue;
  const cost = summary.cost;
  const grossProfit = toMoney(revenue - cost);
  const profit = summary.profit;
  const labor = toMoney(revenue * 0.18);
  const rent = toMoney(revenue * 0.1);
  const services = toMoney(revenue * 0.06);
  const other = toMoney(revenue * 0.04);
  const weekHistory = getSalesHistory();

  return `<div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-label">Ingresos brutos</div><div class="stat-value">$${fmt(revenue)}</div><div class="stat-sub">Ultimos 7 dias</div></div>
      <div class="stat-card amber"><div class="stat-label">Costo materia prima</div><div class="stat-value">$${fmt(cost)}</div><div class="stat-sub">Costo real de ventas</div></div>
      <div class="stat-card sky"><div class="stat-label">Utilidad bruta</div><div class="stat-value">$${fmt(grossProfit)}</div><div class="stat-sub">Ventas menos costo de producto</div></div>
      <div class="stat-card rose"><div class="stat-label">Ganancia neta</div><div class="stat-value">$${fmt(profit)}</div><div class="stat-sub">${revenue ? `${Math.round((profit / revenue) * 100)}% margen` : 'Sin margen aun'}</div></div>
    </div>
    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-title">Flujo de caja semanal</div>
        <table class="data-table">
          <thead><tr><th>Dia</th><th>Ingresos MXN</th><th>Costos MXN</th><th>Ordenes</th></tr></thead>
          <tbody>${weekHistory.map((entry) => `<tr>
            <td><strong>${esc(entry.day)}</strong></td>
            <td style="font-family:var(--mono);color:var(--accent-dark)">$${fmt(entry.revenue)}</td>
            <td style="font-family:var(--mono);color:var(--rose)">$${fmt(entry.revenue * 0.4)}</td>
            <td style="font-family:var(--mono);font-weight:700">${entry.orders}</td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
      <div class="chart-card">
        <div class="chart-title">Desglose estimado de gastos</div>
        ${[
          ['Materia Prima', cost, revenue ? Math.round((cost / revenue) * 100) : 0, 'var(--amber)'],
          ['Personal', labor, revenue ? Math.round((labor / revenue) * 100) : 0, 'var(--sky)'],
          ['Renta', rent, revenue ? Math.round((rent / revenue) * 100) : 0, 'var(--rose)'],
          ['Servicios', services, revenue ? Math.round((services / revenue) * 100) : 0, 'var(--stone-light)'],
          ['Otros', other, revenue ? Math.round((other / revenue) * 100) : 0, 'var(--accent-pale)'],
        ].map(([label, amount, pct, color]) => `
          <div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:3px"><span>${label}</span><span style="font-weight:700">$${fmt(amount)} · ${pct}%</span></div>
            <div class="inv-bar"><div style="height:100%;background:${color};border-radius:3px;width:${pct}%"></div></div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="chart-card" style="margin-top:14px">
      <div class="chart-title">Variantes mas vendidas</div>
      ${(() => {
        const tv = getTopVariants(10);
        if (!tv.length) return `<div style="padding:18px;text-align:center;color:var(--stone);font-size:14px">Aun no hay ventas con variantes registradas</div>`;
        const max = tv[0].qty || 1;
        return tv.map((v, i) => `
          <div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:3px">
              <span><span style="font-family:var(--mono);color:var(--stone)">${i + 1}.</span> ${esc(v.label)}</span>
              <span style="font-weight:700;white-space:nowrap">${v.qty} vendida${v.qty === 1 ? '' : 's'}</span>
            </div>
            <div class="inv-bar"><div style="height:100%;background:var(--accent);border-radius:3px;width:${Math.round((v.qty / max) * 100)}%"></div></div>
          </div>
        `).join('');
      })()}
    </div>
  </div>`;
}

// ===================== SALES =====================
function buildSales() {
  if (currentUser.role !== 'owner') return restricted();
  if (!salesSelectedDate) salesSelectedDate = toLocalDateStr(new Date());
  const todayStr = toLocalDateStr(new Date());
  const yesterdayStr = toLocalDateStr(new Date(Date.now() - 86400000));
  return `<div style="display:grid;grid-template-columns:340px 1fr;gap:14px;height:calc(100vh - 128px)">

    <!-- Panel izquierdo -->
    <div style="display:flex;flex-direction:column;background:var(--surface);border-radius:var(--r-lg);box-shadow:var(--shadow-md);overflow:hidden">

      <!-- Encabezado -->
      <div style="padding:14px 14px 10px;border-bottom:1px solid var(--stone-pale)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <span style="font-size:15px;font-weight:700;color:var(--charcoal)">Historial de Ventas</span>
          <button class="btn btn-primary btn-sm" onclick="exportSales()">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Exportar
          </button>
        </div>
        <div style="display:flex;gap:5px;margin-bottom:8px">
          <button class="btn btn-sm ${salesSelectedDate === todayStr ? 'btn-primary' : 'btn-secondary'}" onclick="setSalesDate('${todayStr}')">Hoy</button>
          <button class="btn btn-sm ${salesSelectedDate === yesterdayStr ? 'btn-primary' : 'btn-secondary'}" onclick="setSalesDate('${yesterdayStr}')">Ayer</button>
          <input type="date" style="flex:1;border:1px solid var(--stone-pale);border-radius:var(--r);padding:4px 8px;font-size:13px;background:var(--surface);color:var(--charcoal)" value="${salesSelectedDate}" onchange="setSalesDate(this.value)">
        </div>
        <div class="search-bar" style="margin:0">
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/></svg>
          <input type="text" placeholder="Buscar por folio o mesero..." value="${esc(salesSearchTerm)}" oninput="setSalesSearch(this.value)">
        </div>
      </div>

      <!-- Pestañas -->
      <div style="display:flex;border-bottom:1px solid var(--stone-pale)">
        <button onclick="setSalesTab('sales')" style="flex:1;padding:7px;font-size:13px;font-weight:600;border:none;cursor:pointer;background:${salesTab==='sales'?'var(--accent-mist)':'transparent'};color:${salesTab==='sales'?'var(--accent-dark)':'var(--stone)'}">
          Ventas
        </button>
        <button onclick="setSalesTab('movements')" style="flex:1;padding:7px;font-size:13px;font-weight:600;border:none;cursor:pointer;background:${salesTab==='movements'?'var(--accent-mist)':'transparent'};color:${salesTab==='movements'?'var(--accent-dark)':'var(--stone)'}">
          Movimientos
        </button>
      </div>

      <!-- Lista -->
      <div id="salesListPanel" style="flex:1;overflow-y:auto">${renderSalesListHTML()}</div>

      <!-- Resumen del día -->
      <div id="salesDaySummary" style="padding:10px 14px;border-top:1px solid var(--stone-pale);background:var(--surface-alt)">
        ${renderSalesDaySummaryHTML()}
      </div>
    </div>

    <!-- Panel derecho: detalle -->
    <div id="saleDetailPanel" style="background:var(--surface);border-radius:var(--r-lg);box-shadow:var(--shadow-md);overflow-y:auto">
      ${salesTab === 'movements' ? renderMovementDetailHTML() : renderSaleDetailHTML()}
    </div>
  </div>`;
}

function getMovementTicketNumber(m) {
  try { return m.data ? (JSON.parse(m.data).ticketNumber ?? null) : null; } catch { return null; }
}

function renderSalesListHTML() {
  if (salesTab === 'movements') {
    const movs = salesMovements.filter(m => toLocalDateStr(m.timestamp) === salesSelectedDate);
    if (!movs.length) return `<div style="text-align:center;padding:40px 20px;color:var(--stone);font-size:14px">Sin actividad registrada este día</div>`;

    // Group by ticketNumber
    const ticketMap = new Map();
    movs.forEach(m => {
      const tn = getMovementTicketNumber(m);
      if (tn == null) return;
      if (!ticketMap.has(tn)) ticketMap.set(tn, []);
      ticketMap.get(tn).push(m);
    });
    if (!ticketMap.size) return `<div style="text-align:center;padding:40px 20px;color:var(--stone);font-size:14px">Sin actividad registrada este día</div>`;

    return [...ticketMap.entries()]
      .sort((a, b) => {
        const tA = Math.max(...a[1].map(m => new Date(m.timestamp)));
        const tB = Math.max(...b[1].map(m => new Date(m.timestamp)));
        return tB - tA;
      })
      .map(([tn, mList]) => {
        const sel = movementsSelectedTicket === tn;
        const cancelled = mList.some(m => m.type === 'cancel_order');
        const completed = mList.some(m => m.type === 'create_order') && !cancelled;
        const sale = state.salesRecords.find(s => s.ticketNumber === tn);
        const mesa = (() => { try { return JSON.parse(mList.find(m => m.data)?.data || '{}').mesa || '—'; } catch { return '—'; } })();
        const waiter = mList[0]?.user || '—';
        const lastTime = formatTime(mList.reduce((a, b) => new Date(a.timestamp) > new Date(b.timestamp) ? a : b).timestamp);
        const statusChip = cancelled
          ? `<span style="font-size:10.5px;font-weight:700;background:#e53935;color:#fff;padding:1px 6px;border-radius:4px">CANCELADA</span>`
          : sale ? `<span style="font-size:10.5px;font-weight:700;background:#16a34a;color:#fff;padding:1px 6px;border-radius:4px">COMPLETADA</span>`
          : `<span style="font-size:10.5px;font-weight:700;background:var(--accent);color:#fff;padding:1px 6px;border-radius:4px">ACTIVA</span>`;
        return `<div onclick="selectMovementTicket(${tn})"
          style="padding:10px 14px;border-bottom:1px solid var(--stone-pale);cursor:pointer;transition:background .1s;background:${sel?'var(--accent-mist)':'transparent'};border-left:3px solid ${sel?'var(--accent)':'transparent'}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
            <div style="display:flex;align-items:center;gap:6px">
              <span style="font-family:var(--mono);font-weight:800;font-size:14px;color:var(--accent-dark)">#${tn}</span>
              ${statusChip}
            </div>
            <span style="font-size:12px;color:var(--stone);font-family:var(--mono)">${lastTime}</span>
          </div>
          <div style="font-size:12.5px;color:var(--charcoal)">${esc(mesa)} · ${esc(waiter)}</div>
          <div style="font-size:12px;color:var(--stone);margin-top:1px">${mList.length} evento(s)</div>
        </div>`;
      }).join('');
  }

  const all = getSalesByDate(salesSelectedDate);
  const term = salesSearchTerm.toLowerCase();
  const filtered = term
    ? all.filter(s => String(s.ticketNumber).includes(term) || (s.waiter||'').toLowerCase().includes(term))
    : all;

  if (!filtered.length) {
    return `<div style="text-align:center;padding:40px 20px;color:var(--stone);font-size:14px">${term ? 'Sin resultados para la búsqueda' : 'Sin ventas registradas este día'}</div>`;
  }
  return filtered.map(s => {
    const sItems = Array.isArray(s.items) ? s.items : (typeof s.items === 'string' ? (() => { try { return JSON.parse(s.items); } catch { return []; } })() : []);
    const arts = sItems.reduce((sum, i) => sum + i.qty, 0);
    const hasPriceEdit = sItems.some(i => i.priceEdited);
    const sKey = s.id != null ? s.id : `tn-${s.ticketNumber}`;
    const sel = salesSelectedId != null && String(salesSelectedId) === String(sKey);
    const cancelled = s.status === 'Cancelado';
    const bgSel = cancelled ? '#fde8e8' : 'var(--accent-mist)';
    const bgNorm = cancelled ? '#fff5f5' : 'transparent';
    const borderSel = cancelled ? '#e53935' : 'var(--accent)';
    const borderNorm = cancelled ? '#ffcdd2' : 'transparent';
    return `<div onclick="selectSaleTicket('${sKey}')"
      style="border-bottom:1px solid var(--stone-pale);cursor:pointer;transition:background 0.1s;background:${sel?bgSel:bgNorm};border-left:3px solid ${sel?borderSel:borderNorm}">
      ${cancelled ? `<div style="background:#e53935;color:#fff;text-align:center;font-size:12px;font-weight:800;letter-spacing:2px;padding:3px 0">✕ CANCELADA</div>` : ''}
      ${(() => {
        const plat = salePlatform(s);
        if (!plat) return '';
        const info = DELIVERY_PLATFORMS[plat];
        return `<div class="sale-platform-band ${plat.toLowerCase()}">${esc(info.label.toUpperCase())} · deposita los ${info.depositDay}</div>`;
      })()}
      <div style="display:grid;grid-template-columns:38px 1fr auto 68px;align-items:center;gap:6px;padding:9px 14px">
        <span style="font-family:var(--mono);font-weight:700;font-size:12.5px;color:${cancelled?'#e53935':'var(--accent-dark)'}">#${s.ticketNumber}</span>
        <div>
          <div style="font-size:13.5px;font-weight:600;color:${cancelled?'#c62828':'var(--charcoal)'}${cancelled?';text-decoration:line-through':''}">${formatTime(s.completedAt)}${hasPriceEdit?` <span style="font-size:10px;font-weight:700;background:var(--amber);color:#fff;padding:1px 5px;border-radius:4px;vertical-align:middle">PRECIO ✎</span>`:''}</div>
          <div style="font-size:12px;color:var(--stone)">${esc(s.waiter)} · ${s.type==='llevar'?'Llevar':esc(s.mesa)}${(() => {
            const plat = salePlatform(s);
            return plat ? ` <span class="pay-badge ${plat.toLowerCase()}">${esc(plat)}</span>` : '';
          })()}</div>
        </div>
        <div style="text-align:center;font-size:12px;color:var(--stone)">${arts}<br><span style="font-size:11px">art.</span></div>
        <div style="text-align:right;font-family:var(--mono);font-weight:700;font-size:14px;color:${cancelled?'#e53935':'var(--charcoal)'}">$${fmt(s.total)}</div>
      </div>
    </div>`;
  }).join('');
}

function renderSalesDaySummaryHTML() {
  const sales = getSalesByDate(salesSelectedDate);
  const paid = sales.filter(s => s.status !== 'Cancelado');
  const cancelled = sales.filter(s => s.status === 'Cancelado');
  const total = paid.reduce((sum, s) => sum + s.total, 0);
  const arts = paid.reduce((sum, s) => {
    const si = Array.isArray(s.items) ? s.items : (typeof s.items === 'string' ? (() => { try { return JSON.parse(s.items); } catch { return []; } })() : []);
    return sum + si.reduce((a, i) => a + i.qty, 0);
  }, 0);
  return `<div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;flex-wrap:wrap;gap:4px">
    <span style="color:var(--stone)">${paid.length} venta(s) · ${arts} artículos${cancelled.length ? ` · <span style="color:#e53935">${cancelled.length} cancelada(s)</span>` : ''}</span>
    <span style="font-weight:700;color:var(--accent-dark);font-family:var(--mono)">$${fmt(total)} MXN</span>
  </div>`;
}

function renderSaleDetailHTML() {
  if (!salesSelectedId) return `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;color:var(--stone)">
      <svg width="52" height="52" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
      <span style="font-size:14px">Selecciona un ticket para ver el detalle</span>
    </div>`;
  const sale = state.salesRecords.find(s => {
    const sKey = s.id != null ? s.id : `tn-${s.ticketNumber}`;
    return String(sKey) === String(salesSelectedId);
  });
  if (!sale) return '';
  const saleItems = Array.isArray(sale.items) ? sale.items : (typeof sale.items === 'string' ? (() => { try { return JSON.parse(sale.items); } catch { return []; } })() : []);
  const salePayments = Array.isArray(sale.payments) ? sale.payments : (typeof sale.payments === 'string' ? (() => { try { return JSON.parse(sale.payments); } catch { return []; } })() : []);
  const dateStr = new Date(sale.completedAt).toLocaleDateString('es-MX', { day:'2-digit', month:'long', year:'numeric' });
  const cancelled = sale.status === 'Cancelado';
  return `<div style="padding:20px;position:relative;overflow:hidden">
    ${cancelled ? `
    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:1">
      <div style="transform:rotate(-35deg);font-size:72px;font-weight:900;color:rgba(229,57,53,0.13);letter-spacing:4px;white-space:nowrap;user-select:none">CANCELADO</div>
    </div>
    <div style="position:relative;z-index:2;background:#e53935;color:#fff;border-radius:var(--r);padding:11px 16px;margin-bottom:16px;display:flex;align-items:center;gap:10px">
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fff" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
      <div>
        <div style="font-size:15px;font-weight:800;letter-spacing:.5px">VENTA CANCELADA</div>
        <div style="font-size:12px;opacity:.85;margin-top:1px">Los productos fueron devueltos al inventario</div>
      </div>
    </div>` : ''}
    <div style="position:relative;z-index:2">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px">
      <div>
        <div style="font-size:20px;font-weight:800;color:${cancelled?'#e53935':'var(--charcoal)'}">Ticket #${sale.ticketNumber}</div>
        <div style="font-size:13.5px;color:var(--stone);margin-top:3px">${dateStr} · ${formatTime(sale.completedAt)}</div>
      </div>
      <div style="display:flex;align-items:center;gap:7px">
        ${(() => {
          const plat = salePlatform(sale);
          if (!plat) return '';
          const info = DELIVERY_PLATFORMS[plat];
          return `<span class="pay-badge ${plat.toLowerCase()}" title="${esc(info.label)} · deposita los ${info.depositDay}">${esc(plat)}</span>`;
        })()}
        <span class="badge ${sale.type==='llevar'?'badge-amber':'badge-green'}">${sale.type==='llevar'?'Para llevar':esc(sale.mesa)}</span>
      </div>
    </div>
    ${(() => {
      const plat = salePlatform(sale);
      if (!plat) return '';
      const info = DELIVERY_PLATFORMS[plat];
      return `<div class="sale-platform-note">
        Pedido por <strong>${esc(info.label)}</strong>. El dinero no entró a la caja:
        la plataforma deposita los <strong>${info.depositDay}</strong>.
      </div>`;
    })()}

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:18px">
      <div style="background:var(--accent-mist);border-radius:var(--r);padding:10px 12px">
        <div style="font-size:11px;color:var(--stone);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">Mesero</div>
        <div style="font-size:14px;font-weight:600;color:var(--charcoal)">${esc(sale.waiter)}</div>
      </div>
      <div style="background:var(--accent-mist);border-radius:var(--r);padding:10px 12px">
        <div style="font-size:11px;color:var(--stone);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">Comensales</div>
        <div style="font-size:14px;font-weight:600;color:var(--charcoal)">${sale.comensales||'—'}</div>
      </div>
      <div style="background:var(--accent-mist);border-radius:var(--r);padding:10px 12px">
        <div style="font-size:11px;color:var(--stone);text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px">Pago</div>
        <div style="font-size:14px;font-weight:600;color:var(--charcoal)">${esc(sale.paymentMethod||'Efectivo')}</div>
      </div>
    </div>

    <table class="data-table" style="margin-bottom:16px">
      <thead><tr><th style="width:40px">Cant.</th><th>Descripción</th><th style="text-align:right">Importe</th></tr></thead>
      <tbody>${saleItems.map(item => `
        <tr${item.priceEdited?' style="background:#fff8ec"':''}>
          <td style="font-family:var(--mono);font-weight:700;color:var(--accent-dark)">${item.qty}</td>
          <td>
            <span style="font-weight:500">${esc(item.name)}</span>
            ${item.variantLabel?`<div style="font-size:12px;color:var(--stone)">${esc(item.variantLabel)}</div>`:''}
            ${item.isCombo&&item.comboItems?.length?`<div style="font-size:12px;color:var(--stone);line-height:1.7">${item.comboItems.map(ci=>`• ${ci.qty}x ${esc(ci.name||'')}${ci.variantLabel?` (${esc(ci.variantLabel)})`:''}`).join('<br>')}</div>`:''}
            ${item.priceEdited?`<div style="font-size:12px;color:var(--amber);font-weight:700;margin-top:1px">⚑ ${priceEditLabel(item)}</div>`:''}
            ${item.notes?`<div style="font-size:12px;color:var(--accent-dark)">Nota: ${esc(item.notes)}</div>`:''}
          </td>
          <td style="font-family:var(--mono);font-weight:600;text-align:right;color:var(--charcoal)">
            ${item.priceEdited?`<div style="font-size:11.5px;color:var(--stone-light);text-decoration:line-through">$${fmt(item.originalPrice*item.qty)}</div>`:''}
            $${fmt(item.price*item.qty)}
          </td>
        </tr>`).join('')}
      </tbody>
    </table>

    ${sale.notes?`<div style="background:var(--accent-mist);border-radius:var(--r);padding:9px 12px;font-size:13.5px;margin-bottom:14px;color:var(--accent-dark)"><strong>Notas:</strong> ${esc(sale.notes)}</div>`:''}

    <div style="border-top:2px solid ${cancelled?'#ffcdd2':'var(--stone-pale)'};padding-top:14px;display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-size:22px;font-weight:800;color:${cancelled?'#e53935':'var(--charcoal)'}">$${fmt(sale.total)} MXN</div>
        <div style="font-size:12.5px;color:var(--stone);margin-top:2px">${saleItems.reduce((s,i)=>s+i.qty,0)} artículo(s)${cancelled?' · Cancelada':''}</div>
      </div>
      ${!cancelled ? `<div style="display:flex;gap:7px"><button class="btn btn-secondary btn-sm" onclick="reimprimirVenta(${sale.id})">
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a1 1 0 001-1v-4H8v4a1 1 0 001 1zm1-11V5a1 1 0 011-1h2a1 1 0 011 1v1M9 7h6"/></svg>
        Imprimir ticket
      </button><button class="btn btn-danger btn-sm" onclick="confirmarCancelarVenta(${sale.id})">
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
        Cancelar venta
      </button></div>` : ''}
    </div>

    ${!cancelled && (salePayments.length || sale.change > 0) ? `
    <div style="margin-top:14px;background:var(--surface-alt);border-radius:var(--r);padding:11px 14px;font-size:13.5px">
      <div style="font-size:11px;color:var(--stone);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Detalle de pago</div>
      ${salePayments.length
        ? salePayments.map(p => `<div style="display:flex;justify-content:space-between;margin-bottom:3px"><span>${esc(p.method)}</span><span style="font-family:var(--mono)">$${fmt(p.amount)}</span></div>`).join('')
        : `<div style="display:flex;justify-content:space-between;margin-bottom:3px"><span>${esc(sale.paymentMethod||'Efectivo')}</span><span style="font-family:var(--mono)">$${fmt(sale.total)}</span></div>`}
      ${sale.amountReceived ? `<div style="display:flex;justify-content:space-between;margin-bottom:3px;color:var(--stone)"><span>Recibido (efectivo)</span><span style="font-family:var(--mono)">$${fmt(sale.amountReceived)}</span></div>` : ''}
      ${sale.change > 0 ? `<div style="display:flex;justify-content:space-between;font-weight:800;color:var(--accent-dark);border-top:1px dashed var(--stone-pale);padding-top:5px;margin-top:4px"><span>Cambio</span><span style="font-family:var(--mono)">$${fmt(sale.change)}</span></div>` : ''}
    </div>` : ''}
  </div></div>`;
}

function setSalesDate(dateStr) {
  if (!dateStr) return;
  salesSelectedDate = dateStr;
  salesSelectedId = null;
  document.querySelector('[type="date"]') && (document.querySelector('[type="date"]').value = dateStr);
  const listEl = document.getElementById('salesListPanel');
  if (listEl) listEl.innerHTML = renderSalesListHTML();
  const sumEl = document.getElementById('salesDaySummary');
  if (sumEl) sumEl.innerHTML = renderSalesDaySummaryHTML();
  const detEl = document.getElementById('saleDetailPanel');
  if (detEl) detEl.innerHTML = renderSaleDetailHTML();
}

function setSalesSearch(term) {
  salesSearchTerm = term;
  const listEl = document.getElementById('salesListPanel');
  if (listEl) listEl.innerHTML = renderSalesListHTML();
}

function selectSaleTicket(key) {
  salesSelectedId = key;
  const listEl = document.getElementById('salesListPanel');
  if (listEl) listEl.innerHTML = renderSalesListHTML();
  const detEl = document.getElementById('saleDetailPanel');
  if (detEl) detEl.innerHTML = renderSaleDetailHTML();
}

function setSalesTab(tab) {
  salesTab = tab;
  salesSelectedId = null;
  movementsSelectedTicket = null;
  navigateTo('sales');
}

function selectMovementTicket(tn) {
  movementsSelectedTicket = tn;
  const listEl = document.getElementById('salesListPanel');
  if (listEl) listEl.innerHTML = renderSalesListHTML();
  const detEl = document.getElementById('saleDetailPanel');
  if (detEl) detEl.innerHTML = renderMovementDetailHTML();
}

function renderMovementDetailHTML() {
  if (movementsSelectedTicket == null) return `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;color:var(--stone)">
      <svg width="52" height="52" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
      <span style="font-size:14px">Selecciona una comanda para ver su historial</span>
    </div>`;

  const tn = movementsSelectedTicket;
  const movs = salesMovements.filter(m => getMovementTicketNumber(m) === tn)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // Get comanda product list from the most detailed movement (create_order or cancel_order)
  let comandaItems = [];
  let comandaMeta = { mesa: '—', type: '—', waiter: '—' };
  const createMov = movs.find(m => m.type === 'create_order');
  const cancelMov = movs.find(m => m.type === 'cancel_order');
  const refMov = cancelMov || createMov;
  if (refMov?.data) {
    try {
      const d = JSON.parse(refMov.data);
      comandaItems = Array.isArray(d.items) ? d.items : [];
      comandaMeta = { mesa: d.mesa || '—', type: d.type || '—', waiter: refMov.user };
    } catch {}
  }
  // Also check latest edit for final state
  const edits = movs.filter(m => m.type === 'edit_order');
  if (edits.length) {
    try {
      const lastEdit = edits[edits.length - 1];
      const d = JSON.parse(lastEdit.data);
      if (Array.isArray(d.newItems)) comandaItems = d.newItems;
    } catch {}
  }

  const isCancelled = !!cancelMov;
  const sale = state.salesRecords.find(s => s.ticketNumber === tn);
  const statusLabel = isCancelled ? 'CANCELADA' : (sale ? 'COMPLETADA' : 'ACTIVA');
  const statusColor = isCancelled ? '#e53935' : (sale ? '#16a34a' : 'var(--accent)');

  const typeLabel = { cancel_order: 'Cancelación', delete_sale: 'Eliminación', create_order: 'Apertura de comanda', edit_order: 'Edición guardada', comanda_action: 'Cambio en producto', adjust_stock: 'Ajuste de stock' };
  const typeColor = { cancel_order: '#e53935', delete_sale: '#e53935', create_order: '#16a34a', edit_order: '#f59e0b', comanda_action: '#7c3aed' };
  const typeIcon = {
    create_order: '<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>',
    cancel_order: '<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>',
    edit_order: '<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
    comanda_action: '<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>',
  };

  const eventsHTML = movs.map((m, i) => {
    const color = typeColor[m.type] || 'var(--stone)';
    const icon = typeIcon[m.type] || '';
    let detailHTML = '';
    if (m.data) {
      try {
        const d = JSON.parse(m.data);
        if (m.type === 'edit_order' && d.previousItems && d.newItems) {
          const added = d.newItems.filter(n => !d.previousItems.find(p => p.id === n.id));
          const removed = d.previousItems.filter(p => !d.newItems.find(n => n.id === p.id));
          const changed = d.newItems.filter(n => { const p = d.previousItems.find(pr => pr.id === n.id); return p && p.qty !== n.qty; });
          const rows = [
            ...added.map(i => `<div style="color:#16a34a">+ ${i.qty}x ${esc(i.name)}</div>`),
            ...removed.map(i => `<div style="color:#e53935">− ${i.qty}x ${esc(i.name)}</div>`),
            ...changed.map(i => { const p = d.previousItems.find(pr => pr.id === i.id); return `<div style="color:#f59e0b">~ ${esc(i.name)}: ${p.qty}→${i.qty}</div>`; }),
          ];
          if (rows.length) detailHTML = `<div style="font-size:12.5px;margin-top:4px;padding:5px 8px;background:var(--surface-alt);border-radius:5px;line-height:1.8">${rows.join('')}</div>`;
        } else if (m.type === 'create_order' && Array.isArray(d.items)) {
          detailHTML = `<div style="font-size:12.5px;color:var(--stone);margin-top:3px">${d.items.map(i => `${i.qty}x ${esc(i.name)}`).join(' · ')}</div>`;
        }
      } catch {}
    }
    const isLast = i === movs.length - 1;
    return `<div style="display:flex;gap:10px;padding-bottom:${isLast?'0':'16px'}">
      <div style="display:flex;flex-direction:column;align-items:center;gap:0">
        <div style="width:28px;height:28px;border-radius:50%;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0">${icon}</div>
        ${!isLast ? `<div style="width:2px;flex:1;background:var(--stone-pale);margin:3px 0"></div>` : ''}
      </div>
      <div style="flex:1;padding-top:4px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <span style="font-size:13.5px;font-weight:700;color:${color}">${esc(typeLabel[m.type] || m.type)}</span>
          <span style="font-size:12px;color:var(--stone);font-family:var(--mono)">${formatTime(m.timestamp)}</span>
        </div>
        <div style="font-size:13px;color:var(--charcoal);margin-top:1px">${esc(m.description)}</div>
        ${detailHTML}
        <div style="font-size:12px;color:var(--stone-light);margin-top:3px">${esc(m.user)}</div>
      </div>
    </div>`;
  }).join('');

  return `<div style="padding:20px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div>
        <div style="font-size:20px;font-weight:800;color:var(--charcoal)">Comanda #${tn}</div>
        <div style="font-size:13.5px;color:var(--stone);margin-top:2px">${esc(comandaMeta.mesa)} · ${esc(comandaMeta.waiter)}</div>
      </div>
      <span style="font-size:12px;font-weight:700;background:${statusColor};color:#fff;padding:4px 10px;border-radius:var(--r)">${statusLabel}</span>
    </div>

    ${comandaItems.length ? `
    <div style="background:var(--accent-mist);border-radius:var(--r);padding:12px 14px;margin-bottom:18px">
      <div style="font-size:11.5px;font-weight:700;color:var(--accent-dark);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Productos en la comanda</div>
      ${comandaItems.map(i => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid rgba(0,0,0,.05)">
          <div>
            <span style="font-size:14px;font-weight:600;color:var(--charcoal)">${esc(i.name)}</span>
            ${i.variantLabel ? `<span style="font-size:12px;color:var(--stone)"> · ${esc(i.variantLabel)}</span>` : ''}
            ${i.priceEdited ? `<div style="font-size:12px;color:var(--amber);font-weight:700;margin-top:1px">⚑ ${priceEditLabel(i)}</div>` : ''}
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:13px;color:var(--stone)">${i.qty}x</span>
            <span style="font-family:var(--mono);font-size:13.5px;font-weight:600;color:var(--charcoal)">$${fmt(i.price * i.qty)}</span>
          </div>
        </div>`).join('')}
    </div>` : ''}

    <div style="font-size:12px;font-weight:700;color:var(--stone);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">Historial de eventos</div>
    <div>${eventsHTML}</div>
  </div>`;
}

async function loadSalesMovements() {
  try {
    const res = await fetch('/api/movements');
    salesMovements = await res.json();
    if (salesTab === 'movements') {
      const listEl = document.getElementById('salesListPanel');
      if (listEl) listEl.innerHTML = renderSalesListHTML();
      const detEl = document.getElementById('saleDetailPanel');
      if (detEl) detEl.innerHTML = renderMovementDetailHTML();
    }
  } catch (e) {
    salesMovements = [];
  }
}

function exportSales() {
  if (!salesSelectedDate) salesSelectedDate = toLocalDateStr(new Date());
  const sales = getSalesByDate(salesSelectedDate);
  if (!sales.length) { showToast('No hay ventas para exportar', 'error'); return; }
  const rows = [
    ['Ticket','Fecha','Hora','Tipo','Mesa','Comensales','Mesero','Metodo','Articulos','Total'],
    ...sales.map(s => [
      s.ticketNumber,
      salesSelectedDate,
      formatTime(s.completedAt),
      s.type,
      s.mesa,
      s.comensales,
      s.waiter,
      s.paymentMethod||'Efectivo',
      s.items.reduce((sum,i)=>sum+i.qty,0),
      s.total,
    ]),
  ];
  const csv = rows.map(r => r.map(c => `"${String(c||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  downloadTextFile(`ventas-${salesSelectedDate}.csv`, csv, 'text/csv;charset=utf-8');
  showToast('Reporte exportado', 'success');
}

// Las ventas NO se eliminan: se cancelan y el ticket queda en el historial.
// Asi siempre hay rastro de lo que paso y no se presta a desaparecer dinero.
function confirmarCancelarVenta(id) {
  const venta = state.salesRecords.find(s => s.id === id);
  if (!venta) return;
  openConfirmModal({
    title: `¿Cancelar la venta #${venta.ticketNumber}?`,
    message: `Son $${fmt(venta.total)}. El ticket NO se borra: queda marcado como cancelado en el historial y en los reportes, con tu nombre y la hora.`,
    confirmText: 'Sí, cancelar la venta',
    cancelText: 'No, regresar',
    danger: true,
    onConfirm: () => cancelSale(id),
  });
}

async function cancelSale(id) {
  try {
    const res = await fetch(`/api/sales/${id}/cancelar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: currentUser.name }),
    });
    if (!res.ok) throw new Error(await apiError(res));
    const venta = state.salesRecords.find(s => s.id === id);
    if (venta) {
      venta.status = 'Cancelado';
      // Los productos regresan al inventario, igual que al cancelar una comanda.
      const items = Array.isArray(venta.items) ? venta.items
        : (typeof venta.items === 'string' ? (() => { try { return JSON.parse(venta.items); } catch { return []; } })() : []);
      items.forEach((item) => {
        const product = productById(item.id);
        if (product) product.stock += item.qty;
      });
    }
    const listEl = document.getElementById('salesListPanel');
    if (listEl) listEl.innerHTML = renderSalesListHTML();
    const sumEl = document.getElementById('salesDaySummary');
    if (sumEl) sumEl.innerHTML = renderSalesDaySummaryHTML();
    const detEl = document.getElementById('saleDetailPanel');
    if (detEl) detEl.innerHTML = renderSaleDetailHTML();
    showToast('Venta cancelada; el ticket queda en el historial', 'success');
  } catch (error) {
    console.error('Error cancelling sale:', error);
    showToast(error.message || 'Error al cancelar la venta', 'error');
  }
}

// ===================== SETTINGS =====================
function buildSettings() {
  const isOwner = currentUser.role === 'owner';
  const ownerSettings = isOwner ? `
    <div class="chart-card" style="padding:18px;margin-bottom:13px">
      <div class="chart-title">Personalizacion de tienda</div>
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
        <div style="width:68px;height:68px;border-radius:12px;background:var(--accent-mist);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0">${state.settings.logoDataUrl ? `<img src="${state.settings.logoDataUrl}" alt="Logo" style="width:100%;height:100%;object-fit:cover">` : renderBrandMarkMarkup(32)}</div>
        <div style="flex:1">
          <div class="form-group" style="margin-bottom:8px">
            <label class="form-label">Logo de la tienda</label>
            <input class="form-input" type="file" id="setting-logo-file" accept="image/*" onchange="handleLogoUpload(event)">
          </div>
          ${state.settings.logoDataUrl ? `<button class="btn btn-secondary btn-sm" onclick="removeStoreLogo()">Quitar logo</button>` : ''}
        </div>
      </div>
      <div class="form-group"><label class="form-label">Nombre</label><input class="form-input" id="setting-nombre" value="${esc(state.settings.restaurantName)}"></div>
      <div class="form-group"><label class="form-label">RFC</label><input class="form-input" id="setting-rfc" value="${esc(state.settings.rfc)}"></div>
      <div style="display:flex;justify-content:flex-end;margin-top:4px">
        <button class="btn btn-primary btn-sm" onclick="saveSettings('restaurant')">Guardar</button>
      </div>
    </div>
    <div class="chart-card" style="padding:18px;margin-bottom:13px">
      <div class="chart-title">Modificar ticket</div>
      <div class="form-group"><label class="form-label">Nombre del restaurante</label><input class="form-input" id="setting-ticket-name" value="${esc(state.settings.restaurantName)}"></div>
      <div class="form-group"><label class="form-label">Direccion</label><input class="form-input" id="setting-direccion" value="${esc(state.settings.address)}"></div>
      <div class="form-group"><label class="form-label">Telefono</label><input class="form-input" id="setting-phone" value="${esc(state.settings.phone || '')}" placeholder="Ej. 614 123 4567"></div>
      <div class="form-group"><label class="form-label">Pie de pagina</label><input class="form-input" id="setting-ticket-footer" value="${esc(state.settings.ticketFooter)}"></div>
      <div style="font-size:13px;color:var(--stone);margin-bottom:10px">El ticket usara automaticamente el logo actual de la tienda si ya fue cargado.</div>
      <div style="display:flex;justify-content:flex-end;margin-top:4px">
        <button class="btn btn-primary btn-sm" onclick="saveSettings('ticket')">Guardar</button>
      </div>
    </div>
    <div class="chart-card" style="padding:18px;margin-bottom:13px">
      <div class="chart-title">Impresion y operacion</div>
      <div class="form-group"><label class="form-label">Moneda</label><input class="form-input" id="setting-currency" value="${esc(state.settings.currency)}"></div>
      <div style="display:flex;justify-content:flex-end;margin-top:4px">
        <button class="btn btn-primary btn-sm" onclick="saveSettings('printing')">Guardar</button>
      </div>
    </div>
    ${settingsPrintCardsHtml()}
    ${settingsLicenseCardsHtml()}
    <div class="chart-card" style="padding:18px;margin-bottom:13px">
      <div class="chart-title">Respaldos</div>
      <p style="font-size:14px;color:var(--stone);margin-bottom:10px">El sistema crea un respaldo automatico cada hora y al arrancar. Manten las ultimas 30 copias.</p>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <button class="btn btn-primary btn-sm" onclick="createBackupNow()">Crear respaldo ahora</button>
        <button class="btn btn-secondary btn-sm" onclick="loadBackups()">Actualizar lista</button>
      </div>
      <div id="backup-list" style="max-height:280px;overflow-y:auto;border:1px solid var(--accent-mist);border-radius:8px;padding:6px"></div>
    </div>
  ` : '';

  const passwordSection = `
    <div class="chart-card" style="padding:18px;margin-bottom:13px">
      <div class="chart-title">Seguridad</div>
      <div class="form-group">
        <label class="form-label">Contrasena</label>
        <p style="font-size:14px;color:var(--stone);margin-bottom:10px">Actualiza tu acceso sin salir del sistema.</p>
        <button class="btn btn-secondary" onclick="openChangePasswordModal()">Cambiar contrasena</button>
      </div>
    </div>
  `;

  if (!isOwner) {
    return `<div style="max-width:580px">
      <div class="page-header"><h2>Configuracion</h2></div>
      ${passwordSection}
    </div>`;
  }

  return `<div style="max-width:580px">
    <div class="page-header"><h2>Configuracion del Sistema</h2></div>
    ${ownerSettings}
    ${passwordSection}
  </div>`;
}

async function saveSettings(section) {
  if (section === 'restaurant') {
    const restaurantName = document.getElementById('setting-nombre').value.trim();
    const rfc = document.getElementById('setting-rfc').value.trim();
    if (!restaurantName) {
      showToast('El nombre del restaurante es obligatorio', 'error');
      return;
    }
    state.settings.restaurantName = restaurantName;
    state.settings.rfc = rfc;
    syncBranding();
  }
  if (section === 'ticket') {
    const ticketName = document.getElementById('setting-ticket-name').value.trim();
    if (!ticketName) {
      showToast('El nombre del restaurante es obligatorio', 'error');
      return;
    }
    state.settings.restaurantName = ticketName;
    state.settings.address = document.getElementById('setting-direccion').value.trim();
    state.settings.phone = document.getElementById('setting-phone').value.trim();
    state.settings.ticketFooter = document.getElementById('setting-ticket-footer').value.trim();
    syncBranding();
  }
  if (section === 'printing') {
    state.settings.currency = document.getElementById('setting-currency').value.trim();
  }
  if (section === 'printers') {
    state.settings.kitchenPrinter = document.getElementById('setting-kitchen-printer').value.trim();
    state.settings.cashPrinter = document.getElementById('setting-cash-printer').value.trim();
  }
  try {
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.settings)
    });
    showToast('Configuracion guardada', 'success');
    navigateTo('settings');
  } catch (error) {
    console.error('Error saving settings:', error);
    showToast('Error al guardar configuracion', 'error');
  }
}

async function loadBackups() {
  const container = document.getElementById('backup-list');
  if (!container) return;
  try {
    const res = await fetch('/api/backups');
    const backups = await res.json();
    if (!backups.length) {
      container.innerHTML = '<div style="padding:14px;text-align:center;color:var(--stone);font-size:14px">Aun no hay respaldos.</div>';
      return;
    }
    container.innerHTML = backups.map(b => {
      const d = new Date(b.mtime);
      const dateStr = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
      const sizeKb = Math.round(b.size / 1024);
      return `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-bottom:1px solid var(--accent-mist)">
        <div>
          <div style="font-size:14px;font-weight:500">${dateStr}</div>
          <div style="font-size:12px;color:var(--stone)">${esc(b.name)} - ${sizeKb} KB</div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="restoreBackup('${esc(b.name)}')">Restaurar</button>
      </div>`;
    }).join('');
  } catch (error) {
    container.innerHTML = '<div style="padding:14px;text-align:center;color:var(--coral);font-size:14px">Error al cargar respaldos.</div>';
  }
}

async function createBackupNow() {
  try {
    const res = await fetch('/api/backups/now', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      showToast('Respaldo creado: ' + data.name, 'success');
      loadBackups();
    } else {
      showToast(data.error || 'No se pudo crear el respaldo', 'error');
    }
  } catch (error) {
    showToast('Error al crear respaldo', 'error');
  }
}

async function restoreBackup(name) {
  if (!confirm(`¿Restaurar el respaldo ${name}?\n\nFoodPoint se reiniciará solo con los datos de ese respaldo.\n\nAntes se crea un respaldo del estado actual.`)) return;
  try {
    const res = await fetch('/api/backups/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Respaldo restaurado. FoodPoint se está reiniciando…', 'success');
    } else {
      showToast(data.error || 'No se pudo restaurar', 'error');
    }
  } catch (error) {
    showToast('FoodPoint se está reiniciando…', 'success');
  }
}

async function handleLogoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  // Antes se guardaba el archivo tal cual: una foto de celular no cabia en la
  // peticion y el logo se perdia sin aviso. Ahora pasa por el mismo compresor.
  const previous = state.settings.logoDataUrl;
  try {
    state.settings.logoDataUrl = await processImageFile(file);
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.settings)
    });
    if (!res.ok) throw new Error(await apiError(res));
    syncBranding();
    showToast('Logo actualizado', 'success');
    navigateTo('settings');
  } catch (error) {
    state.settings.logoDataUrl = previous;
    console.error('Error saving logo:', error);
    showToast(error.message || 'Error al guardar logo', 'error');
    event.target.value = '';
  }
}

async function removeStoreLogo() {
  state.settings.logoDataUrl = '';
  try {
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.settings)
    });
    syncBranding();
    showToast('Logo eliminado', 'success');
    navigateTo('settings');
  } catch (error) {
    console.error('Error removing logo:', error);
    showToast('Error al eliminar logo', 'error');
  }
}

// ===================== CHANGE PASSWORD =====================
function openChangePasswordModal() {
  resetPasswordForm();
  openModal('changePasswordModal');
}

function resetPasswordForm() {
  document.getElementById('cpCurrent').value = '';
  document.getElementById('cpNew').value = '';
  document.getElementById('cpConfirm').value = '';
  document.getElementById('passwordErr').style.display = 'none';
  document.getElementById('passwordErr').textContent = '';
}

async function confirmChangePassword() {
  const current = document.getElementById('cpCurrent').value.trim();
  const next = document.getElementById('cpNew').value.trim();
  const confirm = document.getElementById('cpConfirm').value.trim();
  const error = document.getElementById('passwordErr');

  if (!current || !next || !confirm) {
    error.textContent = 'Completa todos los campos';
    error.style.display = 'block';
    return;
  }
  if (next.length < 6) {
    error.textContent = 'La contrasena debe tener al menos 6 caracteres';
    error.style.display = 'block';
    return;
  }
  if (next !== confirm) {
    error.textContent = 'Las contrasenas no coinciden';
    error.style.display = 'block';
    return;
  }

  const account = getAccountByEmail(currentUser.email);
  if (!account || account.pass !== current) {
    error.textContent = 'La contrasena actual es incorrecta';
    error.style.display = 'block';
    return;
  }
  if (next === current) {
    error.textContent = 'La nueva contrasena debe ser diferente';
    error.style.display = 'block';
    return;
  }

  try {
    if (currentUser.role === 'owner') {
      state.owner.pass = next;
      await fetch(`/api/users/${state.owner.id || 1}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...state.owner, pass: next })
      });
    } else {
      const employee = getEmployeeByEmail(currentUser.email);
      if (!employee) return;
      employee.pass = next;
      await fetch(`/api/users/${employee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      });
    }
    closeModal('changePasswordModal');
    resetPasswordForm();
    showToast('Contrasena actualizada correctamente', 'success');
  } catch (error) {
    console.error('Error changing password:', error);
    showToast('Error al cambiar contrasena', 'error');
  }
}

// ===================== SEARCH =====================
function doGlobalSearch(value) {
  const grid = document.getElementById('menuGrid');
  if (grid) {
    grid.innerHTML = renderMenuItems(value);
    grid.scrollTop = 0;
    return;
  }
  if (!value || value.length < 2) {
    closeModal('searchModal');
    return;
  }
  const results = state.products.filter((product) => (
    product.name.toLowerCase().includes(value.toLowerCase())
    || product.cat.toLowerCase().includes(value.toLowerCase())
  ));
  document.getElementById('searchCount').textContent = `${results.length} resultado(s) para "${value}"`;
  document.getElementById('searchGrid').innerHTML = results.length
    ? results.map((product) => `<div class="menu-item">
        <div class="mi-icon">${categorySvg(product.cat)}</div>
        <div class="mi-name">${esc(product.name)}</div>
        <div class="mi-price">$${fmt(product.price)} MXN</div>
        <div class="mi-stock">${esc(product.cat)}</div>
      </div>`).join('')
    : `<div style="grid-column:1/-1;text-align:center;padding:20px;color:var(--stone)">Sin resultados</div>`;
  openModal('searchModal');
}

// ===================== COMMON =====================
function restricted() {
  return `<div class="restricted-page">
    <div class="restricted-icon"><svg width="52" height="52" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2"><rect x="3" y="11" width="18" height="11" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M7 11V7a5 5 0 0110 0v4"/></svg></div>
    <h3>Acceso restringido</h3>
    <p>Esta seccion es exclusiva para propietarios del restaurante.</p>
  </div>`;
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal-overlay')) {
    // Los modales estaticos (con id) se ocultan; los flotantes (sin id) se eliminan
    // por completo para que nunca queden "pegados" bloqueando la app.
    if (event.target.id) event.target.classList.remove('open');
    else event.target.remove();
  }
});

// Red de seguridad: la tecla Escape SIEMPRE cierra cualquier ventana emergente abierta.
// Si por cualquier motivo una ventana quedara encima bloqueando la escritura o los clics,
// el usuario puede recuperarse al instante presionando Escape.
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const floating = document.querySelectorAll('.modal-overlay:not([id])');
  if (floating.length) { floating.forEach((el) => el.remove()); return; }
  document.querySelectorAll('.modal-overlay.open[id]').forEach((el) => el.classList.remove('open'));
});

// Al cambiar el tamano de la ventana cambia cuanto cabe en el ticket:
// recalcular el aviso de "hay mas productos abajo".
window.addEventListener('resize', updateScrollHint);

function showToast(message, type) {
  const container = document.getElementById('toastCt');
  const toast = document.createElement('div');
  toast.className = `toast ${type || ''}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function startClock() {
  if (clockTimer) clearInterval(clockTimer);
  function tick() {
    const element = document.getElementById('clockEl');
    if (element) {
      element.textContent = new Date().toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }
  }
  tick();
  clockTimer = setInterval(tick, 1000);
}

// ===================== BOOT =====================
document.addEventListener('DOMContentLoaded', async () => {
  await loadDataFromAPI();
  fillAccount(state.owner.email || 'admin@foodpoint.mx', state.owner.pass || 'admin123');
  avisoNuevoNombre();
});

// ===================== ATAJOS DE TECLADO (estilo Eleventa) =====================
// La idea es no soltar el teclado durante el servicio. Las teclas de funcion
// trabajan siempre, incluso escribiendo en un recuadro, porque no chocan con
// la captura de texto.
// 'corto' es la etiqueta de la barra fija de abajo; los que no lo traen solo
// salen en la ayuda completa (F10).
const ATAJOS = [
  { tecla: 'F1',  corto: 'Cobrar + ticket',  desc: 'Cobrar e imprimir ticket',   donde: 'En el cobro' },
  { tecla: 'F2',  corto: 'Cobrar s/ ticket', desc: 'Cobrar sin ticket',          donde: 'En el cobro' },
  { tecla: 'F3',  corto: 'Buscar',           desc: 'Buscar producto',            donde: 'En Inicio' },
  { tecla: 'F4',  corto: 'Dashboard',        desc: 'Dashboard',                  donde: 'Siempre' },
  { tecla: 'F5',  corto: 'Comandas',         desc: 'Comandas',                   donde: 'Siempre' },
  { tecla: 'F6',  corto: 'Ticket nuevo',     desc: 'Ticket nuevo',               donde: 'Siempre' },
  { tecla: 'F7',  corto: 'A cocina',         desc: 'Enviar comanda a cocina',    donde: 'En Inicio' },
  { tecla: 'F8',  corto: 'Ventas',           desc: 'Ventas del día',             donde: 'Siempre' },
  { tecla: 'F9',  corto: 'Reportes',         desc: 'Reportes',                   donde: 'Siempre' },
  { tecla: 'F10', corto: 'Ayuda',            desc: 'Ver todos los atajos',       donde: 'Siempre' },
  { tecla: 'F12', corto: 'Cobrar',           desc: 'Cobrar',                     donde: 'Siempre' },
  { tecla: 'Esc', desc: 'Cerrar la ventana abierta',  donde: 'Siempre' },
  { tecla: 'Ctrl + / −', desc: 'Agrandar o achicar todo', donde: 'App de escritorio' },
];

// Barra fija del pie: la guia de las teclas F siempre a la vista, como en Eleventa.
function renderBarraAtajos() {
  const barra = document.getElementById('fkeyBar');
  if (!barra) return;
  barra.innerHTML = ATAJOS.filter(a => a.corto).map(a => `
    <button type="button" class="fkey" onclick="ejecutarAtajo('${a.tecla}')" title="${esc(a.desc)}">
      <span class="fkey-tecla">${esc(a.tecla)}</span>
      <span class="fkey-txt">${esc(a.corto)}</span>
    </button>`).join('');
}

function appListaParaAtajos() {
  const app = document.getElementById('app');
  // Con la pantalla de activacion encima no debe correr ningun atajo.
  return !!currentUser && app && !app.classList.contains('hidden') && !document.getElementById('licenseGate');
}

function modalDeCobroAbierto() {
  return !!document.getElementById('paymentModal');
}

// Busca la comanda que toca cobrar: la que se este viendo o la primera pendiente.
function comandaParaCobrar() {
  if (!state.commandas.length) return null;
  // 1) la que este seleccionada en pantalla, 2) la que se esta editando,
  // 3) la primera de la cola.
  const elegida = typeof comandaSeleccionada === 'function' ? comandaSeleccionada() : null;
  if (elegida) return elegida;
  if (editingComandaId != null) {
    const enEdicion = state.commandas.find(c => c.ticketNumber === editingComandaId);
    if (enEdicion) return enEdicion;
  }
  return comandasEnOrden()[0];
}

// F12 / "Cobrar": si el ticket en curso todavia no se manda a cocina, avisa; si ya
// hay comandas, abre el cobro de la que toca.
function atajoCobrar() {
  if (modalDeCobroAbierto()) return;
  const comanda = comandaParaCobrar();
  if (!comanda) {
    showToast(currentOrder.items.length
      ? 'Primero envía la comanda a cocina (F7)'
      : 'No hay comandas para cobrar', 'error');
    return;
  }
  navigateTo('comandas');
  openPaymentModal(comanda.id);
}

function atajoBuscar() {
  navigateTo('pos');
  const input = document.getElementById('gSearch');
  if (input) { input.focus(); input.select(); }
}

function cerrarVentanaArriba() {
  const abiertos = [...document.querySelectorAll('.modal-overlay.open')];
  if (!abiertos.length) return false;
  const ultimo = abiertos[abiertos.length - 1];
  if (ultimo.id && document.getElementById(ultimo.id)?.classList.contains('open') && !ultimo.dataset.modalType) {
    // Modales fijos del HTML: se ocultan, no se borran.
    if (['productModal', 'ticketModal', 'productConfigModal'].includes(ultimo.id)) {
      if (ultimo.id === 'productConfigModal') closeProductConfigModal();
      else closeModal(ultimo.id);
      return true;
    }
  }
  ultimo.remove();
  if (ultimo.id === 'paymentModal') paymentDraft = null;
  return true;
}

function manejarAtajos(e) {
  if (!appListaParaAtajos()) return;
  const tecla = e.key;

  if (tecla === 'Escape') {
    if (cerrarVentanaArriba()) e.preventDefault();
    return;
  }
  if (!/^F([1-9]|1[0-2])$/.test(tecla)) return;
  // Con Ctrl/Alt/Shift se dejan pasar, por si Windows las usa.
  if (e.ctrlKey || e.altKey || e.shiftKey) return;

  if (!ACCIONES_ATAJOS[tecla]) return;
  e.preventDefault();   // evita recargar (F5) o abrir ayuda del navegador (F1)
  // En Comandas, cualquier tecla F agarra el primer ticket de la cola si no
  // habia ninguno elegido, para empezar a trabajar en orden.
  if (enPaginaComandas()) asegurarComandaSeleccionada();
  ejecutarAtajo(tecla);
}

const ACCIONES_ATAJOS = {
  F1: () => { if (modalDeCobroAbierto()) confirmPayment(true); else showToast('F1 cobra e imprime; abre el cobro con F12', 'error'); },
  F2: () => { if (modalDeCobroAbierto()) confirmPayment(false); else showToast('F2 cobra sin ticket; abre el cobro con F12', 'error'); },
  F3: atajoBuscar,
  F4: () => navigateTo('dashboard'),
  F5: () => navigateTo('comandas'),
  F6: () => { navigateTo('pos'); newTicket(); },
  F7: () => { navigateTo('pos'); sendComanda(); },
  F8: () => navigateTo('sales'),
  F9: () => navigateTo('reports'),
  F10: mostrarAtajos,
  F12: atajoCobrar,
};

// La barra de abajo tambien se puede tocar con el mouse.
function ejecutarAtajo(tecla) {
  const accion = ACCIONES_ATAJOS[tecla];
  if (accion) accion();
}

// Ayuda rapida con la lista de atajos (F10 o el boton del pie de pagina).
function mostrarAtajos() {
  if (document.getElementById('atajosModal')) { document.getElementById('atajosModal').remove(); return; }
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'atajosModal';
  overlay.innerHTML = `<div class="modal" style="width:520px;max-width:94vw">
    <div class="modal-header">
      <h3>Atajos de teclado</h3>
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
    </div>
    <div class="modal-body" style="padding:6px 20px 18px">
      <table class="atajos-tabla">
        <tbody>${ATAJOS.map(a => `<tr>
          <td><kbd>${esc(a.tecla)}</kbd></td>
          <td>${esc(a.desc)}</td>
          <td class="atajo-donde">${esc(a.donde)}</td>
        </tr>`).join('')}</tbody>
      </table>
    </div>
  </div>`;
  document.body.appendChild(overlay);
}

document.addEventListener('keydown', manejarAtajos);

// ===================== NAVEGACION CON FLECHAS Y ENTER =====================
// La idea es poder trabajar sin mouse: en Comandas se mueve la seleccion entre
// tickets y Enter cobra; dentro de las ventanas, las flechas recorren los botones
// y Enter elige (los <button> ya responden a Enter por si solos).

let comandaSelId = null;

function comandasEnOrden() {
  return [...state.commandas].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

// La comanda seleccionada, o la primera de la cola si la que estaba ya se cobro.
function comandaSeleccionada() {
  const lista = comandasEnOrden();
  if (!lista.length) { comandaSelId = null; return null; }
  return lista.find(c => c.id === comandaSelId) || null;
}

function seleccionarComanda(id, repintar = true) {
  comandaSelId = id;
  if (!repintar) return;
  pintarSeleccionComanda();
}

// Marca la tarjeta elegida sin repintar toda la pagina (no parpadea).
function pintarSeleccionComanda() {
  const tarjetas = document.querySelectorAll('.comanda-card[data-comanda-id]');
  tarjetas.forEach((t) => {
    const esta = Number(t.dataset.comandaId) === comandaSelId;
    t.classList.toggle('seleccionada', esta);
    if (esta) t.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
}

// Mueve la seleccion siguiendo la flecha tal como se ven las tarjetas en pantalla:
// izquierda/derecha dentro de la fila, arriba/abajo cambia de fila.
function moverSeleccionComanda(dir) {
  const lista = comandasEnOrden();
  if (!lista.length) return;
  if (!comandaSeleccionada()) { seleccionarComanda(lista[0].id); return; }

  const tarjetas = [...document.querySelectorAll('.comanda-card[data-comanda-id]')];
  const actual = tarjetas.find(t => Number(t.dataset.comandaId) === comandaSelId);
  if (!tarjetas.length || !actual) {
    // Sin tarjetas en pantalla (otra pagina): se recorre la cola en orden.
    const i = lista.findIndex(c => c.id === comandaSelId);
    const paso = (dir === 'right' || dir === 'down') ? 1 : -1;
    seleccionarComanda(lista[(i + paso + lista.length) % lista.length].id);
    return;
  }
  const destino = vecinoEnDireccion(tarjetas, actual, dir);
  if (destino) seleccionarComanda(Number(destino.dataset.comandaId));
}

// Si no hay nada elegido, cualquier tecla F agarra el primer ticket de la cola.
function asegurarComandaSeleccionada() {
  if (comandaSeleccionada()) return;
  const lista = comandasEnOrden();
  if (lista.length) seleccionarComanda(lista[0].id);
}

function enPaginaComandas() {
  return !!document.querySelector('.comanda-card[data-comanda-id]');
}

// --- Flechas dentro de una ventana (cobro, variantes, mesas) ---
function botonesNavegables() {
  const abiertos = [...document.querySelectorAll('.modal-overlay.open')];
  if (!abiertos.length) return [];
  const modal = abiertos[abiertos.length - 1];
  return [...modal.querySelectorAll('button:not([disabled])')]
    .filter((b) => b.offsetParent !== null);   // solo los que se ven
}

// Elige el vecino que de verdad esta hacia donde apunta la flecha, usando la
// posicion en pantalla. Con una lista plana (el siguiente del HTML) la flecha de
// abajo saltaba a la celda de al lado en las cuadriculas de dos columnas.
function vecinoEnDireccion(elementos, actual, dir) {
  if (!actual) return elementos[0] || null;
  const r = actual.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const horizontal = dir === 'left' || dir === 'right';
  const signo = (dir === 'right' || dir === 'down') ? 1 : -1;

  let mejor = null;
  let mejorPuntaje = Infinity;
  for (const el of elementos) {
    if (el === actual) continue;
    const re = el.getBoundingClientRect();
    const dx = (re.left + re.width / 2) - cx;
    const dy = (re.top + re.height / 2) - cy;
    const avance = horizontal ? dx : dy;      // cuanto se mueve hacia la flecha
    const desvio = horizontal ? dy : dx;      // cuanto se desvia de la linea
    if (avance * signo <= 2) continue;        // no esta en esa direccion
    // El desvio pesa mas: asi la flecha de abajo prefiere la de abajo-misma-columna
    // antes que una que este abajo pero muy corrida de lado.
    const puntaje = Math.abs(avance) + Math.abs(desvio) * 4;
    if (puntaje < mejorPuntaje) { mejorPuntaje = puntaje; mejor = el; }
  }
  return mejor;
}

function moverFocoEnVentana(dir) {
  const botones = botonesNavegables();
  if (botones.length < 2) return false;
  const actual = botones.includes(document.activeElement) ? document.activeElement : null;
  const destino = vecinoEnDireccion(botones, actual, dir);
  if (!destino) return !!actual;   // no hay nada hacia alla: se queda donde esta
  destino.focus();
  return true;
}

// Deja el foco listo al abrir una ventana, para poder usar flechas de inmediato.
function enfocarPrimerBoton() {
  const botones = botonesNavegables();
  if (botones.length) botones[0].focus();
}

function escribiendoEnUnCampo() {
  const a = document.activeElement;
  if (!a) return false;
  const tag = (a.tagName || '').toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || a.isContentEditable;
}

function manejarFlechas(e) {
  if (!appListaParaAtajos()) return;
  const flechas = { ArrowLeft: 'left', ArrowUp: 'up', ArrowRight: 'right', ArrowDown: 'down' };
  const dir = flechas[e.key];
  if (!dir && e.key !== 'Enter') return;
  // Escribiendo un importe o una nota, las flechas son del campo, no de la app.
  if (escribiendoEnUnCampo()) return;

  const hayVentana = !!document.querySelector('.modal-overlay.open');

  if (dir) {
    if (hayVentana) { if (moverFocoEnVentana(dir)) e.preventDefault(); return; }
    if (enPaginaComandas()) { moverSeleccionComanda(dir); e.preventDefault(); }
    return;
  }

  // Enter: dentro de una ventana lo maneja el boton enfocado; en Comandas, cobra.
  if (!hayVentana && enPaginaComandas()) {
    const comanda = comandaSeleccionada();
    if (comanda) { e.preventDefault(); completeComanda(comanda.id); }
  }
}

document.addEventListener('keydown', manejarFlechas);

// ===================== ACTUALIZACIONES Y LICENCIA =====================
// Las actualizaciones las descarga Electron en segundo plano (main.js). Aqui solo
// se muestran: un aviso cuando la version nueva ya esta lista y una tarjeta en
// Configuracion. En el navegador (sin Electron) window.mesanaDesktop no existe.
let updateInfo = { status: 'idle' };
let licenseInfo = null;
let updateBannerDismissed = null;

function initUpdates() {
  const desktop = window.mesanaDesktop;
  if (!desktop) return;
  desktop.updateState().then(handleUpdateStatus).catch(() => {});
  desktop.onUpdate(handleUpdateStatus);
}

function handleUpdateStatus(info) {
  const prev = updateInfo.status;
  updateInfo = info || { status: 'idle' };
  if (updateInfo.status === 'downloading' && prev !== 'downloading') {
    showToast(`Descargando FoodPoint ${updateInfo.version || 'nueva'} en segundo plano…`, 'success');
  }
  renderUpdateBanner();
  renderUpdateCard();
}

function renderUpdateBanner() {
  document.getElementById('updateBanner')?.remove();
  if (updateInfo.status !== 'ready' || updateBannerDismissed === updateInfo.version) return;
  const banner = document.createElement('div');
  banner.id = 'updateBanner';
  banner.className = 'update-banner';
  banner.innerHTML = `
    <div class="update-banner-ic">↻</div>
    <div class="update-banner-txt">
      <strong>FoodPoint ${esc(updateInfo.version)} está lista</strong>
      <span>Se instala al reiniciar (tarda unos segundos). Tus datos no se tocan.</span>
    </div>
    <button class="btn btn-primary btn-sm" onclick="installUpdateNow()">Reiniciar y actualizar</button>
    <button class="update-banner-x" onclick="dismissUpdateBanner()" title="Más tarde (se instalará al cerrar FoodPoint)">×</button>`;
  document.body.appendChild(banner);
}

function dismissUpdateBanner() {
  updateBannerDismissed = updateInfo.version;
  renderUpdateBanner();
  showToast('Se instalará sola la próxima vez que cierres FoodPoint', 'success');
}

async function installUpdateNow() {
  const pending = currentOrder?.items?.length;
  if (pending && !confirm('Hay productos en el ticket actual. Se guardan, pero ¿reiniciar ahora para actualizar?')) return;
  // Respaldo justo antes de actualizar, por si acaso.
  try { await fetch('/api/backups/now', { method: 'POST' }); } catch (e) { /* no bloquea la actualizacion */ }
  showToast('Actualizando… FoodPoint se volverá a abrir solo', 'success');
  setTimeout(() => window.mesanaDesktop?.installUpdate(), 600);
}

async function checkUpdatesNow() {
  if (!window.mesanaDesktop) return showToast('Las actualizaciones automáticas funcionan en la app instalada', 'error');
  handleUpdateStatus(await window.mesanaDesktop.checkForUpdates());
}

function updateStatusText() {
  switch (updateInfo.status) {
    case 'checking': return 'Buscando actualizaciones…';
    case 'up-to-date': return 'Tienes la versión más reciente.';
    case 'downloading': return `Descargando la versión ${esc(updateInfo.version || '')}… ${updateInfo.percent || 0}%`;
    case 'ready': return `La versión ${esc(updateInfo.version)} ya se descargó. Se instala al reiniciar.`;
    case 'error': return esc(updateInfo.message || 'No se pudo revisar.');
    case 'dev': return 'Modo desarrollo: las actualizaciones solo funcionan en la app instalada.';
    default: return window.mesanaDesktop ? 'FoodPoint revisa solo cada pocas horas.' : 'Abierto desde el navegador: sin actualizaciones automáticas.';
  }
}

function renderUpdateCard() {
  const box = document.getElementById('updateCardBody');
  if (!box) return;
  box.innerHTML = `
    <div class="upd-row">
      <div>
        <div class="upd-version">Versión instalada: <strong>${esc(licenseInfo?.version || '—')}</strong></div>
        <div class="upd-status upd-${esc(updateInfo.status)}">${updateStatusText()}</div>
        ${updateInfo.status === 'downloading' ? `<div class="upd-bar"><span style="width:${Number(updateInfo.percent) || 0}%"></span></div>` : ''}
        ${updateInfo.notes && ['downloading', 'ready'].includes(updateInfo.status) ? `<div class="upd-notes">${esc(updateInfo.notes)}</div>` : ''}
      </div>
      ${updateInfo.status === 'ready'
        ? '<button class="btn btn-primary btn-sm" onclick="installUpdateNow()">Reiniciar y actualizar</button>'
        : `<button class="btn btn-secondary btn-sm" onclick="checkUpdatesNow()" ${updateInfo.status === 'checking' || updateInfo.status === 'downloading' ? 'disabled' : ''}>Buscar ahora</button>`}
    </div>`;
}

async function fetchLicense() {
  try {
    const res = await fetch('/api/license');
    licenseInfo = await res.json();
  } catch (e) {
    licenseInfo = null;
  }
  return licenseInfo;
}

function licenseSummaryHtml(info) {
  if (!info) return '<div class="lic-state">No se pudo leer la licencia.</div>';
  const map = {
    activa: ['lic-ok', 'Licencia activa'],
    fundador: ['lic-ok', 'Cliente fundador'],
    prueba: ['lic-trial', `Prueba gratuita · quedan ${info.trialDaysLeft} día${info.trialDaysLeft === 1 ? '' : 's'}`],
    vencida: ['lic-off', 'Sin licencia activa'],
  };
  const [cls, label] = map[info.status] || ['lic-off', info.status];
  const rows = [];
  if (info.holder) rows.push(['A nombre de', esc(info.holder)]);
  if (info.plan) rows.push(['Plan', esc(info.plan)]);
  if (info.status === 'activa') rows.push(['Vigencia', info.expires ? `hasta el ${esc(info.expires)}` : 'Permanente']);
  if (info.reason) rows.push(['Motivo', esc(info.reason)]);
  rows.push(['ID de este equipo', `<code class="lic-id">${esc(info.machineId)}</code>`]);
  return `<div class="lic-state ${cls}">${label}</div>
    <dl class="lic-rows">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
}

function licenseFormHtml(inputId) {
  return `<div class="form-group" style="margin-bottom:8px">
      <label class="form-label" for="${inputId}">Clave de licencia</label>
      <textarea class="form-input lic-input" id="${inputId}" rows="3" placeholder="Pega aquí la clave que empieza con MSN1."></textarea>
    </div>
    <div style="display:flex;justify-content:flex-end">
      <button class="btn btn-primary btn-sm" onclick="activateLicense('${inputId}')">Activar</button>
    </div>`;
}

async function activateLicense(inputId) {
  const key = document.getElementById(inputId)?.value.trim();
  if (!key) return showToast('Pega la clave de licencia', 'error');
  try {
    const res = await fetch('/api/license', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });
    const data = await res.json();
    if (!res.ok) return showToast(data.error || 'Licencia no válida', 'error');
    licenseInfo = data;
    showToast(`Licencia activada para ${data.holder}`, 'success');
    document.getElementById('licenseGate')?.remove();
    renderLicenseCard();
  } catch (e) {
    showToast('No se pudo activar la licencia', 'error');
  }
}

async function loadLicenseAndUpdates() {
  await fetchLicense();
  renderLicenseCard();
  renderUpdateCard();
}

function renderLicenseCard() {
  const box = document.getElementById('licenseCardBody');
  if (!box) return;
  // Activa y fundador ya no necesitan clave; prueba y vencida muestran el campo para activar.
  const needsKey = !licenseInfo || ['prueba', 'vencida'].includes(licenseInfo.status);
  box.innerHTML = licenseSummaryHtml(licenseInfo) + (needsKey ? licenseFormHtml('licenseKeyInput') : '');
}

function settingsLicenseCardsHtml() {
  return `
    <div class="chart-card" style="padding:18px;margin-bottom:13px">
      <div class="chart-title">Actualizaciones</div>
      <div id="updateCardBody"><div style="color:var(--stone);font-size:14px">Cargando…</div></div>
    </div>
    <div class="chart-card" style="padding:18px;margin-bottom:13px">
      <div class="chart-title">Licencia</div>
      <div id="licenseCardBody"><div style="color:var(--stone);font-size:14px">Cargando…</div></div>
    </div>`;
}

// Al entrar: si la prueba termino o la licencia vencio, se pide la clave antes
// de dejar usar el sistema. Los datos siguen intactos; solo se pide activar.
async function enforceLicense() {
  const info = await fetchLicense();
  if (!info) return true;
  if (info.status === 'prueba' && currentUser?.role === 'owner' && info.trialDaysLeft <= 7) {
    showToast(`Prueba de FoodPoint: quedan ${info.trialDaysLeft} días. Activa tu licencia en Configuración.`, 'success');
  }
  if (info.status !== 'vencida') return true;
  showLicenseGate(info);
  return false;
}

function showLicenseGate(info) {
  document.getElementById('licenseGate')?.remove();
  const gate = document.createElement('div');
  gate.id = 'licenseGate';
  gate.className = 'license-gate';
  gate.innerHTML = `<div class="license-gate-card">
    <div class="license-gate-mark">${renderBrandMarkMarkup(26)}</div>
    <h2>Activa tu licencia de FoodPoint</h2>
    <p>${esc(info.reason || 'Este equipo no tiene una licencia activa.')} Tus ventas, productos y respaldos siguen guardados; solo falta activar.</p>
    ${licenseSummaryHtml(info)}
    ${licenseFormHtml('gateLicenseKey')}
    <p class="license-gate-help">¿No tienes clave? Pídela por WhatsApp al <strong>614 133 6763</strong> o a <strong>jesus.ivan.gd11@gmail.com</strong> e incluye el ID de este equipo.</p>
    <button class="btn btn-secondary btn-sm" onclick="document.getElementById('licenseGate').remove(); logout();">Cerrar sesión</button>
  </div>`;
  document.body.appendChild(gate);
}

initUpdates();

// ===================== IMPRESION Y COCINA =====================
// Cada comanda que se envia, se le agregan productos o se cancela genera un
// "ticket de cocina": se guarda (para el monitor de cocina) y se imprime en la
// impresora de cocina. El ticket del cliente sale en la impresora de caja.
// Impresoras: de red (IP, ESC/POS, la imprime el servidor) o de Windows (USB,
// la imprime Electron en silencio). Ambas reciben el mismo documento.
let printConfig = null;
let printersList = null;
let kitchenConfig = null;
let kitchenEstado = {};
let kitchenPollTimer = null;

async function loadPrintConfig() {
  try {
    const res = await fetch('/api/config/print');
    printConfig = await res.json();
  } catch (e) {
    printConfig = null;
  }
  return printConfig;
}

function impresoraLista(destino) {
  const c = printConfig?.[destino];
  if (!c || c.tipo === 'ninguna') return false;
  return c.tipo === 'red' ? !!c.ip : !!c.nombre;
}

function horaCorta(fecha) {
  return new Date(fecha || Date.now()).toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' });
}

function fechaCorta(fecha) {
  return new Date(fecha || Date.now()).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function docAHtml(doc) {
  const ancho = doc.ancho === 58 ? 58 : 80;
  const util = ancho === 58 ? 48 : 72;
  const fila = (l) => `<div class="f ${l.tam || ''} ${l.negrita ? 'b' : ''}"><span>${esc(l.izq)}</span><span>${esc(l.der)}</span></div>`;
  const cuerpo = (doc.lineas || []).map((l) => {
    if (l.tipo === 'linea') return '<div class="hr"></div>';
    if (l.tipo === 'espacio') return '<div class="sp"></div>';
    if (l.tipo === 'fila') return fila(l);
    const cls = [l.alinear === 'centro' ? 'c' : l.alinear === 'der' ? 'r' : '', l.tam || '', l.negrita ? 'b' : ''].join(' ');
    return `<div class="${cls}">${esc(l.texto).replace(/^( +)/, (m) => '&nbsp;'.repeat(m.length))}</div>`;
  }).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @page { margin: 0; }
    html, body { margin: 0; padding: 0; background: #fff; color: #000; }
    body { width: ${util}mm; padding: 2mm ${(ancho - util) / 2}mm 6mm; font: 12px/1.32 'Lucida Console', 'Courier New', monospace; }
    .c { text-align: center; } .r { text-align: right; } .b { font-weight: bold; }
    .alto { font-size: 16px; font-weight: bold; } .grande { font-size: 22px; font-weight: bold; line-height: 1.2; }
    .f { display: flex; justify-content: space-between; gap: 8px; } .f span:last-child { white-space: nowrap; }
    .hr { border-top: 1px dashed #000; margin: 5px 0; } .sp { height: 10px; }
    .logo { display: block; margin: 0 auto 4px; width: 22mm; height: 22mm; object-fit: cover; }
  </style></head><body>${doc.logo ? `<img class="logo" src="${doc.logo}">` : ''}${cuerpo}</body></html>`;
}

// Imprime en la impresora de 'cocina' o de 'caja'. Nunca lanza: si falla avisa y
// devuelve false, para que una impresora apagada no detenga la venta.
async function imprimirDocumento(destino, doc, { silencioso = false } = {}) {
  if (!printConfig) await loadPrintConfig();
  const c = printConfig?.[destino];
  const nombre = destino === 'cocina' ? 'cocina' : 'caja';
  if (!impresoraLista(destino)) {
    if (!silencioso) showToast(`No hay impresora de ${nombre} configurada (Configuración → Impresoras)`, 'error');
    return false;
  }
  const documento = { ...doc, ancho: c.ancho };
  try {
    if (c.tipo === 'red') {
      const res = await fetch('/api/print/red', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip: c.ip, puerto: c.puerto, copias: c.copias, documento: { ...documento, logo: undefined } }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Error de impresión');
    } else {
      if (!window.mesanaDesktop?.printHtml) throw new Error('Las impresoras USB solo funcionan en la app instalada');
      await window.mesanaDesktop.printHtml({ deviceName: c.nombre, html: docAHtml(documento), anchoMm: c.ancho, copias: c.copias });
    }
    return true;
  } catch (error) {
    showToast(`No se imprimió en ${nombre}: ${error.message}`, 'error');
    return false;
  }
}

// Renglones que ve la cocina: sin precios, con variantes, piezas del combo y notas.
function itemsParaCocina(items) {
  return (items || []).map((it) => ({
    qty: it.qty,
    name: it.name,
    variantLabel: it.variantLabel || '',
    notes: it.notes || '',
    comboItems: it.isCombo && Array.isArray(it.comboItems)
      ? it.comboItems.map((ci) => ({ qty: (ci.qty || 1) * (it.qty || 1), name: ci.name || '', variantLabel: ci.variantLabel || '' }))
      : [],
  }));
}

function claveCocina(it) {
  const combo = (it.comboItems || []).map((ci) => `${ci.qty}:${ci.name}:${ci.variantLabel || ''}`).join(',');
  return `${it.id}|${it.variantKey || it.variantLabel || ''}|${it.notes || ''}|${combo}`;
}

// Que se agrego y que se quito al editar una comanda (por producto + variante + nota).
function diffItemsCocina(antes, despues) {
  const suma = (lista) => {
    const m = new Map();
    lista.forEach((it) => {
      const k = claveCocina(it);
      const e = m.get(k) || { item: it, qty: 0 };
      e.qty += it.qty;
      m.set(k, e);
    });
    return m;
  };
  const a = suma(antes || []);
  const d = suma(despues || []);
  const agregados = [];
  const quitados = [];
  new Set([...a.keys(), ...d.keys()]).forEach((k) => {
    const delta = (d.get(k)?.qty || 0) - (a.get(k)?.qty || 0);
    if (delta > 0) agregados.push({ ...d.get(k).item, qty: delta });
    if (delta < 0) quitados.push({ ...a.get(k).item, qty: -delta });
  });
  return { agregados, quitados };
}

function docCocina(t) {
  const L = [];
  const titulo = t.kind === 'adicional' ? 'ADICIONAL' : t.kind === 'cancelada' ? '*** CANCELAR ***' : 'COCINA';
  L.push({ tipo: 'texto', texto: titulo, alinear: 'centro', tam: 'grande', negrita: true });
  L.push({ tipo: 'texto', texto: `Orden #${t.ticketNumber}`, alinear: 'centro', tam: 'grande', negrita: true });
  L.push({
    tipo: 'texto', alinear: 'centro', tam: 'alto', negrita: true,
    texto: t.type === 'llevar' ? 'PARA LLEVAR' : `${String(t.mesa || 'Comedor').toUpperCase()} · ${t.comensales || 1} pers.`,
  });
  L.push({ tipo: 'fila', izq: `Mesero: ${t.waiter || ''}`, der: horaCorta(t.createdAt) });
  L.push({ tipo: 'linea' });
  t.items.forEach((it) => {
    L.push({ tipo: 'texto', texto: `${it.qty}  ${it.name}`, tam: 'alto', negrita: true });
    if (it.variantLabel) L.push({ tipo: 'texto', texto: `    ${it.variantLabel}`, negrita: true });
    (it.comboItems || []).forEach((ci) => L.push({ tipo: 'texto', texto: `    - ${ci.qty} ${ci.name}${ci.variantLabel ? ` (${ci.variantLabel})` : ''}` }));
    if (it.notes) L.push({ tipo: 'texto', texto: `    ** ${it.notes}`, negrita: true });
  });
  L.push({ tipo: 'linea' });
  if (t.notes) L.push({ tipo: 'texto', texto: `NOTA: ${t.notes}`, tam: 'alto', negrita: true });
  return { lineas: L };
}

// Registra el ticket para el monitor de cocina y lo imprime en cocina.
async function enviarTicketCocina(comanda, kind, items, { imprimir = true } = {}) {
  if (!items?.length) return;
  const ticket = {
    orderId: comanda.id,
    ticketNumber: comanda.ticketNumber,
    kind,
    type: comanda.type,
    mesa: comanda.type === 'llevar' ? 'Para llevar' : comanda.mesa,
    comensales: comanda.comensales,
    waiter: comanda.waiter || currentUser?.name || '',
    notes: kind === 'cancelada' ? '' : (comanda.notes || ''),
    items: itemsParaCocina(items),
    createdAt: new Date().toISOString(),
  };
  try {
    await fetch('/api/kitchen/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    });
  } catch (e) { /* el ticket impreso sigue saliendo aunque falle el monitor */ }
  if (!printConfig) await loadPrintConfig();
  if (imprimir && printConfig?.cocina?.auto && impresoraLista('cocina')) {
    const ok = await imprimirDocumento('cocina', docCocina(ticket));
    if (ok && kind !== 'nueva') showToast(kind === 'cancelada' ? 'Cancelación impresa en cocina' : 'Adicional impreso en cocina', 'success');
  }
}

async function reimprimirComanda(id) {
  const comanda = state.commandas.find((c) => c.id === id);
  if (!comanda) return;
  const ok = await imprimirDocumento('cocina', docCocina({
    ...comanda,
    kind: 'nueva',
    mesa: comanda.type === 'llevar' ? 'Para llevar' : comanda.mesa,
    items: itemsParaCocina(comanda.items),
    createdAt: comanda.createdAt,
  }));
  if (ok) showToast(`Comanda #${comanda.ticketNumber} reimpresa en cocina`, 'success');
}

function encabezadoTicket(L) {
  const s = state.settings;
  L.push({ tipo: 'texto', texto: s.restaurantName || 'FoodPoint', alinear: 'centro', tam: 'alto', negrita: true });
  if (s.address) L.push({ tipo: 'texto', texto: s.address, alinear: 'centro' });
  if (s.phone) L.push({ tipo: 'texto', texto: `Tel. ${s.phone}`, alinear: 'centro' });
  if (s.rfc) L.push({ tipo: 'texto', texto: `RFC ${s.rfc}`, alinear: 'centro' });
}

function renglonesProductos(L, items) {
  items.forEach((it) => {
    L.push({ tipo: 'fila', izq: `${it.qty} ${it.name}`, der: `$${fmt(it.price * it.qty)}` });
    if (it.variantLabel) L.push({ tipo: 'texto', texto: `   ${it.variantLabel}` });
    if (it.isCombo && it.comboItems?.length) {
      it.comboItems.forEach((ci) => L.push({ tipo: 'texto', texto: `   - ${ci.qty * (it.qty || 1)} ${ci.name || ''}${ci.variantLabel ? ` (${ci.variantLabel})` : ''}` }));
    }
  });
}

function docTicketVenta(sale) {
  const L = [];
  encabezadoTicket(L);
  L.push({ tipo: 'linea' });
  L.push({ tipo: 'fila', izq: `Ticket #${sale.ticketNumber}`, der: `${fechaCorta(sale.completedAt)} ${horaCorta(sale.completedAt)}` });
  L.push({ tipo: 'texto', texto: sale.type === 'llevar' ? 'Para llevar' : `${sale.mesa || 'Comedor'} · ${sale.comensales || 1} pers.` });
  L.push({ tipo: 'linea' });
  renglonesProductos(L, sale.items || []);
  L.push({ tipo: 'linea' });
  L.push({ tipo: 'fila', izq: 'TOTAL', der: `$${fmt(sale.total)}`, tam: 'alto', negrita: true });
  const pagos = Array.isArray(sale.payments) && sale.payments.length ? sale.payments : [{ method: sale.paymentMethod || 'Efectivo', amount: sale.total }];
  pagos.forEach((p) => L.push({ tipo: 'fila', izq: p.method, der: `$${fmt(p.amount)}` }));
  if (sale.amountReceived) L.push({ tipo: 'fila', izq: 'Recibido', der: `$${fmt(sale.amountReceived)}` });
  if (sale.change > 0) L.push({ tipo: 'fila', izq: 'Cambio', der: `$${fmt(sale.change)}`, negrita: true });
  L.push({ tipo: 'linea' });
  L.push({ tipo: 'texto', texto: `Atendió: ${sale.waiter || ''}`, alinear: 'centro' });
  L.push({ tipo: 'texto', texto: state.settings.ticketFooter || 'Gracias por su visita', alinear: 'centro', negrita: true });
  L.push({ tipo: 'texto', texto: 'Este ticket no es un comprobante fiscal', alinear: 'centro' });
  return { lineas: L, logo: state.settings.logoDataUrl || null };
}

// La "cuenta" que se lleva a la mesa antes de cobrar.
function docCuenta(order) {
  const totals = calculateTotals(order.items);
  const L = [];
  encabezadoTicket(L);
  L.push({ tipo: 'linea' });
  L.push({ tipo: 'texto', texto: 'CUENTA', alinear: 'centro', tam: 'alto', negrita: true });
  L.push({ tipo: 'fila', izq: order.type === 'llevar' ? 'Para llevar' : `${order.mesa || 'Comedor'} · ${order.comensales || 1} pers.`, der: `${fechaCorta()} ${horaCorta()}` });
  L.push({ tipo: 'linea' });
  renglonesProductos(L, order.items);
  L.push({ tipo: 'linea' });
  L.push({ tipo: 'fila', izq: 'TOTAL', der: `$${fmt(totals.total)}`, tam: 'alto', negrita: true });
  L.push({ tipo: 'espacio' });
  L.push({ tipo: 'texto', texto: state.settings.ticketFooter || 'Gracias por su visita', alinear: 'centro' });
  return { lineas: L, logo: state.settings.logoDataUrl || null };
}

async function imprimirTicketVenta(sale) {
  const ok = await imprimirDocumento('caja', docTicketVenta(sale));
  if (ok) showToast(`Ticket #${sale.ticketNumber} impreso`, 'success');
  return ok;
}

function reimprimirVenta(id) {
  const sale = state.salesRecords.find((s) => String(s.id) === String(id));
  if (sale) imprimirTicketVenta(sale);
}

// ---- Estado de cocina en caja ----
// Cada pocos segundos se pregunta que comandas ya marco la cocina como listas,
// para avisar al mesero y marcar la tarjeta en Comandas.
function startKitchenPolling() {
  if (kitchenPollTimer) clearInterval(kitchenPollTimer);
  const revisar = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/kitchen/estado');
      const lista = await res.json();
      const nuevo = {};
      lista.forEach((e) => { nuevo[e.orderId] = e; });
      let cambio = false;
      Object.values(nuevo).forEach((e) => {
        const antes = kitchenEstado[e.orderId];
        const listaAhora = e.pendientes === 0 && e.listos > 0;
        const listaAntes = antes && antes.pendientes === 0 && antes.listos > 0;
        if (listaAhora && !listaAntes && antes) {
          const comanda = state.commandas.find((c) => c.id === e.orderId);
          if (comanda) {
            showToast(`¡Orden #${comanda.ticketNumber} lista! ${comanda.type === 'llevar' ? 'Para llevar' : comanda.mesa}`, 'success');
            sonidoListo();
          }
        }
        if (!antes || antes.pendientes !== e.pendientes || antes.listos !== e.listos) cambio = true;
      });
      kitchenEstado = nuevo;
      if (cambio && getCurrentActivePage() === 'comandas' && !document.querySelector('.modal-overlay.open')) renderPage('comandas');
    } catch (e) { /* sin servidor por un momento: se reintenta solo */ }
  };
  revisar();
  kitchenPollTimer = setInterval(revisar, 5000);
}

function sonidoListo() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [880, 1175].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.16);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + i * 0.16 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.16 + 0.3);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.16);
      o.stop(ctx.currentTime + i * 0.16 + 0.32);
    });
  } catch (e) { /* sin audio */ }
}

function estadoCocinaHtml(comanda) {
  const e = kitchenEstado[comanda.id];
  if (e && e.pendientes === 0 && e.listos > 0) {
    return `<span class="kds-badge kds-badge--listo">✓ Listo para entregar</span>`;
  }
  return `<span class="kds-badge"><span class="live-dot"></span>En cocina · ${minutesAgo(comanda.createdAt)}</span>`;
}

// ---- Configuracion: impresoras y monitor de cocina ----
function settingsPrintCardsHtml() {
  return `
    <div class="chart-card" style="padding:18px;margin-bottom:13px">
      <div class="chart-title">Impresoras</div>
      <p class="prn-intro">La comanda se imprime sola en cocina al enviarla; si después agregas o quitas productos, sale un ticket de <strong>ADICIONAL</strong> o <strong>CANCELAR</strong>. El ticket del cliente sale en caja al cobrar con <kbd>F1</kbd>.</p>
      <div id="printCardBody"><div style="color:var(--stone);font-size:14px">Cargando…</div></div>
    </div>
    <div class="chart-card" style="padding:18px;margin-bottom:13px">
      <div class="chart-title">Monitor de cocina</div>
      <div id="kitchenCardBody"><div style="color:var(--stone);font-size:14px">Cargando…</div></div>
    </div>`;
}

async function loadPrintSettings() {
  await loadPrintConfig();
  if (window.mesanaDesktop?.listPrinters && !printersList) {
    try { printersList = await window.mesanaDesktop.listPrinters(); } catch (e) { printersList = []; }
  }
  renderPrintSettings();
  try {
    kitchenConfig = await (await fetch('/api/config/kitchen')).json();
  } catch (e) { kitchenConfig = null; }
  renderKitchenSettings();
}

function printerBlockHtml(destino, titulo) {
  const c = printConfig?.[destino] || {};
  const opcionesWin = (printersList || []).map((p) => `<option value="${esc(p.name)}" ${p.name === c.nombre ? 'selected' : ''}>${esc(p.displayName)}${p.isDefault ? ' (predeterminada)' : ''}</option>`).join('');
  return `<div class="prn-block" data-destino="${destino}">
    <div class="prn-head">${titulo}</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="prn-${destino}-tipo">Tipo</label>
        <select class="form-select" id="prn-${destino}-tipo" onchange="cambiarTipoImpresora('${destino}', this.value)">
          <option value="ninguna" ${c.tipo === 'ninguna' ? 'selected' : ''}>Sin impresora</option>
          <option value="windows" ${c.tipo === 'windows' ? 'selected' : ''}>USB o instalada en Windows</option>
          <option value="red" ${c.tipo === 'red' ? 'selected' : ''}>De red (IP)</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="prn-${destino}-ancho">Papel</label>
        <select class="form-select" id="prn-${destino}-ancho">
          <option value="80" ${c.ancho !== 58 ? 'selected' : ''}>80 mm</option>
          <option value="58" ${c.ancho === 58 ? 'selected' : ''}>58 mm</option>
        </select>
      </div>
    </div>
    <div class="form-group" ${c.tipo === 'windows' ? '' : 'hidden'} data-campo="windows">
      <label class="form-label" for="prn-${destino}-nombre">Impresora</label>
      ${window.mesanaDesktop?.listPrinters
        ? `<select class="form-select" id="prn-${destino}-nombre"><option value="">Elige una…</option>${opcionesWin}</select>`
        : '<div class="prn-note">Las impresoras USB se eligen desde la app instalada.</div>'}
    </div>
    <div class="form-row" ${c.tipo === 'red' ? '' : 'hidden'} data-campo="red">
      <div class="form-group"><label class="form-label" for="prn-${destino}-ip">IP de la impresora</label><input class="form-input" id="prn-${destino}-ip" value="${esc(c.ip || '')}" placeholder="192.168.1.120"></div>
      <div class="form-group"><label class="form-label" for="prn-${destino}-puerto">Puerto</label><input class="form-input" id="prn-${destino}-puerto" type="number" value="${esc(c.puerto || 9100)}"></div>
    </div>
    <div class="prn-foot">
      ${destino === 'cocina' ? `<label class="prn-check"><input type="checkbox" id="prn-${destino}-auto" ${c.auto !== false ? 'checked' : ''}> Imprimir al enviar a cocina</label>` : '<span></span>'}
      <label class="prn-check">Copias
        <select id="prn-${destino}-copias">${[1, 2, 3].map((n) => `<option ${Number(c.copias) === n ? 'selected' : ''}>${n}</option>`).join('')}</select>
      </label>
      <button class="btn btn-secondary btn-sm" onclick="probarImpresora('${destino}')">Imprimir prueba</button>
    </div>
  </div>`;
}

function renderPrintSettings() {
  const box = document.getElementById('printCardBody');
  if (!box) return;
  box.innerHTML = printerBlockHtml('cocina', 'Cocina') + printerBlockHtml('caja', 'Caja (ticket del cliente)') + `
    <div style="display:flex;justify-content:flex-end;margin-top:6px">
      <button class="btn btn-primary btn-sm" onclick="guardarImpresoras()">Guardar impresoras</button>
    </div>`;
}

function cambiarTipoImpresora(destino, tipo) {
  const block = document.querySelector(`.prn-block[data-destino="${destino}"]`);
  if (!block) return;
  block.querySelector('[data-campo="windows"]').hidden = tipo !== 'windows';
  block.querySelector('[data-campo="red"]').hidden = tipo !== 'red';
}

function leerImpresora(destino) {
  const v = (campo) => document.getElementById(`prn-${destino}-${campo}`);
  return {
    tipo: v('tipo')?.value || 'ninguna',
    nombre: v('nombre')?.value || printConfig?.[destino]?.nombre || '',
    ip: v('ip')?.value.trim() || '',
    puerto: Number(v('puerto')?.value) || 9100,
    ancho: Number(v('ancho')?.value) || 80,
    copias: Number(v('copias')?.value) || 1,
    auto: destino === 'cocina' ? !!v('auto')?.checked : true,
  };
}

async function guardarImpresoras({ silencioso = false } = {}) {
  const body = { cocina: leerImpresora('cocina'), caja: leerImpresora('caja') };
  for (const [destino, c] of Object.entries(body)) {
    if (c.tipo === 'red' && !/^\d{1,3}(\.\d{1,3}){3}$/.test(c.ip)) {
      showToast(`Escribe la IP de la impresora de ${destino} (ej. 192.168.1.120)`, 'error');
      return false;
    }
    if (c.tipo === 'windows' && !c.nombre) {
      showToast(`Elige la impresora de ${destino}`, 'error');
      return false;
    }
  }
  try {
    const res = await fetch('/api/config/print', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await apiError(res));
    printConfig = await res.json();
    if (!silencioso) showToast('Impresoras guardadas', 'success');
    return true;
  } catch (e) {
    showToast(e.message || 'No se pudieron guardar las impresoras', 'error');
    return false;
  }
}

async function probarImpresora(destino) {
  if (!(await guardarImpresoras({ silencioso: true }))) return;
  const L = [];
  L.push({ tipo: 'texto', texto: 'PRUEBA DE IMPRESION', alinear: 'centro', tam: 'grande', negrita: true });
  L.push({ tipo: 'texto', texto: destino === 'cocina' ? 'Impresora de COCINA' : 'Impresora de CAJA', alinear: 'centro', tam: 'alto', negrita: true });
  L.push({ tipo: 'linea' });
  L.push({ tipo: 'fila', izq: '1 Montados', der: '$85.00' });
  L.push({ tipo: 'texto', texto: '   Asado · sin cebolla' });
  L.push({ tipo: 'fila', izq: 'Acentos: áéíóú ñ ¿? ¡!', der: 'OK' });
  L.push({ tipo: 'linea' });
  L.push({ tipo: 'texto', texto: `${state.settings.restaurantName || 'FoodPoint'} · ${fechaCorta()} ${horaCorta()}`, alinear: 'centro' });
  const ok = await imprimirDocumento(destino, { lineas: L });
  if (ok) showToast('Prueba enviada a la impresora', 'success');
}

function renderKitchenSettings() {
  const box = document.getElementById('kitchenCardBody');
  if (!box) return;
  if (!kitchenConfig) {
    box.innerHTML = '<div class="prn-note">No se pudo leer la configuración del monitor.</div>';
    return;
  }
  const k = kitchenConfig;
  box.innerHTML = `
    <p class="prn-intro">Una pantalla para la cocina con cada comanda, el tiempo que lleva y un botón de <strong>Listo</strong>. Cuando la cocina la marca, aquí en caja te avisa. Funciona junto con la impresora o sin ella.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
      <button class="btn btn-primary btn-sm" onclick="abrirMonitorCocina()">Abrir monitor en esta computadora</button>
    </div>
    <label class="prn-check" style="margin-bottom:8px">
      <input type="checkbox" ${k.red ? 'checked' : ''} onchange="cambiarMonitorRed(this.checked)">
      Permitir una tablet o pantalla de la cocina en la misma red (WiFi)
    </label>
    ${k.red ? `
      <div class="kds-acceso">
        <div>En la tablet abre el navegador y entra a:</div>
        ${(k.urlsRed || []).map((u) => `<div class="kds-url">${esc(u)}</div>`).join('') || '<div class="prn-note">No se detectó la red de esta computadora.</div>'}
        <div style="margin-top:8px">Código de cocina: <span class="kds-codigo">${esc(k.codigo)}</span>
          <button class="btn btn-secondary btn-sm" style="margin-left:8px" onclick="nuevoCodigoCocina()">Cambiar código</button></div>
        <div class="prn-note">Si Windows pregunta si permites el acceso a la red, elige <strong>Redes privadas</strong> y da clic en Permitir.</div>
      </div>` : ''}`;
}

async function abrirMonitorCocina() {
  if (!kitchenConfig) return;
  if (window.mesanaDesktop?.openKitchen) {
    await window.mesanaDesktop.openKitchen(kitchenConfig.urlLocal);
  } else {
    window.open(kitchenConfig.urlLocal, '_blank');
  }
}

async function cambiarMonitorRed(red) {
  await fetch('/api/config/kitchen', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ red }) });
  await loadPrintSettings();
  showToast(red ? 'Monitor disponible en la red del restaurante' : 'Monitor solo en esta computadora', 'success');
}

async function nuevoCodigoCocina() {
  if (!confirm('Las tablets que ya están conectadas tendrán que escribir el código nuevo. ¿Cambiarlo?')) return;
  await fetch('/api/config/kitchen', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nuevoCodigo: true }) });
  await loadPrintSettings();
}


// ===================== MESANA AHORA ES FOODPOINT =====================
// Se muestra una sola vez en cada equipo que ya tenia ventas, para que nadie se
// asuste al ver otro nombre y otro logo despues de la actualizacion.
function avisoNuevoNombre() {
  let visto = null;
  try { visto = localStorage.getItem('foodpoint-aviso-nombre'); } catch (e) { /* sin almacenamiento */ }
  if (visto || !(state.salesRecords || []).length) return;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'avisoNombre';
  overlay.innerHTML = `<div class="modal rebrand-modal">
    <img class="rebrand-logo" src="assets/img/foodpoint-logo.png" alt="FoodPoint · Punto de venta & sabor">
    <h2>Mesana ahora se llama FoodPoint</h2>
    <p>Es el mismo sistema que ya usas: tus ventas, productos, combos, usuarios, respaldos y configuración siguen exactamente igual. Solo cambiaron el nombre y el logo.</p>
    <p class="rebrand-sub">¿Quieres usar también los colores nuevos de FoodPoint? Puedes cambiarlos cuando quieras abajo a la izquierda.</p>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="cerrarAvisoNombre(false)">Conservar mis colores</button>
      <button class="btn btn-primary" onclick="cerrarAvisoNombre(true)">Usar colores FoodPoint</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
}

async function cerrarAvisoNombre(usarColores) {
  try { localStorage.setItem('foodpoint-aviso-nombre', '1'); } catch (e) { /* sin almacenamiento */ }
  document.getElementById('avisoNombre')?.remove();
  if (usarColores) await applyTheme('theme-foodpoint', true);
}
