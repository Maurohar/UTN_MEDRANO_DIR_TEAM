const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HolaMundo", function () {
  let holaMundo;
  let deployer;

beforeEach(async function () {
    [deployer] = await ethers.getSigners();
    const HolaMundo = await ethers.getContractFactory("HolaMundo");
    holaMundo = await HolaMundo.deploy(); // deploy ya retorna el contrato desplegado en ethers v6
});
  it("Debe tener el saludo inicial 'Hola Mundo'", async function () {
    expect(await holaMundo.saludo()).to.equal("Hola Mundo");
  });

  it("Debe actualizar el saludo correctamente", async function () {
    await holaMundo.setSaludo("Hola Hardhat");
    expect(await holaMundo.saludo()).to.equal("Hola Hardhat");
  });
});
