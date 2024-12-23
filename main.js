const { app, BrowserWindow, Tray, Menu, shell } = require('electron');
const path = require('path');

let mainWindow;
let tray;

// Définir le nom de domaine principal
const DOMAIN = 'https://chat.openai.com';

// Tableau des domaines autorisés
const ALLOWED_DOMAINS = [
	DOMAIN,
	'https://ab.chatgpt.com',
	'https://cdn.oaistatic.com',
	'https://chatgpt.com',
	'https://cdn.auth0.com',
	'https://cdn.jsdelivr.net',
	'https://cdnjs.cloudflare.com',
	'https://cdn.openai.com',
	'https://unpkg.com',
	'https://browser-intake-datadoghq.com',
	'https://auth0.openai.com',
];

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: true,
			enableRemoteModule: false,
			nodeIntegration: false,
			webviewTag: false,
			devTools: false,
			sandbox: true,
		},
		icon: path.join(__dirname, 'assets/icons/icon.png'),
	});

	// Charger l'URL principale
	mainWindow.loadURL(DOMAIN);
	mainWindow.setMenu(null);
	// mainWindow.webContents.openDevTools();

	// Ajouter la gestion de la barre système
	mainWindow.on('close', (event) => {
		if (!app.isQuiting) {
			event.preventDefault();
			mainWindow.hide();
		}
	});
	createTray();

	// Ajout d'une Content-Security-Policy (CSP)
	mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
		const csp = `
			default-src 'self' ${ALLOWED_DOMAINS.join(' ')};
			script-src 'self' 'unsafe-inline' ${ALLOWED_DOMAINS.join(' ')};
			style-src 'self' ${ALLOWED_DOMAINS.join(' ')} data: 'unsafe-inline';
			img-src 'self' ${ALLOWED_DOMAINS.join(' ')} data:;
			font-src 'self' ${ALLOWED_DOMAINS.join(' ')} data:;
			worker-src 'self' blob:;
			object-src 'none';
			`.replace(/\s+/g, ' '); // Supprime les retours à la ligne pour éviter les erreurs

		callback({
			responseHeaders: {
				...details.responseHeaders,
				'Content-Security-Policy': [csp]
			}
		});
	});

	// Gestion des ouvertures de fenêtres (URL autorisées uniquement)
	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		if (ALLOWED_DOMAINS.some(domain => url.startsWith(domain))) {
			return { action: 'allow' };
		}
		shell.openExternal(url);
		return { action: 'deny' };
	});

	// Gestion des erreurs de chargement
	mainWindow.webContents.on('did-fail-load', () => {
		mainWindow.loadFile(path.join(__dirname, 'static', 'error.html'));
	});
}

function createTray() {
	const trayIcon = path.join(__dirname, 'assets/icons/icon-small.png');
	tray = new Tray(trayIcon);

	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Afficher la fenêtre',
			click: () => {
				if (mainWindow) {
					mainWindow.show();
					mainWindow.focus();
				}
			},
		},
		{
			label: 'Quitter',
			click: () => {
				app.isQuiting = true;
				app.quit();
			},
		},
	]);

	tray.setToolTip('ChatGPT-electron');
	tray.setContextMenu(contextMenu);

	tray.on('click', () => {
		if (mainWindow) {
			mainWindow.show();
			mainWindow.focus();
		}
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
