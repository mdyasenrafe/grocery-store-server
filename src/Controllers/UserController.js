const bcrypt = require("bcrypt");
const UserModel = require("../Model/UserModel");

exports.signUpUser = async (req, res) => {
  let hashedPassword;
  if (req.body?.password === req.body?.password_repeat) {
    let newPassword = req.body.password.toString();
    hashedPassword = await bcrypt?.hash(newPassword, 10);
  }
  req.body["password"] = hashedPassword;
  req.body["password_repeat"] = hashedPassword;

  UserModel.create(req.body, async (err, data) => {
    if (err) {
      res.status(200).json({ error: true, message: err });
    } else {
      res.status(200).json({
        error: false,
        message: "created successfully",
        data: data,
      });
    }
  });
};

exports.getUser = async (req, res) => {
  UserModel.findOne({ email: req?.body?.email }, async (err, item) => {
    if (item?.email) {
      res.status(200).json({
        error: false,
        data: item,
        message: "data fetch successfully",
      });
    } else {
      res.status(400).json({ error: true, message: "Nothing Found" });
    }
  });
};
