const { Router } = require("express");
const loginRouter = require("./resources/routers/loginRouter");
const registerRouter = require("./resources/routers/registerRouter");
const transactionRouter = require("./resources/routers/transactionRouter");
const bookRouter = require("./resources/routers/bookRouter");
const pdfRouter = require("./resources/routers/pdfRouter");
const quoteRouter = require("./resources/routers/quoteRouter");

module.exports.connect = function (app, path) {
  const router = Router();

  router.use("/login", loginRouter, function (req, res) {
    res.status(res.locals.status || 200).send(res.locals.data);
  });

  router.use("/signup", registerRouter, function (req, res) {
    res.status(res.locals.status || 200).send(res.locals.data);
  });

  router.use("/books", bookRouter, function (req, res) {
    res.status(res.locals.status || 200).send(res.locals.data);
  });

  router.use("/transactions", transactionRouter, function (req, res) {
    res.status(res.locals.status || 200).send(res.locals.data);
  });

  router.use("/getPDFDocument", pdfRouter, function (req, res) {
    res.status(res.locals.status || 200).sendFile(res.locals.data);
  });

  router.use("/quote", quoteRouter, function (req, res) {
    res.status(res.locals.status || 200).send(res.locals.data);
  });

  app.use(path, router);
};
