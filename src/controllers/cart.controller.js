import ContenedorMongo from "../classes/ContenedorMongo.js";
import config from "../config/config.js";
import logger from "../lib/logger.js";
import { Orders } from "../models/orders.model.js";
import { Product } from "../models/product.model.js";
import { SendMails } from "../services/nodemailer.js";
import CartDaoFactory from "../daos/cartDaoFactory.js";

const productApi = new ContenedorMongo(Product);
const cartDao = CartDaoFactory.getDao(config.db);
const orderApi = new ContenedorMongo(Orders);

const createCart = async (req, res, next) => {
  try {
    const response = await cartDao.create(req.body);

    return response;
  } catch (err) {
    next(err);
  }
};

const updateCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await productApi.getById(productId);

    const cart = await cartDao.getByFilter({
      username: req.session.passport.user.username,
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (cart.products.some((item) => item.title === product.title)) {
      cart.products.find((item) => item.title === product.title).quantity++;
    } else {
      cart.products.push(product);
    }

    await cartDao.update(
      { username: req.session.passport.user.username },
      cart
    );
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
    logger.error({ error: err }, "Error adding product");

    res.sendStatus(500);
  }
};

const deleteCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await cartDao.delete(id);

    return response;
  } catch (err) {
    next(err);
  }
};

const findAllCarts = async (req, res, next) => {
  try {
    const response = await cartDao.getAll();

    return response;
  } catch (err) {
    next(err);
  }
};

const findCartById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userCart = await cartDao.getByFilter({
      _id: id,
    });

    res.render("only-cart", { cart: userCart });
  } catch (err) {
    next(err);
  }
};

const findCartByFilter = async (req, res, next) => {
  try {
    const { user } = req.session.passport;
    const products = await productApi.getAll();
    const userCart = await cartDao.getByFilter({
      username: user.username,
    });
    if (!user) {
      return res.redirect("/");
    }
    res.render("cart", { cart: userCart, user, products });
  } catch (err) {
    logger.error(err);
  }
};

const cartOnly = async (req, res) => {
  try {
    const { user } = req.session.passport;

    const userCart = await cartDao.getByFilter({
      username: user.username,
    });
    if (!user) {
      return res.redirect("/");
    }
    res.render("only-cart", { cart: userCart, user, });
  } catch (err) {
    logger.error(err);
  }
}


const deleteProductInCart = async (req, res, next) => {
  try {
    const { user } = req.session.passport;
    const { productId } = req.params;
    const product = await productApi.getById(productId);
    const userCart = await cartDao.getByFilter({
      username: user.username,
    });

    const newArray = userCart.products.filter((item) => item._id != productId);

    await cartDao.update({ username: user.username }, { products: newArray });
    res.send("Producto eliminado");
  } catch (err) {
    logger.error(err);
  }
};

const decrementQty = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await productApi.getById(productId);
    console.log(product);
    const cart = await cartDao.getByFilter({
      username: req.session.passport.user.username,
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (cart.products.some((item) => item.title === product.title)) {
      cart.products.find((item) => item.title === product.title).quantity--;

      if (
        cart.products.find((item) => item.title === product.title).quantity ===
        0
      ) {
        cart.products = cart.products.filter(
          (item) => item.title !== product.title
        );
      }
    }

    await cartDao.update(
      { username: req.session.passport.user.username },
      cart
    );
    res.redirect("/cart");
  } catch (error) {
    next(error);
  }
};

const emptyCart = async (req, res, next) => {
  try {
    const cart = await cartDao.getByFilter({
      username: req.session.passport.user.username,
    });

    cart.products = [];

    const cartupdated = await cartDao.update(
      { username: req.session.passport.user.username },
      cart
    );
    console.log(cart);

    res.render("cart", { cartupdated });
    res.redirect("/productos");
  } catch (error) {
    next(error);
  }
};

const finish = async (req, res, next) => {
  try {
    const { user } = req.session.passport;
    const cart = await cartDao.getByFilter({
      username: user.username,
    });
    const orders = await orderApi.getAll();
    const date = new Date();

    const orderToSend = {
      user: cart.username,
      products: cart.products,
      orderNumber: orders.length + 1,
      email: cart.email,
      time: date.toUTCString(),
    };
    console.log(orderToSend);
    await orderApi.save(orderToSend);

    await SendMails.sendMailCart({ orderToSend });

    await cartDao.update(
      { username: cart.username },
      { products: [], username: cart.username }
    );
    res.render("finish-order", { user: user.username });
  } catch (err) {
    logger.error({ error: err }, "Error finish order");
    res.sendStatus(500);
  }
};
export const cartController = {
  createCart,
  updateCart,
  deleteCart,
  findAllCarts,
  findCartById,
  findCartByFilter,
  finish,
  deleteProductInCart,
  decrementQty,
  emptyCart,
  cartOnly
};
