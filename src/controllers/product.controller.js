import CartDaoFactory from "../daos/cartDaoFactory.js";
import { Product } from "../models/product.model.js";
import logger from "../lib/logger.js";
import ContenedorMongo from "../classes/ContenedorMongo.js";
import config from "../config/config.js";

const productApi = new ContenedorMongo(Product);
const cartDao = CartDaoFactory.getDao(config.db);

const createProduct = async (req, res) => {
  try {
    const { title, thumbnail, price, category } = req.body;

    const productExits = await Product.findOne({ title });

    if (productExits) {
      return res.status(400).json({ error: "Product title already exists" });
    }
    if (!title || !thumbnail || !price || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newProduct = await productApi.save(req.body);

    res.status(200).json({ status: "Created ", data: newProduct });
  } catch (error) {
    throw new Error("Error al crear un producto");
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, thumbnail, category } = req.body;

    const productUpdated = await productApi.update(id, {
      title,
      price,
      thumbnail,
      category,
    });

    res.json({ status: "Updated", data: productUpdated });
  } catch (error) {
    throw new Error("Error al actualizar un producto por id ");
  }
};

const getAllProducts = async (req, res) => {
  try {
    const response = await productApi.getAll();

    res.json(response);
  } catch (error) {
    throw new Error("Error al buscar todos los productos ");
    res.json(error);
  }
};

const getByIdProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await productApi.getById(id);

    res.json({ status: "Founded", data: response });
  } catch (error) {
    throw new Error("Error al buscar un producto por id");
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await productApi.delete(id);

    res.json({ status: "Deleted", data: response });
  } catch (error) {
    throw new Error("Error al eliminar un producto por id ");
  }
};

const findProductsByCategory = async (req, res, next) => {
  try {
    const { user } = req.session.passport;
    const userCart = await cartDao.getByFilter({
      username: user.username,
    });
    const { category } = req.params;
    const filterProducts = await Product.find({ category }).lean();
    if (filterProducts.length === 0) {
      res.send("La categoria no existe");
    }
    if (!user) {
      return res.redirect("/");
    }
    res.render("cart", { cart: userCart, user, products: filterProducts });
  } catch (err) {
    logger.error(err);
  }
};

const productInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productApi.getById(id);
    if (!product) {
      return res.send("El producto no existe");
    }
    const productDetail = {
      titulo: product.title,
      imagen: product.thumbnail,
      precio: product.price,
      categoria: product.category,
    };
    res.json(productDetail);
  } catch (err) {
    next(err);
  }
};

export const productController = {
  createProduct,
  updateProduct,
  deleteProduct,
  getByIdProduct,
  getAllProducts,
  productInfo,
  findProductsByCategory,
};
