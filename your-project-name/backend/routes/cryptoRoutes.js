const express = require("express");
const router = express.Router();
const {
  getCryptos,
  createCrypto,
  updateCrypto,
  deleteCrypto,
} = require("../controllers/cryptoController");

router.route("/").get(getCryptos).post(createCrypto);
router.route("/:id").put(updateCrypto).delete(deleteCrypto);

module.exports = router;
