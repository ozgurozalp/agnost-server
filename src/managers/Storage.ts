import { APIBase } from "../APIBase";
import { ClientError } from "../utils/ClientError";
import { Bucket } from "./Bucket";
import {
  BucketInfo,
  BucketWithCountInfo,
  BucketListOptions,
  FileInfo,
  FileWithCountInfo,
  FileListOptions,
  StorageInfo,
} from "../utils/types";
import {
  valueExists,
  isObject,
  isBoolean,
  isString,
  isPositiveInteger,
} from "../utils/helper";
import { StorageName } from "../utils/specifics";

/**
 * Allows you manage your app's cloud storage buckets and files. With Storage manager you can create and list buckets and use the {@link Bucket} to manage a specific bucket and and its contained files.
 *
 * You store your files, documents, images etc. under buckets, which are the basic containers that hold your application data. You typically create a bucket and upload files/objects to this bucket.
 *
 * @export
 * @class Storage
 */
export class Storage<S extends StorageName> extends APIBase {
  /**
   * The name of the storage
   * @protected
   * @type {string}
   */
  protected name: S;

  /**
   * The metadata of the storage object
   * @protected
   * @type {string}
   */
  protected meta: any;

  /**
   * The resource adapter of the storage object
   * @protected
   * @type {any}
   */
  protected adapter: any;

  /**
   * Creates an instance to manage a specific storage (i.e., buckets, files) of your application.
   * @param {any} metaManager Provides access to the application the version configuration
   * @param {any} adapterManager Provides access to actual resource adapters and drivers
   * @param {string} name The name of the storage
   * @throws Throws an exception if metada or adapter of storage object cannot be found
   */
  constructor(metaManager: any, adapterManager: any, name: S) {
    super(metaManager, adapterManager);
    this.name = name;
    // Get the metadata of the storage
    this.meta = this.getMetadata("storage", name);
    if (!this.meta) {
      throw new ClientError(
        "storage_not_found",
        `Cannot find the storage object identified by name '${name}'`,
      );
    }

    // Get the adapter of the queue
    this.adapter = this.getAdapter("storage", this.name);
    if (!this.adapter) {
      throw new ClientError(
        "adapter_not_found",
        `Cannot find the adapter of the storage named '${name}'`,
      );
    }
  }

  /**
   * Creates a new {@link Bucket} object for the specified bucket. This created object can be used to manage the actual storage bucket.
   *
   * Buckets are the basic containers that hold your application data (i.e., files). Everything that you store in your app storage must be contained in a bucket. You can use buckets to organize your data and control access to your data, but unlike directories and folders, you cannot nest buckets.
   *
   * @param {string} name The name of the bucket.
   * @returns Returns a new {@link Bucket} object that will be used for managing the bucket
   */
  bucket(name: string): Bucket {
    // Check the validity of input parameters
    if (!isString(name))
      throw new ClientError(
        "invalid_value",
        `Bucket name needs to be a string value`,
      );

    return new Bucket(this.meta, this.adapter, name.trim());
  }

  /**
   * Creates a new bucket. If there already exists a bucket with the specified name, it throws an exception. You can specify additional information to store with each bucket using the **tags** which is a JSON object (e.g., key-value pairs).
   *
   * Files can be specified as **public** or **private**, which defines how the public URL of the file will behave. If a file is marked as private then external apps/parties will not be able to access it through its public URL. With `isPublic` parameter of a bucket, you can specify default privacy setting of the files contained in this bucket, meaning that when you add a file to a bucket and if the file did not specify public/private setting, then the the bucket's privacy setting will be applied. You can always override the default privacy setting of a bucket at the individual file level.
   *
   * @param {string} name The name of the bucket to create (case sensitive).
   * @param {boolean} isPublic The default privacy setting that will be applied to the files uploaded to this bucket.
   * @param {object} tags JSON object (key-value pairs) that will be added to the bucket metadata.
   * @param {string} userId The unique identifier of the user who created the bucket.
   * @returns Returns info about newly created bucket
   * @throws Throws an exception if there already exists a bucket with the specified name or if the input parameters are not valid
   */
  async createBucket(
    name: string,
    isPublic: boolean = true,
    tags?: object,
    userId?: string | number,
  ): Promise<BucketInfo> {
    // Check the validity of input parameters
    if (!isString(name))
      throw new ClientError(
        "invalid_value",
        `Bucket name needs to be a string value`,
      );
    if (!isBoolean(isPublic))
      throw new ClientError(
        "invalid_value",
        `Public flag needs to be a boolean value`,
      );
    if (tags && !isObject(tags))
      throw new ClientError(
        "invalid_value",
        `Bucket tags need to be a JSON object`,
      );

    const bucketInfo: BucketInfo = await this.adapter.createBucket(
      this.meta,
      name.trim(),
      isPublic,
      tags,
      userId,
    );

    return bucketInfo;
  }

