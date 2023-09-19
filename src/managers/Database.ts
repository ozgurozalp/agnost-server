import { DatabaseBase } from "./DatabaseBase";
import { Model } from "../model/Model";
import { DatabaseName, ModelList } from "../utils/specifics";

/**
 * The database object allows you perform CRUD operations on the specified database of your application. With Database object you can create new records/documents in your database table/collection, update or delete existing ones, run queries and paginate over large data sets.
 *
 * @export
 * @class Database
 */
export class Database<D extends DatabaseName> {
  /**
   * The actual database object that performs the database operations.
   * @protected
   * @type {DatabaseBase}
   */
  protected dbBase: DatabaseBase;

  /**
   * Creates an instance of database object to perform CRUD operations on the stored data.
   * @param {any} metaManager Provides access to the application the version configuration
   * @param {any} adapterManager Provides access to actual resource adapters and drivers
   * @param {string} name The name of the database
   * @throws Throws an exception if metada or adapter of database cannot be found
   */
  constructor(metaManager: any, adapterManager: any, name: D) {
    this.dbBase = new DatabaseBase(metaManager, adapterManager, name);
  }

  /**
   * Creates a new {@link Model} object for the specified database model (a.k.a table in relational databases or collection in no-sql databases).
   *
   * In Agnost, models define the data structure and data validation rules of your database tables/collections. A model is composed of fields. As an analogy, you can think of models as tables and fields as columns in relational databases.
   *
   * You can specify only a **top-level model** name for this method. As an example if you have a model named `users` where you keep your app users information you can create a {@link Model} for `users` model by calling `agnost.db('myDb').model('users')`
   *
   * > *If your data model is defined in a schema other than the default one, then your model name needs to be prefixed with the schema name by calling `agnost.db('myDb').model('mySchemaName.myModelName')`. Please note that schemas are supported in **PostgreSQL**, **Oracle** and **SQL Server** databases.*
   *
   * @param {string} name The name of the top-level model
   * @returns Returns a new {@link Model} object that will be issuing database commands (e.g., CRUD operations, queries) on the specified model
   * @throws Throws an exception if model cannot be found
   */
  model<T extends ModelList<D>>(name: T): Model<D, T> {
    const modelBase = this.dbBase.model(name);
    return new Model(modelBase);
  }

  /**
   * Starts a new transaction on the database server. Any database CRUD operation that is executed after a call to `beginTransaction` will be executed within the transaction context. If the transaction is not committed then the changes will not be applied to the database.
   * > *Please note that transactions are executed on the read-write database not on the read replicas.*
   */
  async beginTransaction(): Promise<void> {
    await this.dbBase.beginTransaction();
  }

  /**
   * Commits the currently active database transaction.
   * > *Please note that transactions are executed on the read-write database not on the read replicas.*
   */
  async commitTransaction(): Promise<void> {
    await this.dbBase.commitTransaction();
  }

  /**
   * Aborts the transaction and rolls back the database changes that are exected within the transaction.
   * > *Please note that transactions are executed on the read-write database not on the read replicas.*
   */
  async rollbackTransaction(): Promise<void> {
    await this.dbBase.rollbackTransaction();
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
    return this.dbBase.getClient();
  }

  /**
   * Returns the database name used by Agnost. If *Assign a unique name to this database in different versions of the application* is selected when creating a database in Agnost studio, then Agnost assigns a unique database name. This method returns the actual database name used in your application.
   *
   * @returns Database name
   */
  getActualDbName(): string {
    return this.dbBase.getActualDbName();
  }
}
