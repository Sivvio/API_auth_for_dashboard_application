var jwt = require('jsonwebtoken');

var checkToken = function checkToken(token, cb) {

    //verify token
    jwt.verify(token, process.env.SECRET_KEY, function (err, verified) {
        //if decoded send email, else send token expired
        if (verified) {
            cb(null, { "email": verified.email, 'id':verified.user_guid });
        } else {
            cb({ "err": "token expired" }, null);
        }
    });

}

module.exports = checkToken;