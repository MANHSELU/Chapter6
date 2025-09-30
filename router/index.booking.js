const router = require('./user.booking');

module.exports = (app ) =>{
      app.use("/api/user/", router);
}