import { Cart } from "../models/cart.model.js";
import MongoDao from "./mongo.dao.js";

let instance;

export class CartMongoDao extends MongoDao {
  constructor() {
    super(Cart);
  }

  static getInstance() {
    if (!instance) instance = new CartMongoDao();

    return instance;
  }
}
