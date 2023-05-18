import { Router } from "express";

import { cartController } from "../controllers/cart.controller.js";

const router = Router();

//ver carrito solamente buscandolo por id
router.get("/cart/:id", cartController.findCartById);
//Agregar o eliminar productos en carrito por su id
router
  .route("/carrito/:productId")
  .post(cartController.updateCart)
  .delete(cartController.deleteProductInCart);

//vaciar carrito
router.post("/emptycart", cartController.emptyCart);
//ruta creada para poder restar cantidad
router.post("/decrementQty/:productId", cartController.decrementQty);

//Finalizar compra
router.post("/carrito/finish/:cartId", cartController.finish);

router.get("/cart", cartController.cartOnly)


export const cartRouter = router;
