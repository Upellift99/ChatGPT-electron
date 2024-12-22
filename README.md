## **ChatGPT Electron**

Une application Electron non officielle pour accéder à ChatGPT depuis un ordinateur de bureau. Compatible avec Linux, Windows, et macOS.

---

### **Fonctionnalités**
- Interface simple pour accéder à ChatGPT.
- Compatible avec toutes les plateformes de bureau.
- Sécurisé avec des restrictions sur la navigation externe.

---

### **Pré-requis**
1. Un système compatible :
   - Linux
   - Windows
   - macOS
2. **Node.js** (v14 ou supérieur) et npm (si vous souhaitez générer vous-même les binaires).

---

### **Installation depuis les binaires**
1. Téléchargez les fichiers binaires correspondants à votre système depuis la section des releases du dépôt GitHub.
   - **Linux** : Fichier au format AppImage ou `.deb`.
   - **Windows** : Fichier `.exe`.
   - **macOS** : Fichier `.dmg`.

2. Suivez les instructions ci-dessous pour votre plateforme :
   - **Linux** :
     ```bash
     chmod +x ChatGPT-linux-x64.AppImage
     ./ChatGPT-linux-x64.AppImage
     ```
     Ou installez le paquet `.deb` :
     ```bash
     sudo dpkg -i ChatGPT-electron_1.0.0_amd64.deb
     sudo apt-get install -f  # Pour corriger les dépendances
     ```
   - **Windows** : Double-cliquez sur le fichier `.exe` pour lancer l'installation.
   - **macOS** : Ouvrez le fichier `.dmg` et déplacez l'application dans le dossier `Applications`.

---

### **Générer soi-même les binaires**

#### **Installation des dépendances**
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/Upellift99/ChatGPT-electron.git
   cd ChatGPT-electron
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```

#### **Génération des fichiers binaires**
1. Pour **Linux** :
   ```bash
   npm run package-linux
   ```

2. Pour **Windows** :
   ```bash
   npm run package-win
   ```

3. Pour **macOS** :
   ```bash
   npm run package-mac
   ```

Les fichiers binaires seront générés dans le dossier `release-builds/`.

#### **Générer un paquet .deb pour Linux**
1. Installez l'outil pour générer un paquet Debian :
   ```bash
   npm install --save-dev electron-installer-debian
   ```

2. Exécutez la commande pour créer le paquet `.deb` :
   ```bash
   npm run deb
   ```

3. Le paquet `.deb` sera disponible dans le dossier `dist/installers/`.

---

### **Générer les icônes**
Pour garantir la compatibilité avec toutes les plateformes, vous devez convertir une icône de base en plusieurs formats.

1. **Créer une icône source** :
   - Créez une image PNG carrée de **1024x1024 pixels** pour la base.
Attribution de l'image actuelle : <a target="_blank" href="https://icons8.com/icon/FBO05Dys9QCg/chatgpt">ChatGPT</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>

2. **Convertir en `.ico` (Windows)** :
   Utilisez [ImageMagick](https://imagemagick.org/) ou un outil en ligne :
   ```bash
   convert icon.png -resize 256x256 -colors 256 icon.ico
   ```

3. **Convertir en `.icns` (macOS)** :
   Installez `icnsutils` :
   ```bash
   sudo apt install icnsutils
   ```
   Puis exécutez :
   ```bash
   png2icns icon.icns icon.png
   ```

4. **Conserver le `.png` (Linux)** :
   Aucun changement n'est nécessaire. Assurez-vous que l'image est en **1024x1024**.

Placez les fichiers générés dans le dossier `assets/icons/`.

---

### **Utilisation**
1. Lancez l'application en mode développement :
   ```bash
   npm start
   ```

2. Installez un binaire ou un paquet `.deb` sur votre machine pour un accès direct.

---

### **Contribuer**
1. Forkez ce projet.
2. Créez une branche avec votre fonctionnalité :
   ```bash
   git checkout -b feature-nouvelle-fonctionnalite
   ```
3. Envoyez une pull request.

---

### **Licence**
Ce projet est sous licence MIT.
