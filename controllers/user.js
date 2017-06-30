let db = require('../models/mongo');
let config = require('../bin/config');
let jwt = require('jsonwebtoken');
let debug = require('debug')('user');
let seedrandom = require('seedrandom');
let moment = require('moment');
let mail = require('./mail');

exports.login = function(req, res) {
	let username = req.body.username || '';
	let password = req.body.password || '';
	let verifycode = req.body.verifycode || '';
	
	if (username == '' || password == '') { 
		return res.sendStatus(401); 
	}

	db.userModel.findOne({username: username}, function (err, user) {
		if (err) {
			debug(err);
			return res.sendStatus(401);
		}

		if (user == undefined) {
			return res.sendStatus(401);
		}
		if(verifycode){
			user.verifyCode(verifycode, function(isMatch) {
				if (!isMatch) {
					return res.sendStatus(401);
	            }else if (isMatch == 1) {
	            	user.encryptPassword(password, function(hash){
	            		db.userModel.update({username:user.username}, {password:hash, verifycode:{}}, function(err, nbRow) {
	    					if (err) {
	    						debug(err);
	    						return res.sendStatus(500);
	    					}
	    					let token = jwt.sign({id: user._id, username:user.username}, config.secret_token, { expiresIn: config.token_expiration });
	    					return res.json({token:token});
	    				});   
	            	});
	            }else if (isMatch == 2) {
	            	if(user.verifycode.count > 0){
	            		user.verifycode.count --;
		            	db.userModel.update({username:user.username}, {verifycode:user.verifycode}, function(err, nbRow) {
		    				if (err) {
		    					debug(err);
		    					return res.sendStatus(500);
		    				}
		    				return res.sendStatus(403);
			    		});
	            	}else{
	            		return res.sendStatus(404);  
	            	}	            	
	            }
			});
		}else{
			user.comparePassword(password, function(isMatch) {
				if (!isMatch) {
					debug("Failed to login with " + user.username);
					return res.sendStatus(401);
	            }

				let token = jwt.sign({id: user._id, username:user.username}, config.secret_token, { expiresIn: config.token_expiration });
				return res.json({token:token});
			});
		}

	});
};

exports.register = function(req, res) {	
	let username = req.body.username || '';
	let password = req.body.password || '';

	if (username == '' || password == '') {
		return res.sendStatus(400);
	}

	let user = new db.userModel();
	user.username = username;
	user.password = password;

	user.save(function(err) {
		if (err) {
			debug(err);
			return res.sendStatus(500);
		}	
		
		db.userModel.count(function(err, counter) {
			if (err) {
				debug(err);
				return res.sendStatus(500);
			}

			if (counter == 1) {
				db.userModel.update({username:user.username}, {is_admin:true}, function(err, nbRow) {
					if (err) {
						debug(err);
						return res.sendStatus(500);
					}

					debug('First user created as an Admin');
					let token = jwt.sign({id: user._id, username:user.username}, config.secret_token, { expiresIn: config.token_expiration });
					return res.json({token:token});
				});
			} 
			else {
				let token = jwt.sign({id: user._id, username:user.username}, config.secret_token, { expiresIn: config.token_expiration });
				return res.json({token:token});
			}
		});
	});
}


exports.sendVerifyCode = function(req, res) {	
	let username = req.body.username || '';

	if (username == '') {
		return res.sendStatus(400);
	}
	
	db.userModel.findOne({username: username}, function (err, user) {
		if (err) {
			debug(err);
			return res.sendStatus(401);
		}

		if (user == undefined) {
			return res.sendStatus(401);
		}
		//verifycode can be used for 5 times
		if (user.verifycode && user.verifycode.count > 0){
			return res.sendStatus(402);
		}else{
			let rng = seedrandom();
			let code = Math.abs(parseInt(rng.int32()/100000));
			let verifycode_mix = {
					verifycode: code,
					count : 5,
					date: moment().format()
			}
			
			db.userModel.update({username:user.username}, {verifycode:verifycode_mix}, function(err, nbRow) {
				if (err) {
					debug(err);
					return res.sendStatus(500);
				}
				return res.json({mailstatus:0});
			});
			mail.sendmail(user, code)
			
		}
		
		

	});
	
	

	
}

