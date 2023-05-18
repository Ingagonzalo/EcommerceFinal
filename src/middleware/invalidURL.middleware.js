import logger from "../lib/logger.js";

const invalidUrl = (req, res, next) => {
  logger.warn("Ruta no valida");
  logger.warn({
    method: req.method,
    url: req.url,
  });
  res.render("routing-error");
};

export const authMiddlewares = { invalidUrl };
