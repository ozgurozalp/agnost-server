import { APIBase } from "../APIBase";
import { ClientError } from "../utils/ClientError";
import {
  isKey,
  isBoolean,
  isPositiveInteger,
  isInteger,
  isString,
} from "../utils/helper";

const HELPER = (global as any).helper;

/**
 * The Cache manager provides simple key-value storage at a high-speed data storage layer (e.g., Redis) speeding up data set and get operations. The values stored can be a single JSON object, an array of objects or primitive values (e.g., numbes, text, boolean). Values can be stored with an optional time-to-live (TTL) to automatically expire entries.
 *
 * @export
 * @class Func
 */
export class CacheBase extends APIBase {
  /**
   * The name of the cache
   * @protected
   * @type {string}
   */
  protected name: string;

  /**
   * The metadata of the cache object
   * @protected
   * @type {string}
   */
  protected meta: any;

  /**
   * The resource adapter of the cache
   * @protected
   * @type {any}
   */
  protected adapter: any;

  /**
   * Creates an instance of cache object to access and perform cache operations
   * @param {any} metaManager Provides access to the application the version configuration
   * @param {any} adapterManager Provides access to actual resource adapters and drivers
   * @param {string} name The name of the cache
   * @throws Throws an exception if metada or adapter of cache object cannot be found
   */
  constructor(metaManager: any, adapterManager: any, name: string) {
    super(metaManager, adapterManager);
    this.name = name;
    // Get the metadata of the function
    this.meta = this.getMetadata("cache", name);
    if (!this.meta) {
      throw new ClientError(
        "cache_not_found",
        `Cannot find the cache identified by name '${name}'`,
      );
    }

    // Get the adapter of the function
    this.adapter = this.getAdapter("cache", this.name);
    if (!this.adapter) {
      throw new ClientError(
        "adapter_not_found",
        `Cannot find the adapter of the cache named '${name}'`,
      );
    }
  }

  /**
   * Returns the database adapter
   * @param {boolean} readOnly Whether to return the readonly adapter or not
   * @returns Database adapter
   * @internal
   */
  getAdapterObj(readOnly: boolean = false): any {
    if (!readOnly) return this.adapter.adapter;
    else {
      // If the readonly adapter is not there then return the read-write adapter
      if (this.adapter.slaves && this.adapter.slaves.length > 0) {
        const slave =
          this.adapter.slaves[
            HELPER.randomInt(1, this.adapter.slaves.length) - 1
          ];

        return slave.adapter;
      } else return this.adapter.adapter;
    }
  }

  /**
   * Gets an item from the cache by key. If key is not found, then `null` is returned as data.
   *
   * @param {string} key The key to retrieve
   * @param {boolean} useReadReplica Specifies whether to use the read replica of the cache or not. If no read replica cache exists uses the read-write database.
   * @returns Returns the key value
   */
  async getKeyValue(
    key: string,
    useReadReplica: boolean = false,
  ): Promise<any> {
    // Check the validity of input parameters
    if (!isKey(key))
      throw new ClientError(
        "invalid_parameter",
        `Key needs to be a string or numeric value`,
      );

    // Check the validity of input parameters
    if (!isBoolean(useReadReplica))
      throw new ClientError(
        "invalid_parameter",
        `Use read replica needs to be a boolean value`,
      );

    return await this.getAdapterObj(useReadReplica).getKeyValue(this.meta, key);
  }

  /**
   * Sets an item in the cache. Overwrites any existing value already set. If **ttl** specified, sets the stored entry to automatically expire in specified milliseconds. Any previous time to live associated with the key is discarded on successful set operation.
   *
   * @param {string} key The key to update
   * @param {any} value The value to set
   * @param {number} ttl Time to live in milliseconds
   */
  async setKeyValue(key: string, value: any, ttl?: number): Promise<void> {
    // Check the validity of input parameters
    if (!isKey(key))
      throw new ClientError(
        "invalid_parameter",
        `Key needs to be a string or numeric value`,
      );

    // Check the validity of input parameters
    if (ttl && !isPositiveInteger(ttl))
      throw new ClientError(
        "invalid_parameter",
        `Time to live needs to be positive integer`,
      );

    await this.getAdapterObj(false).setKeyValue(
      this.meta,
      key,
      value,
      ttl ?? undefined,
    );
  }

  /**
   * Removes the specified key(s) from the cache.
   *
   * @param {string | string[]} keys A single key or an array of keys (string) to delete
   */
  async deleteKey(keys: string | string[]): Promise<void> {
    let keysVal = null;
    if (Array.isArray(keys)) keysVal = keys;
    else keysVal = [keys];

    for (const key of keysVal) {
      if (!isKey(key))
        throw new ClientError(
          "invalid_parameter",
          `Key needs to be a string or numeric value`,
        );
    }

    await this.getAdapterObj(false).deleteKey(this.meta, keysVal);
  }

