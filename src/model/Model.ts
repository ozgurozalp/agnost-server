import { ModelBase } from "./ModelBase";
import { DatabaseName, ModelName, ModelType } from "../utils/specifics";
import {
	CountInfo,
	FindByIdArgs,
	FindOneArgs,
	FindManyArgs,
	DeleteArgs,
	UpdateByIdArgs,
	UpdateArgs,
	AggregateArgs,
	WhereCondition,
	UpdateDefinition,
} from "../utils/types";

/**
 * The Model object is primarily used to build database queries or run CRUD operations on a model (i.e., table, collection) of your application.
 *
 * @export
 * @class Model
 */
export class Model<D extends DatabaseName, T extends ModelName> {
	/**
	 * Reference to the model object that performs the required CRUD operations
	 * @protected
	 * @type {ModelBase}
	 */
	protected modelBase: ModelBase;

	/**
	 * Creates an instance of the Model object to dispatch requests to the actual implementation class instance
	 * @param {ModelBase} modelBase Reference to the actual CRUD implementing model base object
	 */
	constructor(modelBase: ModelBase) {
		this.modelBase = modelBase;
	}

	/**
	 * Creates single record in the database.
	 *
	 * @param {ModelType<D, T>} data The data that will be inserted into the database
	 * @returns Returns the newly created record in the database.
	 * @throws Throws an exception if the record cannot be created in the database.
	 */
	async createOne(data: ModelType<D, T>): Promise<object> {
		return await this.modelBase.createOne(data);
	}

	/**
	 * Creates multiple records in the database.
	 *
	 * > If any one of the objects in the input data list fails during creation, none of the objects will be created in the database, i.e., database transaction will be rolled back.
	 *
	 * @param {ModelType<D, T>[]} data The list of records that will be inserted into the database
	 * @returns Returns the count of newly created records in the database
	 * @throws Throws an exception if the records cannot be created in the database.
	 */
	async createMany(data: ModelType<D, T>[]): Promise<CountInfo> {
		return await this.modelBase.createMany(data);
	}

	/**
	 * Returns a single database record identified by its `id`. If no matching record found then `null` is returned.
	 *
	 * @param {string | number} id The unique identifier of the record to retrieve. If the database is MongoDB then a valid MongoDB identifier is required.
	 * @param {FindByIdArgs} args The optional input parameters of the method, namely the `select`, `omit`, `join` and `useReadReplica` definitions
	 *   - select?: Array of fields to include on the returned record. If not provided, checks the `omit` list if `omit` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 *   - omit?: Array of fields to exclude on the returned record. If not provided, checks the `select` list if `select` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 *   - join?: The join(s) to make (left outer join) while getting the record from the database.
	 *   - useReadReplica?:  Specifies whether to use the read replica of the database or not. If no read replica exists, it uses the read-write database.
	 *   - where: The where condition that will be used to filter the records.
	 * @returns Returns the matching record otherwise null
	 * @throws Throws an exception if the database record cannot be retrieved
	 */
	async findById(
		id: string | number,
		args?: FindByIdArgs<D, T>
	): Promise<object | null> {
		return await this.modelBase.findById(id, args);
	}

