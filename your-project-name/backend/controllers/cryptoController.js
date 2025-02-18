const Crypto = require("../models/Crypto");

exports.getCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.find();
    res.json(cryptos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCrypto = async (req, res) => {
  const crypto = new Crypto({
    name: req.body.name,
    rate: req.body.rate,
  });

  try {
    const newCrypto = await crypto.save();
    res.status(201).json(newCrypto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCrypto = async (req, res) => {
  try {
    const crypto = await Crypto.findById(req.params.id);
    if (crypto) {
      crypto.name = req.body.name || crypto.name;
      crypto.rate = req.body.rate || crypto.rate;
      const updatedCrypto = await crypto.save();
      res.json(updatedCrypto);
    } else {
      res.status(404).json({ message: "Crypto not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCrypto = async (req, res) => {
  try {
    const crypto = await Crypto.findById(req.params.id);
    if (crypto) {
      await Crypto.findByIdAndDelete(req.params.id); // Use findByIdAndDelete
      res.json({ message: "Crypto removed" });
    } else {
      res.status(404).json({ message: "Crypto not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
