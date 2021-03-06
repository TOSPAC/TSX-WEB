"use strict";
exports = module.exports = function(server){
  var ERR = require('node-restify-errors');

/**
 * @api {get} /items GetItems
 * @apiName GetItems
 * @apiGroup Item
 */
server.get('/items', function (req, res, next) {
    try {
        if( req.params['id'] == 0 )
            return res.send(new ERR.BadRequestError("InvalidParam"));

        server.conn.query("SELECT `id`, `nom` FROM `rp_items`", function(err, rows) {
            if( err )
                return res.send(new ERR.InternalServerError(err));
            if( rows.length == 0 )
                return res.send(new ERR.NotFoundError("NotFound"));
            else
                res.send(rows);
		});
    } catch ( err ) {
        return res.send(err);
    }
	next();
});
/**
 * @api {get} /items/job/:id GetItemByJob
 * @apiName GetItemByJob
 * @apiGroup Item
 * @apiParam {Integer} id Un identifiant unique correspondant au job.
 */
server.get('/items/job/:id', function (req, res, next) {
	try {
        if( req.params['id'] == 0 )
            return res.send(new ERR.BadRequestError("InvalidParam"));

        server.conn.query("SELECT `id`, `nom`, `prix`, CONVERT(CAST(CONVERT(description USING latin1) AS BINARY) USING utf8) as `description` FROM `rp_items` WHERE `job_id`=? AND `extra_cmd`<>'UNKNOWN'", [req.params['id']], function(err, rows) {
		        if( err )
              return res.send(new ERR.InternalServerError(err));
            return res.send(rows);
		});
    } catch ( err ) {
        return res.send(err);
    }
	next();
});

/**
 * @api {get} /items/:id GetItemById
 * @apiName GetItemById
 * @apiGroup Item
 * @apiParam {Integer} id Un identifiant unique correspondant au job.
 */
server.get('/items/:id', function (req, res, next) {
	try {
        if( req.params['id'] == 0 )
            return res.send(new ERR.BadRequestError("InvalidParam"));

        server.conn.query("SELECT I.`id`, I.`nom`, I.`prix`, SUBSTRING(`job_name`, LOCATE(' - ', `job_name`)+3) as `job`, CONVERT(CAST(CONVERT(description USING latin1) AS BINARY) USING utf8) as `description` FROM `rp_items` I INNER JOIN `rp_jobs` J ON I.`job_id`=J.`job_id` WHERE I.`id`=?", [req.params['id']], function(err, rows) {
		        if( err )
              return res.send(new ERR.InternalServerError(err));
            return res.send(rows[0]);
		});
    } catch ( err ) {
        return res.send(err);
    }
	next();
});

};
