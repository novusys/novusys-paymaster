import {
    arrayify,
    defaultAbiCoder,
    hexDataSlice,
    keccak256
} from 'ethers/lib/utils'
import { Wallet } from 'ethers/src.ts';
import { ethers } from 'ethers';
import { UserOperation } from './types/userOperation'
import VERIFYING_PAYMASTER_ABI from './abis/verifyingPaymaster.json';
import { sign } from 'crypto';

const abiCoder = new ethers.utils.AbiCoder();

const DUMMY_PAYMASTER_DATA = "aaaaa3dd71d270b51e95b5adca9ea9c2210a655889ac5f19fd0f56fea29940f21a4420a3d1303683b19c12472ec175ca042223e0ae5d8fc64a19e5a823141aaaaa"
const JSON_RPC_PROVIDER = "https://goerli.infura.io/v3/"+process.env.INFURA_ID


export function packUserOp(op: UserOperation, forSignature = true): string {
    if (forSignature) {
        return defaultAbiCoder.encode(
            ['address', 'uint256', 'bytes32', 'bytes32',
                'uint256', 'uint256', 'uint256', 'uint256', 'uint256',
                'bytes32'],
            [op.sender, op.nonce, keccak256(op.initCode), keccak256(op.callData),
            op.callGasLimit, op.verificationGasLimit, op.preVerificationGas, op.maxFeePerGas, op.maxPriorityFeePerGas,
            keccak256(op.paymasterAndData)])
    } else {
        // for the purpose of calculating gas cost encode also signature (and no keccak of bytes)
        return defaultAbiCoder.encode(
            ['address', 'uint256', 'bytes', 'bytes',
                'uint256', 'uint256', 'uint256', 'uint256', 'uint256',
                'bytes', 'bytes'],
            [op.sender, op.nonce, op.initCode, op.callData,
            op.callGasLimit, op.verificationGasLimit, op.preVerificationGas, op.maxFeePerGas, op.maxPriorityFeePerGas,
            op.paymasterAndData, op.signature])
    }
}

export function encodeUserOp(op: UserOperation): string {
    return defaultAbiCoder.encode(
        ['(address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes)'],
        [[op.sender, op.nonce, op.initCode, op.callData,
        op.callGasLimit, op.verificationGasLimit, op.preVerificationGas, op.maxFeePerGas, op.maxPriorityFeePerGas,
        op.paymasterAndData, op.signature]]);
}


export async function createSignature(message: string, signer: Wallet) {
    let signature = await signer.signMessage(message);
    console.log(signature);
    console.log('Address: ', signer.address)
    return signature;
}

export async function recoverAddress(message: string, signature: string) {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    return recoveredAddress
}

// export const constructPaymasterData = async (signer: Wallet, userOp: UserOperation) => {
//     const verifyingPaymaster = new ethers.Contract(process.env.VERIFYING_PAYMASTER ? process.env.VERIFYING_PAYMASTER : "", VERIFYING_PAYMASTER_ABI, signer);
    
//     const address = await signer.getAddress();
//     // console.log('address - ', address);
//     const validUntil = Math.round((Date.now())/1000) + 100
//     const validAfter = Math.round((Date.now())/1000) 
    
//     // construct valid until and valid after abi 
//     const abiEncode = abiCoder.encode(["uint48", "uint48"], [validUntil, validAfter]);
//     userOp.paymasterAndData = address + abiEncode.slice(2) + DUMMY_PAYMASTER_DATA;

//     let hashToSign = await verifyingPaymaster.functions.getMessageToSign(userOp);

//     // console.log('\n hashToSign: ',hashToSign[0]);

//     const signedHash = await signer.signMessage(ethers.utils.arrayify(hashToSign[0]));

//     // console.log('\n Signed hash: ', signedHash);
    
//     const paymasterAndData = address + abiEncode.slice(2) + signedHash.slice(2);

//     // userOp.paymasterAndData = paymasterAndData;
 
//     // console.log('does edsca work ?? ', await verifyingPaymaster.functions.recoverAddress(hashToSign[0], signedHash));
//     // // console.log('does edsca work ? ', await verifyingPaymaster.functions.recoverAddress(ethers.utils.arrayify(tempMessage), signature))
//     // // console.log('ethers debugging - ', await recoverAddress(tempMessage , signature));

//     // const res = await verifyingPaymaster.functions._validatePaymasterUserOpTest(userOp, '0x165375c36c877a37d1f429859b47b90a5ea13871df4369b0a25b4402e2e22282', 123);
//     // console.log('\n response from the verification paymaster  ', res);
//     // userOp.paymasterAndData = paymasterAndData;

//     return paymasterAndData;
// }

// export const constructPaymasterData = async (signer: Wallet, userOp: UserOperation) => {
    
//     const verifyingPaymaster = new ethers.Contract(process.env.VERIFYING_PAYMASTER ? process.env.VERIFYING_PAYMASTER : "", VERIFYING_PAYMASTER_ABI, signer);
    
//     const address = process.env.VERIFYING_PAYMASTER;
//     console.log('signer address  - ', signer.getAddress());
//     console.log('paymaster address  - ', address);
//     const validUntil = Math.round((Date.now())) + 100
//     const validAfter = 0
    
//     // construct valid until and valid after abi 
//     const abiEncode = abiCoder.encode(["uint48", "uint48"], [validUntil, validAfter]);
//     userOp.paymasterAndData = address + abiEncode.slice(2) + DUMMY_PAYMASTER_DATA;

//     let hashToSign = await verifyingPaymaster.functions.getHash(userOp);

//     console.log('\n hashToSign: ',hashToSign[0]);

//     const signedHash = await signer.signMessage(ethers.utils.arrayify(hashToSign[0]));

//     // console.log('\n Signed hash: ', signedHash);
    
//     const paymasterAndData = address + abiEncode.slice(2) + signedHash.slice(2);

//     // userOp.paymasterAndData = paymasterAndData;
 
//     // console.log('does edsca work ?? ', await verifyingPaymaster.functions.recoverAddress(hashToSign[0], signedHash));
//     // console.log('does edsca work ? ', await verifyingPaymaster.functions.recoverAddress(ethers.utils.arrayify(tempMessage), signature))
//     // console.log('ethers debugging - ', await recoverAddress(tempMessage , signature));

//     // const res = await verifyingPaymaster.functions._validatePaymasterUserOpTest(userOp, '0x165375c36c877a37d1f429859b47b90a5ea13871df4369b0a25b4402e2e22282', 123);
//     // console.log('\n response from the verification paymaster  ', res);
//     // userOp.paymasterAndData = paymasterAndData;

//     return paymasterAndData;
//     // return address;
// }

export const createPaymasterAndDataForERC20 = (userOp: UserOperation) => {
    const callData = userOp.callData;
    const value = abiCoder.decode(["address", "uint256", "bytes"], '0x'+callData.toString().slice(10))[1];
    console.log(value.toString());
    return process.env.VERIFYING_PAYMASTER + abiCoder.encode(['address','uint256','bool'], ['0x94c3c4d89E516b03D4b85335429EAA7286a2A1a9',value,'false']).slice(2);
}
