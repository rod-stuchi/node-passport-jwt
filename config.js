var fs = require("fs");

module.exports = {
  jwtSecret: fs.readFileSync('./secretb.pem'), //"MyS3cr3tK3Y",
  jwtSession: {
    session: false
  }
};
