// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Web3 from 'web3';
import { CONTRACT_ABI } from '../frontend/orbital-orbit/src/abi/ContractABI.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

if (!process.env.PRIVATE_KEY || !process.env.PUBLIC_CONTRACT_ADDRESS || !process.env.PUBLIC_QUICKNODE_RPC) {
  console.error("❌ Falta configurar alguna variable de entorno en .env");
  process.exit(1);
}

if (!process.env.PRIVATE_KEY.startsWith("0x") || process.env.PRIVATE_KEY.length !== 66) {
  console.error("❌ PRIVATE_KEY inválida. Debe empezar con 0x y tener 64 caracteres hexadecimales.");
  process.exit(1);
}

app.post('/register', async (req, res) => {
  const { nombreAlumno, dniAlumno, matriculaAlumno } = req.body;

  if (!nombreAlumno || !dniAlumno || !matriculaAlumno) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    const web3 = new Web3(process.env.PUBLIC_QUICKNODE_RPC);
    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    web3.eth.accounts.wallet.add(account);

    console.log("Cuenta que firma:", account.address);

    const contract = new web3.eth.Contract(CONTRACT_ABI, process.env.PUBLIC_CONTRACT_ADDRESS);

    const hash = web3.utils.sha3(
      `UTN Medrano|${nombreAlumno}|Tecnicatura Universitaria en Programación|26/08/2025|Universitario|${dniAlumno}|${matriculaAlumno}`
    );

    console.log("Hash a registrar:", hash);

    // Estimar gas
    const gas = await contract.methods.registerTitle(hash).estimateGas({ from: account.address });
    console.log("Gas estimado:", gas);

    const tx = await contract.methods.registerTitle(hash).send({ from: account.address, gas });

    console.log("✅ Transacción enviada:", tx.transactionHash);
    res.json({ success: true, txHash: tx.transactionHash });

  } catch (err) {
    console.error("❌ Error al enviar transacción:", err);
    res.status(500).json({ success: false, message: err.message, stack: err.stack });
  }
});

app.get("/verify", async (req, res) => {
  const { nombreAlumno, dniAlumno, matriculaAlumno } = req.query;

  if (!nombreAlumno || !dniAlumno || !matriculaAlumno) {
    return res.status(400).json({ success: false, message: "Faltan datos del alumno" });
  }

  try {
    const web3 = new Web3(process.env.PUBLIC_QUICKNODE_RPC);
    const contract = new web3.eth.Contract(CONTRACT_ABI, process.env.PUBLIC_CONTRACT_ADDRESS);

    // Generamos el hash exactamente igual que al registrar
    const hash = web3.utils.sha3(
      `UTN Medrano|${nombreAlumno}|Tecnicatura Universitaria en Programación|26/08/2025|Universitario|${dniAlumno}|${matriculaAlumno}`
    );

    // Llamamos a verifyTitle
    const exists = await contract.methods.verifyTitle(hash).call();

    if (exists) {
      res.json({ success: true, message: "Título registrado" });
    } else {
      res.json({ success: false, message: "Título no encontrado en la blockchain" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola desde Express con ES Modules!');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
