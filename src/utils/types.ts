import { Readable } from "stream";
import { Expression } from "../expression/Expression";
import {
	DatabaseName,
	ModelType,
	ModelList,
	ReferenceFieldType,
} from "./specifics";

export const SQLdatabaseTypes = ["PostgreSQL", "MySQL", "SQL Server", "Oracle"];

export type MetaType =
	| "storage"
	| "queue"
	| "database"
	| "task"
	| "function"
	| "realtime"
	| "cache";

export type MethodType =
	| "createOne"
	| "createMany"
	| "deleteById"
	| "deleteOne"
	| "deleteMany"
	| "findById"
	| "findOne"
	| "findMany"
	| "updateById"
	| "updateOne"
	| "updateMany"
	| "aggregate"
	| "searchText"
	| "getSQLQuery";

/**
 * Represents a basic javascript object with key-value pairs
 * @export
 * @interface KeyValuePair
 */
export type KeyValuePair = {
	[key: string]: any;
};

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
 * Provides info about the storage bucket with additional information
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
 * Provides info about the storage buckets and pagination
 * @export
 * @interface BucketInfo
 */
export interface BucketWithCountInfo {
	/**
	 * Count info object
	 * @type {object}
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
 * @type BucketListOptions
 */
export type BucketListOptions = {
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
};

/**
 * Defines the structure of a bucket sort entry
 * @export
 * @type BucketSortEntry
 */
export type BucketSortEntry = {
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
};

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
 * Provides info about the storage files and pagination
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
 * @type FileListOptions
 */
export type FileListOptions = {
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
};

/**
 * Defines the structure of a file sort entry
 * @export
 * @type FileSortEntry
 */
export type FileSortEntry = {
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
};

/**
 * Defines the options available that can be set during file upload as a stream
 * @export
 * @type FileUploadOptions
 */
export type FileStreamObject = {
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
};

/**
 * Defines the options available that can be set during file upload as a locally stored file in the server
 * @export
 * @type FileUploadOptions
 */
export type FileDiskObject = {
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
};

/**
 * Defines the options available that can be set during file upload
 * @export
 * @type FileUploadOptions
 */
export type FileUploadOptions = {
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
};

/**
 * Provides information about the overall storage
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

export type DbType = {
	MONGODB: string;
	POSTGRESQL: string;
	MYSQL: string;
	SQLSERVER: string;
	ORACLE: string;
};

export const DBTYPE: DbType = {
	MONGODB: "MongoDB",
	POSTGRESQL: "PostgreSQL",
	MYSQL: "MySQL",
	SQLSERVER: "SQL Server",
	ORACLE: "Oracle",
};

export enum ConditionType {
	QUERY = 1,
	PULL_CONDITION = 2,
	ARRAY_FILTER = 3,
}

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
	 * @type {any | any[] | null}
	 */
	createData: any | any[] | null;

	/**
	 * An JSON object that contains the instructions to update model field values
	 * @type {any | null}
	 */
	updateData: any | null;

	/**
	 * The list of fields to include in returned objects
	 * @type {any[] | null}
	 */
	select: any[] | null;

	/**
	 * The list of fields to exclude in returned objects
	 * @type {any[] | null}
	 */
	omit: any[] | null;

	/**
	 * The identifier of the record to retrieve, update or delete
	 * @type {string | number | null}
	 */
	id: string | number | null;

	/**
	 * The number of recordsto skip
	 * @type {string | null}
	 */
	skip: number | null;

	/**
	 * The maximum number of records to return
	 * @type {string | null}
	 */
	limit: number | null;

	/**
	 * The where condition to query database records
	 * @type {Expression | null}
	 */
	where: Expression | null;

	/**
	 * The lookup(s) to make while getting the record from the database
	 * @type {any[] | null}
	 */
	lookup: any[] | null;

	/**
	 * The join(s) to make (left outer join) while getting the record from the database
	 * @type {any[] | null}
	 */
	join: any[] | null;

	/**
	 * The sorting order of the records
	 * @type {any[] | null}
	 */
	sort: any[] | null;

	/**
	 * List of array filter entries
	 * @type {any[] | null}
	 */
	arrayFilters: any[] | null;

	/**
	 * Specifies whether to use the read replica database or not for data retrieval operations. By default this is set to `false`.
	 * @type {boolean}
	 */
	useReadReplica: boolean;

	/**
	 * The group by definitions
	 * @type {any[] | null}
	 */
	groupBy: any[] | null;

	/**
	 * The having condition to apply to computation results
	 * @type {Expression | null}
	 */
	having: Expression | null;

	/**
	 * The group by computation definitions
	 * @type {any[] | null}
	 */
	computations: any[] | null;

	/**
	 * The search field name parameter
	 * @type {string}
	 */
	searchField: string | null;

	/**
	 * The search text parameter
	 * @type {string}
	 */
	searchText: string | null;

	/**
	 * The main model where this subquery will be used
	 * @type {string}
	 */
	baseModel: string | null;

	/**
	 * The flag to specify whether to return the count and pagination information such as total number of records, page number and page size
	 * @type {boolean}
	 */
	returnCount: boolean;
}

/**
 * Specifies the number of objects created, updated or deleted in the database
 * @export
 * @interface CountInfo
 */
export interface CountInfo {
	/**
	 * The number of objects created, updated or deleted in the database
	 * @type {string}
	 */
	count: number;
}

/**
 * The type of an expression
 */
export enum ExpressionType {
	FIELD = 2,
	STATIC = 3,
	FUNCTION = 4,
	ARRAY_FIELD = 5,
}

/**
 * Return value type of an expression
 */