	/**
	 * Returns a single database record matching the `where` query. If no matching record found then `null` is returned.
	 *
	 * @param {WhereCondition} where The where condition that will be used to filter the records
	 * @param {FindOneArgs} args The input parameters of the method, namely the `sort`, `skip`, `select`, `omit`, `join` and `useReadReplica` definitions
	 *   - select?: Array of fields to include on the returned record. If not provided, checks the `omit` list if `omit` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 *   - omit?: Array of fields to exclude on the returned record. If not provided, checks the `select` list if `select` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 *   - join?: The join(s) to make (left outer join) while getting the record from the database.
	 *   - useReadReplica?:  Specifies whether to use the read replica of the database or not. If no read replica exists, it uses the read-write database.
	 *   - sort?: Sorts the returned objects by the values of the specified fields and sorting order.
	 *   - skip?: Number of records to skip.
	 * @returns Returns the matching record otherwise null
	 * @throws Throws an exception if the database record cannot be retrieved
	 */
	async findOne(
		where: WhereCondition<D, T>,
		args?: FindOneArgs<D, T>
	): Promise<object | null> {
		return await this.modelBase.findOne(where, args);
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
	async findMany(
		where: WhereCondition<D, T>,
		args: FindManyArgs<D, T>
	): Promise<object[]> {
		return await this.modelBase.findMany(where, args);
	}

	/**
	 * Deletes the record identified by the id and returns the deleted record count. If no matching record found, zero is returned as deleted record count.
	 *
	 * @param {string | number} id The unique identifier of the record to delete. If the database is `MongoDB` then a valid MongoDB identifier is required.
	 * @returns Returns the count of the records deleted in the database
	 * @throws Throws an exception if an error occurs during the delete operation
	 */
	async deleteById(id: string | number): Promise<CountInfo> {
		return await this.modelBase.deleteById(id);
	}

	/**
	 * Deletes the records matching the `where` condition.
	 *
	 * @param {DeleteArgs} args The input parameters of the method, namely the `join` definition(s)
	 *   - join?: The join(s) to make (left outer join) while getting the record from the database.
	 * @returns Returns the count of the records deleted in the database
	 * @throws Throws an exception if an error occurs during the delete operation
	 */
	async delete(
		where: WhereCondition<D, T>,
		args?: DeleteArgs<D, T>
	): Promise<CountInfo> {
		return await this.modelBase.delete(where, args);
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
	 *   - $pull: Removes the specified value or matching array object from the array. Applicable only for basic values list or object list fields and can only be used in no-sql databases. You need to specify the select condition to identify the array elements to remove. You can only use $eq, $neq, $lt, $lte, $gt, $gte, $in, $nin, $and, $or, $not and $exists functions in your select condition.
	 *   - $push: Adds the specified value to the array. Applicable only for basic values list or object list fields and can only be used in no-sql databases.
	 *   - $pop: Removes the last element from the array.  Applicable only for basic values list or object list fields and can only be used in no-sql databases.
	 *   - $shift: Removes the first element from the array.  Applicable only for basic values list or object list fields and can only be used in no-sql databases.
	 * @param {UpdateByIdArgs} args The input parameters of the method, namely the `select` or `omit` definitions
	 *   - select?: Array of fields to include on the returned record. If not provided, checks the `omit` list if `omit` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 *   - omit?: Array of fields to exclude on the returned record. If not provided, checks the `select` list if `select` is also not provided then all fields will be returned. You can specifiy either `select` or `omit` but not both.
	 *   - arrayFilters?: The filtered positional operator $[<identifier>] in MongoDB identifies the array elements that match the arrayFilters conditions for an update operation. Array filters define the conditional match structure for array objects and used during update operations that involve update of array elements. You can only use $eq, $neq, $lt, $lte, $gt, $gte, $in, $nin, $and, $or, $not and $exists functions in your array filter conditions. Please note that this option is only available for `MongoDB` databases.
	 * @returns Returns the updated record
	 * @throws Throws an exception if an error occurs during the update operation
	 */
	async updateById(
		id: string | number,
		updates: UpdateDefinition<D, T>,
		args: UpdateByIdArgs<D, T>
	): Promise<object | null> {
		return await this.modelBase.updateById(id, updates, args);
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
	async update(
		where: WhereCondition<D, T>,
		updates: UpdateDefinition<D, T>,
		args: UpdateArgs<D, T>
	): Promise<CountInfo> {
		return await this.modelBase.update(where, updates, args);
	}

	/**
	 *
	 *
	 * @param {UpdateArgs} args The input parameters of the method, namely the `where`, `join` and update instructions
	 * @returns Returns the number of the records updated in the database
	 * @throws Throws an exception if an error occurs during the aggregage operation
	 */
	async aggregate(args: AggregateArgs<D, T>): Promise<object[]> {
		return [];
	}
}
