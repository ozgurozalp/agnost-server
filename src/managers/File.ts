import { Readable } from "stream";
import {
	FileInfo,
	FileStreamObject,
	FileDiskObject,
	KeyValuePair,
} from "../utils/types";
import { ClientError } from "../utils/ClientError";
import {
	valueExists,
	isObject,
	isPositiveInteger,
	isString,
	isBoolean,
} from "../utils/helper";

/**
 * File object is primarily used to manage a file. Using the {@link Bucket.file} method, you can create a File instance for a specific file identified by its name.
 *
 * @export
 * @class File
 */
export class File {
	/**
	 * The path of the file e.g., path/to/my/file.png
	 * @protected
	 * @type {string}
	 */
	protected path: string;

	/**
	 * The name of the bucket where this file is stored under
	 * @protected
	 * @type {string}
	 */
	protected bucketName: string;

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
	 * Creates an instance to manage a specific file of your application.
	 * @param {any} storageMeta Provides access to the application the version configuration
	 * @param {any} storageAdapter Provides access to actual resource adapters and drivers
	 * @param {string} bucketName The name of the bucket where this file is stored in
	 * @param {string} path The path of the file e.g., path/to/my/file.png
	 */
	constructor(
		storageMeta: any,
		storageAdapter: any,
		bucketName: string,
		path: string
	) {
		this.path = path;
		this.bucketName = bucketName;
		this.meta = storageMeta;
		this.adapter = storageAdapter;
	}

	/**
	 * Check if the file exists.
	 *
	 * @returns Returns true if file exists, false otherwise
	 */
	async exists(): Promise<boolean> {
		const exists: boolean = await this.adapter.fileExists(
			this.meta,
			this.bucketName,
			this.path
		);

		return exists;
	}

	/**
	 * Gets information about the file.
	 *
	 * @returns Returns basic file metadata informaton. If not such file exists then returns null.
	 */
	async getInfo(): Promise<FileInfo> {
		const result = await this.adapter.getFileInfo(
			this.meta,
			this.bucketName,
			this.path
		);

		return result;
	}

	/**
	 * Deletes the file from the bucket.
	 * @throws Throws an exception if file cannot be identified or deleted.
	 */
	async delete(): Promise<void> {
		await this.adapter.deleteFile(this.meta, this.bucketName, this.path);
	}

	/**
	 * Sets the default privacy of the file to **true**.
	 *
	 * @returns Returns the updated file information
	 * @throws Throws an exception if file cannot be identified.
	 */
	async makePublic(): Promise<FileInfo> {
		const result = await this.adapter.makeFilePublic(
			this.meta,
			this.bucketName,
			this.path
		);

		return result;
	}

	/**
	 * Sets the default privacy of the file to **false**.
	 *
	 * @returns Returns the updated file information.
	 * @throws Throws an exception if file cannot be identified.
	 */
	async makePrivate(): Promise<FileInfo> {
		const result = await this.adapter.makeFilePrivate(
			this.meta,
			this.bucketName,
			this.path
		);

		return result;
	}

	/**
	 * Downloads the file as a stream. The returned readable stream can be piped to a writable stream or listened to for 'data' events to read a file's contents.
	 *
	 * @returns Returns a readable stream to read the contents of the stored file.
	 * @throws Throws an exception if file cannot be identified.
	 */
	async createReadStream(): Promise<Readable> {
		const result = await this.adapter.createFileReadStream(
			this.meta,
			this.bucketName,
			this.path
		);

		return result;
	}

	/**
	 * Sets the specified tag value in file's metadata.
	 *
	 * @param {string} key The key of the tag
	 * @param {any} value The value of the tag
	 * @returns Returns the updated file information
	 * @throws Throws an exception if file cannot be identified.
	 */
	async setTag(key: string, value: any): Promise<FileInfo> {
		if (!isString(key))
			throw new ClientError(
				"invalid_value",
				`Key parameter needs to be a string value`
			);

		const result = await this.adapter.setFileTag(
			this.meta,
			this.bucketName,
			this.path,
			key,
			value
		);

		return result;
	}

