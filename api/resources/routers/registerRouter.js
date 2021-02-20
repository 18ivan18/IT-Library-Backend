const { Router } = require("express");
const { createQueriesForModel } = require("../../../db_sql/queries");

const router = Router();
const userQueries = createQueriesForModel("User");
const {
  checkAndExtractUserRegisterFieldsMiddlewareFactory,
} = require("../utils");

router.post(
  "/",
  checkAndExtractUserRegisterFieldsMiddlewareFactory({ strict: true }),
  (req, res, next) => {
    userQueries
      .insert(req.body)
      .then((user) => {
        user.password = undefined;
        res.locals.data = { success: true, user };
        next();
      })
      .catch((err) => {
        res.locals.data = { success: false, message: err.message };
        res.locals.status = 400;
        next();
      });
  }
);

module.exports = router;
