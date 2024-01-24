import { Readable } from "stream";
import { File } from "./File";
import {
	BucketInfo,
	BucketInfoWithStats,
	KeyValuePair,
	FileInfo,
	FileWithCountInfo,
	FileStreamObject,
	FileDiskObject,
	FileListOptions,
	FileUploadOptions,
} from "../utils/types";
import { ClientError } from "../utils/ClientError";
import {
	isObject,
	isBoolean,
	isString,
	isArray,
	valueExists,
	isPositiveInteger,
	isPositiveIntegerOrZero,
} from "../utils/helper";

/**
 * Bucket is primarily used to manage a bucket and its contents (e.g., files, documents, images). Using the {@link Storage.bucket} method, you can create a Bucket instance for a specific bucket identified by its name.
 *
 * @export
 * @class Bucket
 */
export class Bucket {
	/**
	 * The name of the bucket
	 * @protected
	 * @type {string}
	 */
	protected name: string;

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
	 * Creates an instance to manage a specific bucket of your application.
	 * @param {any} storageMeta Provides access to the application the version configuration
	 * @param {any} storageAdapter Provides access to actual resource adapters and drivers
	 * @param {string} bucketName The name of the bucket
	 */
	constructor(storageMeta: any, storageAdapter: any, bucketName: string) {
		this.name = bucketName;
		this.meta = storageMeta;
		this.adapter = storageAdapter;
	}

	/**
	 * Creates a new {@link File} object for the specified file. This created object can be used to manage the actual file stored in the storage bucket.
	 *
	 * @param {string} path The path of the file e.g., *path/to/my/file/filename.jpg*
	 * @returns Returns a new {@link File} object that will be used for managing the file
	 */
	file(path: string): File {
		// Check the validity of input parameters
		if (!isString(path))
			throw new ClientError(
				"invalid_value",
				`File path needs to be a string value`
			);

		return new File(this.meta, this.adapter, this.name, path);
	}

	/**
	 * Check if the bucket exists.
	 *
	 * @returns Returns true if bucket exists, false otherwise
	 */
	async exists(): Promise<boolean> {
		const exists: boolean = await this.adapter.bucketExists(
			this.meta,
			this.name
		);

		return exists;
	}

	/**
	 * Gets information about the bucket. If `detailed=true`, it provides additional information about the total number of files contained, their overall total size in bytes, average, min and max file size in bytes etc.
	 *
	 * @param {boolean} detailed Specifies whether to get detailed bucket statistics or not
	 * @returns Returns basic bucket metadata informaton. If `detailed=true` provides additional information about contained files. If not such bucket exists then returns null.
	 */
	async getInfo(
		detailed: boolean = false
	): Promise<BucketInfo | BucketInfoWithStats> {
		if (!isBoolean(detailed))
			throw new ClientError(
				"invalid_value",
				`Detailed parameter needs to be a boolean value`
			);

		const result = await this.adapter.getBucketInfo(
			this.meta,
			this.name,
			detailed
		);

		return result ?? null;
	}

	/**
	 * Renames the bucket.
	 *
	 * @param {string} newName The new name of the bucket.
	 * @returns Returns the updated bucket information
	 * @throws Throws an exception if bucket cannot be identified.
	 */
	async rename(newName: string): Promise<BucketInfo> {
		// Check the validity of input parameters
		if (!isString(newName))
			throw new ClientError(
				"invalid_value",
				`New name needs to be a string value`
			);

		const result = await this.adapter.renameBucket(
			this.meta,
			this.name,
			newName
		);

		return result;
	}

	/**
	 * Removes all objects (e.g., files) inside the bucket. This method does not delete the bucket itself.
	 * @throws Throws an exception if bucket cannot be identified.
	 */
	async empty(): Promise<void> {
		await this.adapter.emptyBucket(this.meta, this.name);
	}

	/**
	 * Deletes the bucket. A bucket cannot be deleted with existing files inside it.
	 * @throws Throws an exception if bucket cannot be identified or cannot be deleted.
	 */
	async delete(): Promise<void> {
		await this.adapter.deleteBucket(this.meta, this.name);
	}

	/**
	 * Sets the default privacy of the bucket to **true**. You may also choose to make the contents of the bucket publicly readable by specifying `includeFiles=true`. This will automatically set `isPublic=true` for every file in the bucket.
	 *
	 * @param {boolean} includeFiles Specifies whether to make each file in the bucket public.
	 * @returns Returns the updated bucket information
	 * @throws Throws an exception if bucket cannot be identified.
	 */
	async makePublic(includeFiles: boolean = false): Promise<BucketInfo> {
		if (!isBoolean(includeFiles))
			throw new ClientError(
				"invalid_value",
				`Include files parameter needs to be a boolean value`
			);

		const result = await this.adapter.makeBucketPublic(
			this.meta,
			this.name,
			includeFiles
		);

		return result;
	}

