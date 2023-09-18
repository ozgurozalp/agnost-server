/* export type QueueName = string;
export type TaskName = string;
export type StorageName = string;
export type DatabaseName = string;
export type ModelName = string;

export type ModelType<
	D extends DatabaseName,
	T extends ModelName,
	H extends boolean = true,
	P extends string = "",
> = {
	[key: string]: any;
};

export type ModelList<D extends DatabaseName> = string[];
 */

export type ReferanceMarker = { _typeTag: "_RefMarker" };
export type ReferenceFieldType =
	| (string & ReferanceMarker)
	| (number & ReferanceMarker);

export type QueueName = string;
export type TaskName = string;
export type StorageName = string;
export type DatabaseName = "mydb";
export type ModelName = "Users" | "Posts";

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

export type PrependKeys<Base, Prefix extends string> = {
	[K in keyof Base as `${Prefix & string}${Prefix extends ""
		? ""
		: "." & string}${K & string}`]: Base[K];
};

export type mydb_Users_Flat = {
	name: string;
	email: string;
	age: number;
	isPublic: boolean;
	address: GenericJSON;
	"address.street": string;
	"address.zip": number;
	profileId: ReferenceFieldType;
};

export type mydb_Users_Hierarchy = {
	name: string;
	email: string;
	age: number;
	isPublic: boolean;
	address: {
		street: string;
		zip: number;
	};
	profileId: ReferenceFieldType;
};

export type mydb_Posts_Flat = {
	message: string;
	timestamp: Date;
	userId: string;
};

export type mydb_Posts_Hierarchy = {
	message: string;
	timestamp: Date;
	userId: string;
};

export type ModelListMappings = {
	mydb: ModelName;
};

export type ModelList<D extends DatabaseName> = ModelListMappings[D];

export type ModelMappings<H extends boolean = true, P extends string = ""> = {
	mydb: {
		Users: H extends true
			? PrependKeys<mydb_Users_Hierarchy, P>
			: PrependKeys<mydb_Users_Flat, P>;
		Posts: H extends true
			? PrependKeys<mydb_Posts_Hierarchy, P>
			: PrependKeys<mydb_Posts_Flat, P>;
	};
};

export type ModelType<
	D extends DatabaseName,
	T extends ModelName,
	H extends boolean = true,
	P extends string = "",
> = ModelMappings<H, P>[D][T];
