// DOM elements
const textInput = document.getElementById('textInput');
const translationOutput = document.getElementById('translationOutput');
const translationText = document.getElementById('translationText');
const loadingSpinner = document.getElementById('loadingSpinner');
const targetLanguageSelect = document.getElementById('targetLanguage');
const translateButton = document.getElementById('translateButton');
const copyButton = document.getElementById('copyButton');
const contextInput = document.getElementById('contextInput');
const configButton = document.getElementById('configButton');
const pinButton = document.getElementById('pinButton');
const configModal = document.getElementById('configModal');
const closeModal = document.getElementById('closeModal');
const baseUrlInput = document.getElementById('baseUrlInput');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveConfigButton = document.getElementById('saveConfigButton');
const cancelConfigButton = document.getElementById('cancelConfigButton');


// Translate text function
async function translateText() {
    const text = textInput.value.trim();
    const targetLanguage = targetLanguageSelect.value;
    const context = contextInput.value.trim();
    
    if (!text) {
        translationText.textContent = 'Digite um texto para traduzir.';
        translationText.style.color = '#a0aec0';
        return;
    }
    
    // Disable button and show loading
    translateButton.disabled = true;
    loadingSpinner.style.display = 'flex';
    translationText.textContent = '';
    
    try {
        const translation = await window.electronAPI.translateText(text, targetLanguage, context);
        translationText.textContent = translation;
        translationText.style.color = '#4a5568';
        
        // Show copy button if translation is successful
        if (translation && !translation.startsWith('Erro:')) {
            copyButton.style.display = 'flex';
        }
    } catch (error) {
        translationText.textContent = `Erro na tradução: ${error.message}`;
        translationText.style.color = '#e53e3e';
        copyButton.style.display = 'none';
    } finally {
        loadingSpinner.style.display = 'none';
        translateButton.disabled = false;
    }
}

// Copy translation to clipboard
async function copyToClipboard() {
    const text = translationText.textContent;
    
    if (!text || text.startsWith('Erro:')) {
        return;
    }
    
    try {
        await navigator.clipboard.writeText(text);
        
        // Show visual feedback
        const originalContent = copyButton.innerHTML;
        copyButton.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
            Copiado!
        `;
        copyButton.classList.add('copied');
        
        // Reset after 2 seconds
        setTimeout(() => {
            copyButton.innerHTML = originalContent;
            copyButton.classList.remove('copied');
        }, 2000);
        
    } catch (error) {
        console.error('Erro ao copiar texto:', error);
    }
}

// Event listeners
translateButton.addEventListener('click', translateText);
copyButton.addEventListener('click', copyToClipboard);

// Handle Enter key in text input
textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        translateText();
    }
});

// Load available languages
window.electronAPI.getLanguages().then(languages => {
    targetLanguageSelect.innerHTML = '';
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.name;
        targetLanguageSelect.appendChild(option);
    });
    targetLanguageSelect.value = 'espanhol';
});

// Configuration functions
async function openConfigModal() {
    try {
        const config = await window.electronAPI.getConfig();
        baseUrlInput.value = config.baseURL || '';
        apiKeyInput.value = config.apiKey || '';
        configModal.style.display = 'flex';
    } catch (error) {
        console.error('Erro ao carregar configuração:', error);
    }
}

function closeConfigModal() {
    configModal.style.display = 'none';
}

async function saveConfig() {
    try {
        const config = {
            baseURL: baseUrlInput.value.trim(),
            apiKey: baseUrlInput.value.trim() ? 'test' : apiKeyInput.value.trim()
        };
        
        await window.electronAPI.saveConfig(config);
        closeConfigModal();
        
        // Show success feedback
        configButton.textContent = '✅ Configurado!';
        setTimeout(() => {
            configButton.textContent = '⚙️ Configurações';
        }, 2000);
    } catch (error) {
        console.error('Erro ao salvar configuração:', error);
        alert('Erro ao salvar configuração');
    }
}

// Pin toggle function
async function togglePin() {
    try {
        const isAlwaysOnTop = await window.electronAPI.toggleAlwaysOnTop();
        if (isAlwaysOnTop) {
            pinButton.textContent = '📌';
            pinButton.classList.add('pinned');
            pinButton.title = 'Janela fixada - Clique para desafixar';
        } else {
            pinButton.textContent = '📌';
            pinButton.classList.remove('pinned');
            pinButton.title = 'Clique para fixar janela sempre no topo';
        }
    } catch (error) {
        console.error('Erro ao alternar fixação:', error);
    }
}

// Configuration event listeners
configButton.addEventListener('click', openConfigModal);
pinButton.addEventListener('click', togglePin);
closeModal.addEventListener('click', closeConfigModal);
saveConfigButton.addEventListener('click', saveConfig);
cancelConfigButton.addEventListener('click', closeConfigModal);

// Close modal when clicking outside
configModal.addEventListener('click', (e) => {
    if (e.target === configModal) {
        closeConfigModal();
    }
});

// Initialize pin button state
async function initializePinButton() {
    try {
        const config = await window.electronAPI.getConfig();
        if (config.alwaysOnTop !== false) {
            pinButton.textContent = '📌';
            pinButton.classList.add('pinned');
            pinButton.title = 'Janela fixada - Clique para desafixar';
        } else {
            pinButton.title = 'Clique para fixar janela sempre no topo';
        }
        
        configButton.title = 'Configurações da API';
    } catch (error) {
        console.error('Erro ao inicializar botão de fixação:', error);
    }
}

// Initialize app
initializePinButton();

// Auto-focus on text input
textInput.focus();