# WT-Log

<div align="right">
  <small>
    <a href="#english-version">English</a> | 
    <a href="#versión-en-español">Español</a>
  </small>
</div>

## 🌐 English Version

WT-Log is an amateur radio contact (QSO) logging application developed with Electron and React. It provides an intuitive interface to log, manage, and export radio contacts.

### 🚀 Features

- 📝 Detailed QSO contact logging
- 🔍 Search and filter contacts
- 📊 Statistics visualization
- 📤 Data export in multiple formats
- 🎨 Modern and responsive user interface
- 🌓 Light/dark mode
- 🔄 Cloud sync (coming soon)

### 🛠️ Technologies

- ⚛️ **Frontend**: React 18
- 🖥️ **Desktop**: Electron
- 🎨 **UI**: Material-UI (MUI) v5
- 📊 **Charts**: (to be implemented)
- 📦 **State Management**: React Hooks
- 📱 **Responsive Design**: MUI Grid and Flexbox

### 📦 Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Git

### 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tu-usuario/wt-log.git
   cd wt-log
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### 🛠️ Development

To start the application in development mode:

```bash
npm run dev
```

### 📦 Build the Application

#### Windows
```bash
npm run build:win
```

#### macOS
```bash
npm run build:mac
```

#### Linux
```bash
npm run build:linux
```

---

<div id="versión-en-español">

## 🌐 Versión en Español

WT-Log es una aplicación de registro de contactos de radioaficionados (QSO) desarrollada con Electron y React. Proporciona una interfaz intuitiva para registrar, gestionar y exportar contactos de radio.

### 🚀 Características

- 📝 Registro detallado de contactos QSO
- 🔍 Búsqueda y filtrado de contactos
- 📊 Visualización de estadísticas
- 📤 Exportación de datos en múltiples formatos
- 🎨 Interfaz de usuario moderna y responsiva
- 🌓 Modo claro/oscuro
- 🔄 Sincronización con servicios en la nube (próximamente)

### 🛠️ Tecnologías

- ⚛️ **Frontend**: React 18
- 🖥️ **Desktop**: Electron
- 🎨 **UI**: Material-UI (MUI) v5
- 📊 **Gráficos**: (pendiente de implementar)
- 📦 **Gestión de estado**: React Hooks
- 📱 **Diseño Responsive**: MUI Grid y Flexbox

### 📦 Requisitos previos

- Node.js 16.x o superior
- npm 8.x o superior
- Git

### 🚀 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/wt-log.git
   cd wt-log
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

### 🛠️ Desarrollo

Para iniciar la aplicación en modo desarrollo:

```bash
npm run dev
```

### 📦 Construir la aplicación

#### Windows
```bash
npm run build:win
```

#### macOS
```bash
npm run build:mac
```

#### Linux
```bash
npm run build:linux
```

### 🏗️ Estructura del proyecto

```
wt-log/
├── src/
│   ├── main/           # Código del proceso principal de Electron
│   ├── preload/        # Scripts de precarga
│   └── renderer/       # Aplicación React
│       ├── assets/     # Recursos estáticos
│       ├── components/ # Componentes de React
│       └── src/        # Código fuente principal de la aplicación
├── .eslintrc.json      # Configuración de ESLint
├── .prettierrc         # Configuración de Prettier
└── electron.vite.config.mjs  # Configuración de Vite
```

### 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

### 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, lee las [pautas de contribución](CONTRIBUTING.md) antes de enviar un pull request.

### 📧 Contacto

¿Preguntas o sugerencias? ¡No dudes en abrir un issue!

</div>
