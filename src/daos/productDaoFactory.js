import { ProductMongoDao } from "./productMongo.dao.js";
import { ProductMemDao } from "./productMem.dao.js";

export default class ProductDaoFactory {
  static getDao(db) {
    switch (db) {
      case "MONGO":
        return ProductMongoDao.getInstance();
      case "MEM":
        return ProductMemDao.getInstance();
    }
  }
}
