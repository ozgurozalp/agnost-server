import { APIBase } from "../APIBase";
import { Model } from "../model/Model";
import { ClientError } from "../utils/ClientError";

/**
 * The database object allows you perform CRUD operations on the specified database of your application. With Database object you can create new records/documents in your database table/collection, update or delete existing ones, run queries and paginate over large data sets.
 *
 * @export
 * @class Database
 */
export class Database extends APIBase {
	/**
	 * The name of the database
	 * @protected
	 * @type {string}
	 */
	protected name: string;

	/**
	 * The metadata of the database object
	 * @protected
	 * @type {string}
	 */
	protected meta: any;

	/**
	 * The resource adapter of the database object
	 * @protected
	 * @type {any}
	 */
	protected adapter: any;

	/**
	 * The models of the database
	 * @protected
	 * @type {any}
	 */
	protected models: Map<string, Model>;

	/**
	 * The sub-models of the database
	 * @protected
	 * @type {any}
	 */
	protected subModels: Map<string, Model>;

	/**
	 * Creates an instance of database object to perform CRUD operations on the stored data.
	 * @param {any} metaManager Provides access to the application the version configuration
	 * @param {any} adapterManager Provides access to actual resource adapters and drivers
	 * @param {string} name The name of the database
	 * @throws Throws an exception if metada or adapter of database cannot be found
	 */
	constructor(metaManager: any, adapterManager: any, name: string) {
		super(metaManager, adapterManager);
		this.models = new Map();
		this.subModels = new Map();
		this.name = name;
		// Get the metadata of the database
		this.meta = this.getMetadata("database", name);
		if (!this.meta) {
			throw new ClientError(
				"database_not_found",
				`Cannot find the database object identified by name '${name}'`
			);
		}

		// Get the adapter of the database
		this.adapter = this.getAdapter("database", this.name);
		if (!this.adapter) {
			throw new ClientError(
				"adapter_not_found",
				`Cannot find the adapter of the database named '${name}'`
			);
		}

		// We have the db adapter and the metadata at this point. Build the model hierarchy of the database
		const { models } = this.meta;
		// Process the top level models, when top level models are being processed, we will also build the child models
		const topLevelModels = models.filter(
			(entry: any) => entry.type === "model"
		);

		for (const item of topLevelModels) {
			// Create the top level model
			const model = new Model(item, null, this);
			// Add this model to the models set
			this.addModel(item.name, model);
		}
	}

	/**
	 * Adds model to the database models list
	 * @param {string} name The name of the model (this include the full path information for sub-models e.g., parentModel.subModel.subSubModel)
	 * @param {Model} model The model itself
	 */
	addModel(name: string, model: Model) {
		const schema = model.getSchema();
		if (schema) this.models.set(`${schema}.${name}`, model);
		else this.models.set(name, model);
	}

	/**
	 * Adds sub-model to the database sub-models list
	 * @param {string} name The name of the model (this include the full path information for sub-models e.g., parentModel.subModel.subSubModel)
	 * @param {Model} model The model itself
	 */
	addSubModel(name: string, model: Model) {
		const schema = model.getSchema();
		if (schema) this.subModels.set(`${schema}.${name}`, model);
		else this.subModels.set(name, model);
	}

	/**
	 * Returns the name of the database
	 * @returns Name of the database
	 */
	getName(): string {
		return this.meta.name;
	}

	/**
	 * Returns the type of the database
	 * @returns Type of the database
	 */
	getType(): string {
		return this.meta.type;
	}

	/**
	 * Returns the metadata of the model identified by its iid
	 * @param {string} iid The iid of the model object
	 * @returns Model metadata json object.
	 */
	getModelMetaByIId(iid: string): object {
		const { models } = this.meta;

		return models.find((entry: any) => entry.iid === iid);
	}

	/**
	 * Creates a new {@link Model} object for the specified database model (a.k.a table in relational databases or collection in no-sql databases).
	 *
	 * In Agnost, models define the data structure and data validation rules of your database tables/collections. A model is composed of basic, advanced, and sub-model fields. As an analogy, you can think of models as tables and fields as columns in relational databases.
	 *
	 * You can specify only a **top-level model** name for this method. As an example if you have a model named `users` where you keep your app users information you can create a {@link Model} for `users` model by calling `agnost.db('myDb').model('users')`
	 *
	 * > *If your data model is defined in a schema other than the default one, then your model name needs to be prefixed with the schema name by calling `agnost.db('myDb').model('mySchemaName.myModelName')`. Please note that schemas are supported in **PostgreSQL**, **Oracle** and **SQL Server** databases.*
	 *
	 * @param {string} name The name of the top-level model
	 * @returns Returns a new {@link Model} object that will be issuing database commands (e.g., CRUD operations, queries) on the specified model
	 * @throws Throws an exception if model cannot be found
	 */
	model(name: string): Model {
		const model = this.models.get(name);
		if (!model) {
			throw new ClientError(
				"model_not_found",
				`Cannot find the model identified by name '${name}' in database '${this.meta.name}'`
			);
		}

		return model;
	}
}
