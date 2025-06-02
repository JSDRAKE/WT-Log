const { app, shell, BrowserWindow, Menu, ipcMain } = require('electron');
const { join } = require('path');
const { electronApp, optimizer, is } = require('@electron-toolkit/utils');
const fs = require('fs').promises;
const path = require('path');

// Ensure app data directory exists
const appDataPath = app.getPath('userData');
const settingsPath = path.join(appDataPath, 'settings.json');

// Load settings from file
async function loadSettings() {
  try {
    const data = await fs.readFile(settingsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return default settings
      return {
        callsign: '',
        operatorName: '',
        name: '',
        city: '',
        country: '',
        gridSquare: '',
        locator: '',
        cqZone: '',
        ituZone: '',
      };
    }
    console.error('Error loading settings:', error);
    throw error;
  }
}

// Save settings to file
async function saveSettings(settings) {
  try {
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
}

const icon = join(__dirname, '../../resources/icon.png');

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Create the application's main menu
  const isMac = process.platform === 'darwin';
  const template = [
    // App menu for macOS
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' },
            ],
          },
        ]
      : []),
    // File menu
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Nuevo Log',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('menu-action', 'new-log');
            }
          },
        },
        {
          label: 'Cargar Log',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('menu-action', 'load-log');
            }
          },
        },
        {
          label: 'Borrar Log',
          accelerator: 'CmdOrCtrl+Shift+D',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('menu-action', 'delete-log');
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Importar ADIF',
          accelerator: 'CmdOrCtrl+I',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('menu-action', 'import-adif');
            }
          },
        },
        {
          label: 'Exportar ADIF',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('menu-action', 'export-adif');
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Configuración',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('menu-action', 'open-settings');
            }
          },
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
    // Edit menu
    {
      label: 'Editar',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' },
      ],
    },
    // View menu
    {
      label: 'Ver',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    // Help menu
    {
      role: 'help',
      submenu: [
        {
          label: 'Acerca de WT-Log',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.send('open-about');
            }
          },
        },
      ],
    },
  ];

  // Set up IPC handlers
  ipcMain.handle('load-settings', loadSettings);
  ipcMain.handle('save-settings', (_, settings) => saveSettings(settings));

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Helper function to get all logs
async function getAllLogs() {
  const logsDir = path.join(app.getPath('userData'), 'Logs');
  try {
    await fs.mkdir(logsDir, { recursive: true });
    const files = await fs.readdir(logsDir);
    const logFiles = files.filter((file) => file.endsWith('.json'));
    const logs = [];
    for (const file of logFiles) {
      try {
        const filePath = path.join(logsDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const logData = JSON.parse(content);
        logs.push({
          ...logData,
          fileName: file,
          filePath,
          // Ensure createdAt is a Date object for consistent sorting
          createdAt: logData.createdAt ? new Date(logData.createdAt) : new Date(0),
        });
      } catch (error) {
        console.error(`Error reading log file ${file}:`, error);
      }
    }
    // Sort logs by createdAt in descending order (newest first)
    return logs.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error reading logs directory:', error);
    return [];
  }
}

// IPC Handlers
ipcMain.handle('get-logs', async () => {
  return await getAllLogs();
});

ipcMain.handle('log-exists', async (_, name) => {
  const logs = await getAllLogs();
  const logName = name.endsWith('.json') ? name : `${name}.json`;
  return logs.some((log) => log.fileName.toLowerCase() === logName.toLowerCase());
});

// Load a log file by path
ipcMain.handle('load-log', async (_, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const logData = JSON.parse(content);
    return {
      ...logData,
      filePath,
      fileName: path.basename(filePath),
    };
  } catch (error) {
    console.error('Error loading log file:', error);
    throw new Error('Error al cargar el archivo de log');
  }
});

// Create a new log file
ipcMain.handle('create-log', async (_, { name, settings = {} }) => {
  const logsDir = path.join(app.getPath('userData'), 'Logs');
  await fs.mkdir(logsDir, { recursive: true });

  // Check if log already exists using the same check as the log-exists handler
  const logs = await getAllLogs();
  const logName = name.endsWith('.json') ? name : `${name}.json`;
  const logExists = logs.some((log) => log.fileName.toLowerCase() === logName.toLowerCase());

  if (logExists) {
    throw new Error('Ya existe un log con ese nombre');
  }

  try {
    // Clean and validate the log name
    const cleanName = name.trim();
    if (!cleanName) {
      throw new Error('El nombre del log no puede estar vacío');
    }

    // Create a safe filename (only allow alphanumeric, spaces, and underscores)
    const safeName = cleanName
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    const logFilename = `${safeName}.json`;
    const logPath = path.join(logsDir, logFilename);

    const timestamp = new Date().toISOString();
    const logData = {
      id: timestamp,
      name: cleanName,
      createdAt: timestamp,
      settings,
      qsos: [],
    };

    await fs.writeFile(logPath, JSON.stringify(logData, null, 2));
    return { ...logData, path: logPath };
  } catch (error) {
    console.error('Error creating log:', error);
    throw new Error('Failed to create log');
  }
});

// Delete a log file
ipcMain.handle('delete-log', async (_, filePath) => {
  try {
    // Check if the file exists before trying to delete it
    try {
      await fs.access(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error('El archivo del log no existe');
      }
      throw error;
    }

    // Delete the log file
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting log file:', error);
    throw new Error(`Error al eliminar el log: ${error.message}`);
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
