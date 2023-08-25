import { Database } from "../managers/Database";
import { Field } from "./Field";
import { DBAction } from "./DBAction";
import { createField } from "./Factory";
import { isObject } from "../utils/helper";
import { ClientError } from "../utils/ClientError";
/**
 * The Model object is primarily used to build database queries or run CRUD operations on a model (i.e., table, collection) of your application.
 *
 * There are several modifiers (e.g., filter, join, select, sort, limit, page) that you can use to build your queries. For convenience, these modifiers can be chained to build complex queries. As an example, assuming that you have a userOrders model where you keep orders of your users, you can create the following query by chaining multiple modifiers to get the first 100 orders with basket size greater than 50 and sorted by orderDate descending.
 * ```
 * const { data, errors } = await altogic
 * 	  .db('myDB')
 *    .model('userOrders')
 *    .filter(gt('basketSize', 50))
 *    .sort('orderDate', 'desc')
 *    .limit(100)
 *    .page(1)
 *    .get();
 * ```
 *
 * @export
 * @class Model
 */
export class Model {
	/**
	 * The metadata of the model object
	 * @protected
	 * @type {string}
	 */
	protected meta: any;

	/**
	 * The reference to parent model object. Parent-child hierarchical models are only valid for no-sql databases.
	 * @protected
	 * @type {string}
	 */
	protected parent: Model | null;

	/**
	 * The reference to the database object.
	 * @protected
	 * @type {string}
	 */
	protected db: Database;

	/**
	 * The fields of the model
	 * @protected
	 * @type {any}
	 */
	protected fields: Map<string, Field>;

	/**
	 * The timestamp
	 * @protected
	 * @type {Date | Null}
	 */
	protected timestamp: Date | null;

	/**
	 * Creates an instance of task object to trigger execution of scheduled tasks.
	 * @param {any} meta Provides access to the application the version configuration
	 * @param {Model | null} parent Reference to the parent @link Model}
	 * @param {Database} db Reference to the {@link Database} object
	 */
	constructor(meta: any, parent: Model | null, db: Database) {
		this.meta = meta;
		this.parent = parent;
		this.db = db;
		this.fields = new Map();
		this.timestamp = null;

		const { fields } = meta;
		// Create the field entries of the model
		for (const item of fields) {
			const field = createField(item, this);
			if (field) this.fields.set(item.name, field);
		}
	}

	/**
	 * Returns the database of the model
	 * @returns Database of the model.
	 */
	getDb(): Database {
		return this.db;
	}

	/**
	 * Returns the name of the model
	 * @returns Name of the model
	 */
	getName(): string {
		return this.meta.name;
	}

	/**
	 * Returns the schema of the model
	 * @returns Schema of the model
	 */
	getSchema(): string {
		return this.meta.schema;
	}

	/**
	 * Returns the schema of the model
	 * @returns Schema of the model
	 */
	getFields(): Map<string, Field> {
		return this.fields;
	}

	/**
	 * Returns the timestamp
	 * @returns Schema of the model
	 */
	getTimestamp(): Date | null {
		if (!this.parent) {
			if (!this.timestamp) this.timestamp = new Date();
			return this.timestamp;
		} else return this.parent.getTimestamp();
	}

	/**
	 * Updates the timestamp
	 * @returns Schema of the model
	 */
	resetTimestamp(): void {
		if (this.parent) this.parent.resetTimestamp();
		else this.timestamp = new Date();
	}

	/**
	 * Prepares the list of raw data objects and returns the processed object values list
	 * @param {any[]} data Array of raw data objects that will be processed
	 * @param {boolean} isCreate Whether this is a create or update operation
	 * @param {any} errors Errors object of the parent model if this method is called for a sub-model object
	 * @param {number} index Index number for object in a sub-model-list, mainly used in error messages
	 * @returns Array of processed objects
	 * @throws Throws an exception if the raw data objects cannot pass validation rules
	 */
	async prepareFieldValues(
		data: any,
		isCreate: boolean = true,
		errors: any,
		index: number = -1
	): Promise<object> {
		// Process all data objects
		const processedData: object = {};
		const response: any = errors ?? {};

		// For each field of the model process the entry values
		for (const [fieldName, field] of this.fields) {
			await field.prepare(
				data[fieldName],
				processedData,
				response,
				isCreate,
				index
			);
		}

		return processedData;
	}

	/**
	 * Creates single top level model object in the database.
	 *
	 * @param {object} data The data that will be inserted into the database
	 * @returns Returns the newly create object in the database.
	 * @throws Throws an exception if the object cannot be created in the database.
	 */
	async createOne(data: object): Promise<object> {
		// Reset the timestamp of the model
		this.resetTimestamp();

		if (!data) {
			throw new ClientError(
				"missing_input_parameter",
				`The 'create' method expects an input object to insert into the database`
			);
		}

		if (!isObject(data))
			throw new ClientError(
				"invalid_value",
				`The 'data' to create in the database table/collection needs to be a JSON object`
			);

		const action = new DBAction(this);
		action.setMethod("create");

		const result: any = {};
		const processedData = await this.prepareFieldValues(data, true, result);

		if (result.errors?.length > 0) {
			throw new ClientError(
				"validation_errors",
				`The input data provided has failed to pass validation rules`,
				result.errors
			);
		}

		// Set the prepared data for insertion into the database
		action.setCreateData(processedData);

		return processedData;
	}
}
