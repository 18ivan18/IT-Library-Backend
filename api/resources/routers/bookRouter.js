const { Router } = require("express");
const { createQueriesForModel } = require("../../../db_sql/queries");
const { download } = require("../../utils/download");
const { assets } = require("../../utils/constants");

const router = Router();
const bookQueries = createQueriesForModel("Book");
const {
  checkAndExtractBookPostFieldsMiddlewareFactory,
  checkAndExtractBookQueryFieldsMiddlewareFactory,
} = require("../utils");

router.post(
  "/",
  checkAndExtractBookPostFieldsMiddlewareFactory({ strict: true }),
  (req, res, next) => {
    console.log(req.body);
    bookQueries
      .insert(req.body)
      .then((book) => {
        download(req.body.pdfURL, `${assets}/${req.body.title}.pdf`);
        res.locals.data = {
          success: true,
          book,
          message: "Book successfully inserted",
        };
        next();
      })
      .catch((err) => {
        res.locals.data = { success: false, message: err.message };
        res.locals.status = 400;
        next();
      });
  }
);

router.put("/", (req, res, next) => {
  console.log("yes");
  res.locals.data = { success: true, message: "yes" };
  next();
});

router.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  bookQueries
    .remove(id)
    .then((res) => {
      console.log(res);
    })
    .catch(console.log);
  res.locals.data = { success: false, message: "test" };
  next();
});

router.get(
  "/",
  checkAndExtractBookQueryFieldsMiddlewareFactory({ strict: false }),
  (req, res, next) => {
    bookQueries
      .findAll(req.query)
      .then((books) => {
        res.locals.data = { success: true, books };
        next();
      })
      .catch((err) => {
        res.locals.data = { success: false, message: err.message };
        res.locals.status = 400;
        next();
      });
  }
);

router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  bookQueries
    .findOne({ id })
    .then((book) => {
      if (book) {
        res.locals.data = { success: true, book: book.dataValues };
      } else {
        res.locals.data = { success: false, message: "Not found" };
        res.locals.status = 404;
      }
      next();
    })
    .catch(console.log);
});

module.exports = router;
