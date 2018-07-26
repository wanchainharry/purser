import blockies from 'ethereum-blockies';

import software from '../../software';
import * as utils from '../../core/utils';

jest.mock('ethereum-blockies');
/*
 * Manual mocking a manual mock. Yay for Jest being build by Facebook!
 *
 * If you need context, see this:
 * https://github.com/facebook/jest/issues/2070
 */
jest.mock('../../core/utils', () =>
  /* eslint-disable-next-line global-require */
  require('../../core/__mocks-required__/utils'),
);

describe('`software` wallet module', () => {
  afterEach(() => {
    blockies.create.mockClear();
  });
  describe('`SoftwareWallet` Blockie', () => {
    test('Add the `blockie` prop to the wallet instance', async () => {
      const testWallet = await software.SoftwareWallet.create({});
      testWallet.address = '0x123';
      const blockieGetterSpy = jest.spyOn(
        software.SoftwareWallet.prototype,
        'blockie',
        'get',
      );
      expect(testWallet).toHaveProperty('blockie');
      expect(await testWallet.blockie).toEqual('base64');
      expect(blockieGetterSpy).toHaveBeenCalled();
      expect(blockies.create).toHaveBeenCalled();
      blockieGetterSpy.mockReset();
      blockieGetterSpy.mockRestore();
    });
    test("Can't get the blockie if no address is available", async () => {
      const testWallet = await software.SoftwareWallet.create({});
      const blockieGetterSpy = jest.spyOn(
        software.SoftwareWallet.prototype,
        'blockie',
        'get',
      );
      expect(testWallet.blockie).rejects.toEqual(undefined);
      expect(blockieGetterSpy).toHaveBeenCalled();
      expect(utils.warning).toHaveBeenCalled();
      expect(blockies.create).not.toHaveBeenCalled();
      blockieGetterSpy.mockReset();
      blockieGetterSpy.mockRestore();
    });
  });
});
