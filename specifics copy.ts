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
export type FunctionName = string;
export type CacheName = string;

export type DatabaseName = "avukat" | "avukat2";
export type ModelList<D extends DatabaseName> = D extends "avukat"
	? "users" | "users2"
	: D extends "avukat2"
	? "users3" | "users4"
	: string;

export type ModelType<
	D extends DatabaseName,
	T extends ModelList<D>,
> = D extends "avukat"
	? T extends "users"
		? {
				name: string;
				email: string;
				"profile.age": number;
				"profile.gender": string;
		  }
		: T extends "users2"
		? {
				name2: string;
				email2: string;
				"profile.age2": number;
				"profile.gender2": string;
		  }
		: never
	: D extends "avukat2"
	? T extends "users3"
		? {
				name3: string;
				email3: string;
				"profile.age3": number;
				"profile.gender3": string;
		  }
		: T extends "users4"
		? {
				name4: string;
				email4: string;
				"profile.age4": number;
				"profile.gender4": string;
		  }
		: never
	: never;

export type ModelTypeHierarchy<
	D extends DatabaseName,
	T extends ModelList<D>,
> = D extends "avukat"
	? T extends "users"
		? {
				name: string;
				email: string;
				profile: {
					age: number;
					gender: string;
				};
		  }
		: T extends "users2"
		? {
				name2: string;
				email2: string;
				profile: {
					age2: number;
					gender2: string;
				};
		  }
		: never
	: D extends "avukat2"
	? T extends "users3"
		? {
				name3: string;
				email3: string;
				profile: {
					age3: number;
					gender3: string;
				};
		  }
		: T extends "users4"
		? {
				name4: string;
				email4: string;
				profile: {
					age4: number;
					gender4: string;
				};
		  }
		: never
	: never;

export type FTSFields<
	D extends DatabaseName,
	T extends ModelList<D>,
> = D extends "legalai"
	? T extends "users"
		? "a" | "b"
		: T extends "documents"
		? "c" | "d"
		: T extends "laws"
		? "e" | "f"
		: never
	: D extends "doctorai"
	? T extends "users"
		? "a" | "b"
		: T extends "hospitals"
		? "c" | "d"
		: T extends "diseases"
		? "e" | "f"
		: never
	: never;
