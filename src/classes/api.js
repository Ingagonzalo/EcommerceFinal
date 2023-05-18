import knex from "knex";
import logger from "../lib/logger.js";

//CRUD
class Contenedor {
  constructor(databaseConfig, tableName) {
    this.database = knex(databaseConfig);
    this.table = tableName;
  }
  // GUARDAR PRODUCTO
  async save(document) {
    try {
      const response = await this.database(this.table).insert(document);

      return response;
    } catch (err) {
      logger.error(err);
    }
  }
  // UPDATE  PRODUCTO
  async replace(id, document) {
    try {
      const response = await this.database(this.table)
        .where({ id })
        .update(document);

      return response;
    } catch (err) {
      throw new Error(`error: documento no encontrado`);
    }
  }
  // OBTENER PRODUCTO BY ID
  async getById(id) {
    try {
      const response = await this.database
        .from(this.table)
        .select("*")
        .where({ id });

      return response;
    } catch (err) {
      throw new Error(`No se encuentra el documento con id: ${err}`);
    }
  }
  // OBTENER PRODUCTOS
  async getAll() {
    try {
      const response = await this.database.from(this.table).select("*");
      return response;
    } catch {
      return { error: "producto no encontrado" };
    }
  }
  // ELIMINAR BY ID
  async deleteById(id) {
    try {
      await this.database(this.table).del().where({ id });

      return true;
    } catch (err) {
      throw new Error(`Error al borrar data: ${err}`);
    }
  }
  // ELIMINAR TODO
  async deleteAll() {
    try {
      await this.database(this.table).del();
    } catch (err) {
      throw new Error(`Error al escribir: ${err}`);
    }
  }
}

export default Contenedor;
