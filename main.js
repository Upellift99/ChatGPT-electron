const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: true,
			enableRemoteModule: false,
		},
	});

	mainWindow.loadURL('https://chat.openai.com');
	mainWindow.setMenu(null); // Désactive le menu pour plus de sécurité

	// Gérer l'ouverture de nouvelles fenêtres
	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith('https://chat.openai.com')) {
			return { action: 'allow' };
		}
		return { action: 'deny' };
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
