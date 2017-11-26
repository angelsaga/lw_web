import * as https from "https";
let config = require('../../bin/config');
let querystring = require("querystring");

export class Push {
    constructor() { }

    public pushActivity(activity){
        let data = {
            description: activity.description,
            title: activity.title,
            restricted_package_name : 'top.littlewings.hb',
            notify_type : 2,
            payload : ''
        }
        let postData = querystring.stringify(data);
        this.postPush(postData);
    }
    
    public push_test(r, res){
        console.log('postData');
       /*  let data = {
            description: 'TEST API 3',
            title: 'TEST',
            restricted_package_name : 'top.littlewings.hb',
            notify_type : 2,
            payload : '' 
        }
        let postData = querystring.stringify(data);
        console.log(postData);

        //let postData1 = 'description=notificationdescription&restricted_package_name=top.littlewings.hb&title=notificationtitle&notify_type=2&payload=this+is+xiaomi+push';
        
        this.postPush(postData); */
    }

    postPush(postData){
        let headers = {
            Authorization: 'key=' + config.app_secret,
            "Content-Type": 'application/x-www-form-urlencoded',
            "Content-Length": postData.length, 
        }

        let options = {
            host: 'api.xmpush.xiaomi.com',
            port: 443,
            path: '/v3/message/all',
            method: 'post',
            headers: headers	
        };
        let body = '';   
        let req = https.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                body += chunk;  
                console.log('BODY: ' + chunk);    
            });
        });	
        req.on('error', (e) => {
           console.log("auth_user error: " + e.message);
        });
        req.write( postData );  
        req.end();
    }

}
