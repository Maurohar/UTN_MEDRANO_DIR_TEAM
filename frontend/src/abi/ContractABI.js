export const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "string", "name": "matricula", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "nombre", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "dni", "type": "string"}
    ],
    "name": "TituloRegistrado",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "string","name": "_matricula","type": "string"}],
    "name": "obtenerAlumno",
    "outputs": [
      {
        "components": [
          {"internalType": "string","name": "nombre","type": "string"},
          {"internalType": "string","name": "dni","type": "string"},
          {"internalType": "string","name": "matricula","type": "string"}
        ],
        "internalType": "struct InscripcionMatriculas.Alumno",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string","name": "_nombre","type": "string"},
      {"internalType": "string","name": "_dni","type": "string"},
      {"internalType": "string","name": "_matricula","type": "string"}
    ],
    "name": "registrarAlumno",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "universidad",
    "outputs": [{"internalType": "address","name": "","type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
];
