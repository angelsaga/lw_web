
import { UserModel, ActivityModel } from '../models/mongo';
import * as mongoose from "mongoose";

let config = require('../bin/config');
let jwt = require('jsonwebtoken');
let debug = require('debug')('activity');
let seedrandom = require('seedrandom');
let moment = require('moment');
let mail = require('./mail');




export class Activity {
	constructor() { }


	list(req, res) {
		return this.list_match(req, res)
	}

	list_match(req, res, id_list?) {
		let limit = req.query.limit || 10;
		let skip = req.query.skip || 0;
		let user_id = req.user.id || '';

		let opts = [];

		if (id_list) {
			opts = [
				{
					$project:
					{
						user_fans_count:
						{
							$size:
							{ "$ifNull": ["$user_fans", []] }
						},
						user_subs_count:
						{
							$size:
							{ "$ifNull": ["$user_subs", []] }
						},
						_id: 1,
						title: 1,
						user_fans: 1,
						thumbnail_pic: 1,
						created: 1
					}
				},
				{ $sort: { "created": -1 } },
				{
					$match: {
						_id: { "$in": id_list }
					}
				}
			];
		}else{
			opts = [
			{
				$project:
				{
					user_fans_count:
					{
						$size:
						{ "$ifNull": ["$user_fans", []] }
					},
					user_subs_count:
					{
						$size:
						{ "$ifNull": ["$user_subs", []] }
					},
					_id: 1,
					title: 1,
					user_fans: 1,
					thumbnail_pic: 1,
					created: 1
				}
			},
			{ $sort: { "created": -1 } }
		];
		}


		ActivityModel.aggregate(opts)
			.limit(parseInt(limit))
			.skip(parseInt(skip))
			.exec((err, result) => {
				if (err) {
					debug(err);
					return res.sendStatus(404);
				} else {
					return res.json(result);
				}
			});
	};



	getDetail(req, res) {
		let id = req.query.id || '';
		let user_id = req.user.id || '';

		if (!id || !user_id) {
			return res.sendStatus(404)
		}

		ActivityModel.aggregate(
			[
				{
					$match:
					{ _id: new mongoose.Types.ObjectId(id) }
				},
				{
					$project:
					{
						user_fans_count:
						{
							$size:
							{ "$ifNull": ["$user_fans", []] }
						},
						user_subs_count:
						{
							$size:
							{ "$ifNull": ["$user_subs", []] }
						},
						_id: 1,
						title: 1,
						thumbnail_pic: 1,
						created: 1,
						description: 1,
						user_fans: 1,
						author: 1
					}
				}
			])
			.exec((err, result) => {
				if (err) {
					debug(err);
					return res.sendStatus(404);
				} else {
					if (0 in result) {
						let r = result[0];
						let liked = false;
						liked = r['user_fans'].some(function (user_fans) {
							return user_fans.equals(user_id);
						});

						r['liked'] = liked;
						delete r['user_fans'];
						return res.json(r);
					} else {
						return res.sendStatus(404);
					}
				}
			});
	};

	save(req, res) {
		let title = req.body.title || '';
		let thumbnail_pic = req.body.thumbnail_pic || '';
		let description = req.body.description || '';
		let abstract = req.body.abstract || '';
		let author = req.body.author || '';
		let created = req.body.created || null;

		if (title == '') {
			return res.sendStatus(400);
		}

		let activity = new ActivityModel();

		activity.title = title;
		activity.thumbnail_pic = thumbnail_pic;
		activity.description = description;
		activity.abstract = abstract;
		activity.author = author;
		if (created) {
			activity.created = created;
		}


		activity.save(function (err) {
			if (err) {
				debug(err);
				return res.sendStatus(500);
			}
		});
	}

	updateDetialLike(req, res) {
		let id = req.body._id || '';
		let user_id = req.user.id || '';
		let liked = req.body.liked;

		if (liked) {
			ActivityModel.update({ _id: id }, { $pull: { user_fans: user_id } }, function (err) {
				if (err) {
					debug(err);
					return res.sendStatus(500);
				} else {
					UserModel.update({ _id: user_id }, { $pull: { activities_fans: id } }, function (err) {
						if (err) {
							debug(err);
							return res.sendStatus(500);
						}
						return res.json('ok');
					})
				}

			})
		} else {
			ActivityModel.update({ _id: id }, { $addToSet: { user_fans: user_id } }, function (err) {
				if (err) {
					debug(err);
					return res.sendStatus(500);
				} else {
					UserModel.update({ _id: user_id }, { $addToSet: { activities_fans: id } }, function (err, raw) {
						if (err) {
							debug(err);
							return res.sendStatus(500);
						} else {
							return res.json('ok');
						}
					})
				}
			})
		}

	}

	listFanActivitiesByUser(req, res) {
		let limit = req.query.limit || 10;
		let skip = req.query.skip || 0;
		let user_id = req.user.id || '';

		UserModel.findOne({ _id: user_id }, (err, user) => {
			if (err) {
				debug(err);
				return res.sendStatus(401);
			}
			return this.list_match(req, res, user.activities_fans);
		});

	};



}





