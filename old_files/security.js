//https://github.com/twitterdev/account-activity-dashboard/blob/master/helpers/security.js

const crypto = require('crypto')


/**
 * Creates a HMAC SHA-256 hash created from the app TOKEN and
 * your app Consumer Secret.
 * @param  token  the token provided by the incoming GET request
 * @return string
 */
module.exports.get_challenge_response = function(crc_token, consumer_secret) {

  hmac = crypto.createHmac('sha256', consumer_secret).update(crc_token).digest('base64')
  console.log(hmac)

  return hmac
}