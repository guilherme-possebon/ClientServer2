import { dbQuery } from "../database";

export class Usuario {
  username: string = "";
  password: string = "";

  public async findUser(): Promise<Usuario | boolean> {
    try {
      let sql = `SELECT * FROM usuario WHERE username = $1 AND password = $2`;

      let params = [this.username, this.password];

      let result: Usuario[] = await dbQuery(sql, params);
      console.log(result);
      if (result.length > 0) {
        return true;
      }
    } catch (error) {
      console.log("Error when trying to find user", error);
    }
    return false;
  }
}
