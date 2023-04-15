import axios from "axios";
import { ethers } from "ethers";
var request = require("request");

//@ts-ignore
async function handle(req, res) {
  let op = {};
  try {
    const auth0_id = req.body[0].auth0_id;
    const target = req.body[0].target;
    const value = req.body[0].value;
    const data = req.body[0].data;
    const provider = req.body[0].provider;
    const entryPoint = req.body[0].epAddr;
    const factory = req.body[0].factoryAddr;
    const withPm = req.body[0].withPm;
    const paymasterAddress = req.body[0].paymasterAddress;
    const cid = req.body[0].cid;

    // console.log(`${auth0_id}, "target": ${target}, "value": ${value}, "data": ${data}`);

    var options = {
      method: "POST",
      url: "https://dev-27jeufvx256r244q.us.auth0.com/oauth/token",
      headers: { "content-type": "application/json" },
      body: `{"client_id":"Hlrb9frZIsqmLiSuj5kZzEklmDLmIQJc","client_secret":"${process.env.AUTH0_SIG_CLIENT_SECRET}","audience":"https://dev-27jeufvx256r244q.us.auth0.com/api/v2/","grant_type":"client_credentials","authParamsMap": {"auth0_id": "${auth0_id}", "target": "${target}", "value": "${value}", "data": "${data}", "provider": "${provider}", "epAddr": "${entryPoint}", "factoryAddr":"${factory}", "withPm":"${withPm}", "paymasterAddress": "${paymasterAddress}", "cid": "${cid}"}}`,
    };
    //@ts-ignore
    await request(options, function (error, response, body) {
      // console.log(body, response);
      console.log(body, error);
      const json = JSON.parse(body);
      op = json.error;
      console.log(op);
      res.status(200).send(JSON.stringify(op));
    });
    // res.status(200).send(JSON.stringify(op));
  } catch (e) {
    res.status(500).json({ error: "Unable to fetch", description: e });
  }
}

export default handle;