export enum ReturnType {
	NUMBER = 1,
	TEXT = 2,
	BOOLEAN = 3,
	OBJECT = 4,
	DATETIME = 5,
	NULL = 6,
	BINARY = 7,
	JSON = 8,
	ID = 9,
	ARRAY = 10,
	GEOPOINT = 11,
	UNDEFINED = 12,
	ANY = 13,
	PRIMITIVE = 14, // Can be either number, text, boolean, null, id
	DATE = 15,
	TIME = 16,
	STATICBOOLEAN = 17,
}

/**
 * Model fields based on their types
 * @export
 * @type QueryField
 */
export type NumericModelField<
	D extends DatabaseName,
	T extends ModelList<D>,
> = {
	[K in keyof ModelType<D, T>]: ModelType<D, T>[K] extends number ? K : never;
}[keyof ModelType<D, T>];

export type StringModelField<D extends DatabaseName, T extends ModelList<D>> = {
	[K in keyof ModelType<D, T>]: ModelType<D, T>[K] extends string ? K : never;
}[keyof ModelType<D, T>];

export type BooleanModelField<
	D extends DatabaseName,
	T extends ModelList<D>,
> = {
	[K in keyof ModelType<D, T>]: ModelType<D, T>[K] extends boolean ? K : never;
}[keyof ModelType<D, T>];

export type DateModelField<D extends DatabaseName, T extends ModelList<D>> = {
	[K in keyof ModelType<D, T>]: ModelType<D, T>[K] extends Date ? K : never;
}[keyof ModelType<D, T>];

export type ArrayModelField<D extends DatabaseName, T extends ModelList<D>> = {
	[K in keyof ModelType<D, T>]: ModelType<D, T>[K] extends any[] ? K : never;
}[keyof ModelType<D, T>];

export type ReferenceModelField<
	D extends DatabaseName,
	T extends ModelList<D>,
> = {
	[K in keyof ModelType<D, T>]: ModelType<D, T>[K] extends ReferenceFieldType
		? K
		: never;
}[keyof ModelType<D, T>];

/**
 * Numeric value can be either a number, a numeric type field name or a function that returns a numeric value
 * @export
 * @type NumericValue
 */
export type NumericValue<D extends DatabaseName, T extends ModelList<D>> =
	| NumericModelField<D, T>
	| ReferenceModelField<D, T>
	| number
	| QueryFunction<D, T>;

/**
 * String value can be either a string, a string (e.g., text) type field name or a function that returns a string value
 * @export
 * @type StringValue
 */
export type StringValue<D extends DatabaseName, T extends ModelList<D>> =
	| StringModelField<D, T>
	| ReferenceModelField<D, T>
	| string
	| QueryFunction<D, T>;

/**
 * Boolean value can be either a boolean value (true/false), a boolean type field name or a function that returns a boolean value
 * @export
 * @type BooleanValue
 */
export type BooleanValue<D extends DatabaseName, T extends ModelList<D>> =
	| BooleanModelField<D, T>
	| boolean
	| QueryFunction<D, T>;

/**
 * Any value
 * @export
 * @type AnyValue
 */
export type AnyValue<D extends DatabaseName, T extends ModelList<D>> =
	| NumericModelField<D, T>
	| StringModelField<D, T>
	| BooleanModelField<D, T>
	| DateModelField<D, T>
	| ArrayModelField<D, T>
	| ReferenceModelField<D, T>
	| QueryFunction<D, T>;

/**
 * Date value
 * @export
 * @type DateValue
 */
export type DateValue<D extends DatabaseName, T extends ModelList<D>> =
	| DateModelField<D, T>
	| Date
	| QueryFunction<D, T>;

/**
 * Array value
 * @export
 * @type DateValue
 */
export type ArrayValue<D extends DatabaseName, T extends ModelList<D>> =
	| ArrayModelField<D, T>
	| any[]
	| QueryFunction<D, T>;

/**
 * Specifies the mapping of the function name to database specific name
 * @export
 * @type QueryFunctionMapping
 */
export type QueryFunctionMapping = {
	[key: string]: string;
	// PostgreSQL: string;
	// MySQL: string;
	// "SQL Server": string;
	// Oracle: string;
};

/**
 * QueryFunction definition
 * @export
 * @type QueryFunctionDefinition
 */
export type QueryFunctionDefinition = {
	paramCount: number;
	returnType: ReturnType;
	params: ReturnType | ReturnType[];
	mapping: QueryFunctionMapping;
};

export type FieldCondition<
	D extends DatabaseName,
	T extends ModelList<D>,
	M = ModelType<D, T>,
> = {
	[K in keyof M]: M[K] | QueryFunction<D, T>;
};

/**
 * Defines the where condition of the database queries
 * @export
 * @type WhereCondition
 */
export type WhereCondition<D extends DatabaseName, T extends ModelList<D>> =
	| FieldCondition<D, T>
	| QueryFunction<D, T>;

/**
 * Defines the list of functions that can be used in where queries
 * @export
 * @type QueryFunction
 */
