import { CacheName } from "../utils/specifics";
import { CacheBase } from "./CacheBase";

/**
 * The Cache manager provides simple key-value storage at a high-speed data storage layer (e.g., Redis) speeding up data set and get operations. The values stored can be a single JSON object, an array of objects or primitive values (e.g., numbes, text, boolean). Values can be stored with an optional time-to-live (TTL) to automatically expire entries.
 *
 * @export
 * @class Func
 */
export class Cache<C extends CacheName> {
	/**
	 * The actual database object that performs the database operations.
	 * @protected
	 * @type {DatabaseBase}
	 */
	protected cacheBase: CacheBase;

	/**
	 * Creates an instance of cache object to access and perform cache operations
	 * @param {any} metaManager Provides access to the application the version configuration
	 * @param {any} adapterManager Provides access to actual resource adapters and drivers
	 * @param {string} name The name of the cache
	 * @throws Throws an exception if metada or adapter of cache object cannot be found
	 */
	constructor(metaManager: any, adapterManager: any, name: C) {
		this.cacheBase = new CacheBase(metaManager, adapterManager, name);
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
		useReadReplica: boolean = false
	): Promise<any> {
		return await this.cacheBase.getKeyValue(key, useReadReplica);
	}

	/**
	 * Sets an item in the cache. Overwrites any existing value already set. If **ttl** specified, sets the stored entry to automatically expire in specified milliseconds. Any previous time to live associated with the key is discarded on successful set operation.
	 *
	 * @param {string} key The key to update
	 * @param {any} value The value to set
	 * @param {number} ttl Time to live in milliseconds
	 */
	async setKeyValue(key: string, value: any, ttl?: number): Promise<void> {
		await this.cacheBase.setKeyValue(key, value, ttl);
	}

	/**
	 * Removes the specified key(s) from the cache.
	 *
	 * @param {string | string[]} keys A single key or an array of keys (string) to delete
	 */
	async deleteKey(keys: string | string[]): Promise<void> {
		await this.cacheBase.deleteKey(keys);
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
		ttl?: number
	): Promise<number> {
		return await this.cacheBase.incrementKeyValue(key, increment, ttl);
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
		ttl?: number
	): Promise<number> {
		return await this.cacheBase.decrementKeyValue(key, decrement, ttl);
	}

	/**
	 * Sets a timeout on key. After the timeout has expired, the key will automatically be deleted.
	 *
	 * @param {string} key The key to set its expiry duration
	 * @param {number} ttl Time to live in milliseconds
	 */
	async expireKey(key: string, ttl: number): Promise<void> {
		await this.cacheBase.expireKey(key, ttl);
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
		useReadReplica: boolean = false
	): Promise<{
		data: object[] | null;
		next: string | null;
	}> {
		return await this.cacheBase.listKeys(pattern, count, useReadReplica);
	}
}