  /**
   * Gets the list of buckets in your app storage. You can filter your buckets by their name, paginate through your buckets and sort them using the input {@link BucketListOptions} parameter.
   *
   * @param {BucketListOptions} options Options to configure how buckets will be listed, primarily used to set pagination and sorting settings
   *   - search: The search string parameter. Agnost searches the bucket names that includes the search string parameter.
   *   - page?: A positive integer that specifies the page number to paginate bucket results. Page numbers start from 1.
   *   - limit?: A positive integer that specifies the max number of buckets to return per page.
   *   - sort?: Specifies the field name and sort direction (asc | desc) as a JSON object for sorting returned buckets.
   *   - returnCountInfo?: Flag to specify whether to return the count and pagination information such as total number of buckets, page number and page size.
   * @returns Returns the array of matching buckets. If `returnCountInfo=true` in {@link BucketListOptions}, it returns an object which includes the count information and the matching buckets array.
   */
  async listBuckets(
    options?: BucketListOptions,
  ): Promise<BucketInfo[] | BucketWithCountInfo> {
    // Check the validity of input parameters
    if (options) {
      if (!isObject(options))
        throw new ClientError(
          "invalid_value",
          `Bucket listing options need to be a JSON object`,
        );

      if (valueExists(options.search) && !isString(options.search))
        throw new ClientError(
          "invalid_value",
          `Search parameter needs to be a string value`,
        );
      if (valueExists(options.page) && !isPositiveInteger(options.page))
        throw new ClientError(
          "invalid_value",
          `Page number needs to be a positive integer value`,
        );

      if (valueExists(options.limit) && !isPositiveInteger(options.limit))
        throw new ClientError(
          "invalid_value",
          `Page limit (size) needs to be a positive integer value`,
        );

      if (
        valueExists(options.returnCountInfo) &&
        !isBoolean(options.returnCountInfo)
      )
        throw new ClientError(
          "invalid_value",
          `Return count info option needs to be a boolean value`,
        );
    }

    const buckets = await this.adapter.listBuckets(this.meta, options);

    return buckets;
  }

  /**
   * Gets the list of files whose names match the search string. This method performs a global search across all the files contained in all the buckets. You can search, paginate through your files and sort them using the input {@link FileListOptions} parameter.
   *
   * @param {FileListOptions} options Options to configure how files will be listed, primarily used to set pagination and sorting settings
   *   - search: The search string parameter. Agnost searches the file names that includes the search string parameter.
   *   - page?: A positive integer that specifies the page number to paginate file results. Page numbers start from 1.
   *   - limit?: A positive integer that specifies the max number of files to return per page.
   *   - sort?: Specifies the field name and sort direction (asc | desc) in a JSON object for sorting returned files.
   *   - returnCountInfo?: Flag to specify whether to return the count and pagination information such as total number of files, page number and page size
   * @returns Returns the files mathcing the search query. If `returnCountInfo=true` in {@link FileListOptions}, returns an object which includes count information and array of matching files.
   */
  async listFiles(
    options?: FileListOptions,
  ): Promise<FileInfo[] | FileWithCountInfo> {
    // Check the validity of input parameters
    if (options) {
      if (!isObject(options))
        throw new ClientError(
          "invalid_value",
          `File listing options need to be a JSON object`,
        );

      if (valueExists(options.search) && !isString(options.search))
        throw new ClientError(
          "invalid_value",
          `Search parameter needs to be a string value`,
        );
      if (valueExists(options.page) && !isPositiveInteger(options.page))
        throw new ClientError(
          "invalid_value",
          `Page number needs to be a positive integer value`,
        );

      if (valueExists(options.limit) && !isPositiveInteger(options.limit))
        throw new ClientError(
          "invalid_value",
          `Page limit (size) needs to be a positive integer value`,
        );

      if (
        valueExists(options.returnCountInfo) &&
        !isBoolean(options.returnCountInfo)
      )
        throw new ClientError(
          "invalid_value",
          `Return count info option needs to be a boolean value`,
        );
    }

    const files = await this.adapter.listFiles(this.meta, options);

    return files;
  }

  /**
   * Returns the overall information about your apps cloud storage including total number of buckets and files stored, total storage size in bytes and average, min and max file size in bytes.
   *
   * @returns Returns information about your app's cloud storage
   */
  async getStats(): Promise<StorageInfo> {
    const stats = await this.adapter.getStats(this.meta);

    return stats;
  }
}