export type QueryFunction<D extends DatabaseName, T extends ModelList<D>> = {
	/**
	 * Checks equality of two values
	 */
	$eq?: [leftOperand: AnyValue<D, T>, rightOperand: AnyValue<D, T>];
	/**
	 * Checks not-equality of two values
	 */
	$neq?: [leftOperand: AnyValue<D, T>, rightOperand: AnyValue<D, T>];
	/**
	 * Checks whether the first value is less than the second value
	 */
	$lt?: [firstValue: NumericValue<D, T>, secondValue: NumericValue<D, T>];
	/**
	 * Checks whether the first value is less than or equal to the second value
	 */
	$lte?: [firstValue: NumericValue<D, T>, secondValue: NumericValue<D, T>];
	/**
	 * Checks whether the first value is greater than the second value
	 */
	$gt?: [firstValue: NumericValue<D, T>, secondValue: NumericValue<D, T>];
	/**
	 * Checks whether the first value is greater than or equal to the second value
	 */
	$gte?: [firstValue: NumericValue<D, T>, secondValue: NumericValue<D, T>];
	/**
	 * Checks whether the value is in an array
	 */
	$in?: [value: AnyValue<D, T>, arrayOfValues: ArrayValue<D, T>];
	/**
	 * Checks whether the value is not in an array
	 */
	$nin?: [value: AnyValue<D, T>, arrayOfValues: ArrayValue<D, T>];
	/**
	 * Performs logical and
	 */
	$and?: BooleanValue<D, T>[];
	/**
	 * Performs logical or
	 */
	$or?: BooleanValue<D, T>[];
	/**
	 * Performs logical not
	 */
	$not?: BooleanValue<D, T> | [value: BooleanValue<D, T>];
	/**
	 * Checks if the value exists or not
	 */
	$exists?: AnyValue<D, T> | [value: AnyValue<D, T>];
	/**
	 * Returns the absolute value of a number.
	 */
	$abs?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Adds numbers together
	 */
	$add?: NumericValue<D, T>[];
	/**
	 * Returns the result of dividing the first number by the second
	 */
	$divide?: [dividend: NumericValue<D, T>, divisor: NumericValue<D, T>];
	/**
	 * Returns the smallest integer greater than or equal to the specified number
	 */
	$ceil?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Returns the largest integer less than or equal to the specified number
	 */
	$floor?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Returns the remainder of the first number divided by the second
	 */
	$mod?: [dividend: NumericValue<D, T>, divisor: NumericValue<D, T>];
	/**
	 * Multiplies numbers together and returns the result
	 */
	$multiply?: NumericValue<D, T>[];
	/**
	 * Rounds a number to a whole integer or to a specified decimal place
	 */
	$round?: [number: NumericValue<D, T>, decimalPlaces: NumericValue<D, T>];
	/**
	 * Calculates the square root of a positive number and returns the result as a decimal
	 */
	$sqrt?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Subtracts two numbers to return the difference
	 */
	$subtract?: [number1: NumericValue<D, T>, number2: NumericValue<D, T>];
	/**
	 * Concatenates strings and returns the concatenated string
	 */
	$concat?: StringValue<D, T>[];
	/**
	 * Checks whether a string starts with the characters of a specified string, returning true or false as appropriate
	 */
	$startsWith?: [mainText: StringValue<D, T>, searchText: StringValue<D, T>];
	/**
	 * Checks whether a string ends with the characters of a specified string, returning true or false as appropriate
	 */
	$endsWith?: [mainText: StringValue<D, T>, searchText: StringValue<D, T>];
	/**
	 * Checks whether the main string includes the characters of the search string, returning true or false as appropriate
	 */
	$includes?: [
		mainText: StringValue<D, T>,
		searchText: StringValue<D, T>,
		caseSensitive?: boolean,
	];
	/**
	 * Returns the first count characters from the beginning of the main string as a new string
	 */
	$left?: [text: StringValue<D, T>, characterCount: NumericValue<D, T>];
	/**
	 * Returns the last count characters from the end of the main string as a new string
	 */
	$right?: [text: StringValue<D, T>, characterCount: NumericValue<D, T>];
	/**
	 * Returns the number of characters in the specified string
	 */
	$length?: StringValue<D, T> | [text: StringValue<D, T>];
	/**
	 * Returns the substring of a string. The substring starts with the character at the specified index (zero-based) in the string for the number of characters (count) specified.
	 */
	$substring?: [
		text: StringValue<D, T>,
		startingIndex: NumericValue<D, T>,
		characterCount: NumericValue<D, T>,
	];
	/**
	 * Converts a string to lowercase and returns the resulting new string
	 */
	$lower?: StringValue<D, T> | [text: StringValue<D, T>];
	/**
	 * Converts a string to uppercase and returns the resulting new string
	 */
	$upper?: StringValue<D, T> | [text: StringValue<D, T>];
	/**
	 * Removes whitespace characters (e.g., spaces) from the beginning of a string
	 */
	$ltrim?: StringValue<D, T> | [text: StringValue<D, T>];
	/**
	 * Removes whitespace characters (e.g., spaces) from the end of a string
	 */
	$rtrim?: StringValue<D, T> | [text: StringValue<D, T>];
	/**
	 * Removes whitespace characters (e.g., spaces) from the beginning and end of a string
	 */
	$trim?: StringValue<D, T> | [text: StringValue<D, T>];
	/**
	 * Searches a string for an occurrence of a substring and returns the index (zero-based) of the first occurrence. If the substring is not found, returns -1. The optional starting index parameter is zero based.
	 */
	$charindex?: [
		mainText: StringValue<D, T>,
		searchText: NumericValue<D, T>,
		startingIndex: NumericValue<D, T>,
	];
	/**
	 * Returns the size of the array
	 */
	$size?: ArrayValue<D, T> | [arrayValue: ArrayValue<D, T>];
	/**
	 * Raises Euler’s number (e, the base of the natural logarithm) to the specified exponent and returns the result
	 */
	$exp?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Calculates the natural logarithm of a number and returns the result as a decimal number
	 */
	$ln?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Calculates the log of a number in the specified base and returns the result as a double
	 */
	$log?: [number: NumericValue<D, T>, base: NumericValue<D, T>];
	/**
	 * Calculates the log base 10 of a number and returns the result as a decimal number
	 */
	$log10?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Raises a number to the specified exponent and returns the result. 0 (zero) cannot be raised by a negative exponent in POW function
	 */
	$pow?: [number: NumericValue<D, T>, exponent: NumericValue<D, T>];
	/**
	 * Returns the sine of a value that is measured in radians
	 */
	$sin?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Returns the cosine of a value that is measured in radians
	 */
	$cos?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Returns the tangent of a value that is measured in radians
	 */
	$tan?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Returns the hyperbolic sine of a value that is measured in radians
	 */
	$sinh?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Returns the hyperbolic cosine of a value that is measured in radians
	 */
	$cosh?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Returns the hyperbolic tangent of a value that is measured in radians
	 */
	$tanh?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Returns the inverse sine (arcsine) of a number in radians, in the range -Pi/2 to Pi/2
	 */
	$asin?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Returns the inverse cosine (arccosine) of a number, in radians in the range 0 to Pi
	 */
	$acos?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Returns the inverse tangent (arctangent) of a value in radians, in the range -Pi/2 to Pi/2
	 */
	$atan?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Returns the inverse tangent (arc tangent) of y / x
	 */
	$atan2?: [y: NumericValue<D, T>, x: NumericValue<D, T>];
	/**
	 * Returns the inverse hyperbolic sine (hyperbolic arcsine) of a value
	 */
	$asinh?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Returns the inverse hyperbolic cosine (hyperbolic arc cosine) of a value
	 */
	$acosh?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Returns the inverse hyperbolic tangent (hyperbolic arctangent) of a value in radians
	 */
	$atanh?: NumericValue<D, T> | [value: NumericValue<D, T>];
	/**
	 * Converts an input value measured in degrees to radians
	 */
	$radians?: NumericValue<D, T> | [degress: NumericValue<D, T>];
	/**
	 * Converts an input value measured in radians to degrees
	 */
	$degrees?: NumericValue<D, T> | [radians: NumericValue<D, T>];
	/**
	 * Adds a period of time to the input date & time value and returns the resulting date & time value
	 */
	$dateAdd?: [
		date: DateValue<D, T>,
		duration: NumericValue<D, T>,
		unitOfMeasure:
			| "year"
			| "quarter"
			| "week"
			| "month"
			| "day"
			| "hour"
			| "minute"
			| "second",
	];
	/**
	 * Calculates the difference between two date & time values as a duration.
	 */
	$dateDiff?: [
		startDate: DateValue<D, T>,
		endDate: DateValue<D, T>,
		unitOfMeasure:
			| "year"
			| "quarter"
			| "week"
			| "month"
			| "day"
			| "hour"
			| "minute"
			| "second",
	];
	/**
	 * Returns the hour part of a date as a number between 0 and 23
	 */
	$hour?: DateValue<D, T> | [date: DateValue<D, T>];
	/**
	 * Returns the minute part of a date as an integer between 0 and 59
	 */
	$minute?: DateValue<D, T> | [date: DateValue<D, T>];
	/**
	 * Returns the second part of a date as a number between 0 and 59
	 */
	$second?: DateValue<D, T> | [date: DateValue<D, T>];
	/**
	 * Returns the year part of a date
	 */
	$year?: DateValue<D, T> | [date: DateValue<D, T>];
	/**
	 * Returns the month of a date as a number between 1 and 12
	 */
	$month?: DateValue<D, T> | [date: DateValue<D, T>];
	/**
	 * Returns the day of the month for a date as a number between 1 and 31
	 */
	$dayOfMonth?: DateValue<D, T> | [date: DateValue<D, T>];
	/**
	 * Returns the day of the week for a date as a number between 1 (Sunday) and 7 (Saturday)
	 */
	$dayOfWeek?: DateValue<D, T> | [date: DateValue<D, T>];
	/**
	 * Returns the day of the year for a date as a number between 1 and 366
	 */
	$dayOfYear?: DateValue<D, T> | [date: DateValue<D, T>];
	/**
	 * Converts the input string into a date. The input string needs to be in following format: 'YYYY-MM-DD HH24:MI:SS', e.g., '2023-09-07 23:07:35',
	 */
	$strToDate?: StringValue<D, T> | [dateString: StringValue<D, T>];
	/**
	 * Returns the current date and time
	 */
	$now?: any;
	/**
	 * Converts the input value to a decimal
	 */
	$toDecimal?: AnyValue<D, T> | [value: AnyValue<D, T>];
	/**
	 * Converts the input value to a boolean
	 */
	$toBoolean?: AnyValue<D, T> | [value: AnyValue<D, T>];
	/**
	 * Converts the input value to an integer
	 */
	$toInteger?: AnyValue<D, T> | [value: AnyValue<D, T>];
	/**
	 * Converts the input value to a date
	 */
	$toDate?: AnyValue<D, T> | [value: AnyValue<D, T>];
	/**
	 * Converts the input value to string
	 */
	$toString?: AnyValue<D, T> | [value: AnyValue<D, T>];
	/**
	 * Converts a value to a MongoDB ObjectId(). If the value cannot be converted to an ObjectId, it returns errors. If the value is null or missing, it returns null.
	 * > *Can only be used in MongoDB databases.*
	 */
	$toObjectId?: AnyValue<D, T> | [value: AnyValue<D, T>];
	/**
	 * Calculates the distance between two geo points in meters
	 */
	$distance?: [point1: AnyValue<D, T>, point2: AnyValue<D, T>];
	/**
	 * Constructs and returns a geo point value given the constituent longitude and latitude properties
	 */
	$point?: [longitude: NumericValue<D, T>, latitude: NumericValue<D, T>];
};

