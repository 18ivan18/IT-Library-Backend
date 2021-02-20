const { Router } = require("express");
const { createQueriesForModel } = require("../../../db_sql/queries");
const { assets } = require("../../utils/constants");

const router = Router();
const transactionQueries = createQueriesForModel("Transaction");
const bookQueries = createQueriesForModel("Book");

router.get("/:id", (req, res, next) => {
  const transId = req.params.id;
  transactionQueries
    .findOne({ id: transId })
    .then((resp) => {
      bookQueries
        .findOne({ id: resp.BookId })
        .then((book) => {
          res.locals.data = `${assets}/${book.title}.pdf`;
          next();
        })
        .catch(console.log);
    })
    .catch(console.log);
});

module.exports = router;
