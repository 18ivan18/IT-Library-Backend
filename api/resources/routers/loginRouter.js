const { Router } = require("express");
const { createQueriesForModel } = require("../../../db_sql/queries");
const jwt = require("jsonwebtoken");

const router = Router();
const userQueries = createQueriesForModel("User");
const {
  checkAndExtractUserLoginFieldsMiddlewareFactory,
  isPasswordValid,
} = require("../utils");

router.post(
  "/",
  checkAndExtractUserLoginFieldsMiddlewareFactory({ strict: true }),
  (req, res, next) => {
    console.log(req.body);
    userQueries
      .findOne({ username: req.body.username })
      .then((user) => {
        if (!user) {
          res.locals.data = {
            success: false,
            message: "Incorrect username",
          };
          res.locals.status = 401;
          return next();
        }

        if (!isPasswordValid(req.body.password, user.password)) {
          res.locals.data = {
            success: false,
            message: "Incorrect password",
          };
          res.locals.status = 401;
          return next();
        }
        const token = jwt.sign(
          { id: user.id },
          process.env.ACESS_TOKEN_SECRET,
          {
            expiresIn: 86400, // expires in 24 hours
          }
        );
        user.password = undefined;

        res.locals.data = { success: true, token, user };
        next();
      })
      .catch(console.log);
  }
);

module.exports = router;
