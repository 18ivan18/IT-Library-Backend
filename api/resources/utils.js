const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

module.exports.checkAndExtractUserRegisterFieldsMiddlewareFactory = (
  { strict } = { strict: false }
) => {
  return function (req, res, next) {
    const { username, name, email, password, pizza } = req.body || {};
    if (strict && (!username || !name || !email || !password)) {
      return void next(new Error("BAD_REQUEST"));
    }
    req.body = {
      username,
      name,
      email,
      password: hashPassword(password),
      pizza,
    };
    next();
  };
};

module.exports.checkAndExtractUserLoginFieldsMiddlewareFactory = (
  { strict } = { strict: false }
) => {
  return function (req, res, next) {
    const { username, password } = req.body || {};
    if (strict && (!username || !password)) {
      return void next(new Error("BAD_REQUEST"));
    }
    req.body = { username, password };
    next();
  };
};

module.exports.checkAndExtractBookPostFieldsMiddlewareFactory = (
  { strict } = { strict: false }
) => {
  return function (req, res, next) {
    const {
      author,
      title,
      coverURL,
      description,
      count,
      type,
      tag,
      physical,
      pdfURL,
    } = req.body || {};
    if (
      strict &&
      (!author || !title || !coverURL || !description || !tag || !pdfURL)
    ) {
      return void next(new Error("BAD_REQUEST"));
    }
    req.body = {
      author,
      title,
      coverURL,
      description,
      count,
      type,
      tag,
      physical,
      pdfURL,
    };
    next();
  };
};

module.exports.checkAndExtractBookQueryFieldsMiddlewareFactory = (
  { strict } = { strict: false }
) => {
  return function (req, res, next) {
    const {
      title,
      titleExactMatch,
      author,
      authorExactMatch,
      tag,
      sortBy,
      order,
      type,
    } = req.query || {};
    req.query = {};
    if (author) {
      if (authorExactMatch === "true") {
        req.query["author"] = author;
      } else {
        req.query["author"] = { [Op.like]: `%${author}%` };
      }
    }
    if (title) {
      if (titleExactMatch === "true") {
        req.query["title"] = title;
      } else {
        req.query["title"] = { [Op.like]: `%${title}%` };
      }
    }
    if (type) {
      req.query["type"] = type;
    }
    if (tag) {
      req.query["tag"] = tag;
    }
    next();
  };
};

module.exports.authCheck = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.locals.status = 403;
    res.locals.data = { success: false, message: "No token provided." };
    return next();
  }

  jwt.verify(token, process.env.ACESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.locals.status = 500;
      res.locals.data = {
        success: false,
        message: "Failed to authenticate token.",
      };
      return next();
    }

    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
};

const hashPassword = (password) => bcrypt.hashSync(password, 8);
module.exports.isPasswordValid = (toBeChecked, actualPassword) =>
  bcrypt.compareSync(toBeChecked, actualPassword);
