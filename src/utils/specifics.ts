export type ReferanceMarker = { _typeTag: "_RefMarker" };
export type ReferenceFieldType =
	| (string & ReferanceMarker)
	| (number & ReferanceMarker);

export type QueueName = string;
export type TaskName = string;
export type StorageName = string;
export type DatabaseName = string;
export type ModelName = string;
export type FunctionName = string;

export type ModelList<D extends DatabaseName> = string;

export type ModelType<D extends DatabaseName, T extends ModelList<D>> = {};
