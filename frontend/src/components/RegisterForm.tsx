import { useState } from "react";
import Web3 from "web3";
import { CONTRACT_ABI } from "../abi/ContractABI.js";

const CONTRACT_ADDRESS = import.meta.env.PUBLIC_CONTRACT_ADDRESS;

declare global {
  interface Window {
    ethereum?: {
      request?: (...args: any[]) => Promise<any>;
      isMetaMask?: boolean;
    };
  }
}

export default function RegisterForm() {
  const [universidad, setUniversidad] = useState("");
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [dniAlumno, setDniAlumno] = useState("");
  const [matriculaAlumno, setMatriculaAlumno] = useState("");
  const [txHash, setTxHash] = useState("");
  const [status, setStatus] = useState("");

  interface Alumno {
    nombre: string;
    dni: string;
    matricula: string;
  }

  // 🔹 FUNCION: Obtener datos de alumno desde hash de transacción
  async function getTitleByTxHash(txHash: string) {
    console.log("🔹 getTitleByTxHash llamada con txHash:", txHash);
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
      console.log("🔹 Conexión Web3 creada");

      const receipt = await web3.eth.getTransactionReceipt(txHash);
      console.log("🔹 Receipt obtenido:", receipt);

      if (!receipt) {
        setStatus("❌ Transacción aún no minada");
        console.log("❌ Receipt undefined");
        return;
      }

      if (!receipt.logs || receipt.logs.length === 0) {
        setStatus("⚠️ No hay logs en esta transacción");
        console.log("⚠️ Receipt sin logs");
        return;
      }

      const log = receipt.logs[0];
      console.log("🔹 Primer log del receipt:", log);

      const decoded = web3.eth.abi.decodeLog(
        [
          { type: "string", name: "matricula", indexed: false },
          { type: "string", name: "nombre", indexed: false },
          { type: "string", name: "dni", indexed: false },
        ],
        log.data!,
        log.topics!
      );

      console.log("🔹 Evento decodificado:", decoded);

      setStatus(`✅ Alumno: ${decoded.nombre}, DNI: ${decoded.dni}, Matrícula: ${decoded.matricula}`);
    } catch (err) {
      console.error("❌ Error en getTitleByTxHash:", err);
      setStatus("❌ Error buscando transacción");
    }
  }

  // 🔹 FUNCION: Registrar alumno en blockchain
  async function registerTitle() {
    console.log("🔹 registerTitle llamada");
    if (!universidad || !nombreAlumno || !dniAlumno || !matriculaAlumno) {
      setStatus("❌ Faltan datos");
      console.log("❌ Datos incompletos:", { universidad, nombreAlumno, dniAlumno, matriculaAlumno });
      return;
    }

    try {
      if (!window.ethereum) {
        setStatus("❌ Necesitas MetaMask para registrar títulos");
        console.log("❌ MetaMask no detectado");
        return;
      }

      const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
      console.log("🔹 Conexión Web3 creada");

      const contract = new web3.eth.Contract(CONTRACT_ABI as any, CONTRACT_ADDRESS);
      console.log("🔹 Contrato instanciado:", contract.options.address);

      const accounts = await window.ethereum.request!({ method: "eth_requestAccounts" });
      const from = accounts[0];
      console.log("🔹 Cuenta Ethereum seleccionada:", from);

      const tx = await contract.methods
        .registrarAlumno(nombreAlumno, dniAlumno, matriculaAlumno)
        .send({ from });

      console.log("🔹 Transacción enviada:", tx);

      setStatus(`✅ Título registrado! TX: ${tx.transactionHash}`);
    } catch (err: any) {
      console.error("❌ Error en registerTitle:", err);
      setStatus("❌ Error al registrar en la blockchain");
    }
  }

  // 🔹 FUNCION: Obtener datos de alumno desde hash usando evento
  async function getAlumnoByTxHash(txHash: string) {
    console.log("🔹 getAlumnoByTxHash llamada con txHash:", txHash);

    if (!txHash) {
      console.log("❌ Debes pasar un hash de transacción");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum as any);
      console.log("🔹 Conexión Web3 creada");

      const contract = new web3.eth.Contract(CONTRACT_ABI as any, CONTRACT_ADDRESS);
      console.log("🔹 Contrato instanciado:", contract.options.address);

      const receipt = await web3.eth.getTransactionReceipt(txHash);
      console.log("🔹 Receipt obtenido:", receipt);

      if (!receipt || !receipt.logs || receipt.logs.length === 0) {
        console.log("❌ No se encontraron eventos en esta transacción");
        return;
      }

      const eventAbi = CONTRACT_ABI.find(
        (e) => e.name === "TituloRegistrado" && e.type === "event"
      );
      console.log("🔹 Event ABI encontrado:", eventAbi);

      if (!eventAbi) {
        console.log("❌ No se encontró la definición del evento TituloRegistrado");
        return;
      }

      const logs = receipt.logs
        .filter(
          (log): log is { data: string; topics: string[]; address: string } =>
            !!log.address && !!log.data && !!log.topics && log.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()
        )
        .map((log) => {
          const decoded = web3.eth.abi.decodeLog(eventAbi.inputs, log.data, log.topics.slice(1));
          console.log("🔹 Log decodificado:", decoded);
          return decoded;
        });

      if (logs.length === 0) {
        console.log("❌ No se encontró el evento TituloRegistrado en la transacción");
        return;
      }

      const alumno = logs[0];
      console.log("🔹 Datos del alumno desde el evento:");
      console.log("Nombre:", alumno.nombre);
      console.log("DNI:", alumno.dni);
      console.log("Matrícula:", alumno.matricula);
    } catch (err: any) {
      console.error("❌ Error al obtener los datos del alumno por txHash:", err);
    }
  }

  const containerStyle = {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start" as const,
    justifyContent: "center",
    padding: "16px",
    background: "rgba(255,255,255,0.85)",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    gap: "12px",
    width: "300px",
  };

  const inputStyle = {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    marginBottom: "12px",
  };

  const buttonStyle = {
    padding: "10px 16px",
    borderRadius: "6px",
    backgroundColor: "#3245ff",
    color: "white",
    border: "none",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <input
        type="text"
        placeholder="Entidad Universitaria"
        value={universidad}
        onChange={(e) => setUniversidad(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Nombre completo del alumno"
        value={nombreAlumno}
        onChange={(e) => setNombreAlumno(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="DNI del alumno"
        value={dniAlumno}
        onChange={(e) => setDniAlumno(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Número de matrícula del alumno"
        value={matriculaAlumno}
        onChange={(e) => setMatriculaAlumno(e.target.value)}
        style={inputStyle}
      />

      <button onClick={registerTitle} style={buttonStyle}>
        Enviar Título
      </button>

      <p>{status}</p>

      <section>
        <input
          type="text"
          placeholder="Ingrese hash de transacción"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          style={inputStyle}
        />
        <button onClick={() => getAlumnoByTxHash(txHash)} style={buttonStyle}>
          Buscar título por hash
        </button>
      </section>
    </div>
  );
}
