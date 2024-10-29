import { Usuario } from "../model/Usuario";

async function testUsuario() {
  let usuario = new Usuario();

  usuario.username = "guilherme";
  usuario.password = "1234";

  await usuario.findUser();
}

testUsuario();
