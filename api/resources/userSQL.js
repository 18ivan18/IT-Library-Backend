const { Router } = require("express");
const { createQueriesForModel } = require("../../db_sql/queries");

const router = Router();
const userQueries = createQueriesForModel("User");
const { checkAndExtractUserFieldsMiddlewareFactory } = require("./utils");

router.get("/", (req, res, next) => {
  userQueries
    .findAll({})
    .then((users) => {
      res.locals.data = users;
      next();
    })
    .catch((err) => next(err));
});

router.get("/:id", (req, res, next) => {
  userQueries.findOne(req.params.id).then((user) => {
    res.locals.data = user;
    next();
  });
});

router.post(
  "/",
  checkAndExtractUserFieldsMiddlewareFactory({ strict: true }),
  (req, res, next) => {
    userQueries.insert(req.body).then((user) => {
      res.locals.data = user;
      next();
    });
  }
);

router.put(
  "/:id",
  checkAndExtractUserFieldsMiddlewareFactory({ strict: false }),
  (req, res, next) => {
    userQueries
      .update({ id: req.params.id }, req.body)
      .then((message) => {
        res.locals.data = message;
        next();
      })
      .catch((err) => console.log(err));
  }
);

router.delete("/:id", function (req, res, next) {
  userQueries
    .remove(req.params.id)
    .then((data) => {
      res.locals.data = data.user;
      next();
    })
    .catch((err) => next(err));
});

module.exports = router;
