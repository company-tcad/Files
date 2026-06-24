// APK Installer - JavaScript puro
class APKInstaller {
    constructor() {
        this.apks = [];
        this.initDropZone();
        this.loadInstalledApps();
    }
    
    initDropZone() {
        const dropZone = document.getElementById('dropZone');
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files)
                .filter(f => f.name.endsWith('.apk'));
            
            this.processAPKFiles(files);
        });
        
        dropZone.addEventListener('click', () => {
            document.getElementById('apkInput').click();
        });
    }
    
    async processAPKFiles(files) {
        const apkList = document.getElementById('apkList');
        apkList.innerHTML = '<p>Processando APKs...</p>';
        
        for (const file of files) {
            const apkInfo = {
                name: file.name.replace('.apk', ''),
                fileName: file.name,
                size: file.size,
                path: URL.createObjectURL(file),
                version: 'Desconhecida',
                packageName: 'Desconhecido'
            };
            
            // Tentar extrair informações reais do APK
            try {
                const zipReader = new JSZip();
                const zip = await zipReader.loadAsync(file);
                
                // Tentar ler AndroidManifest.xml
                // (Isso é simplificado - precisaria de parser AXML)
                apkInfo.packageName = file.name.replace('.apk', '').toLowerCase();
            } catch (e) {
                console.log('Erro ao analisar APK:', e);
            }
            
            this.apks.push(apkInfo);
            this.renderAPKItem(apkInfo, apkList, true);
        }
    }
    
    renderAPKItem(apkInfo, container, showInstall = false) {
        const item = document.createElement('div');
        item.className = 'apk-item';
        
        const sizeMB = (apkInfo.size / 1024 / 1024).toFixed(2);
        
        item.innerHTML = `
            <div class="apk-icon">📱</div>
            <div class="apk-info">
                <div class="apk-name">${apkInfo.name}</div>
                <div class="apk-version">v${apkInfo.version}</div>
                <div class="apk-size">${sizeMB} MB</div>
            </div>
            ${showInstall ? 
                `<button class="install-btn" onclick="installAPK('${apkInfo.fileName}')">
                    Instalar
                </button>` : ''
            }
        `;
        
        container.appendChild(item);
    }
    
    async loadInstalledApps() {
        const installedList = document.getElementById('installedList');
        
        // No ambiente web, não podemos acessar apps instalados diretamente
        installedList.innerHTML = `
            <div class="info-message">
                <p>ℹ️ Em ambiente web, não é possível listar apps instalados.</p>
                <p>Use o app nativo para esta funcionalidade.</p>
            </div>
        `;
    }
    
    searchAPK() {
        const query = document.getElementById('searchInput').value;
        const results = document.getElementById('searchResults');
        
        if (!query) {
            results.innerHTML = '';
            return;
        }
        
        results.innerHTML = '<p>Buscando por "${query}"...</p>';
        
        // Simulação de busca (substitua por API real)
        setTimeout(() => {
            results.innerHTML = `
                <div class="apk-item">
                    <div class="apk-icon">🔍</div>
                    <div class="apk-info">
                        <div class="apk-name">Resultados para "${query}"</div>
                        <div class="apk-version">Use fontes confiáveis</div>
                    </div>
                </div>
            `;
        }, 1000);
    }
}

// Funções globais
let installer;

function showTab(tabName) {
    // Esconder todas as tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Mostrar tab selecionada
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
}

function scanDeviceAPKs() {
    document.getElementById('apkInput').click();
}

function handleAPKFiles(event) {
    const files = Array.from(event.target.files);
    installer.processAPKFiles(files);
}

function installAPK(fileName) {
    showToast(`Instalando ${fileName}...`);
    
    // Redirecionar para o APK
    const apk = installer.apks.find(a => a.fileName === fileName);
    if (apk) {
        window.open(apk.path);
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    installer = new APKInstaller();
});