/**
 * Any value
 * @export
 * @type AnyPullValue
 */
export type AnyPullValue<D extends DatabaseName, T extends ModelList<D>> =
	| NumericModelField<D, T>
	| StringModelField<D, T>
	| BooleanModelField<D, T>
	| DateModelField<D, T>
	| ArrayModelField<D, T>
	| ReferenceModelField<D, T>;

/**
 * Numeric value can be either a number, a numeric type field name or a function that returns a numeric value
 * @export
 * @type NumericPullValue
 */
export type NumericPullValue<D extends DatabaseName, T extends ModelList<D>> =
	| NumericModelField<D, T>
	| ReferenceModelField<D, T>
	| number;

/**
 * Boolean value can be either a boolean value (true/false), a boolean type field name or a function that returns a boolean value
 * @export
 * @type BooleanPullValue
 */
export type BooleanPullValue<D extends DatabaseName, T extends ModelList<D>> =
	| BooleanModelField<D, T>
	| boolean;

/**
 * Defines the list of functions that can be used in pull select queries
 * @export
 * @type PullQueryFunction
 */
export type PullQueryFunction<
	D extends DatabaseName,
	T extends ModelList<D>,
> = {
	/**
	 * Checks equality of two values
	 */
	$eq?: [leftOperand: AnyPullValue<D, T>, rightOperand: AnyPullValue<D, T>];
	/**
	 * Checks not-equality of two values
	 */
	$neq?: [leftOperand: AnyPullValue<D, T>, rightOperand: AnyPullValue<D, T>];
	/**
	 * Checks whether the first value is less than the second value
	 */
	$lt?: [
		firstValue: NumericPullValue<D, T>,
		secondValue: NumericPullValue<D, T>,
	];
	/**
	 * Checks whether the first value is less than or equal to the second value
	 */
	$lte?: [
		firstValue: NumericPullValue<D, T>,
		secondValue: NumericPullValue<D, T>,
	];
	/**
	 * Checks whether the first value is greater than the second value
	 */
	$gt?: [
		firstValue: NumericPullValue<D, T>,
		secondValue: NumericPullValue<D, T>,
	];
	/**
	 * Checks whether the first value is greater than or equal to the second value
	 */
	$gte?: [
		firstValue: NumericPullValue<D, T>,
		secondValue: NumericPullValue<D, T>,
	];
	/**
	 * Checks whether the value is in an array
	 */
	$in?: [value: AnyPullValue<D, T>, arrayOfValues: AnyPullValue<D, T>];
	/**
	 * Checks whether the value is not in an array
	 */
	$nin?: [value: AnyPullValue<D, T>, arrayOfValues: AnyPullValue<D, T>];
	/**
	 * Performs logical and
	 */
	$and?: BooleanPullValue<D, T>[];
	/**
	 * Checks if the value exists or not
	 */
	$exists?: AnyPullValue<D, T> | [value: AnyPullValue<D, T>];
};

