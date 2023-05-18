// PASSPORT STRATEGYS
import bcrypt from "bcrypt";
import LocalStrategy from "passport-local";
import { User } from "../models/user.model.js";

import logger from "./logger.js";

//persistencia
import CartDaoFactory from "../daos/cartDaoFactory.js";
import config from "../config/config.js";

const date = new Date().toLocaleString();

const cartDao = CartDaoFactory.getDao(config.db);

const hashPasword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const validatePassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

const loginStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });

    if (!user || !validatePassword(password, user.password)) {
      return done("Invalid credentials", null);
    }

    done(null, user);
  } catch (err) {
    return done("Error while login in", null);
  }
});

const registerStrategy = new LocalStrategy(
  { passReqToCallback: true },
  async (req, username, password, done) => {
    try {
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        return done("Username already in use", null);
      }

      const newUser = {
        username,
        password: hashPasword(password),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        age: req.body.age,
        photo: req.file.filename,
        admin: true,
      };

      const createdUser = await User.create(newUser);

      await cartDao.create({
        username,
        products: [],
        email: req.body.email,
        address: req.body.address,
        time: date,
      });

      req.user = createdUser;

      return done(null, createdUser);
    } catch (err) {
      logger.error(err);
      return done("Error while register", null);
    }
  }
);

export const passportStrategies = { loginStrategy, registerStrategy };
