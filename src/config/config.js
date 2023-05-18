import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT,
  host: process.env.HOST,
  dbUrl: process.env.URL_MONGOATLAS,
  db: process.argv[2],
};

export default config;