/**
 * Defines the list of functions that can be used in array filters
 * @export
 * @type ArrayFilterFunction
 */
export type ArrayFilterFunction<
	D extends DatabaseName,
	T extends ModelList<D>,
> = {
	/**
	 * Checks equality of two values
	 */
	$eq?: [identifier: AnyValue<D, T>, rightOperand: AnyValue<D, T>];
	/**
	 * Checks not-equality of two values
	 */
	$neq?: [leftOperand: AnyValue<D, T>, rightOperand: AnyValue<D, T>];
	/**
	 * Checks whether the first value is less than the second value
	 */
	$lt?: [
		firstValue: NumericPullValue<D, T>,
		secondValue: NumericPullValue<D, T>,
	];
	/**
	 * Checks whether the first value is less than or equal to the second value
	 */
	$lte?: [
		firstValue: NumericPullValue<D, T>,
		secondValue: NumericPullValue<D, T>,
	];
	/**
	 * Checks whether the first value is greater than the second value
	 */
	$gt?: [
		firstValue: NumericPullValue<D, T>,
		secondValue: NumericPullValue<D, T>,
	];
	/**
	 * Checks whether the first value is greater than or equal to the second value
	 */
	$gte?: [
		firstValue: NumericPullValue<D, T>,
		secondValue: NumericPullValue<D, T>,
	];
	/**
	 * Checks whether the value is in an array
	 */
	$in?: [value: AnyValue<D, T>, arrayOfValues: ArrayValue<D, T>];
	/**
	 * Checks whether the value is not in an array
	 */
	$nin?: [value: AnyValue<D, T>, arrayOfValues: ArrayValue<D, T>];
	/**
	 * Performs logical and
	 */
	$and?: BooleanPullValue<D, T>[];
	/**
	 * Checks if the value exists or not
	 */
	$exists?: AnyValue<D, T> | [value: AnyValue<D, T>];
};

export const UpdatePullFunctions = [
	"$eq",
	"$neq",
	"$lt",
	"$lte",
	"$gt",
	"$gte",
	"$in",
	"$nin",
	"$and",
	"$exists",
];

export type SortDirection = "asc" | "desc";

/**
 * Defines the structure of the sorting order
 * @export
 * @type SortingOrder
 */
export type SortingOrder<D extends DatabaseName, T extends ModelList<D>> = {
	[K in keyof ModelType<D, T>]?: SortDirection;
};

/**
 * Defines the structure of the lookup operation
 * @export
 * @type Join
 */
