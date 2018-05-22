var db = require('../db');
var jwt = require('jsonwebtoken');

/*
* authentication method 
* TODO add password security with hasing and salting
* takes the email and the password, checks first the email. If email exists, check for the password associated with it. 
* if exists, return true, else return error
*/

var authenticate = function authenticate(useremail, password, cb) {
    let emailQuery = db.format(process.env.query_check_email, [useremail]);
    //query for email, check if user exists. 
    db.query(process.env.query_check_email,
        function (err, results, fields) {
            if (err) throw err;
            if (results.length > 0) {
                let passwQuery = db.format(process.env.query_check_password, [password]);
                //check for password. In the query I specified to search both the email and the password for redudancy
                db.query(passwQuery,
                    function (err, results, fields) {
                        if (results.length > 0) {
                            //creates a token 
                            var token = jwt.sign({ email: results[0].user_email, user_guid: results[0].user_guid, user_name: results[0].user_name }, process.env.SECRET_KEY, {
                                expiresIn: 28800 // expires in 8 hours
                            });
                            //if both password and email match, send a token 
                            cb(null, { "authenticated": true, "token": token, "user_name": results[0].user_name });
                        } else {
                            //if password and email don't match, return an error
                            cb({ "authenticated": "incorrect password" }, null);
                        }
                    });
            } else {
                //if the user is not found, return an error
                cb({ "authenticated": "user not found" }, null);
            }
        });

}

module.exports = authenticate;