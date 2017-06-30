var db = require('../models/mongo');
var config = require('../bin/config');
var jwt = require('jsonwebtoken');
var debug = require('debug')('activity');
var seedrandom = require('seedrandom');
var moment = require('moment');
var mail = require('./mail');
var mongoose = require('mongoose');

exports.list = function(req, res) {
	var limit = req.query.limit || 10;
	var skip = req.query.skip || 0;
	var user_id = req.user.id || '';
	
	db.activityModel.aggregate(
			[{
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
					user_fans : 1,
					thumbnail_pic : 1,
					created : 1
					}
				}, 
			{$sort:{"created" : -1}}
		])
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
	var id = req.query.id || '';
	var user_id = req.user.id || '';
	
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
				var liked = false;
				var liked = result.user_fans.some(function (user_fans) {
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
	var title = req.body.title || '';
	var thumbnail_pic = req.body.thumbnail_pic || '';
	var description = req.body.description || '';
	var abstract = req.body.abstract || '';
	var author = req.body.author || '';
	var created = req.body.created || null;

	if ( title == '' ) {
		return res.sendStatus(400);
	}

	var activity = new db.activityModel();	
	
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
	var id = req.body._id || '';
	var user_id = req.user.id || '';
	var liked = req.body.liked;

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



