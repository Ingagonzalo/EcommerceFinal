import logger from "../lib/logger.js";
import { SendMails } from "../services/nodemailer.js";
import { args } from "../server.js";
import ContenedorMongo from "../classes/ContenedorMongo.js";
import { Chat } from "../models/chat.model.js";

const chatApi = new ContenedorMongo(Chat);

const getAdmin = async (req, res) => {
  try {
    const { user } = req.session.passport;
    console.log(user.admin);
    if (user.admin === false) {
      return res.redirect("/");
    }
    res.render("admin", {
      user,
    });
  } catch (err) {
    logger.error(err);
  }
};

const getLoginMail = (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    SendMails.sendMail(
      user.username,
      user.firstname,
      user.lastname,
      user.email,
      user.phone,
      user.address,
      user.age
    );
    return res.render("bienvenida", {
      usuario: user.username,
      nombre: user.firstname,
      apellido: user.lastname,
      email: user.email,
      tel: user.phone,
      direccion: user.address,
      edad: user.age,
      imagen: user.photo,
    });
  }

  res.render("login");
};

const getLogin = (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;

    return res.render("bienvenida", {
      usuario: user.username,
      nombre: user.firstname,
      apellido: user.lastname,
      tel: user.phone,
      direccion: user.address,
      edad: user.age,
      email: user.email,
      imagen: user.photo,
    });
  }
  res.render("login");
};

const getUser = (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;

    return res.render("user", {
      usuario: user.username,
      nombre: user.firstname,
      apellido: user.lastname,
      tel: user.phone,
      direccion: user.address,
      edad: user.age,
      email: user.email,
      imagen: res.locals.image,
    });
  }

}


const getRegister = (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.session.user;
    const image = req.file.filename;
    res.locals.image = `${image}`;

    logger.info("Get register");

    return res.render("bienvenida", {
      usuario: user.username,
      nombre: user.firstname,
      apellido: user.lastname,
      tel: user.phone,
      direccion: user.address,
      edad: user.age,
      email: user.email,
      imagen: res.locals.image,
    });
  }
  res.render("register");
};

const getLoginFailiure = (req, res) => {
  res.render("login-error");
};

const getRegisterFailiure = (req, res) => {
  res.render("signup-error");
};

const logOut = (req, res) => {
  const username = req.user.username;

  req.logout(() => {
    return res.render("logout", { username });
  });
};

const getInfo = (req, res) => {
  res.render("info", {
    entryArgs: JSON.stringify(args),
    platform: process.platform,
    versionNode: process.version,
    memory: process.memoryUsage().rss,
    path: process.execPath,
    processID: process.pid,
    dir: process.cwd(),
  });
};

const globalChat = (req, res) => {
  const { user } = req.session.passport;
  console.log(user);
  if (!user) {
    return res.send("Usuario no encontrado");
  }
  res.render("chat-global");
};

const findChatByMail = async (req, res) => {
  const { email } = req.params;
  const { user } = req.session.passport;
  if (!user) {
    return res.send("Usuario no encontrado");
  }
  const chats = await chatApi.getAll();
  const userChat = chats.filter((chat) => chat.username === email);

  res.render("find-chat", { userChat });
};

export const authController = {
  getLoginMail,
  getAdmin,
  getLogin,
  getRegister,
  getLoginFailiure,
  getRegisterFailiure,
  logOut,
  getInfo,
  globalChat,
  findChatByMail,
  getUser,
};
