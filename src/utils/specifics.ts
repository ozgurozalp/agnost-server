/* export type QueueName = string;
export type TaskName = string;
export type StorageName = string;
export type DatabaseName = string;
export type ModelName = string;

export type ModelType<D extends DatabaseName, T extends ModelName> = {
	[key: string]: any;
};

export type ModelList<D extends DatabaseName> = string[];
 */

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

export type Users = {
	name: string;
	email: string;
	age: number;
	isPublic: boolean;
	address: GenericJSON;
	"address.street": string;
	"address.zip": number;
};

export type Posts = {
	message: string;
	timestamp: Date;
	userId: string;
};

export type ModelMappings = {
	mydb: {
		Users: Users;
		Posts: Posts;
	};
};

export type ModelType<
	D extends DatabaseName,
	T extends ModelName,
> = ModelMappings[D][T];

export type ModelList<D extends DatabaseName> = D extends "mydb"
	? "Users" | "Posts"
	: never;
