# Estructura del Proyecto - Registro de Certificados Académicos

## 📁 Estructura de Archivos

```
academic-certificates/
├── contracts/
│   ├── CertificateRegistry.sol
│   └── migrations/
│       └── 2_deploy_contracts.js
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── UploadCertificate.js
│   │   │   ├── CertificateList.js
│   │   │   └── CertificateCard.js
│   │   ├── utils/
│   │   │   ├── web3.js
│   │   │   └── contract.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── package-lock.json
├── truffle-config.js
├── package.json
└── README.md
```

## 🔧 Tecnologías Principales

- **Blockchain**: Ethereum (Testnet: Sepolia)
- **Smart Contract**: Solidity
- **Framework**: Truffle Suite
- **Frontend**: React.js
- **Blockchain Integration**: Web3.js
- **Wallet**: MetaMask
- **Styling**: CSS moderno con gradientes y efectos
- **Storage**: IPFS para archivos de certificados

## 📋 Funcionalidades Core (MVP)

### 1. Autenticación
- Conexión con MetaMask
- Verificación de wallet address
- Estado de sesión persistente

### 2. Subida de Certificados
- Upload de archivos PDF/imagen
- Almacenamiento en IPFS
- Registro en blockchain con hash
- Metadatos: nombre, institución, fecha, tipo

### 3. Visualización
- Lista de certificados propios
- Vista detallada de cada certificado
- Verificación de autenticidad
- Búsqueda y filtros básicos

### 4. Verificación Pública
- URL pública para verificar certificados
- QR code para verificación rápida
- Historial inmutable en blockchain

## 🛠️ Setup Inicial

### Prerrequisitos
```bash
# Node.js y npm
node --version  # v16+
npm --version   # v8+

# Truffle Suite
npm install -g truffle

# Ganache CLI (blockchain local)
npm install -g ganache-cli
```

### Instalación
```bash
# Clonar e instalar dependencias
git clone <tu-repo>
cd academic-certificates
npm install

# Instalar dependencias del frontend
cd frontend
npm install
cd ..
```

### Variables de Entorno
```env
# .env
REACT_APP_INFURA_PROJECT_ID=tu_project_id
REACT_APP_CONTRACT_ADDRESS=direccion_del_contrato
IPFS_API_KEY=tu_ipfs_key
```

## 🔗 Smart Contract Básico

### Funciones Principales
- `registerCertificate()`: Registrar nuevo certificado
- `getCertificate()`: Obtener datos del certificado
- `verifyCertificate()`: Verificar autenticidad
- `getUserCertificates()`: Obtener certificados del usuario

### Eventos
- `CertificateRegistered`: Emisión al registrar
- `CertificateVerified`: Emisión al verificar

## 🎨 Diseño UI/UX

### Paleta de Colores
- Primario: `#667eea` (Azul)
- Secundario: `#764ba2` (Púrpura)
- Acento: `#f093fb` (Rosa)
- Fondo: `#f8fafc` (Gris claro)
- Texto: `#2d3748` (Gris oscuro)

### Componentes Visuales
- Gradientes suaves
- Sombras modernas (box-shadow)
- Bordes redondeados
- Animaciones sutiles
- Cards con hover effects
- Botones con estados interactivos

## 📱 Páginas Principales

1. **Landing Page**: Introducción y conexión wallet
2. **Dashboard**: Vista general de certificados
3. **Upload**: Formulario para subir certificados
4. **Certificate View**: Vista detallada individual
5. **Verify**: Página pública de verificación

## 🔐 Seguridad

- Validación de ownership en smart contract
- Hash verification para integridad
- Rate limiting en uploads
- Validación de tipos de archivo
- Sanitización de inputs

## 🚀 Deployment

### Testnet (Desarrollo)
```bash
# Compilar contratos
truffle compile

# Migrar a Sepolia testnet
truffle migrate --network sepolia

# Iniciar frontend
cd frontend
npm start
```

### Mainnet (Producción)
- Deploy en Ethereum mainnet
- Frontend en Vercel/Netlify
- IPFS pinning service
- Domain personalizado

## 📊 Roadmap Futuro

### v1.1 - Mejoras
- Multi-idioma (ES/EN)
- Notificaciones push
- Exportar certificados
- API pública

### v1.2 - Avanzado
- NFT certificates
- Batch operations
- Mobile app
- Analytics dashboard

### v1.3 - Enterprise
- Multi-tenant
- Admin panel
- Bulk verification
- Integration APIs

## 💡 Tips de Desarrollo

1. **Empezar local**: Usar Ganache para desarrollo
2. **Gas optimization**: Minimizar operaciones costosas
3. **Error handling**: Manejo robusto de errores Web3
4. **UX feedback**: Loading states y confirmaciones
5. **Mobile first**: Diseño responsive desde el inicio

## 📚 Recursos de Aprendizaje

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Web3.js Guide](https://web3js.readthedocs.io/)
- [Truffle Suite](https://trufflesuite.com/docs/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/)
- [IPFS Documentation](https://docs.ipfs.io/)

---

**Siguiente paso**: Implementar el smart contract básico y la conexión Web3 en el frontend.