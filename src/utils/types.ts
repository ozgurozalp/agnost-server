import { Readable } from "stream";

export type MetaType = "storage" | "queue" | "database" | "task";

export type MethodType = "create" | "createMany";

/**
 * Represents a basic javascript object with key-value pairs
 * @export
 * @interface KeyValuePair
 */
export interface KeyValuePair {
	[key: string]: any;
}

/**
 * Provides info about the status of a message that is submitted to a queue.
 * @export
 * @interface MessageInfo
 */
export interface MessageInfo {
	/**
	 * The id of the message
	 * @type {string}
	 */
	messageId: string;
	/**
	 * The id of the queue this message is submitted to
	 * @type {string}
	 */
	queueId: string;
	/**
	 * The name of the queue this message is submitted to
	 * @type {string}
	 */
	queueName: string;
	/**
	 * The message submit date-time
	 * @type {string}
	 */
	submittedAt: string;
	/**
	 * The message processing start date-time
	 * @type {string}
	 */
	startedAt: string;
	/**
	 * The message processing complete date-time
	 * @type {string}
	 */
	completedAt: string;
	/**
	 * The status of the message. When the message is submitted to the queue, it is in `pending` status. When the message is being processed, its status changes to `processing`. If message is successfully completed its status becomes `complete`otherwiese it becomes `errors`.
	 * @type {string}
	 */
	status: "pending" | "processing" | "completed" | "errors";

	/**
	 * Provides information about the errors occurred during processing of the message
	 * @type {object}
	 */
	errors: object;
}

/**
 * Provides info about the status of a task that is triggered for execution.
 * @export
 * @interface TaskInfo
 */
export interface TaskInfo {
	/**
	 * The id of the task
	 * @type {string}
	 */
	taskId: string;
	/**
	 * The id of the scheduled task that is triggered
	 * @type {string}
	 */
	scheduledTaskId: string;
	/**
	 * The name of the scheduled task that is triggered
	 * @type {string}
	 */
	scheduledTaskName: string;
	/**
	 * The task trigger date-time
	 * @type {string}
	 */
	triggeredAt: string;
	/**
	 * The task execution start date-time
	 * @type {string}
	 */
	startedAt: string;
	/**
	 * The task execution complete date-time
	 * @type {string}
	 */
	completedAt: string;
	/**
	 * The status of the task. When the task is firts triggered, it is in `pending` status. When the task is being processed, its status changes to `processing`. If task is successfully completed its status becomes `complete`otherwiese it becomes `errors`.
	 * @type {string}
	 */
	status: "pending" | "processing" | "completed" | "errors";

	/**
	 * Provides information about the errors occurred during execution of the task
	 * @type {object}
	 */
	errors: object;
}

/**
 * Provides info about the storage bucket.
 * @export
 * @interface BucketInfo
 */
export interface BucketInfo {
	/**
	 * The id of the bucket
	 * @type {string}
	 */
	id: string;
	/**
	 * The name of the bucket
	 * @type {string}
	 */
	name: string;
	/**
	 * Default privacy setting that will be applied to files of the bucket
	 * @type {boolean}
	 */
	isPublic: boolean;
	/**
	 * The unique identifier of the user who created the bucket.
	 * @type {string}
	 */
	userId: string;
	/**
	 * Key-value pairs added to the bucket metadata
	 * @type {object}
	 */
	tags: object;
	/**
	 * The creation date and time of the bucket
	 * @type {string}
	 */
	createdAt: string;
	/**
	 * The last modification date and time of bucket metadata
	 * @type {string}
	 */
	updatedAt: string;
}

/**
 * Provides info about the storage bucket.
 * @export
 * @interface BucketInfo
 */
export interface BucketInfoWithStats {
	/**
	 * The id of the bucket
	 * @type {string}
	 */
	id: string;
	/**
	 * The name of the bucket
	 * @type {string}
	 */
	name: string;
	/**
	 * Default privacy setting that will be applied to files of the bucket
	 * @type {boolean}
	 */
	isPublic: boolean;
	/**
	 * The unique identifier of the user who created the bucket.
	 * @type {string}
	 */
	userId: string;
	/**
	 * Key-value pairs added to the bucket metadata
	 * @type {object}
	 */
	tags: object;
	/**
	 * The creation date and time of the bucket
	 * @type {string}
	 */
	createdAt: string;
	/**
	 * The last modification date and time of bucket metadata
	 * @type {string}
	 */
	updatedAt: string;
	/**
	 * The stats about the bucket files
	 * @type {string}
	 */
	stats: {
		/**
		 * Total number of files contained in the bucket
		 * @type {number}
		 */
		objectsCount: number;
		/**
		 * Total size of all files contained in the bucket
		 * @type {number}
		 */
		totalStorageSize: number;
		/**
		 * Average file size in bytes
		 * @type {number}
		 */
		averageObjectSize: number;
		/**
		 * Minimum file size in bytes
		 * @type {number}
		 */
		minObjectSize: number;
		/**
		 * Maximum file size in bytes
		 * @type {number}
		 */
		maxObjectSize: number;
	};
}

