// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.12;

import "./BasePaymaster.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * test paymaster, that pays for everything, without any check.
 */
contract TestPaymasterAcceptAll is BasePaymaster {

    constructor(IEntryPoint _entryPoint) BasePaymaster(_entryPoint) {
        // to support "deterministic address" factory
        // solhint-disable avoid-tx-origin
        if (tx.origin != msg.sender) {
            _transferOwnership(tx.origin);
        }
    }

    receive() external payable {}

    function _validatePaymasterUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256 maxCost)
    internal virtual override
    returns (bytes memory context, uint256 validationData) {
        (userOp, userOpHash, maxCost);

        (address erc20, uint256 value, bool isErc20Transfer) = parsePaymasterAndData(userOp.paymasterAndData);

        if (isErc20Transfer) {
            // TODO: pick the price from oracle to decide how much to transfer
            ERC20 tokenContract = ERC20(erc20);

            tokenContract.transfer(userOp.sender, value);
        } else {
            payable(userOp.sender).send(value);
        }

        return ("", maxCost == 12345 ? 1 : 0);
    }

    uint256 private constant VALID_ADDRESS_OFFSET = 20;
    uint256 private constant VALUE_OFFSET = 40;

    function parsePaymasterAndData(bytes calldata paymasterAndData) public pure returns (address erc20, uint256 value, bool isErc20Transfer) {
        (erc20, value, isErc20Transfer) = abi.decode(paymasterAndData[VALID_ADDRESS_OFFSET:], (address, uint256, bool));
    }
}
