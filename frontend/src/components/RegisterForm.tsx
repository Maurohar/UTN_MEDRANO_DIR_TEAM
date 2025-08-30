import { useState } from "react";
import Web3 from "web3";
import { CONTRACT_ABI } from '../abi/ContractABI.js';
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
  const [status, setStatus] = useState("")

  interface Alumno {
  nombre: string;
  dni: string;
  matricula: string;
  } 

  async function registerTitle() {
    if (!universidad || !nombreAlumno || !dniAlumno || !matriculaAlumno) {
      setStatus("❌ Faltan datos");
      return;
    }

    try {
      if (!window.ethereum) {
        setStatus("❌ Necesitas MetaMask para registrar títulos");
        return;
      }

      const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545")); // <<-- importante

      const contract = new web3.eth.Contract(CONTRACT_ABI as any, CONTRACT_ADDRESS);
      
      // Solicitamos cuentas de MetaMask
      const accounts = await window.ethereum.request!({ method: "eth_requestAccounts" });
      const from = accounts[0];

      const tx = await contract.methods
        .registrarAlumno(nombreAlumno, dniAlumno, matriculaAlumno)
        .send({ from });
      
      setStatus(`✅ Título registrado! TX: ${tx.transactionHash}`);
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Error al registrar en la blockchain");
    }
  }

async function verifyTitle() {
  if (!matriculaAlumno) {
    setStatus("❌ Ingrese matrícula para verificar");
    return;
  }

  try {
    const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    const contract = new web3.eth.Contract(CONTRACT_ABI as any, CONTRACT_ADDRESS);

    // PRIMERO: Verificar que el contrato responda a funciones básicas
    const universidad = await contract.methods.universidad().call();
    console.log("Universidad address:", universidad);
    
    // SEGUNDO: Intentar la consulta
    const result: any = await contract.methods.obtenerAlumno(matriculaAlumno).call();
    console.log("Tipo de resultado:", typeof result);
    console.log("Resultado completo:", result);
    
    setStatus(`✅ Resultado: ${JSON.stringify(result)}`);

  } catch (err: any) {
    console.error(err);
    setStatus("❌ Matrícula no encontrada o error del contrato");
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
    width: "300px"
  };

  const inputStyle = {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    marginBottom: "12px"
  };

  const buttonStyle = {
    padding: "10px 16px",
    borderRadius: "6px",
    backgroundColor: "#3245ff",
    color: "white",
    border: "none",
    cursor: "pointer"
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
          placeholder="Ingrese número de matrícula para verificar"
          value={matriculaAlumno}
          onChange={(e) => setMatriculaAlumno(e.target.value)}
          style={inputStyle}
        />
        <button onClick={verifyTitle} style={buttonStyle}>
          Buscar título por matrícula
        </button>
      </section>
    </div>
  );
}
