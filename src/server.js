import express, { json, urlencoded } from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import router from "./routes/index.js";
import { Server as IOServer } from "socket.io";
import dotenv from "dotenv";
import yargs from "yargs";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import { passportStrategies } from "./lib/passport.lib.js";
import { User } from "./models/user.model.js";
import { Chat } from "./models/chat.model.js";
import { authMiddlewares } from "./middleware/invalidURL.middleware.js";
import logger from "./lib/logger.js";
import ProductDaoFactory from "./daos/productDaoFactory.js";
import config from "./config/config.js";
import ContenedorMongo from "./classes/ContenedorMongo.js";

dotenv.config();

export const args = yargs(process.argv.slice(2))
  .alias({
    p: "puerto",
  })
  .default({
    puerto: 3000,
  }).argv;

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static("src/uploads"));

// definimos la configuracion HBS
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main.html",
    layoutsDir: join(__dirname, "/views/layouts"),
    partialsDir: join(__dirname, "/views/partials"),
  })
);

app.set("view engine", "hbs");
app.set("views", join(__dirname, "/views"));

app.use(express.static(__dirname + "/views/layouts"));

app.use(
  session({
    secret: "coderhouse",
    rolling: true, // Esto lo que hace es que reinicia el tiempo de expiracion de las sesiones con cada request
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000, // tiempo de expiracion de la cookie
    },
  })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

passport.use("login", passportStrategies.loginStrategy);
passport.use("register", passportStrategies.registerStrategy);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  const data = await User.findById(id);
  done(null, data);
});

app.use((req, res, next) => {
  logger.info(` Peticion a ${req.url}, con metodo ${req.method}}`);
  next();
});

app.use(router);

mongoose.set("strictQuery", true); //mongoose set para sacar warning
await mongoose.connect(process.env.URL_MONGOATLAS); //mongoose conecction
logger.info("database connected");
console.log("Database connected!");

const expressServer = app.listen(args.puerto || config.port, () => {
  logger.info(`Server listening on port ${args.puerto || config.port}`);
  console.log(`Server listening on port ${args.puerto || config.port}`);
});
const io = new IOServer(expressServer);

const productApi = ProductDaoFactory.getDao(config.db); // product api es un contenedor para los productos
const messageApi = new ContenedorMongo(Chat);

io.on("connection", async (socket) => {
  logger.info(`New connection, socket ID: ${socket.id}`);
  console.log(`New connection, socket ID: ${socket.id}`);

  // Cuando se conecta un nuevo cliente le emitimos a ese cliente todos los productos que se mandaron hasta el momento
  socket.emit("server:message", await messageApi.getAll());

  // Cuando se conecta un nuevo cliente le emitimos a ese cliente todos los productos que se mandaron hasta el momento
  socket.emit("server:product", await productApi.getAll());

  //Formateo la hora
  let date = new Date();
  let dateOficial = date.toLocaleString();

  // Nos ponemos a escuchar el evento "client:message" que recibe la info de un mensaje
  socket.on("client:message", async (messageInfo) => {
    await messageApi.save({ ...messageInfo, time: dateOficial });

    io.emit("server:message", await messageApi.getAll());
  });

  // Nos ponemos a escuchar el evento "client:product" que recibe la info de un producto
  socket.on("client:product", async (product) => {
    await productApi.create(product);

    //Emitimos a TODOS los sockets conectados el arreglo de productos actualizados
    io.emit("server:product", await productApi.getAll());
  });
});

app.use(authMiddlewares.invalidUrl);

app.on("error", (err) => {
  logger.error(err);
});