/**
 * Provides info about the storage buckets and overall bucket stats
 * @export
 * @interface BucketInfo
 */
export interface BucketWithCountInfo {
	/**
	 * Count info object
	 * @type {string}
	 */
	info: {
		/**
		 * Total number of buckets matching the bucket list options filter conditions
		 * @type {number}
		 */
		count: number;
		/**
		 * Total number of pages for pagination
		 * @type {number}
		 */
		totalPages: number;
		/**
		 * Current page number
		 * @type {number}
		 */
		currentPage: number;
		/**
		 * Page size
		 * @type {number}
		 */
		pageSize: number;
	};

	/**
	 * The list of bucket metadata array
	 * @type {string}
	 */
	data: BucketInfo[];
}

/**
 * Defines the structure how to get app buckets
 * @export
 * @interface BucketListOptions
 */
export interface BucketListOptions {
	/**
	 * The search string parameter. Agnost searches the bucket names that includes the search string parameter.
	 * @type {string}
	 */
	search: string;
	/**
	 * A positive integer that specifies the page number to paginate bucket results. Page numbers start from 1.
	 * @type {(number | null | undefined)}
	 */
	page?: number | null | undefined;
	/**
	 * A positive integer that specifies the max number of buckets to return per page
	 * @type {(number | null | undefined)}
	 */
	limit?: number | null | undefined;
	/**
	 * Specifies the field name and sort direction for sorting returned buckets
	 * @type {(BucketSortEntry | null | undefined)}
	 */
	sort?: BucketSortEntry | null | undefined;
	/**
	 * Flag to specify whether to return the count and pagination information such as total number of buckets, page number and page size
	 * @type {boolean}
	 */
	returnCountInfo?: boolean;
}

/**
 * Defines the structure of a bucket sort entry
 * @export
 * @interface BucketSortEntry
 */
export interface BucketSortEntry {
	/**
	 * The name of the bucket field that will be used in sorting the returned objects
	 * @type {string}
	 */
	field: "name" | "isPublic" | "createdAt" | "updatedAt" | "userId";
	/**
	 * Sort order
	 * @type {string}
	 */
	order: "asc" | "desc";
}

/**
 * Provides info about the storage file.
 * @export
 * @interface FileInfo
 */
export interface FileInfo {
	/**
	 * The id of the file
	 * @type {string}
	 */
	id: string;
	/**
	 * The id of the bucket
	 * @type {string}
	 */
	bucketId: string;
	/**
	 * The name of the file which might also include path information e.g., my/path/to/image1.png
	 * @type {string}
	 */
	name: string;
	/**
	 * Whether file is publicy accessible or not
	 * @type {boolean}
	 */
	isPublic: boolean;
	/**
	 * Size of the file in bytes
	 * @type {boolean}
	 */
	size: number;
	/**
	 * The content-type of the file such as image/gif, text/html
	 * @type {string}
	 */
	mimeType: string;
	/**
	 * The unique identifier of the user who created/uploaded the file.
	 * @type {string}
	 */
	userId: string;
	/**
	 * Key-value pairs added to the file metadata
	 * @type {object}
	 */
	tags: object;
	/**
	 * The upload date and time of the file
	 * @type {string}
	 */
	uploadedAt: string;
	/**
	 * The last modification date and time of file metadata
	 * @type {string}
	 */
	updatedAt: string;
}

/**
 * Provides info about the storage bucket files and overall bucket file stats
 * @export
 * @interface BucketInfo
 */
export interface FileWithCountInfo {
	/**
	 * Count info object
	 * @type {string}
	 */
	info: {
		/**
		 * Total number of files matching the file list options filter conditions
		 * @type {number}
		 */
		count: number;
		/**
		 * Total number of pages for pagination
		 * @type {number}
		 */
		totalPages: number;
		/**
		 * Current page number
		 * @type {number}
		 */
		currentPage: number;
		/**
		 * Page size
		 * @type {number}
		 */
		pageSize: number;
	};

	/**
	 * The list of bucket metadata array
	 * @type {string}
	 */
	data: FileInfo[];
}

/**
 * Defines the structure how to get the files of a bucket
 * @export
 * @interface FileListOptions
 */
