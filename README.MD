# UTN Medrano - Validación de Títulos con Blockchain

Este proyecto permite registrar y verificar títulos académicos en blockchain. Está dividido en tres partes:

1. **Frontend**: Interfaz web para registrar y verificar títulos.  
2. **Backend**: API que comunica el frontend con la blockchain.  
3. **Blockchain**: Contrato inteligente en Solidity que guarda los registros de los alumnos.

---

## Requisitos

- Node.js v18+  
- npm  
- MetaMask (para interactuar con la blockchain)  

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/Maurohar/UTN_MEDRANO_DIR_TEAM.git
cd UTN_MEDRANO_DIR

cd frontend/orbital-orbit
npm install
npm run dev



cd ../../backend
npm install
npm start


cd ../blockchain
npm install
npx hardhat node
