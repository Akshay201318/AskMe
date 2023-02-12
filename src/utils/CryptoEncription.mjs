import CryptoJS from 'crypto-js' // Standard JavaScript cryptography library
import fetch from 'node-fetch'

const apiKey = 'VH7qBTrGPh8DKMhPWilGJESTt0HoKT1qI4bZSeXnXxP' // const apiKey = 'paste key here'
const apiSecret = 'GEdwREVqDEW3i6VWe2mcn1IPuMMXiq621PChEez9Ts6' // const apiSecret = 'paste secret here'
const token = 'pub:api:643e9578-2574-448c-8f77-3d014131a7cd-caps:a:o:f-write'

const apiPath = 'v2/auth/r/info/user'// Example path

const nonce = (Date.now() * 1000).toString() // Standard nonce generator. Timestamp * 1000
console.log(nonce);
const body = JSON.stringify({
  // scope: 'api',
  // writePermission: true,
  // ttl: 300, // 5 minutes
  // caps: ['a', 'o', 'f'] // account, orders, funding
});

let signature = `/api/${apiPath}${nonce}${body}` 

console.log("signature>>>>>>>>>>", signature);


const sig = CryptoJS.HmacSHA384(signature, apiSecret).toString();

console.log(sig);


fetch(`https://api.bitfinex.com/${apiPath}`, {
  method: 'POST',
  body: body,
  headers: {
    'Content-Type': 'application/json',
    'bfx-nonce': nonce,
    'bfx-apikey': apiKey,
    'bfx-signature': sig,
    'bfx-token': token
  }
})
.then(res => res.json())
.then(json => console.log(json)) //Logs the response body
.catch(err => {
    console.log(err)
 })