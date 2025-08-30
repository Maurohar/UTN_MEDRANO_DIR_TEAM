// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const InscripcionMatriculas = await hre.ethers.getContractFactory("InscripcionMatriculas");
  const inscripcion = await InscripcionMatriculas.deploy();

  console.log("Desplegando InscripcionMatriculas...");
  await inscripcion.waitForDeployment(); // ethers v6
  console.log("Contrato desplegado en:", await inscripcion.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
