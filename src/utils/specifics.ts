export type ReferanceMarker = { _typeTag: "_RefMarker" };
export type ReferenceFieldType =
  | (string & ReferanceMarker)
  | (number & ReferanceMarker);

export type GenericJSON = {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | GenericJSON
    | GenericJSONArray;
};

export type GenericJSONArray = GenericJSON[];
export type JSON = GenericJSON | GenericJSONArray[];
export type QueueName = string;
export type TaskName = string;
export type StorageName = string;
export type CacheName = string;
export type FunctionName = string;
export type DatabaseName = string;
export type ModelList<D extends DatabaseName> = string;
export type ModelType<D extends DatabaseName, T extends ModelList<D>> = {};
export type ModelTypeHierarchy<
  D extends DatabaseName,
  T extends ModelList<D>,
> = {};
export type FTSFields<D extends DatabaseName, T extends ModelList<D>> = string;
