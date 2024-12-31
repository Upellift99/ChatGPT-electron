const { app, BrowserWindow, session, Tray, Menu } = require('electron');
const path = require('path');

let mainWindow;
let tray;

// Définir le domaine principal
const DOMAIN = 'https://chat.openai.com';

// Fonction pour créer la fenêtre principale
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			partition: 'persist:main', // Utiliser une session persistante pour les cookies
			contextIsolation: true,
			enableRemoteModule: false,
			nodeIntegration: false,
			webviewTag: false,
			sandbox: true,
		},
		icon: path.join(__dirname, 'assets/icons/icon.png'), // Icône de la fenêtre
	});

	// Désactiver la barre de menu
	mainWindow.setMenu(null);

	// Charger le domaine principal
	mainWindow.loadURL(DOMAIN);

	// Ouvrir les DevTools (facultatif pour le débogage)
	// mainWindow.webContents.openDevTools();

	// Capturer les cookies lorsque l'utilisateur se connecte
	session.defaultSession.cookies.on('changed', (event, cookie) => {
		console.log('Cookie détecté:', cookie);
	});

	// Gérer les erreurs de chargement
	mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
		console.error('Erreur de chargement:', {
			errorCode,
			errorDescription,
			validatedURL,
		});
	});

	// Gérer la fermeture de la fenêtre (minimiser dans la barre système)
	mainWindow.on('close', (event) => {
		if (!app.isQuiting) {
			event.preventDefault();
			mainWindow.hide(); // Cache la fenêtre au lieu de la fermer
		}
	});
}

// Fonction pour créer l'icône dans la barre système (tray)
function createTray() {
	const trayIcon = path.join(__dirname, 'assets/icons/icon-small.png'); // Icône du tray
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

	tray.setToolTip('ChatGPT-electron'); // Info-bulle du tray
	tray.setContextMenu(contextMenu);

	// Afficher la fenêtre lorsque l'utilisateur clique sur l'icône du tray
	tray.on('click', () => {
		if (mainWindow) {
			mainWindow.show();
			mainWindow.focus();
		}
	});
}

// Gestion des événements d'application
app.on('ready', () => {
	createWindow(); // Créer la fenêtre principale
	createTray(); // Créer l'icône dans la barre système
});

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