	/**
	 * Removes the specified tag from file's metadata.
	 *
	 * @param {string} key The name of the tag key to remove from file metadata
	 * @returns Returns the updated file information
	 * @throws Throws an exception if file cannot be identified.
	 */
	async removeTag(key: string): Promise<FileInfo> {
		if (!isString(key))
			throw new ClientError(
				"invalid_value",
				`Key parameter needs to be a string value`
			);

		const result = await this.adapter.removeFileTag(
			this.meta,
			this.bucketName,
			this.path,
			key
		);

		return result;
	}

	/**
	 * Removes all tags from files's metadata.
	 *
	 * @returns Returns the updated file information
	 * @throws Throws an exception if file cannot be identified.
	 */
	async removeAllTags(): Promise<FileInfo> {
		const result = await this.adapter.removeAllFileTags(
			this.meta,
			this.bucketName,
			this.path
		);

		return result;
	}

	/**
	 * Copies the file to another path in the same bucket. It basically creates a copy of the existing file at the new path `toPath`.
	 *
	 * @param {string} toPath The new file path where this file will be copied to.
	 * @returns Returns the copied file information
	 * @throws Throws an exception if file cannot be identified or if there is already a file stored at the new path
	 */
	async copyTo(toPath: string): Promise<FileInfo> {
		if (!isString(toPath))
			throw new ClientError(
				"invalid_value",
				`Path parameter needs to be a string value`
			);

		const result = await this.adapter.copyFileTo(
			this.meta,
			this.bucketName,
			this.path,
			toPath
		);

		return result;
	}

	/**
	 * Moves the file to another path in the same bucket. This method basically updates the file path including the file name.
	 *
	 * @param {string} toPath The new file path where this file will be moved to.
	 * @returns Returns the updated file information
	 * @throws Throws an exception if file cannot be identified or if there is already a file stored at the new path
	 */
	async moveTo(toPath: string): Promise<FileInfo> {
		if (!isString(toPath))
			throw new ClientError(
				"invalid_value",
				`Path parameter needs to be a string value`
			);

		const result = await this.adapter.moveFileTo(
			this.meta,
			this.bucketName,
			this.path,
			toPath
		);

		return result;
	}

	/**
	 * Replaces an existing file with another. It keeps the path and name of the file but replaces file contents, size and mime-type with the newly uploaded file info. Please note that `FileStreamObject.path` or `FileDiskObject.path` data will be ignored since only the contents of the file is replaced not its path or name.
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
	 * @returns Returns the updated file information
	 * @throws Throws an exception if file cannot be identified or an error occurs during file upload.
	 */
	async replace(file: FileStreamObject | FileDiskObject): Promise<FileInfo> {
		if (!valueExists(file) || !isObject(file))
			throw new ClientError(
				"invalid_value",
				`File data to upload needs to be provided`
			);

		if (!isString(file.mimeType))
			throw new ClientError(
				"invalid_value",
				`File mime-type needs to be a string value`
			);

		if (!isPositiveInteger(file.size))
			throw new ClientError(
				"invalid_value",
				`File size needs to be a positive integer value value`
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

		const result = await this.adapter.replaceFile(
			this.meta,
			this.bucketName,
			this.path,
			file
		);

		return result;
	}

	/**
	 * Updates the overall file metadata (path, isPublic and tags) in a single method call.
	 *
	 * @param {string} newPath The new path of the file.
	 * @param {boolean} isPublic The privacy setting of the file.
	 * @param {KeyValuePair} tags JSON object (key-value pairs) that will be set as the file metadata.
	 * @returns Returns the updated file information
	 * @throws Throws an exception if file cannot be identified or updated
	 */
	async updateInfo(
		newPath: string,
		isPublic: boolean,
		tags: KeyValuePair
	): Promise<FileInfo> {
		if (!isString(newPath))
			throw new ClientError(
				"invalid_value",
				`New path parameter needs to be a string value`
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

		const result = await this.adapter.updateFileInfo(
			this.meta,
			this.bucketName,
			this.path,
			newPath,
			isPublic,
			tags
		);

		return result;
	}
}