export type Lookup<D extends DatabaseName, T extends ModelList<D>> = {
	/**
	 * The name of the join. This will become a field of the retrieved record which will hold the looked up value. The specified name needs to be **unique** among the fields of the model.
	 * @type {string}
	 */
	as: string;
	/**
	 * The name of the target model which will be joined with the current model
	 * @type {ModelList<D>}
	 */
	from: ModelList<D>;
	/**
	 * The query expression that will be used in joining the models
	 * @type {string}
	 */
	where: WhereCondition<D, T>;
	/**
	 * Sorts the lookedup objects by the values of the specified fields and sorting order
	 * @type {SortingOrder}
	 */
	sort?: SortingOrder<D, T>;
	/**
	 * Number of records to skip
	 * @type {number}
	 */
	skip?: number;
	/**
	 * Max number of objects to return
	 * @type {number}
	 */
	limit?: number;
};

/**
 * Defines the structure of the join operation
 * @export
 * @type Join
 */
export type Join<D extends DatabaseName, T extends ModelList<D>> = {
	/**
	 * The name of the join. This will become a field of the retrieved record which will hold the looked up value. The specified name needs to be **unique** among the fields of the model.
	 * @type {string}
	 */
	as: string;
	/**
	 * The name of the target model which will be joined with the current model
	 * @type {ModelList<D>}
	 */
	from: ModelList<D>;
	/**
	 * The query expression that will be used in joining the models
	 * @type {string}
	 */
	where: WhereCondition<D, T>;
};

/**
 * Lookup the value of reference fields of a model or define complex join structure
 * @export
 * @type LookupDefinition
 */
export type LookupDefinition<D extends DatabaseName, T extends ModelList<D>> =
	| ReferenceModelField<D, T>
	| Lookup<D, T>
	| (ReferenceModelField<D, T> | Lookup<D, T>)[];

/**
 * Join the value of reference fields of a model or define complex join structure
 * @export
 * @type JoinDefinition
 */
export type JoinDefinition<D extends DatabaseName, T extends ModelList<D>> =
	| ReferenceModelField<D, T>
	| Join<D, T>
	| (ReferenceModelField<D, T> | Join<D, T>)[];

export type UpdateOperation<
	D extends DatabaseName,
	T extends ModelList<D>,
	K extends keyof ModelType<D, T>,
> =
	| { $set: ModelType<D, T>[K] }
	| { $unset: any }
	| { $inc: number }
	| { $mul: number }
	| { $min: number }
	| { $max: number }
	| { $push: any }
	| { $pull: PullQueryFunction<D, T> }
	| { $pop: any }
	| { $shift: any }
	| ModelType<D, T>[K];

export type UpdateDefinition<D extends DatabaseName, T extends ModelList<D>> = {
	[K in keyof ModelType<D, T>]?: UpdateOperation<D, T, K>;
};

export const UpdateOperators = [
	"$set",
	"$unset",
	"$inc",
	"$mul",
	"$min",
	"$max",
	"$push",
	"$pull",
	"$pop",
	"$shift",
];

export const ArrayUpdateOperators = ["$push", "$pull", "$pop", "$shift"];
export const NumericUpdateOperators = ["$inc", "$mul", "$min", "$max"];

/**
 * Any value
 * @export
 * @type AnyValue
 */
export type GroupByModelField<D extends DatabaseName, T extends ModelList<D>> =
	| NumericModelField<D, T>
	| StringModelField<D, T>
	| BooleanModelField<D, T>
	| DateModelField<D, T>
	| ReferenceModelField<D, T>;

/**
 * Defines the expression based grouping structure
 * @export
 * @type Join
 */
export type GroupBy<D extends DatabaseName, T extends ModelList<D>> = {
	/**
	 * The name of the join. This will become a field of the retrieved record which will hold the looked up value. The specified name needs to be **unique** among the fields of the model.
	 * @type {string}
	 */
	as: string;
	/**
	 * The query expression that will be used in joining the models
	 * @type {string}
	 */
	expression: WhereCondition<D, T>;
};

export type GroupByDefinition<D extends DatabaseName, T extends ModelList<D>> =
	| GroupByModelField<D, T>
	| GroupBy<D, T>
	| (GroupByModelField<D, T> | GroupBy<D, T>)[];

export type ComputeOperation<D extends DatabaseName, T extends ModelList<D>> =
	| { $count: any }
	| { $countif: BooleanValue<D, T> }
	| { $sum: NumericValue<D, T> }
	| { $avg: NumericValue<D, T> }
	| { $min: NumericValue<D, T> }
	| { $max: NumericValue<D, T> };

export const ComputeOperators = [
	"$count",
	"$countif",
	"$sum",
	"$avg",
	"$min",
	"$max",
];

/**
 * Defines the computation structure
 * @export
 * @type Join
 */
export type Computation<D extends DatabaseName, T extends ModelList<D>> = {
	/**
	 * This will be the name of the computation where the group by computation will be calculated for.
	 * @type {string}
	 */
	as: string;
	/**
	 * The computation operation
	 * @type {string}
	 */
	compute: ComputeOperation<D, T>;
};

/**
 * Specifies the input parameters of `findById` method
 * @export
 * @type FindByIdArgs
 */
export type FindByIdArgs<D extends DatabaseName, T extends ModelList<D>> = {
	/**
	 * Array of fields to include on the returned record. If not provided, checks the `omit` list if `omit` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 * @type {string}
	 */
	select?: (keyof ModelType<D, T>)[];

	/**
	 * Array of fields to exclude on the returned record. If not provided, checks the `select` list if `select` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 * @type {string}
	 */
	omit?: (keyof ModelType<D, T>)[];

	/**
	 * The lookup(s) to make while getting the record from the database
	 * @type {LookupDefinition}
	 */
	lookup?: LookupDefinition<D, T>;

	/**
	 * Specifies whether to use the read replica of the database or not. If no read replica database exists uses the read-write database.
	 * @type {boolean}
	 */
	useReadReplica?: boolean;
};

