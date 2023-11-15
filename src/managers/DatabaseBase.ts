import { APIBase } from "../APIBase";
import { ModelBase } from "../model/ModelBase";
import { ClientError } from "../utils/ClientError";
import { SQLdatabaseTypes } from "../utils/types";

const HELPER = (global as any).helper;
const META = (global as any).META;

/**
 * The actual Database class which is used to originate the CRUD operations.
 *
 * @export
 * @class Database
 */
export class DatabaseBase extends APIBase {
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
  protected models: Map<string, ModelBase>;

  /**
   * The sub-models of the database
   * @protected
   * @type {any}
   */
  protected subModels: Map<string, ModelBase>;

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
        `Cannot find the database object identified by name '${name}'`,
      );
    }

    // Get the adapter of the database
    this.adapter = this.getAdapter("database", this.name);
    if (!this.adapter) {
      throw new ClientError(
        "adapter_not_found",
        `Cannot find the adapter of the database named '${name}'`,
      );
    }

    // We have the db adapter and the metadata at this point. Build the model hierarchy of the database
    const { models } = this.meta;
    // Process the top level models, when top level models are being processed, we will also build the child models
    const topLevelModels = models.filter(
      (entry: any) => entry.type === "model",
    );

    for (const item of topLevelModels) {
      // Create the top level model
      const model = new ModelBase(item, null, this);
      // Add this model to the models set
      this.addModel(item.name, model);
    }
  }

  /**
   * @private
   * Adds model to the database models list
   * @param {string} name The name of the model (this include the full path information for sub-models e.g., parentModel.subModel.subSubModel)
   * @param {ModelBase} model The model itself
   */
  addModel(name: string, model: ModelBase) {
    const schema = model.getSchema();
    if (schema) this.models.set(`${schema}.${name}`, model);
    else this.models.set(name, model);
  }

  /**
   * Adds sub-model to the database sub-models list
   * @param {string} name The name of the model (this include the full path information for sub-models e.g., parentModel.subModel.subSubModel)
   * @param {ModelBase} model The model itself
   * @internal
   */
  addSubModel(name: string, model: ModelBase) {
    const schema = model.getSchema();
    if (schema) this.subModels.set(`${schema}.${name}`, model);
    else this.subModels.set(name, model);
  }

  /**
   * Returns the database metadata
   * @returns Database metadata
   * @internal
   */
  getMetaObj(): any {
    return this.meta;
  }

  /**
   * Returns the database adapter
   * @param {boolean} readOnly Whether to return the readonly adapter or not
   * @returns Database adapter
   * @internal
   */
  getAdapterObj(readOnly: boolean = false): any {
    if (!readOnly) return this.adapter.adapter;
    else {
      // If the readonly adapter is not there then return the read-write adapter
      if (this.adapter.slaves && this.adapter.slaves.length > 0) {
        const slave =
          this.adapter.slaves[
            HELPER.randomInt(1, this.adapter.slaves.length) - 1
          ];

        return slave.adapter;
      } else return this.adapter.adapter;
    }
  }

  /**
   * Returns the name of the database
   * @returns Name of the database
   * @internal
   */
  getName(): string {
    return this.meta.name;
  }

  /**
   * Returns the type of the database
   * @returns Type of the database
   * @internal
   */
  getType(): string {
    return this.meta.type;
  }

  /**
   * Returns true if the database is an SQL database
   * @returns True for SQL databases and false for non-sql databases
   * @internal
   */
  isSQLDB(): boolean {
    return SQLdatabaseTypes.includes(this.meta.type);
  }

  /**
   * Returns the metadata of the model identified by its iid
   * @param {string} iid The iid of the model object
   * @returns ModelBase metadata json object.
   * @internal
   */
  getModelMetaByIId(iid: string): any {
    const { models } = this.meta;

    return models.find((entry: any) => entry.iid === iid);
  }

  /**
   * Returns the model identified by its iid
   * @param {string} iid The iid of the model object
   * @returns ModelBase object
   * @internal
   */
  getModelByIId(iid: string): ModelBase {
    const modelMeta: any = this.getModelMetaByIId(iid);
    return this.model(modelMeta.name);
  }

  /**
   * Creates a new {@link ModelBase} object for the specified database model (a.k.a. table in relational databases or collection in no-sql databases).
   *
   * In Agnost, models define the data structure and data validation rules of your database tables/collections. A model is composed of basic, advanced, and sub-model fields. As an analogy, you can think of models as tables and fields as columns in relational databases.
   *
   * You can specify only a **top-level model** name for this method. As an example if you have a model named `users` where you keep your app users information you can create a {@link ModelBase} for `users` model by calling `agnost.db('myDb').model('users')`
   *
   * > *If your data model is defined in a schema other than the default one, then your model name needs to be prefixed with the schema name by calling `agnost.db('myDb').model('mySchemaName.myModelName')`. Please note that schemas are supported in **PostgreSQL**, **Oracle** and **SQL Server** databases.*
   *
   * @param {any} name The name of the top-level model
   * @returns Returns a new {@link ModelBase} object that will be issuing database commands (e.g., CRUD operations, queries) on the specified model
   * @throws Throws an exception if model cannot be found
   */
  model(name: any): ModelBase {
    const model = this.models.get(name);
    if (!model) {
      throw new ClientError(
        "model_not_found",
        `Cannot find the model identified by name '${name}' in database '${this.meta.name}'`,
      );
    }

    return model;
  }

  /**
   * Starts a new transaction on the database server. Any database CRUD operation that is executed after a call to `beginTransaction` will be executed within the transaction context. If the transaction is not committed then the changes will not be applied to the database.
   * > *Please note that transactions are executed on the read-write database not on the read replicas.*
   */
  async beginTransaction(): Promise<void> {
    await this.getAdapterObj(false).beginTransaction(this.meta);
  }

  /**
   * Commits the currently active database transaction.
   * > *Please note that transactions are executed on the read-write database not on the read replicas.*
   */
  async commitTransaction(): Promise<void> {
    await this.getAdapterObj(false).commitTransaction(this.meta);
  }

  /**
   * Aborts the transaction and rolls back the database changes that are exected within the transaction.
   * > *Please note that transactions are executed on the read-write database not on the read replicas.*
   */
  async rollbackTransaction(): Promise<void> {
    await this.getAdapterObj(false).rollbackTransaction(this.meta);
  }

  /**
   * Returns the database client that you can use the perform advanced database operations. A client instance for the the following NPM modules will be returned.
   *
   * | Database type | NPM module |
   * | MognoDB | mongodb |
   * | PostgreSQL | pg |
   * | MySQL | mysql2 |
   * | SQL Server | mssql |
   *
   *  > *Please note that if you update the database schame for a database that is managed by Agnost using the `client`, these changes will not be reflected to your Agnost application. For this reason we recommend using Agnost studio to perform database schema changes.*
   * @returns Database client
   */
  getClient(): any {
    return this.getAdapterObj(false).getDriver();
  }

  /**
   * Returns whether the database should assign a unique name or use the name given when being created in Agnost studio
   */
  getAssignUniqueName() {
    return this.meta.assignUniqueName ?? true;
  }

  /**
   * Returns the database name used by Agnost. If *Assign a unique name to this database in different versions of the application* is selected when creating a database in Agnost studio, then Agnost assigns a unique database name. This method returns the actual database name used in your application.
   *
   * @returns Database name
   */
  getActualDbName(): string {
    if (this.getAssignUniqueName())
      return `${META.getEnvId()}_${this.meta.iid}`;
    else return this.meta.name;
  }
}
