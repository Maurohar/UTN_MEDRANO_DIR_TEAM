// blockchain/debug-contract.js
const hre = require("hardhat");

async function debugContract() {
  console.log("🔍 DIAGNÓSTICO COMPLETO DEL CONTRATO\n");
  
  // 1. Verificar compilación
  console.log("1️⃣ Verificando compilación...");
  const contractName = "InscripcionMatriculas";
  
  try {
    const ContractFactory = await hre.ethers.getContractFactory(contractName);
    console.log("✅ Contrato compilado correctamente");
    
    // 2. Obtener el ABI real
    const contractArtifact = await hre.artifacts.readArtifact(contractName);
    console.log("\n2️⃣ ABI REAL DEL CONTRATO:");
    console.log(JSON.stringify(contractArtifact.abi, null, 2));
    
    // 3. Verificar red local
    console.log("\n3️⃣ Verificando conexión a red local...");
    const provider = hre.ethers.provider;
    const network = await provider.getNetwork();
    console.log("📡 Red:", network.name, "ChainID:", network.chainId);
    
    // 4. Obtener cuentas
    const accounts = await hre.ethers.getSigners();
    console.log("👥 Cuentas disponibles:", accounts.length);
    console.log("🏛️ Universidad (cuenta 0):", accounts[0].address);
    
    // 5. Verificar si hay contratos desplegados
    console.log("\n4️⃣ Buscando contratos desplegados...");
    
    // Buscar en las direcciones típicas de Hardhat
    const commonAddresses = [
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
    ];
    
    for (const addr of commonAddresses) {
      try {
        const code = await provider.getCode(addr);
        if (code !== "0x") {
          console.log(`✅ Contrato encontrado en: ${addr}`);
          
          // Intentar interactuar
          const contract = new hre.ethers.Contract(addr, contractArtifact.abi, accounts[0]);
          
          try {
            const universidad = await contract.universidad();
            console.log(`🏛️ Universidad del contrato: ${universidad}`);
            
            // Intentar registrar un alumno de prueba
            console.log("🧪 Probando registro...");
            const tx = await contract.registrarAlumno("Juan Perez", "12345678", "TEST123");
            await tx.wait();
            console.log("✅ Registro exitoso!");
            
            // Intentar obtener el alumno
            console.log("🧪 Probando obtener alumno...");
            const alumno = await contract.obtenerAlumno("TEST123");
            console.log("✅ Alumno obtenido:", alumno);
            
          } catch (err) {
            console.log("❌ Error al interactuar:", err.message);
          }
        }
      } catch (err) {
        // Ignorar errores de direcciones sin contrato
      }
    }
    
    console.log("\n5️⃣ INSTRUCCIONES:");
    console.log("1. Copia el ABI de arriba al archivo frontend/src/abi/ContractABI.js");
    console.log("2. Si encontraste una dirección de contrato, úsala en tu .env");
    console.log("3. Si no, ejecuta el deploy nuevamente");
    
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

debugContract();