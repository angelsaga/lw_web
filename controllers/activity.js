let db = require('../models/mongo');
let config = require('../bin/config');
let jwt = require('jsonwebtoken');
let debug = require('debug')('activity');
let seedrandom = require('seedrandom');
let moment = require('moment');
let mail = require('./mail');
let mongoose = require('mongoose');


exports.list = function(req, res) {
	return list_match(req, res)
}

function list_match(req, res, id_list) {
	let limit = req.query.limit || 10;
	let skip = req.query.skip || 0;
	let user_id = req.user.id || '';	
	
	let opts = [		
			
			{$project :
				{
				user_fans_count :
					{$size : 
						{"$ifNull" : ["$user_fans",[]]}
					},
				user_subs_count :
					{$size : 
						{"$ifNull" : ["$user_subs",[]]}
					},
				_id : 1,
				title : 1,
				user_fans : 1,
				thumbnail_pic : 1,
				created : 1
				}
			}, 
		{$sort:{"created" : -1}}
	];

	
	if(id_list){
		opts.push({ 
			$match: {
		        _id: { "$in": id_list } 
		    	}
			})
	}
	
	
	db.activityModel.aggregate(opts)
		.limit(parseInt(limit))
		.skip(parseInt(skip))	
	    .exec(function (err, result) {
		if (err) {
			debug(err);
			return res.sendStatus(404);
		}else{
			return res.json(result);
		}
	});
};



exports.getDetial = function(req, res) {
	let id = req.query.id || '';
	let user_id = req.user.id || '';
	
	if(! id || ! user_id){
		return res.sendStatus(404)
	}
	
	db.activityModel.aggregate(
			[
				{ $match : 
					{ _id : new mongoose.Types.ObjectId(id) } 
				},
				{
					$project :					
						{
						user_fans_count :
							{$size : 
								{"$ifNull" : ["$user_fans",[]]}
							},
						user_subs_count :
							{$size : 
								{"$ifNull" : ["$user_subs",[]]}
							},
						_id : 1,
						title : 1,
						thumbnail_pic : 1,
						created : 1,
						description : 1,
						user_fans : 1,
						author : 1
				}
			}
		])
	    .exec(function (err, result) {
		if (err) {
			debug(err);
			return res.sendStatus(404);
		}else{
			if(0 in result){
				result = result[0];
				let liked = false;
				liked = result.user_fans.some(function (user_fans) {
				    return user_fans.equals(user_id);
				});	
				
				result.liked = liked;
				delete result.user_fans;
				return res.json(result);
			}else{
				return res.sendStatus(404);
			}	
		}
	});	
};

exports.save = function(req, res) {
	let title = req.body.title || '';
	let thumbnail_pic = req.body.thumbnail_pic || '';
	let description = req.body.description || '';
	let abstract = req.body.abstract || '';
	let author = req.body.author || '';
	let created = req.body.created || null;

	if ( title == '' ) {
		return res.sendStatus(400);
	}

	let activity = new db.activityModel();	
	
	activity.title = title;
	activity.thumbnail_pic = thumbnail_pic;
	activity.description = description;
	activity.abstract = abstract;
	activity.author = author;
	if(created){
		activity.created = created;
	}
	

	activity.save(function(err) {
		if (err) {
			debug(err);
			return res.sendStatus(500);
		}
	});
}

exports.updateDetialLike = function(req, res) {
	let id = req.body._id || '';
	let user_id = req.user.id || '';
	let liked = req.body.liked;

	if(liked){
		db.activityModel.update({_id : id }, { $pull : { user_fans : user_id } }, function(err) {
			if (err) {
				debug(err);
				return res.sendStatus(500);
			}else{
				db.userModel.update({_id : user_id }, { $pull : { activities_fans : id } }, function(err) {
					if (err) {
						debug(err);
						return res.sendStatus(500);
					}
					return res.json('ok');
				})
			}
			
		})
	}else{		
		db.activityModel.update({ _id : id }, { $addToSet : { user_fans : user_id } }, function(err) {
			if (err) {
				debug(err);
				return res.sendStatus(500);
			}else{
				db.userModel.update({_id : user_id }, { $addToSet : { activities_fans : id } }, function(err, raw) {
					if (err) {
						debug(err);
						return res.sendStatus(500);
					}else{
						return res.json('ok');
					}
				})
			}			
		})		
	}
	
}

exports.listFanActivitiesByUser = function(req, res) {
	let limit = req.query.limit || 10;
	let skip = req.query.skip || 0;
	let user_id = req.user.id || '';
	
	db.userModel.findOne({_id : user_id}, function (err, user) {
		if (err) {
			debug(err);
			return res.sendStatus(401);
		}
		return list_match(req, res, user.activities_fans);
	});
	
};
