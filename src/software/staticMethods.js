/* @flow */

import { bigNumberify } from 'ethers/utils';

import { transactionObjectValidator } from '../core/helpers';
import { addressNormalizer, hexSequenceNormalizer } from '../core/normalizers';
import { messageValidator } from '../core/validators';
import { objectToErrorString } from '../core/utils';

import { staticMethods as messages } from './messages';

/**
 * Sign a transaction object and return the serialized signature (as a hex string)
 *
 * @method signTransaction
 *
 * @param {bigNumber} gasPrice gas price for the transaction in WEI (as an instance of bigNumber), defaults to 9000000000 (9 GWEI)
 * @param {bigNumber} gasLimit gas limit for the transaction (as an instance of bigNumber), defaults to 21000
 * @param {number} chainId the id of the chain for which this transaction is intended
 * @param {number} nonce the nonce to use for the transaction (as a number)
 * @param {string} to the address to which to the transaction is sent
 * @param {bigNumber} value the value of the transaction in WEI (as an instance of bigNumber), defaults to 1
 * @param {string} inputData data appended to the transaction (as a `hex` string)
 * @param {function} callback Ethers method to call with the validated transaction object
 *
 * All the above params are sent in as props of an {TransactionObjectType} object.
 *
 * @return {Promise<string>} the hex signature string
 */
export const signTransaction = async ({
  callback,
  ...transactionObject
}: Object = {}): Promise<string> => {
  const {
    gasPrice,
    gasLimit,
    chainId,
    nonce,
    to,
    value,
    inputData,
  } = transactionObjectValidator(transactionObject);
  try {
    const signedTransaction: string = await callback({
      /*
       * Ethers needs it's own "proprietary" version of bignumber to work.
       */
      gasPrice: bigNumberify(gasPrice.toString()),
      /*
       * Ethers needs it's own "proprietary" version of bignumber to work.
       */
      gasLimit: bigNumberify(gasLimit.toString()),
      chainId,
      nonce,
      to: addressNormalizer(to),
      /*
       * Ethers needs it's own "proprietary" version of bignumber to work.
       */
      value: bigNumberify(value.toString()),
      data: hexSequenceNormalizer(inputData),
    });
    return hexSequenceNormalizer(signedTransaction);
  } catch (caughtError) {
    throw new Error(
      `${messages.cannotSign} ${objectToErrorString(transactionObject)} ${
        caughtError.message
      }`,
    );
  }
};

/**
 * Sign a message and return the signature. Useful for verifying identities.
 *
 * @method signMessage
 *
 * @TODO Add unit tests
 *
 * @param {string} message the message you want to sign
 * @param {function} callback Ethers method to call with the validated message string
 *
 * All the above params are sent in as props of an {object}.
 *
 * @return {Promise<string>} The signed message `hex` string (wrapped inside a `Promise`)
 */
export const signMessage = async ({ message, callback }: Object = {}): Promise<
  string,
> => {
  /*
   * Validate input value
   */
  messageValidator(message);
  try {
    const messageSignature: string = callback(message);
    /*
     * Normalize the message signature
     */
    return hexSequenceNormalizer(messageSignature);
  } catch (caughtError) {
    throw new Error(
      `${messages.cannotSignMessage}: ${message} Error: ${caughtError.message}`,
    );
  }
};