export interface FileListOptions {
	/**
	 * The search string parameter. Agnost searches the file names that includes the search string parameter.
	 * @type {string}
	 */
	search: string;
	/**
	 * A positive integer that specifies the page number to paginate file results. Page numbers start from 1.
	 * @type {(number | null | undefined)}
	 */
	page?: number | null | undefined;
	/**
	 * A positive integer that specifies the max number of files to return per page
	 * @type {(number | null | undefined)}
	 */
	limit?: number | null | undefined;
	/**
	 * Specifies the field name and sort direction for sorting returned files
	 * @type {(FileSortEntry | null | undefined)}
	 */
	sort?: FileSortEntry | null | undefined;
	/**
	 * Flag to specify whether to return the count and pagination information such as total number of files, page number and page size
	 * @type {boolean}
	 */
	returnCountInfo?: boolean;
}

/**
 * Defines the structure of a file sort entry
 * @export
 * @interface FileSortEntry
 */
export interface FileSortEntry {
	/**
	 * The name of the file field that will be used in sorting the returned objects
	 * @type {string}
	 */
	field:
		| "bucketId"
		| "name"
		| "size"
		| "contentType"
		| "isPublic"
		| "uploadedAt"
		| "updatedAt"
		| "userId";
	/**
	 * Sort direction
	 * @type {string}
	 */
	order: "asc" | "desc";
}

/**
 * Defines the options available that can be set during file upload
 * @export
 * @interface FileUploadOptions
 */
export interface FileStreamObject {
	/**
	 * The path of the file e.g., *path/to/my/file/filename.jpg*
	 * @type {string}
	 */
	path: string;
	/**
	 * The mime-type of the file, e.g., *image/png*
	 * @type {string}
	 */
	mimeType: string;
	/**
	 * The size of the file in bytes
	 * @type {number}
	 */
	size: number;
	/**
	 * The readable stream of file contents
	 * @type {Readable}
	 */
	stream: Readable;
}

/**
 * Defines the options available that can be set during file upload
 * @export
 * @interface FileUploadOptions
 */
export interface FileDiskObject {
	/**
	 * The path of the file e.g., *path/to/my/file/filename.jpg*
	 * @type {string}
	 */
	path: string;
	/**
	 * The mime-type of the file, e.g., *image/png*
	 * @type {string}
	 */
	mimeType: string;
	/**
	 * The size of the file in bytes
	 * @type {number}
	 */
	size: number;
	/**
	 * The local path of the file where it is stored locally
	 * @type {string}
	 */
	localPath: string;
}

/**
 * Defines the options available that can be set during file upload
 * @export
 * @interface FileUploadOptions
 */
export interface FileUploadOptions {
	/**
	 * Specifies whether file is publicy accessible or not. Defaults to the bucket's privacy setting if not specified.
	 * @type {boolean}
	 */
	isPublic?: boolean;
	/**
	 * Specifies whether to create a new file or overwrite an existing file. Defaults to false.
	 * @type {boolean}
	 */
	upsert?: boolean;
	/**
	 * Key-value pairs that will be added to the file metadata.
	 * @type {KeyValuePair}
	 */
	tags?: KeyValuePair;
	/**
	 * The unique identifier of the user who created the bucket.
	 * @type {string}
	 */
	userId?: string | number;
}

/**
 * Provides statistical information about the overall storage
 * @export
 * @interface StorageInfo
 */
export interface StorageInfo {
	/**
	 * The total number of buckets
	 * @type {number}
	 */
	bucketsCount: number;
	/**
	 * The total number of files
	 * @type {number}
	 */
	objectsCount: number;
	/**
	 * The total storage size for all objects stored
	 * @type {number}
	 */
	totalStorageSize: number;
	/**
	 * The average size of all objects stored
	 * @type {number}
	 */
	averageObjectSize: number;
	/**
	 * The minimum size of all objects stored
	 * @type {number}
	 */
	minObjectSize: number;
	/**
	 * The minimum size of all objects stored
	 * @type {number}
	 */
	maxObjectSize: number;
}

interface DbType {
	MONGODB: string;
	POSTGRESQL: string;
	MYSQL: string;
	SQLSERVER: string;
	ORACLE: string;
}

export const DBTYPE: DbType = {
	MONGODB: "MongoDB",
	POSTGRESQL: "PostgreSQL",
	MYSQL: "MySQL",
	SQLSERVER: "SQL Server",
	ORACLE: "Oracle",
};

/**
 * Defines the structure of a db action that is built by a {@link DBAction}
 * @export
 * @interface ActionDefinition
 */
export interface ActionDefinition {
	/**
	 * The type of the action
	 * @type {string}
	 */
	method: MethodType | null;
	/**
	 * An JSON object or an array of JSON objects that contains the fields and their values to create in the database
	 * @type {object | object[]}
	 */
	createData: object | object[] | null;

	/**
	 * The list of fields to include in returned objects
	 * @type {string | null | undefined}
	 */
	select: string | null;
}
