export type ReferanceMarker = { _typeTag: "_RefMarker" };
export type ReferenceFieldType =
	| (string & ReferanceMarker)
	| (number & ReferanceMarker);

export type QueueName = string;
export type TaskName = string;
export type StorageName = string;
// export type DatabaseName = string;
// export type ModelName = string;
export type FunctionName = string;
export type CacheName = string;
// export type ModelList<D extends DatabaseName> = string;
// export type ModelType<D extends DatabaseName> = string;
// export type FTSFields<D extends DatabaseName> = string;

// New definitions
export type Databases = {
	legalai: {
		users: {
			name: string;
			email: string;
			age: number;
			isPublic: boolean;
			"deneme.denene.join": number;
		};
		documents: { path: string; category: string };
		laws: { name: string; article: number; puclishDate: string };
	};
	doctorai: {
		users: { name: string; email: string; age: number; isPublic: boolean };
		hospitals: { name: string; address: string };
		diseases: { name: string; complications: string };
	};
};

export type DatabaseName = keyof Databases;
export type ModelList<D extends DatabaseName> = keyof Databases[D];
export type ModelType<
	D extends DatabaseName,
	T extends ModelList<D>,
> = Databases[D][T];

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
