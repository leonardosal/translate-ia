require('dotenv').config();
const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createTray() {
  // Use the translate.png icon for the tray
  const iconPath = path.join(__dirname, 'translate.png');
  const icon = nativeImage.createFromPath(iconPath);
  
  // Resize icon for tray (16x16 for macOS)
  tray = new Tray(icon.resize({ width: 16, height: 16 }));
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mostrar TranslateIA',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createWindow();
        }
      }
    },
    {
      label: 'Sair',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('TranslateIA - Tradutor com IA');
  tray.setContextMenu(contextMenu);
  
  // Double click to show window
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    } else {
      createWindow();
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 400,
    resizable: true,
    alwaysOnTop: true,
    frame: true,
    show: false, // Don't show until ready
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');

  // Remove menu bar
  Menu.setApplicationMenu(null);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Hide to tray instead of closing
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createTray();
  createWindow();

  app.on('activate', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    } else {
      createWindow();
    }
  });
});

app.on('window-all-closed', (e) => {
  // Keep app running in background on macOS
  if (process.platform === 'darwin') {
    e.preventDefault();
  }
});

// Prevent multiple instances
app.on('second-instance', () => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
});

app.on('before-quit', () => {
  app.isQuiting = true;
});

// IPC handlers
ipcMain.handle('translate-text', async (event, text, targetLanguage, context = '') => {
  const OpenAI = require('openai');
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    // Build system message with context
    let systemMessage = `Você é um tradutor profissional. Traduza o texto fornecido para ${targetLanguage}.`;
    
    if (context) {
      systemMessage += ` Considere o seguinte contexto: ${context}.`;
    }
    
    systemMessage += ' Retorne apenas a tradução, sem explicações adicionais.';

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: text
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erro na tradução:', error);
    return `Erro: ${error.message}`;
  }
});

ipcMain.handle('get-languages', () => {
  return [
    { code: 'português', name: 'Português' },
    { code: 'inglês', name: 'English' },
    { code: 'espanhol', name: 'Español' },
    { code: 'francês', name: 'Français' },
    { code: 'alemão', name: 'Deutsch' },
    { code: 'italiano', name: 'Italiano' },
    { code: 'japonês', name: '日本語' },
    { code: 'chinês', name: '中文' },
    { code: 'russo', name: 'Русский' },
    { code: 'árabe', name: 'العربية' }
  ];
});