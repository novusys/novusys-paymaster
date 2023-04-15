import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { ethers } from 'ethers'
import { UserOperation } from './types/userOperation';
import { constructPaymasterData, createPaymasterAndDataForERC20 } from './utils';

dotenv.config();

const JSON_RPC_PROVIDER = "https://goerli.infura.io/v3/"+process.env.INFURA_ID
export const AddressZero = ethers.constants.AddressZero;

const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_PROVIDER);
const signer = new ethers.Wallet(process.env.PAYMASTER_PVT_KEY ? process.env.PAYMASTER_PVT_KEY : "", provider);
const abiCoder = new ethers.utils.AbiCoder()

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
  res.send('/');
});

app.post('/getPaymasterAndData', async (req: Request, res: Response) => {
  // console.log("Got response: " + req.statusCode);
  // console.log("Got data", req.body?.params[0])

  // console.log(
  //   'userOperation', req.body?.params[0]
  // )

  // const constructedPaymasterData = await constructPaymasterData(signer ,req.body?.params[0])

  // console.log('constructPaymasterData', constructedPaymasterData);
  console.log(req.body)
  console.log(req.body?.params[0]);
  res.send({
      result: createPaymasterAndDataForERC20(req.body?.params[0] as UserOperation)
    });
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});