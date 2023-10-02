import { DatabaseBase } from "../managers/DatabaseBase";
import { Field } from "./Field";
import { DBAction } from "./DBAction";
import { createField } from "./Factory";
import { isArray, isObject } from "../utils/helper";
import { ClientError } from "../utils/ClientError";
import { ConditionType, CountInfo } from "../utils/types";

/**
 * The ModelBase object is primarily used to build database queries or run CRUD operations on a model (i.e., table, collection) of your application.
 *
 * There are several options (e.g., filter, join, select, sort, limit, skip) that you can use to build your queries. As an example, assuming that you have a userOrders model where you keep orders of your users, you can create the following query by specifying options to get the first 100 orders with basket size greater than 50 and sorted by orderDate descending.
 * ```
 * const records = await agnost
 *   .db("myDB")
 *   .model("userOrders")
 *   .filter(
 *     { $gt: ["basketSize", 50] },
 *     { skip: 0, limit: 100, sort: { orderDate: "desc" } },
 *   );
 * ```
 *
 * @export
 * @class ModelBase
 */
export class ModelBase {
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
  protected parent: ModelBase | null;

  /**
   * The reference to the database object.
   * @protected
   * @type {string}
   */
  protected db: DatabaseBase;

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
   * @param {ModelBase | null} parent Reference to the parent @link ModelBase}
   * @param {Database} db Reference to the {@link Database} object
   */
  constructor(meta: any, parent: ModelBase | null, db: DatabaseBase) {
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
   * Returns the model metadata
   * @returns ModelBase metadata
   */
  getMetaObj(): any {
    return this.meta;
  }

  /**
   * Returns the database of the model
   * @returns Database of the model.
   */
  getDb(): DatabaseBase {
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
   * Returns the name of the model
   * @returns Name of the model
   */
  getIid(): string {
    return this.meta.iid;
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
   * Returns the schema of the model
   * @returns Schema of the model
   */
  getField(fieldName: string): Field | undefined {
    return this.fields.get(fieldName);
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
   * Returns the model type
   * @returns Type of the model
   */
  getType(): string {
    return this.meta.type;
  }

  /**
   * Returns true if the model or its sub-models at least have a searchable field
   * @returns Type of the model
   */
  hasSearchIndex(): boolean {
    for (const [fieldName, field] of this.fields) {
      if (field.isSearchable()) return true;
    }

    return false;
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
    index: number = -1,
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
        index,
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
        `The 'createOne' method expects an input object to insert into the database`,
      );
    }

    if (!isObject(data))
      throw new ClientError(
        "invalid_value",
        `The 'data' to create in the database table/collection needs to be a JSON object`,
      );

    const action = new DBAction(this);
    action.setMethod("createOne");
    // Set the prepared data for insertion into the database
    await action.setCreateData(data);
    // Execute the action
    return await action.execute();
  }

  /**
   * Creates multiple top level model objects in the database.
   *
   * > If any one of the objects in the input data list fails during creation, none of the objects will be created in the database, i.e., database transaction will be rolled back.
   *
   * @param {object[]} data The list of objects that will be inserted into the database
   * @returns Returns the count of newly created objects in the database
   * @throws Throws an exception if the objects cannot be created in the database.
   */
  async createMany(data: object): Promise<CountInfo> {
    // Reset the timestamp of the model
    this.resetTimestamp();

    if (!data) {
      throw new ClientError(
        "missing_input_parameter",
        `The 'createOne' method expects an array of input objects to insert into the database`,
      );
    }

    if (!isArray(data))
      throw new ClientError(
        "invalid_value",
        `The 'data' to create in the database table/collection needs to be an array of JSON objects`,
      );

    const action = new DBAction(this);
    action.setMethod("createMany");
    // Set the prepared data for insertion into the database
    await action.setCreateData(data);
    // Execute the action
    return await action.execute();
  }

  /**
   * Returns a single database record identified by its `id`. If no matching object found then `null` is returned.
   *
   * @param {string | number} id The unique identifier of the record to retrieve. If the database is MongoDB then a valid MongoDB identifier is required.
   * @param {FindByIdArgs} args The optional input parameters of the method, namely the `select`, `omit`, `join` and `useReadReplica` definitions
   * @returns Returns the matching record otherwise null
   * @throws Throws an exception if the database record cannot be retrieved
   */
  async findById(id: string | number, args?: any): Promise<object | null> {
    if (!id) {
      throw new ClientError(
        "missing_input_parameter",
        `The 'findById' method expects id of the record to fetch as input`,
      );
    }

    const action = new DBAction(this);
    action.setMethod("findById");
    action.setId(id);
    if (args) {
      // Set whether to use the read replica database or not
      action.setReadReplica(args.useReadReplica);
      // While selecting fields we might be also joining other models and we can select fields from other models
      action.setSelect(args.select, args.join);
      // While selecting fields we might be also joining other models and we can select fields from other models
      action.setOmit(args.omit, args.join);
      // Set included or joined fields
      action.setJoin(args.join);
    }

    // Execute the action
    return await action.execute();
  }

  /**
   * Returns a single database record matching the `where` query. If no matching object found then `null` is returned.
   *
   * @param {WhereCondition} where The filter query to apply on the records
   * @param {FindOneArgs} args The input parameters of the method, namely the `where`, `sort`, `skip`, `select`, `omit`, `join` and `useReadReplica` definitions
   * @returns Returns the matching record otherwise null
   * @throws Throws an exception if the database record cannot be retrieved
   */
  async findOne(where: any, args?: any): Promise<object | null> {
    if (!where) {
      throw new ClientError(
        "missing_input_parameter",
        `The 'findOne' method expects the where condition to query database records`,
      );
    }

    const action = new DBAction(this);
    action.setMethod("findOne");
    action.setWhere(where, args?.join, ConditionType.QUERY);
    if (args) {
      // Set whether to use the read replica database or not
      action.setReadReplica(args.useReadReplica);
      // While selecting fields we might be also joining other models and we can select fields from other models
      action.setSelect(args.select, args.join);
      // While selecting fields we might be also joining other models and we can select fields from other models
      action.setOmit(args.omit, args.join);
      // Set included or joined fields
      action.setJoin(args.join);
      // Set sorting order
      action.setSort(args.sort, args.join);
      // Set skip number
      action.setSkip(args.skip);
    }

    // Execute the action
    return await action.execute();
  }

  /**
   * Returns database records matching the `where` query. If no matching objects found an empty array is returned
   *
   * @param {WhereCondition} where The where condition that will be used to filter the records
   * @param {FindManyArgs} args The input parameters of the method, namely the `sort`, `skip`, `limit`, `select`, `omit`, `join` and `useReadReplica` definitions
   *   - select?: Array of fields to include on the returned record. If not provided, checks the `omit` list if `omit` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
   *   - omit?: Array of fields to exclude on the returned record. If not provided, checks the `select` list if `select` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
   *   - join?: The join(s) to make (left outer join) while getting the record from the database.
   *   - useReadReplica?:  Specifies whether to use the read replica of the database or not. If no read replica exists, it uses the read-write database.
   *   - sort?: Sorts the returned objects by the values of the specified fields and sorting order.
   *   - skip?: Number of records to skip.
   *   - limit?: Max number of objects to return.
   * @returns Returns the matching records otherwise an empty array
   * @throws Throws an exception if the database records cannot be retrieved
   */
  async findMany(where: any, args: any): Promise<object[]> {
    if (!where) {
      throw new ClientError(
        "missing_input_parameter",
        `The 'findMany' method expects the where condition to query database records`,
      );
    }

    const action = new DBAction(this);
    action.setMethod("findMany");
    action.setWhere(where, args?.join, ConditionType.QUERY);
    if (args) {
      // Set whether to use the read replica database or not
      action.setReadReplica(args.useReadReplica);
      // While selecting fields we might be also joining other models and we can select fields from other models
      action.setSelect(args.select, args.join);
      // While selecting fields we might be also joining other models and we can select fields from other models
      action.setOmit(args.omit, args.join);
      // Set included or joined fields
      action.setJoin(args.join);
      // Set sorting order
      action.setSort(args.sort, args.join);
      // Set skip number
      action.setSkip(args.skip);
      // Set limit number
      action.setLimit(args.limit);
    }

    // Execute the action
    return await action.execute();
  }

  /**
   * Deletes the record identified by the id and returns the deleted record count. If no matching object found, zero is returned as deleted record count.
   *
   * @param {string | number} id The unique identifier of the record to delete. If the database is MongoDB then a valid MongoDB identifier is required.
   * @returns Returns the count of the records deleted in the database
   * @throws Throws an exception if the an error occurs during the delete operation
   */
  async deleteById(id: string | number): Promise<CountInfo> {
    if (!id) {
      throw new ClientError(
        "missing_input_parameter",
        `The 'deleteById' method expects id of the record to delete as input`,
      );
    }

    const action = new DBAction(this);
    action.setMethod("deleteById");
    action.setId(id);
    // Execute the action
    return await action.execute();
  }

  /**
   * Deletes the first record matching the `where` condition and returns the deleted record count. If the `where` condition matches multiple documents, only the first document (in natural order, which often corresponds to insertion order unless there's an index that determines otherwise) will be deleted. If no matching object found, zero is returned as deleted record count.
   *
   * @param {WhereCondition} where The where condition that will be used to filter the records
   * @param {DeleteArgs} args The input parameters of the method, namely the `join` definition(s)
   *   - join?: The join(s) to make (left outer join) while getting the record from the database.
   * @returns Returns the count of the records deleted in the database
   * @throws Throws an exception if an error occurs during the delete operation
   */
  async deleteOne(where: any, args?: any): Promise<CountInfo> {
    if (!where) {
      throw new ClientError(
        "missing_input_parameter",
        `The 'delete' method expects the where condition to query database records`,
      );
    }

    const action = new DBAction(this);
    action.setMethod("deleteOne");
    action.setWhere(where, args?.join, ConditionType.QUERY);
    if (args) {
      // Set included or joined fields
      action.setJoin(args.join);
    }

    // Execute the action
    return await action.execute();
  }

  /**
   * Deletes the records matching the `where` condition.
   *
   * @param {DeleteArgs} args The input parameters of the method, namely the `join` definition(s)
   *   - join?: The join(s) to make (left outer join) while getting the record from the database.
   * @returns Returns the count of the records deleted in the database
   * @throws Throws an exception if an error occurs during the delete operation
   */
  async deleteMany(where: any, args?: any): Promise<CountInfo> {
    if (!where) {
      throw new ClientError(
        "missing_input_parameter",
        `The 'delete' method expects the where condition to query database records`,
      );
    }

    const action = new DBAction(this);
    action.setMethod("deleteMany");
    action.setWhere(where, args?.join, ConditionType.QUERY);
    if (args) {
      // Set included or joined fields
      action.setJoin(args.join);
    }

    // Execute the action
    return await action.execute();
  }
  /**
   * Updates the record identified by the id and returns the updated record. If no matching record found then `null` is returned.
   *
   * @param {string | number} id The unique identifier of the record to update. If the database is MongoDB then a valid MongoDB identifier is required.
   * @param {UpdateDefinition} updates An object that contains the fields and their values to update in the database
   *   - You can directly update the value of a field by assigning a value to it as follows {fieldName: value}. Alternatively you can also use field update operations to perform specific field updates. Below are the list of field update operators that you can use:
   *   - $set: Sets (overwrites) the value of a field. Applicable on all fields, except system managed fields such as id, cretedAt, updatedAt etc.
   *   - $unset: Clears the value of a field. Applicable on all not-required fields, except system managed id, createdAt, updatedAt fields. This update operation is only applicable for no-sql databases and cannot be used in SQL based databases.
   *   - $inc: Increments the value of a numeric field by the specified amount. Applicable only for integer and decimal fields.
   *   - $mul: Multiplies the current value of the field with the specified amount and sets the field value to teh multiplication result. Applicable only for integer and decimal fields.
   *   - $min: Assigns the minimum of the specified value or the field value. If the specified value is less than the current field value, sets the field value to the specificied value, otherwise does not make any changes. Applicable only for integer and decimal fields..
   *   - $max: Assigns the maximum of the specified value or the field value. If the specified value is greater than the current field value, sets the field value to the specificied value, otherwise does not make any changes. Applicable only for integer and decimal fields.
   *   - $pull: Removes the specified value or matching array object from the array. Applicable only for basic values list or object list fields and can only be used in no-sql databases.
   *   - $push: Adds the specified value to the array. Applicable only for basic values list or object list fields and can only be used in no-sql databases.
   *   - $pop: Removes the last element from the array.  Applicable only for basic values list or object list fields and can only be used in no-sql databases.
   *   - $shift: Removes the first element from the array.  Applicable only for basic values list or object list fields and can only be used in no-sql databases.
   * @param {UpdateByIdArgs} args The input parameters of the method, namely the `select` or `omit` definitions
   *   - select?: Array of fields to include on the returned record. If not provided, checks the `omit` list if `omit` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
   *   - omit?: Array of fields to exclude on the returned record. If not provided, checks the `select` list if `select` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
   * @returns Returns the updated record
   * @throws Throws an exception if an error occurs during the update operation
   */
  async updateById(
    id: string | number,
    updates: any,
    args: any,
  ): Promise<object | null> {
    if (!id) {
      throw new ClientError(
        "missing_input_parameter",
        `The 'updateById' method expects id of the record to update as input`,
      );
    }

    if (!updates) {
      throw new ClientError(
        "missing_input_parameter",
        `The 'updateById' method expects the update definitions as input parameter`,
      );
    }

    if (!isObject(updates)) {
      throw new ClientError(
        "invalid_value",
        `The 'updateById' method expects the update definitions as an object of key-value pairs`,
      );
    }

    // Reset the timestamp of the model
    this.resetTimestamp();

    const action = new DBAction(this);
    action.setMethod("updateById");
    action.setId(id);
    await action.setUpdates(updates, null);
    if (args) {
      // Set included or joined fields
      action.setSelect(args.select, null);
      action.setOmit(args.omit, null);
      action.setArrayFilters(args.arrayFilters);
    }
    // Execute the action
    return await action.execute();
  }

  /**
   * Updates the first record matching the `where` condition and returns the updated record. If the `where` condition matches multiple documents, only the first document (in natural order, which often corresponds to insertion order unless there's an index that determines otherwise) will be updated. If no matching record found then `null` is returned.
   *
   * @param {WhereCondition} where The where condition that will be used to filter the records
   * @param {UpdateDefinition} updates An object that contains the fields and their values to update in the database
   *   - You can directly update the value of a field by assigning a value to it as follows {fieldName: value}. Alternatively you can also use field update operations to perform specific field updates. Below are the list of field update operators that you can use:
   *   - $set: Sets (overwrites) the value of a field. Applicable on all fields, except system managed fields such as id, cretedAt, updatedAt etc.
   *   - $unset: Clears the value of a field. Applicable on all not-required fields, except system managed id, createdAt, updatedAt fields. This update operation is only applicable for no-sql databases and cannot be used in SQL based databases.
   *   - $inc: Increments the value of a numeric field by the specified amount. Applicable only for integer and decimal fields.
   *   - $mul: Multiplies the current value of the field with the specified amount and sets the field value to teh multiplication result. Applicable only for integer and decimal fields.
   *   - $min: Assigns the minimum of the specified value or the field value. If the specified value is less than the current field value, sets the field value to the specificied value, otherwise does not make any changes. Applicable only for integer and decimal fields..
   *   - $max: Assigns the maximum of the specified value or the field value. If the specified value is greater than the current field value, sets the field value to the specificied value, otherwise does not make any changes. Applicable only for integer and decimal fields.
   *   - $pull: Removes the specified value or matching array object from the array. Applicable only for basic values list or object list fields and can only be used in no-sql databases. You need to specify the select condition to identify the array elements to remove. You can only use $eq, $neq, $lt, $lte, $gt, $gte, $in, $nin, $and, $or, $not and $exists functions in your select condition.
   *   - $push: Adds the specified value to the array. Applicable only for basic values list or object list fields and can only be used in no-sql databases.
   *   - $pop: Removes the last element from the array.  Applicable only for basic values list or object list fields and can only be used in no-sql databases.
   *   - $shift: Removes the first element from the array.  Applicable only for basic values list or object list fields and can only be used in no-sql databases.	 * @param {UpdateArgs} args The input parameters of the method, namely the `join` instructions
   *   - join?: The join(s) to make (left outer join) while getting the record from the database.
   *   - arrayFilters?: The filtered positional operator $[<identifier>] in MongoDB identifies the array elements that match the arrayFilters conditions for an update operation. Array filters define the conditional match structure for array objects and used during update operations that involve update of array elements. You can only use $eq, $neq, $lt, $lte, $gt, $gte, $in, $nin, $and, $or, $not and $exists functions in your array filter conditions. Please note that this option is only available for `MongoDB` databases.
   * @returns Returns the number of the records updated in the database
   * @throws Throws an exception if an error occurs during the update operation
   */
  async updateOne(where: any, updates: any, args: any): Promise<CountInfo> {
    if (!where) {
      throw new ClientError(
        "missing_input_parameter",
        `The 'update' method expects the where condition to query database records`,
      );
    }

    if (!updates) {
      throw new ClientError(
        "missing_input_parameter",
        `The 'update' method expects the update definitions as input parameter`,
      );
    }

    if (!isObject(updates)) {
      throw new ClientError(
        "invalid_value",
        `The 'update' method expects the update definitions as an object of key-value pairs`,
      );
    }

    // Reset the timestamp of the model
    this.resetTimestamp();

    const action = new DBAction(this);
    action.setMethod("updateOne");
    action.setWhere(where, args?.join, ConditionType.QUERY);
    await action.setUpdates(updates, null);
    if (args) {
      // Set included or joined fields
      action.setSelect(args.select, null);
      action.setOmit(args.omit, null);
      action.setJoin(args.join);
      action.setArrayFilters(args.arrayFilters);
    }

    // Execute the action
    return await action.execute();
  }

  /**
   * Updates the records matching the `where` condition. Returns the number of records updated.
   *
   * @param {WhereCondition} where The where condition that will be used to filter the records
   * @param {UpdateDefinition} updates An object that contains the fields and their values to update in the database
   *   - You can directly update the value of a field by assigning a value to it as follows {fieldName: value}. Alternatively you can also use field update operations to perform specific field updates. Below are the list of field update operators that you can use:
   *   - $set: Sets (overwrites) the value of a field. Applicable on all fields, except system managed fields such as id, cretedAt, updatedAt etc.
   *   - $unset: Clears the value of a field. Applicable on all not-required fields, except system managed id, createdAt, updatedAt fields. This update operation is only applicable for no-sql databases and cannot be used in SQL based databases.
   *   - $inc: Increments the value of a numeric field by the specified amount. Applicable only for integer and decimal fields.
   *   - $mul: Multiplies the current value of the field with the specified amount and sets the field value to teh multiplication result. Applicable only for integer and decimal fields.
   *   - $min: Assigns the minimum of the specified value or the field value. If the specified value is less than the current field value, sets the field value to the specificied value, otherwise does not make any changes. Applicable only for integer and decimal fields..
   *   - $max: Assigns the maximum of the specified value or the field value. If the specified value is greater than the current field value, sets the field value to the specificied value, otherwise does not make any changes. Applicable only for integer and decimal fields.
   *   - $pull: Removes the specified value or matching array object from the array. Applicable only for basic values list or object list fields and can only be used in no-sql databases. You need to specify the select condition to identify the array elements to remove. You can only use $eq, $neq, $lt, $lte, $gt, $gte, $in, $nin, $and, $or, $not and $exists functions in your select condition.
   *   - $push: Adds the specified value to the array. Applicable only for basic values list or object list fields and can only be used in no-sql databases.
   *   - $pop: Removes the last element from the array.  Applicable only for basic values list or object list fields and can only be used in no-sql databases.
   *   - $shift: Removes the first element from the array.  Applicable only for basic values list or object list fields and can only be used in no-sql databases.	 * @param {UpdateArgs} args The input parameters of the method, namely the `join` instructions
   *   - join?: The join(s) to make (left outer join) while getting the record from the database.
   *   - arrayFilters?: The filtered positional operator $[<identifier>] in MongoDB identifies the array elements that match the arrayFilters conditions for an update operation. Array filters define the conditional match structure for array objects and used during update operations that involve update of array elements. You can only use $eq, $neq, $lt, $lte, $gt, $gte, $in, $nin, $and, $or, $not and $exists functions in your array filter conditions. Please note that this option is only available for `MongoDB` databases.
   * @returns Returns the number of the records updated in the database
   * @throws Throws an exception if an error occurs during the update operation
   */
  async updateMany(where: any, updates: any, args: any): Promise<CountInfo> {
    if (!where) {
      throw new ClientError(
        "missing_input_parameter",
        `The 'update' method expects the where condition to query database records`,
      );
    }

    if (!updates) {
      throw new ClientError(
        "missing_input_parameter",
        `The 'update' method expects the update definitions as input parameter`,
      );
    }

    if (!isObject(updates)) {
      throw new ClientError(
        "invalid_value",
        `The 'update' method expects the update definitions as an object of key-value pairs`,
      );
    }

    // Reset the timestamp of the model
    this.resetTimestamp();

    const action = new DBAction(this);
    action.setMethod("updateMany");
    action.setWhere(where, args?.join, ConditionType.QUERY);
    await action.setUpdates(updates, null);
    if (args) {
      // Set included or joined fields
      action.setJoin(args.join);
      action.setArrayFilters(args.arrayFilters);
    }

    // Execute the action
    return await action.execute();
  }

  /**
   * Groups the records of the model by the specified expressions or by the specified fields to calculated group statistics.
   *
   * @param {AggregateArgs} args The input parameters of the method, namely the `where`, `join`, `groupBy`, `computations`, `having`, `sort`, `limit` and `skip`  instructions
   *   - where?: The where condition that will be used to filter the records before aggregation.
   *   - join?: The join(s) to make (left outer join) while getting the record from the database.
   *   - groupBy?: The model field names and/or expressions to group the records. If no grouping specified then aggregates all records of the model.
   *   - computations: The computations that will be peformed on the grouped records. At least one computation needs to be provided.
   *   - having?: The conditions that will be applied on the grouped results to further narrow down the results.
   *   - useReadReplica?:  Specifies whether to use the read replica of the database or not. If no read replica exists, it uses the read-write database.
   *   - sort?: Sorts the returned groups by the values of the computations.
   *   - skip?: Number of records to skip.
   *   - limit?: Max number of records to return.
   * @returns Returns the aggregation results
   * @throws Throws an exception if an error occurs during the aggregage operation
   */
  async aggregate(args: any): Promise<object[]> {
    if (!args || !args.computations) {
      throw new ClientError(
        "missing_input_parameter",
        `The 'aggregate' method expects at least one computation to aggregate database records`,
      );
    }

    const action = new DBAction(this);
    action.setMethod("aggregate");
    action.setWhere(args.where, args.join, ConditionType.QUERY);
    action.setJoin(args.join);
    action.setGroupBy(args.groupBy, args.join);
    action.setComputations(args.computations, args.join);
    // Before calling group sort we should have already processed computations and groupby definitions
    action.setHaving(args.having);
    // Before calling group sort we should have already processed computations and groupby definitions
    action.setGroupSort(args.sort);
    action.setSkip(args.skip);
    action.setLimit(args.limit);

    // Execute the action
    return await action.execute();
  }

  /**
   * Retrieves a list of records from the database running the text search. It performs a logical OR search of the terms unless specified as a phrase between double-quotes. If filter is specified it applies the filter query to further narrow down the results.
   *
   * @param {WhereCondition} where The where condition that will be used to filter the records
   * @param {FindManyArgs} args The input parameters of the method, namely the `sort`, `skip`, `limit`, `select`, `omit`, `join` and `useReadReplica` definitions
   *   - where?: The where condition that will be used to further filter results.
   *   - select?: Array of fields to include on the returned record. If not provided, checks the `omit` list if `omit` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
   *   - omit?: Array of fields to exclude on the returned record. If not provided, checks the `select` list if `select` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
   *   - join?: The join(s) to make (left outer join) while getting the record from the database.
   *   - useReadReplica?:  Specifies whether to use the read replica of the database or not. If no read replica exists, it uses the read-write database.
   *   - sort?: Sorts the returned objects by the values of the specified fields and sorting order.
   *   - skip?: Number of records to skip.
   *   - limit?: Max number of objects to return.
   * @returns Returns the matching records otherwise an empty array
   * @throws Throws an exception if the database records cannot be retrieved
   */
  async searchText(text: string, args: any): Promise<object[]> {
    if (!text) {
      throw new ClientError(
        "missing_input_parameter",
        `The 'searchText' method expects the search string to query database records`,
      );
    }

    if (!this.hasSearchIndex()) {
      throw new ClientError(
        "not_searchable_model",
        `To run text search on a model records you need to have at least one 'searchable' text or rich-text field.`,
      );
    }

    const action = new DBAction(this);
    action.setMethod("searchText");
    action.setSearchText(text);
    if (args) {
      // Set the where condition
      action.setWhere(args?.where, args?.join, ConditionType.QUERY);
      // Set whether to use the read replica database or not
      action.setReadReplica(args.useReadReplica);
      // While selecting fields we might be also joining other models and we can select fields from other models
      action.setSelect(args.select, args.join);
      // While selecting fields we might be also joining other models and we can select fields from other models
      action.setOmit(args.omit, args.join);
      // Set included or joined fields
      action.setJoin(args.join);
      // Set sorting order
      action.setSort(args.sort, args.join);
      // Set skip number
      action.setSkip(args.skip);
      // Set limit number
      action.setLimit(args.limit);
    }

    // Execute the action
    return await action.execute();
  }
}
