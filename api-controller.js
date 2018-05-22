var checkToken = require('./authentication/check-token');
var authenticate = require('./authentication/authenticate');

module.exports = function (app, db) {
    app.post('/login', (req, res) => {
        var username = req.body.username;
        var password = req.body.password;
        authenticate(username, password, function (err, success) {
            if (success) {
                res.send(success);
            } else {
                res.send(err);
            }
        });
    });

    app.post('/projects', (req, res) => {
        var token = req.get('authentication');
        fromTokenQuery(token, process.env.query_auth , (err, results) => {
            if (results) res.send(results);
            else res.send(err);
        });
    });

    app.post("/contracts", (req, res) => {
        var token = req.get('authentication');
        query(token, process.env.query_contracts, req.body.query, (err, results) => {
            if (results) res.send(results);
            else res.send(err);
        })
    });

    app.post("/contractTeam", (req, res) => {
        var token = req.get('authentication');
        query(token, process.env.query_contract_team, req.body.query, (err, results) => {
                if (results) res.send(results);
                else res.send(err);
            });
    });

    app.post("/getLists", (req, res) => {
        var token = req.get('authentication');
        var sizes = [];
        var los = [];
        query(token, process.env.get_project_size, null, (err, results) => {
            results.forEach(element => {
                sizes.push(element.project_size);
            });
        });
        query(token, process.env.get_project_los, null, (err, results) => {
            results.forEach(element => {
                los.push(element.project_los);
            });
        });

        let interval = setInterval(() => {
            if (sizes != null && los != null) {
                res.send({ "project_size": sizes, "project_los": los });
                clearInterval(interval);
            }
        }, 100);
    });

    app.post("/createProject", (req, res)=>{

    });

    //use it whenever we need to query something that comes from the token
    function query(token, query, queryObject, cb) {
        checkToken(token, function (err, verified) {
            if (verified) {
                var newQuery = db.format(query, [queryObject])
                db.query(newQuery,
                    function (err, results, fields) {
                        if (results.length > 0) {
                            cb(null, results);
                        } else {
                            cb({ "error": "sorry something wrong with fetching the data" }, null);
                        }
                    });
            }
        });
    }

    //use it whenever we need to query something that comes from the token
    function fromTokenQuery(token, query, cb) {
        checkToken(token, function (err, verified) {
            if (verified) {
                var newQuery = db.format(query, [verified.id]);
                db.query(newQuery,
                    function (err, results, fields) {
                        if (results.length > 0) {
                            cb(null, results);
                        } else {
                            cb({ "error": "sorry something wrong with fetching the data" }, null)
                        }
                    });
            }
        });
    }
};