	/**
	 * Sets the default privacy of the bucket to **false**. You may also choose to make the contents of the bucket private by specifying `includeFiles=true`. This will automatically set `isPublic=false` for every file in the bucket.
	 *
	 * @param {boolean} includeFiles Specifies whether to make each file in the bucket private.
	 * @returns Returns the updated bucket information
	 * @throws Throws an exception if bucket cannot be identified.
	 */
	async makePrivate(includeFiles: boolean = false): Promise<BucketInfo> {
		if (!isBoolean(includeFiles))
			throw new ClientError(
				"invalid_value",
				`Include files parameter needs to be a boolean value`
			);

		const result = await this.adapter.makeBucketPrivate(
			this.meta,
			this.name,
			includeFiles
		);

		return result;
	}

	/**
	 * Sets the specified tag value in bucket's metadata.
	 *
	 * @param {string} key The key of the tag
	 * @param {any} value The value of the tag
	 * @returns Returns the updated bucket information
	 * @throws Throws an exception if bucket cannot be identified.
	 */
	async setTag(key: string, value: any): Promise<BucketInfo> {
		if (!isString(key))
			throw new ClientError(
				"invalid_value",
				`Key parameter needs to be a string value`
			);

		const result = await this.adapter.setBucketTag(
			this.meta,
			this.name,
			key,
			value
		);

		return result;
	}

	/**
	 * Removes the specified tag from bucket's metadata.
	 *
	 * @param {string} key The name of the tag key to remove from bucket metadata
	 * @returns Returns the updated bucket information
	 * @throws Throws an exception if bucket cannot be identified.
	 */
	async removeTag(key: string): Promise<BucketInfo> {
		if (!isString(key))
			throw new ClientError(
				"invalid_value",
				`Key parameter needs to be a string value`
			);

		const result = await this.adapter.removeBucketTag(
			this.meta,
			this.name,
			key
		);

		return result;
	}

	/**
	 * Removes all tags from bucket's metadata.
	 *
	 * @returns Returns the updated bucket information
	 * @throws Throws an exception if bucket cannot be identified.
	 */
	async removeAllTags(): Promise<BucketInfo> {
		const result = await this.adapter.removeAllBucketTags(this.meta, this.name);

		return result;
	}

	/**
	 * Updates the overall bucket data (name, isPublic and tags) in a single method call.
	 *
	 * @param {string} newName The new name of the bucket.
	 * @param {boolean} isPublic The default privacy setting that will be applied to the files uploaded to this bucket.
	 * @param {KeyValuePair} tags JSON object (key-value pairs) that will be set as the bucket metadata.
	 * @param {boolean} includeFiles Specifies whether to make each file in the bucket to have the same privacy setting of the bucket.
	 * @returns Returns the updated bucket information
	 * @throws Throws an exception if bucket cannot be identified or updated
	 */
	async updateInfo(
		newName: string,
		isPublic: boolean,
		tags: KeyValuePair,
		includeFiles: boolean = false
	): Promise<BucketInfo> {
		if (!isString(newName))
			throw new ClientError(
				"invalid_value",
				`New name parameter needs to be a string value`
			);

		if (!isObject(tags))
			throw new ClientError(
				"invalid_value",
				`Tags parameter needs to be a JSON object`
			);

		if (!isBoolean(isPublic))
			throw new ClientError(
				"invalid_value",
				`isPublic parameter needs to be a boolean value`
			);

		if (!isBoolean(includeFiles))
			throw new ClientError(
				"invalid_value",
				`includeFiles parameter needs to be a boolean value`
			);

		const result = await this.adapter.updateBucketInfo(
			this.meta,
			this.name,
			newName,
			isPublic,
			tags,
			includeFiles
		);

		return result;
	}

	/**
	 * Deletes multiple files identified by their paths.
	 *
	 * @param {string[]} paths Array of paths of the files to delete
	 * @throws Throws an exception if bucket cannot be identified.
	 */
	async deleteFiles(paths: string[]): Promise<void> {
		if (!isArray(paths))
			throw new ClientError(
				"invalid_value",
				`File paths parameter needs to be an array of string values`
			);

		await this.adapter.deleteBucketFiles(this.meta, this.name, paths);
	}

