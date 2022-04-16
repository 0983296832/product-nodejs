const Productdb = require("../models/product");
const Commentdb = require("../models/comment");
const Features = require("../lib/featured");

exports.create = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const product = new Productdb({
    msp: req.body.msp,
    name: req.body.name,
    amount: req.body.amount,
    price: req.body.price,
  });

  try {
    const products = await product.save();
    res.json({ success: "true", data: products });
  } catch (err) {
    res.status(500).json({
      success: "false",
      message: "Some error occurred while creating a create product",
    });
  }
};

exports.findOne = (req, res) => {
  if (req.params.msp) {
    const msp = req.params.msp;
    if (msp) {
      Productdb.find({ msp: msp })
        .populate({ path: "comments" })
        .exec()
        .then((product) => {
          if (!product) {
            res.status(404).json({
              success: false,
              message: "Not found product with msp " + msp,
            });
          } else {
            res.json({ data: product });
          }
        });
    } else {
      res.status(404).json({
        success: false,
        message: "Not found product with msp " + msp,
      });
      //
    }
  }
};

exports.findAll = async (req, res) => {
  try {
    const features = new Features(Productdb.find(), req.query)
      // .paginating()
      .sorting()
      .searching()
      .filtering();

    const result = await Promise.allSettled([
      features.query,
      Productdb.countDocuments(), //count number of products.
    ]);

    const products = result[0].status === "fulfilled" ? result[0].value : [];
    const count = result[1].status === "fulfilled" ? result[1].value : 0;

    return res.status(200).json({ products, count });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

  // Productdb.find()
  //   .then((products) => {
  //     res.json({ data: products });
  //   })
  //   .catch((err) => {
  //     res.status(500).send({
  //       success: false,
  //       message:
  //         err.message || "Error Occurred while retriving product information",
  //     });
  //   });
};

exports.delete = (req, res) => {
  const msp = req.params.msp;

  Productdb.deleteOne({ msp: msp })
    .then((data) => {
      if (!data) {
        res.status(404).json({
          message: `Cannot Delete with msp ${msp}. Maybe msp is wrong`,
        });
      } else {
        res.json({
          message: "User was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Could not delete Product with msp=" + msp,
      });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Data to update can not be empty" });
  }

  const msp = req.params.msp;

  Productdb.updateOne({ msp: msp }, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).json({
          success: false,
          message: `Cannot Update Product with ${msp}. Maybe Product not found!`,
        });
      } else {
        res.json({ success: true, data: data });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ success: false, message: "Error Update user information" });
    });
};

exports.order = (req, res) => {
  newAmount = parseInt(req.body.amount);
  console.log(newAmount);
  Productdb.updateOne({ msp: req.body.msp }, { $inc: { amount: -newAmount } })
    .then((data) =>
      res.json({ success: "true", message: "Update succsessfully" })
    )
    .catch((err) => {
      res.json({ success: "false", message: "Update false" });
    });
};

exports.comment = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const id = req.params.id;
  const commentsp = new Commentdb({
    author: req.body.author,
    comment: req.body.comment,
  });

  try {
    const comment = await commentsp.save();
    Productdb.findById(id, (err, result) => {
      if (err) {
        res.status(500).json({
          success: "false",
          message: "can not find product",
        });
      } else {
        result.comments.push(comment);
        result.save();
      }
    });
    res.status(200).json({ success: "true", comment: comment });
  } catch (err) {
    res.status(500).json({
      success: "false",
      message: "Some error occurred while creating a create comment",
    });
  }
};
