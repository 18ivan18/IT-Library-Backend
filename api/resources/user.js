const { Router } = require("express");
const { createQueriesForCollection } = require("../../db/queries");

const router = Router();
const userQueries = createQueriesForCollection("users");
const { checkAndExtractUserFieldsMiddlewareFactory } = require("./utils");

router.get("/", (req, res, next) => {
  userQueries.get({}).then((users) => {
    res.locals.data = users;
    next();
  });
});

router.get("/:id", (req, res, next) => {
  userQueries.get({ _id: req.params.id }).then((users) => {
    if (users.length !== 1) {
      next(new Error("Found nothing."));
    }
    res.locals.data = users[0];
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
    console.log(req.body);
    userQueries
      .update({ _id: req.params.id }, req.body)
      .then((user) => {
        res.locals.data = user;
        next();
      })
      .catch((err) => console.log(err));
  }
);

router.delete("/:id", function (req, res, next) {
  userQueries.remove({ _id: req.params.id }).then((user) => {
    res.locals.data = user;
    next();
  });
});

module.exports = router;
