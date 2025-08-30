// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract InscripcionMatriculas {

    struct Alumno {
        string nombre;
        string dni;
        string matricula;
    }
    // Mapeo desde la matrícula a los datos del alumno
    mapping(string => Alumno) private registros;

    // Dirección de la universidad autorizada
    address public universidad;

    // Evento para registrar la inscripción
    event TituloRegistrado(string matricula, string nombre, string dni);

    constructor() {
        universidad = msg.sender; // quien despliega el contrato es la universidad
    }

    // Modificador para funciones solo para la universidad
    modifier soloUniversidad() {
        require(msg.sender == universidad, "Solo la universidad puede ejecutar esta accion");
        _;
    }

    // Registrar un nuevo alumno
    function registrarAlumno(
        string memory _nombre,
        string memory _dni,
        string memory _matricula
    ) public soloUniversidad {
        // Evitar sobreescribir un registro existente
        require(bytes(registros[_matricula].matricula).length == 0, "La matricula ya existe");

        registros[_matricula] = Alumno(_nombre, _dni, _matricula);
        emit TituloRegistrado(_matricula, _nombre, _dni);
    }

    // Verificar los datos de un alumno por matrícula
    function obtenerAlumno(string memory _matricula) public view returns (Alumno memory) {
        require(bytes(registros[_matricula].matricula).length != 0, "Alumno no registrado");
        return registros[_matricula];
    }
}
