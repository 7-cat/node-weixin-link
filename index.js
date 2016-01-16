'use strict';
var request = require("node-weixin-request");
var util = require("node-weixin-util");
var auth = require('node-weixin-auth');
var settings = require('node-weixin-settings');

var baseUrl = 'https://api.weixin.qq.com/cgi-bin/qrcode/';

function send(url, app, data, cb) {
  auth.determine(app, function () {
    settings.get(app.id, 'auth', function(authData) {
      url = url + util.toParam({
          access_token: authData.accessToken
        });
      request.json(url, data, cb);
    });
  });
}

module.exports = {
  qrcode: {
    temporary: {
      create: function (app, id, cb) {
        var data = {
          expire_seconds: 604800,
          action_name: "QR_SCENE",
          action_info: {
            scene: {
              scene_id: id
            }
          }
        };
        send(baseUrl + 'create' + '?', app, data, cb);
      }
    },
    permanent: {
      create: function (app, id, cb) {
        var data = {
          action_name: "QR_LIMIT_SCENE",
          action_info: {
            scene: {
              scene_id: id
            }
          }
        };
        send(baseUrl + 'create' + '?', app, data, cb);
      },
      createString: function (app, string, cb) {
        var data = {
          action_name: "QR_LIMIT_STR_SCENE",
          action_info: {
            scene: {
              scene_str: string
            }
          }
        };
        send(baseUrl + 'create' + '?', app, data, cb);
      }
    }
  },
  url: {
    shorten: function (app, longUrl, cb) {
      var data = {
        action: 'long2short',
        long_url: longUrl
      };
      send('https://api.weixin.qq.com/cgi-bin/shorturl?', app, data, cb);
    }
  }
};