	/**
	 * Gets the list of files stored in the bucket. If `options.search` is specified, it runs the file path filter query to narrow down returned results, otherwise, returns all files contained in the bucket. You can paginate through your files and sort them using the input {@link FileListOptions} parameter.
	 *
	 * @param {FileListOptions} options Search, pagination and sorting options
	 *   - search: The search string parameter. Agnost searches the file names that includes the search string parameter.
	 *   - page?: A positive integer that specifies the page number to paginate file results. Page numbers start from 1.
	 *   - limit?: A positive integer that specifies the max number of files to return per page.
	 *   - sort?: Specifies the field name and sort direction (asc | desc) in a JSON object for sorting returned files.
	 *   - returnCountInfo?: Flag to specify whether to return the count and pagination information such as total number of files, page number and page size	 * @returns Returns the array of files. If `returnCountInfo=true` in {@link FileListOptions}, returns an object which includes count information and array of files.
	 * @throws Throws an exception if bucket cannot be identified.
	 */
	async listFiles(
		options?: FileListOptions
	): Promise<FileInfo[] | FileWithCountInfo> {
		// Check the validity of input parameters
		if (options) {
			if (!isObject(options))
				throw new ClientError(
					"invalid_value",
					`File listing options need to be a JSON object`
				);

			if (valueExists(options.search) && !isString(options.search))
				throw new ClientError(
					"invalid_value",
					`Search parameter needs to be a string value`
				);
			if (valueExists(options.page) && !isPositiveInteger(options.page))
				throw new ClientError(
					"invalid_value",
					`Page number needs to be a positive integer value`
				);

			if (valueExists(options.limit) && !isPositiveInteger(options.limit))
				throw new ClientError(
					"invalid_value",
					`Page limit (size) needs to be a positive integer value`
				);

			if (
				valueExists(options.returnCountInfo) &&
				!isBoolean(options.returnCountInfo)
			)
				throw new ClientError(
					"invalid_value",
					`Return count info option needs to be a boolean value`
				);
		}

		const result = await this.adapter.listBucketFiles(
			this.meta,
			this.name,
			options
		);

		return result;
	}

	/**
	 * Uploads a file to an existing bucket.
	 *
	 * @param {FileStreamObject | FileDiskObject} file The file object that will be stored in the bucket. A file can be uploaded from a readable stream or from a file locally stored on the disk using its localPath.
	 *
	 * If **FileStreamObject** provided then the following values need to be provided:
	 *   - path: The path of the file e.g., *path/to/my/file/filename.jpg*
	 *   - mimeType: The mime-type of the file, e.g., *image/png*
	 *   - size: The size of the file in bytes
	 *   - stream: The Readable stream of file contents
	 *
	 * If **FileDiskObject** provided then the following values need to be provided:
	 *   - path: The path of the file e.g., *path/to/my/file/filename.jpg*
	 *   - mimeType: The mime-type of the file, e.g., *image/png*
	 *   - size: The size of the file in bytes
	 *   - localPath: The local path of the file where it is stored locally
	 *
	 * If **FileUploadOptions** provided then the following values need to be provided:
	 *   - isPublic?: Specifies whether file is publicy accessible or not. Defaults to the bucket's privacy setting if not specified.
	 *   - upsert?: Specifies whether to create a new file or overwrite an existing file. Defaults to false.
	 *   - tags?: Key-value pairs that will be added to the file metadata.
	 *   - userId?: The unique identifier of the user who created the bucket.
	 *
	 * @throws Throws an exception if bucket cannot be identified or an error occurs during file upload.
	 */
	async upload(
		file: FileStreamObject | FileDiskObject,
		options?: FileUploadOptions
	): Promise<FileInfo> {
		if (!valueExists(file) || !isObject(file))
			throw new ClientError(
				"invalid_value",
				`File data to upload needs to be provided`
			);

		if (!isString(file.path))
			throw new ClientError(
				"invalid_value",
				`File path needs to be a string value`
			);

		if (!isString(file.mimeType))
			throw new ClientError(
				"invalid_value",
				`File mime-type needs to be a string value`
			);

		if (!isPositiveIntegerOrZero(file.size))
			throw new ClientError(
				"invalid_value",
				`File size needs to be a positive integer value or zero`
			);

		if ("stream" in file && !(file.stream instanceof Readable))
			throw new ClientError(
				"invalid_value",
				`File stream needs to be a Readable stream`
			);

		if ("localPath" in file && !isString(file.localPath))
			throw new ClientError(
				"invalid_value",
				`File local path needs to be a string value`
			);

		// Check the validity of input parameters
		if (options) {
			if (!isObject(options))
				throw new ClientError(
					"invalid_value",
					`File upload options need to be a JSON object`
				);

			if (valueExists(options.isPublic) && !isBoolean(options.isPublic))
				throw new ClientError(
					"invalid_value",
					`isPublic parameter needs to be a boolean value`
				);

			if (valueExists(options.upsert) && !isBoolean(options.upsert))
				throw new ClientError(
					"invalid_value",
					`Upsert parameter needs to be a boolean value`
				);

			if (valueExists(options.tags) && !isObject(options.tags))
				throw new ClientError(
					"invalid_value",
					`Tags parameter needs to be a JSON object`
				);

			if (valueExists(options.userId) && isObject(options.userId))
				throw new ClientError(
					"invalid_value",
					`User id can be either a number or a string value`
				);
		}

		const result = await this.adapter.uploadFile(
			this.meta,
			this.name,
			file,
			options
		);

		return result;
	}
}