/**
 * Specifies the input parameters of `findOne` method
 * @export
 * @type FindOneArgs
 */
export type FindOneArgs<D extends DatabaseName, T extends ModelList<D>> = {
	/**
	 * Array of fields to include on the returned record. If not provided, checks the `omit` list if `omit` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 * @type {string}
	 */
	select?: (keyof ModelType<D, T>)[];

	/**
	 * Array of fields to exclude on the returned record. If not provided, checks the `select` list if `select` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 * @type {string}
	 */
	omit?: (keyof ModelType<D, T>)[];

	/**
	 * The lookup(s) to make while getting the record from the database
	 * @type {LookupDefinition}
	 */
	lookup?: LookupDefinition<D, T>;

	/**
	 * The join(s) to make (left outer join) while getting the record from the database
	 * @type {JoinDefinition}
	 */
	join?: JoinDefinition<D, T>;

	/**
	 * Specifies whether to use the read replica of the database or not. If no read replica database exists uses the read-write database.
	 * @type {boolean}
	 */
	useReadReplica?: boolean;

	/**
	 * Sorts the returned objects by the values of the specified fields and sorting order
	 * @type {SortingOrder}
	 */
	sort?: SortingOrder<D, T>;

	/**
	 * Number of records to skip
	 * @type {number}
	 */
	skip?: number;
};

/**
 * Specifies the input parameters of `findMany` method
 * @export
 * @type FindByIdArgs
 */
export type FindManyArgs<D extends DatabaseName, T extends ModelList<D>> = {
	/**
	 * Array of fields to include on the returned record. If not provided, checks the `omit` list if `omit` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 * @type {string}
	 */
	select?: (keyof ModelType<D, T>)[];

	/**
	 * Array of fields to exclude on the returned record. If not provided, checks the `select` list if `select` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 * @type {string}
	 */
	omit?: (keyof ModelType<D, T>)[];

	/**
	 * The lookup(s) to make while getting the record from the database
	 * @type {LookupDefinition}
	 */
	lookup?: LookupDefinition<D, T>;

	/**
	 * The join(s) to make (left outer join) while getting the record from the database
	 * @type {JoinDefinition}
	 */
	join?: JoinDefinition<D, T>;

	/**
	 * Specifies whether to use the read replica of the database or not. If no read replica database exists uses the read-write database.
	 * @type {boolean}
	 */
	useReadReplica?: boolean;

	/**
	 * Sorts the returned objects by the values of the specified fields and sorting order
	 * @type {SortingOrder}
	 */
	sort?: SortingOrder<D, T>;

	/**
	 * Number of records to skip
	 * @type {number}
	 */
	skip?: number;

	/**
	 * Max number of objects to return
	 * @type {number}
	 */
	limit?: number;

	/**
	 * Specifies whether to return the count and pagination information such as total number of objects matched, page number and page size
	 * @type {boolean}
	 */
	returnCount?: boolean;
};

/**
 * Specifies the input parameters of `deleteOne` and `deleteMany` methods
 * @export
 * @type DeleteArgs
 */
export type DeleteArgs<D extends DatabaseName, T extends ModelList<D>> = {
	/**
	 * The join(s) to make (left outer join) while getting the record from the database
	 * @type {JoinDefinition}
	 */
	join?: JoinDefinition<D, T>;
};

/**
 * Specifies the input parameters of `updateById` method
 * @export
 * @type UpdateByIdArgs
 */
export type UpdateByIdArgs<D extends DatabaseName, T extends ModelList<D>> = {
	/**
	 * Array of fields to include on the returned record. If not provided, checks the `omit` list if `omit` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 * @type {string}
	 */
	select?: (keyof ModelType<D, T>)[];

	/**
	 * Array of fields to exclude on the returned record. If not provided, checks the `select` list if `select` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 * @type {string}
	 */
	omit?: (keyof ModelType<D, T>)[];
	/**
	 * The filtered positional operator $[<identifier>] in MongoDB identifies the array elements that match the arrayFilters conditions for an update operation. Array filters define the conditional match structure for array objects and used during update operations that involve update of array elements.
	 * @type {ArrayFilterFunction}
	 */
	arrayFilters?: ArrayFilterFunction<D, T>[];
};

/**
 * Specifies the input parameters of `updateOne` method
 * @export
 * @type UpdateOneArgs
 */
export type UpdateOneArgs<D extends DatabaseName, T extends ModelList<D>> = {
	/**
	 * Array of fields to include on the returned record. If not provided, checks the `omit` list if `omit` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 * @type {string}
	 */
	select?: (keyof ModelType<D, T>)[];
	/**
	 * Array of fields to exclude on the returned record. If not provided, checks the `select` list if `select` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 * @type {string}
	 */
	omit?: (keyof ModelType<D, T>)[];
	/**
	 * The filtered positional operator $[<identifier>] in MongoDB identifies the array elements that match the arrayFilters conditions for an update operation. Array filters define the conditional match structure for array objects and used during update operations that involve update of array elements.
	 * @type {ArrayFilterFunction}
	 */
	arrayFilters?: ArrayFilterFunction<D, T>[];
	/**
	 * The join(s) to make (left outer join) while getting the record from the database
	 * @type {JoinDefinition}
	 */
	join?: JoinDefinition<D, T>;
};

