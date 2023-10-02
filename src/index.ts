import { APIBase } from "./APIBase";
import { AgnostServerSideClient } from "./AgnostServerSideClient";
import { Storage } from "./managers/Storage";
import { Bucket } from "./managers/Bucket";
import { File } from "./managers/File";
import { Queue } from "./managers/Queue";
import { Task } from "./managers/Task";
import { Func } from "./managers/Func";
import { Database } from "./managers/Database";
import { DatabaseBase } from "./managers/DatabaseBase";
import { Model } from "./model/Model";
import { ModelBase } from "./model/ModelBase";
import { Field } from "./model/Field";
import { DBAction } from "./model/DBAction";
import { Cache } from "./managers/Cache";
import { Expression } from "./expression/Expression";

/**
 * Creates a new server-side client to interact with your backend application resource in Agnost cluster.
 *
 * > You do not need to call this method to instantiate a server-side client object. A server-side client instance will be globally available in your Agnost backend apps with the identifier **`agnost`**.
 *
 * @param  {any} metaManager The metadata manager object
 * @param  {any} adapterManager The adapter manager object
 * @returns {AgnostServerSideClient} The newly created server-side client instance
 */
const createServerSideClient = (
	metaManager: any,
	adapterManager: any
): AgnostServerSideClient => {
	return new AgnostServerSideClient(metaManager, adapterManager);
};

const META = (global as any).META;
const ADAPTERS = (global as any).ADAPTERS;

/**
 * Agnost server side client instance.
 */
const agnost = createServerSideClient(META, ADAPTERS);

export {
	agnost,
	createServerSideClient,
	APIBase,
	AgnostServerSideClient,
	Storage,
	Bucket,
	File,
	Queue,
	Task,
	Database,
	DatabaseBase,
	Model,
	ModelBase,
	Field,
	DBAction,
	Expression,
	Func,
	Cache,
};

export * from "./utils/types";
export * from "./utils/specifics";