  /**
   * Increments the value of the number stored at the key by the increment amount. If increment amount not specified, increments the number stored at key by one. If the key does not exist, it is set to 0 before performing the operation. If **ttl** specified, sets the stored entry to automatically expire in specified milliseconds. Any previous time to live associated with the key is discarded on successful increment operation.
   *
   * @param {string} key The key to increment
   * @param {number} [increment=1] The amount to increment the value by
   * @param {number} ttl Time to live in milliseconds
   * @returns Returns the value of key after the increment
   */
  async incrementKeyValue(
    key: string,
    increment: number = 1,
    ttl?: number,
  ): Promise<number> {
    if (!isKey(key))
      throw new ClientError(
        "invalid_parameter",
        `Key needs to be a string or numeric value`,
      );

    // Check the validity of input parameters
    if (!isInteger(increment))
      throw new ClientError(
        "invalid_parameter",
        `Increment needs to be an integer`,
      );

    // Check the validity of input parameters
    if (ttl && !isPositiveInteger(ttl))
      throw new ClientError(
        "invalid_parameter",
        `Time to live needs to be positive integer`,
      );

    return await this.getAdapterObj(false).incrementKeyValue(
      this.meta,
      key,
      increment,
      ttl,
    );
  }

  /**
   * Decrements the value of the number stored at the key by the decrement amount. If decrement amount not specified, decrements the number stored at key by one. If the key does not exist, it is set to 0 before performing the operation. If **ttl** specified, sets the stored entry to automatically expire in specified milliseconds. Any previous time to live associated with the key is discarded on successful decrement operation.
   *
   * @param {string} key The key to decrement
   * @param {number} [decrement=1] The amount to decrement the value by
   * @param {number} ttl Time to live in milliseconds
   * @returns Returns the value of key after the decrement
   */
  async decrementKeyValue(
    key: string,
    decrement: number = 1,
    ttl?: number,
  ): Promise<number> {
    if (!isKey(key))
      throw new ClientError(
        "invalid_parameter",
        `Key needs to be a string or numeric value`,
      );

    // Check the validity of input parameters
    if (!isInteger(decrement))
      throw new ClientError(
        "invalid_parameter",
        `Increment needs to be an integer`,
      );

    // Check the validity of input parameters
    if (ttl && !isPositiveInteger(ttl))
      throw new ClientError(
        "invalid_parameter",
        `Time to live needs to be positive integer`,
      );

    return await this.getAdapterObj(false).decrementKeyValue(
      this.meta,
      key,
      decrement,
      ttl,
    );
  }

  /**
   * Sets a timeout on key. After the timeout has expired, the key will automatically be deleted.
   *
   * @param {string} key The key to set its expiry duration
   * @param {number} ttl Time to live in milliseconds
   */
  async expireKey(key: string, ttl: number): Promise<void> {
    if (!isKey(key))
      throw new ClientError(
        "invalid_parameter",
        `Key needs to be a string or numeric value`,
      );

    // Check the validity of input parameters
    if (ttl && !isPositiveInteger(ttl))
      throw new ClientError(
        "invalid_parameter",
        `Time to live needs to be positive integer`,
      );

    return await this.getAdapterObj(false).expireKey(this.meta, key, ttl);
  }

  /**
   * Gets the list of keys in your app cache storage. It runs the pattern match to narrow down returned results, otherwise, returns all keys contained in your app's cache storage. See below examples how to specify filtering pattern:
   *
   * - h?llo matches hello, hallo and hxllo
   * - h*llo matches hllo and heeeello
   * - h[ae]llo matches hello and hallo, but not hillo
   * - h[^e]llo matches hallo, hbllo, ... but not hello
   * - h[a-b]llo matches hallo and hbllo
   *
   * @param {string} pattern The pattern string that will be used to filter cache keys
   * @param {number} count The maximum number of keys and their values to return.
   * @param {boolean} useReadReplica Specifies whether to use the read replica of the cache or not. If no read replica cache exists uses the read-write database.
   * @returns Returns the array of matching keys and their values
   */
  async listKeys(
    pattern: string,
    count: number,
    useReadReplica: boolean = false,
  ): Promise<{
    data: object[] | null;
    next: string | null;
  }> {
    if (!isString(pattern))
      throw new ClientError(
        "invalid_parameter",
        `Pattern needs to be a string value`,
      );

    if (!isPositiveInteger(count))
      throw new ClientError(
        "invalid_parameter",
        `Count needs to be a number value`,
      );

    // Check the validity of input parameters
    if (!isBoolean(useReadReplica))
      throw new ClientError(
        "invalid_parameter",
        `Use read replica needs to be a boolean value`,
      );

    return await this.getAdapterObj(useReadReplica).listKeys(
      this.meta,
      pattern,
      count,
    );
  }

  /**
   * Returns the cache client that you can use the perform advanced cache operations. A client instance for the the following NPM modules will be returned.
   *
   * | Cache type | NPM module |
   * | Redis | redis |
   *
   * @returns Cache client
   */
  getClient(): any {
    return this.getAdapterObj(false).getDriver();
  }
}
