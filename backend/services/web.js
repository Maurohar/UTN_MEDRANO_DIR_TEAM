import Web3 from "web3"; 
import dotenv from "dotenv";
import { CONTRACT_ABI } from "../../frontend/src/abi/ContractABI"; // Ajusta la ruta si es necesario

dotenv.config();

const web3 = new Web3(process.env.PUBLIC_QUICKNODE_RPC);

export async function registerTitleOnBlockchain(nombreAlumno, dniAlumno, matriculaAlumno) {
  const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
  web3.eth.accounts.wallet.add(account);

  const contract = new web3.eth.Contract(CONTRACT_ABI, process.env.PUBLIC_CONTRACT_ADDRESS);

  const hash = web3.utils.sha3(
    `UTN Medrano|${nombreAlumno}|Tecnicatura Universitaria en Programación|26/08/2025|Universitario|${dniAlumno}|${matriculaAlumno}`
  );

  try {
    const tx = await contract.methods.registerTitle(hash)
      .send({ from: account.address, gas: 3000000 });
    return tx.transactionHash;
  } catch (err) {
    console.error(err);
    throw new Error("Error al registrar el título en blockchain");
  }
}
