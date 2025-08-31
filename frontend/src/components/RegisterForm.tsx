import { useState } from "react";
import Web3 from "web3";
import { CONTRACT_ABI } from "../abi/ContractABI.js";

const CONTRACT_ADDRESS = import.meta.env.PUBLIC_CONTRACT_ADDRESS;

export default function RegisterForm() {
  const [universidad, setUniversidad] = useState("");
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [dniAlumno, setDniAlumno] = useState("");
  const [matriculaAlumno, setMatriculaAlumno] = useState("");
  const [matriculaBuscar, setMatriculaBuscar] = useState("");
  const [status, setStatus] = useState("");

  interface Alumno {
    nombre: string;
    dni: string;
    matricula: string;
  }

  // 🔹 Registrar alumno apuntando al nodo local
  async function registerTitle() {
    if (!universidad || !nombreAlumno || !dniAlumno || !matriculaAlumno) {
      setStatus("❌ Faltan datos");
      return;
    }

    try {
      const web3 = new Web3("http://127.0.0.1:8545");
      const contract = new web3.eth.Contract(CONTRACT_ABI as any, CONTRACT_ADDRESS);

      // Obtener la primera cuenta del nodo local
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];
      console.log("🔹 Usando cuenta:", from);

      // Enviar transacción
      const tx = await contract.methods
        .registrarAlumno(nombreAlumno, dniAlumno, matriculaAlumno)
        .send({ from });

      console.log("✅ Transacción enviada:", tx);
      setStatus(`✅ Título registrado! TX: ${tx.transactionHash}`);
    } catch (err: any) {
      console.error("❌ Error al registrar título:", err);
      setStatus("❌ Error al registrar título");
    }
  }

  // 🔹 Obtener alumno directamente por matrícula
  async function getAlumnoByMatricula(matricula: string) {
    if (!matricula) {
      setStatus("❌ Debes ingresar una matrícula");
      return;
    }

    try {
      const web3 = new Web3("http://127.0.0.1:8545");
      const contract = new web3.eth.Contract(CONTRACT_ABI as any, CONTRACT_ADDRESS);

      console.log(`🔹 Buscando alumno con matrícula: ${matricula}`);
      const alumno: Alumno = await contract.methods.obtenerAlumno(matricula).call();
      console.log("✅ Alumno encontrado:", alumno);

      setStatus(`✅ Alumno: ${alumno.nombre}, DNI: ${alumno.dni}, Matrícula: ${alumno.matricula}`);
    } catch (err: any) {
      console.error("❌ Error al obtener alumno:", err);
      setStatus("❌ Alumno no encontrado o error en la búsqueda");
    }
  }

  // 🔹 Estilos
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

  // 🔹 JSX
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
          placeholder="Ingrese matrícula del alumno"
          value={matriculaBuscar}
          onChange={(e) => setMatriculaBuscar(e.target.value)}
          style={inputStyle}
        />
        <button onClick={() => getAlumnoByMatricula(matriculaBuscar)} style={buttonStyle}>
          Buscar alumno
        </button>
      </section>
    </div>
  );
}