/**
 * Specifies the input parameters of `updateMany` method
 * @export
 * @type UpdateManyArgs
 */
export type UpdateManyArgs<D extends DatabaseName, T extends ModelList<D>> = {
	/**
	 * The join(s) to make (left outer join) while getting the record from the database
	 * @type {JoinDefinition}
	 */
	join?: JoinDefinition<D, T>;
	/**
	 * The filtered positional operator $[<identifier>] in MongoDB identifies the array elements that match the arrayFilters conditions for an update operation. Array filters define the conditional match structure for array objects and used during update operations that involve update of array elements.
	 * @type {ArrayFilterFunction}
	 */
	arrayFilters?: ArrayFilterFunction<D, T>[];
};

/**
 * Specifies the input parameters of `aggregate` method
 * @export
 * @type FindByIdArgs
 */
export type AggregateArgs<D extends DatabaseName, T extends ModelList<D>> = {
	/**
	 * The where condition that will be used to filter the records before aggregation
	 * @type {WhereCondition}
	 */
	where?: WhereCondition<D, T>;

	/**
	 * The join(s) to make (left outer join) while getting the record from the database
	 * @type {JoinDefinition}
	 */
	join?: JoinDefinition<D, T>;

	/**
	 * The model field names and/or expressions to group the records. If no grouping specified then aggregates all records of the model.
	 * @type {GroupByDefinition}
	 */
	groupBy?: GroupByDefinition<D, T>;

	/**
	 * The computations that will be peformed on the grouped records. At least one computation needs to be provided
	 * @type {Computation}
	 */
	computations: Computation<D, T> | Computation<D, T>[];

	/**
	 * The conditions that will be applied on the grouped results to further narrow down the results
	 * @type {WhereCondition}
	 */
	having?: WhereCondition<D, T>;

	/**
	 * Sorts the returned groups by the values of the computations
	 * @type {SortingOrder}
	 */
	sort?: SortingOrder<D, T>;

	/**
	 * Number of records to skip
	 * @type {number}
	 */
	skip?: number;

	/**
	 * Max number of objects to return
	 * @type {number}
	 */
	limit?: number;

	/**
	 * Specifies whether to use the read replica of the database or not. If no read replica database exists uses the read-write database.
	 * @type {boolean}
	 */
	useReadReplica?: boolean;
};

/**
 * Specifies the input parameters of `findMany` method
 * @export
 * @type FindByIdArgs
 */
export type SearchTextArgs<D extends DatabaseName, T extends ModelList<D>> = {
	/**
	 * The where condition that will be used to futher filter the search results
	 * @type {WhereCondition}
	 */
	where?: WhereCondition<D, T>;

	/**
	 * Array of fields to include on the returned record. If not provided, checks the `omit` list if `omit` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 * @type {string}
	 */
	select?: (keyof ModelType<D, T>)[];

	/**
	 * Array of fields to exclude on the returned record. If not provided, checks the `select` list if `select` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 * @type {string}
	 */
	omit?: (keyof ModelType<D, T>)[];

	/**
	 * The lookup(s) to make while getting the record from the database
	 * @type {LookupDefinition}
	 */
	lookup?: LookupDefinition<D, T>;

	/**
	 * The join(s) to make (left outer join) while getting the record from the database
	 * @type {JoinDefinition}
	 */
	join?: JoinDefinition<D, T>;

	/**
	 * Specifies whether to use the read replica of the database or not. If no read replica database exists uses the read-write database.
	 * @type {boolean}
	 */
	useReadReplica?: boolean;

	/**
	 * Sorts the returned objects by the values of the specified fields and sorting order
	 * @type {SortingOrder}
	 */
	sort?: SortingOrder<D, T>;

	/**
	 * Number of records to skip
	 * @type {number}
	 */
	skip?: number;

	/**
	 * Max number of objects to return
	 * @type {number}
	 */
	limit?: number;

	/**
	 * Specifies whether to return the count and pagination information such as total number of objects matched, page number and page size
	 * @type {boolean}
	 */
	returnCount?: boolean;
};

/**
 * Specifies the input parameters of `getSQLQuery` method
 * @export
 * @type GetSQLQueryArgs
 */
export type GetSQLSubQueryArgs<
	D extends DatabaseName,
	T extends ModelList<D>,
> = {
	/**
	 * The where condition that will be used to futher filter the search results
	 * @type {WhereCondition}
	 */
	where?: WhereCondition<D, T>;
	/**
	 * Array of fields to include on the returned record. If not provided, checks the `omit` list if `omit` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 * @type {string}
	 */
	select?: (keyof ModelType<D, T>)[];

	/**
	 * Array of fields to exclude on the returned record. If not provided, checks the `select` list if `select` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 * @type {string}
	 */
	omit?: (keyof ModelType<D, T>)[];

	/**
	 * The lookup(s) to make while getting the record from the database
	 * @type {LookupDefinition}
	 */
	lookup?: LookupDefinition<D, T>;

	/**
	 * The join(s) to make (left outer join) while getting the record from the database
	 * @type {JoinDefinition}
	 */
	join?: JoinDefinition<D, T>;

	/**
	 * Sorts the returned objects by the values of the specified fields and sorting order
	 * @type {SortingOrder}
	 */
	sort?: SortingOrder<D, T>;

	/**
	 * Number of records to skip
	 * @type {number}
	 */
	skip?: number;

	/**
	 * Max number of objects to return
	 * @type {number}
	 */
	limit?: number;

	/**
	 * The main model where this subquery will be used
	 * @type {number}
	 */
	baseModel: ModelList<D>;
};
