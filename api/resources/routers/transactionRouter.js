const { Router } = require("express");
const { QueryTypes } = require("sequelize");
const { getDB } = require("../../../db_sql");
const { createQueriesForModel } = require("../../../db_sql/queries");

const router = Router();
const transactionQueries = createQueriesForModel("Transaction");
const booksQueris = createQueriesForModel("Book");
const userQueries = createQueriesForModel("User");
const { authCheck } = require("../utils");

router.post("/", authCheck, (req, res, next) => {
  const UserId = req.userId,
    BookId = req.body.bookId;
  transactionQueries
    .insert({ UserId, BookId })
    .then((transaction) => {
      res.locals.data = {
        success: true,
        transaction,
        message: "You have successfully bought the book",
      };
      userQueries.findOne({ id: req.userId }).then((user) => {
        userQueries.update(
          { id: req.userId },
          { resources: user.resources - 1 }
        );
      });
      booksQueris.findOne({ id: BookId }).then((book) => {
        booksQueris.update({ id: BookId }, { count: book.count - 1 });
      });
      next();
    })
    .catch((err) => {
      console.log(err);
      res.locals.data = { success: false, message: err.message };
      res.locals.status = 400;
      next();
    });
});

router.put("/", authCheck, (req, res, next) => {
  const transactionId = req.body.id;
  transactionQueries
    .update({ id: transactionId }, { returned: true })
    .then((result) => {
      res.locals.data = {
        success: true,
        message: "Returned the book successfully",
      };
      userQueries.findOne({ id: req.userId }).then((user) => {
        userQueries.update(
          { id: req.userId },
          { resources: user.resources + 1 }
        );
      });
      transactionQueries.findOne({ id: transactionId }).then((transaction) => {
        booksQueris.findOne({ id: transaction.BookId }).then((book) => {
          booksQueris.update(
            { id: transaction.BookId },
            { count: book.count + 1 }
          );
        });
      });

      next();
    })
    .catch(console.log);
});

router.get("/", authCheck, (req, res, next) => {
  const sequelize = getDB().sequelize;
  const UserId = req.userId;
  sequelize
    .query(
      "select t.id, t.BookId, b.coverURL, t.returned, t.createdAt, t.updatedAt, b.title, b.author from transactions t INNER JOIN users u ON u.id=t.UserId INNER JOIN books b ON b.id=t.BookId where u.id = ?",
      { replacements: [UserId], type: QueryTypes.SELECT }
    )
    .then((response) => {
      res.locals.data = { success: true, history: response };
      next();
    });
});

module.exports = router;
