import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { cartController } from "../controllers/cart.controller.js";

const router = Router();

router
  .route("/product-list")
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route("/product-list/:id")
  .get(productController.getByIdProduct)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

// datos de usuario, lista de productos, y su carrito
router.get("/productos", cartController.findCartByFilter);

//Trae la informacion de un producto por su id
router.route("/productos/info/:id").get(productController.productInfo);

//filtro por categorias
router
  .route("/productos/:category")
  .get(productController.findProductsByCategory);


export const productRouter = router;
