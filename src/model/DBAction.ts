import { ModelBase } from "./ModelBase";
import { JoinField } from "./field/JoinField";
import { ArrayFilterField } from "./field/ArrayFilterField";
import { Expression } from "../expression/Expression";
import { StaticValue } from "../expression/values/StaticValue";
import { FieldValue } from "../expression/values/FieldValue";
import { ArrayFilterFieldValue } from "../expression/values/ArrayFilterFieldValue";
import { ArrayValue } from "../expression/values/ArrayValue";
import { FunctionManager } from "../expression/Factory";

import {
  ActionDefinition,
  MethodType,
  UpdateOperators,
  DBTYPE,
  ConditionType,
  ComputeOperators,
  ReturnType,
} from "../utils/types";
import {
  isObject,
  isArray,
  isValidId,
  isInteger,
  isPositiveInteger,
  isBoolean,
  isString,
} from "../utils/helper";
import { ClientError } from "../utils/ClientError";

/**
 * The database action is primarily used to build database queries or run CRUD operations on a model (i.e., table, collection) of your application.
 *
 * @export
 * @class DBAction
 */
export class DBAction {
  /**
   * The reference to model object that the database action will be executed.
   * @protected
   * @type {string}
   */
  protected model: ModelBase;

  /**
   * The definition of the action.
   * @protected
   * @type {ActionDefinition}
   */
  protected definition: ActionDefinition;

  /**
   * Creates an instance of DBAction object.
   * @param {ModelBase} model Reference to the {@link ModelBase} object that this database action will be exectued on.
   */
  constructor(model: ModelBase) {
    this.model = model;
    this.definition = {
      method: null,
      createData: null,
      updateData: null,
      select: null,
      omit: null,
      id: null,
      skip: null,
      limit: null,
      join: null,
      where: null,
      sort: null,
      arrayFilters: null,
      useReadReplica: false,
      groupBy: null,
      computations: null,
      having: null,
      searchText: null,
    };
  }

  /**
   * Returns the createData field of the action definition
   */
  getCreateData(): any {
    return this.definition.createData;
  }

  /**
   * Returns the where field of the action definition
   */
  getWhere(): any {
    return this.definition.where;
  }

  /**
   * Returns the soft field of the action definition
   */
  getSort(): any {
    return this.definition.sort;
  }

  /**
   * Sets the method part of the db action definition
   * @param {MethodType} method The method that will be executed
   */
  setMethod(method: MethodType) {
    this.definition.method = method;
  }

  /**
   * Sets the method part of the db action definition
   * @param {string | number} id The record unique identifier
   */
  setId(id: string | number) {
    if (!isValidId(id, this.model.getDb().getType()))
      throw new ClientError(
        "invalid_value",
        `Not a valid record identifier '${id}'`,
      );

    this.definition.id = id;
  }

  /**
   * Sets the searchText part of the db action definition
   * @param {string} searchText The search string
   */
  setSearchText(searchText: string) {
    if (typeof searchText === "object") {
      throw new ClientError(
        "invalid_parameter",
        `The 'searchText' method expects the search string to query database records`,
      );
    }

    this.definition.searchText = searchText;
  }

  /**
   * Sets the method part of the db action definition
   * @param {any | null | undefined} where The where condition
   * @param {JoinDefinition} join The join definition
   * @param {number} expType The type of the expression
   */
  setWhere(
    where: any | null | undefined,
    join: any | null | undefined,
    expType: number,
  ) {
    if (!where) return;

    const expression = this.processWhereCondition(where, join, expType);
    this.definition.where = expression;
  }

  /**
   * Sets the select part of the db action definition
   * @param {string} select The names of the fields to include in returned objects
   * @param {JoinDefinition} join The join definition
   */
  setSelect(select: string[] | null | undefined, join: any | null | undefined) {
    if (!select) return;

    if (!isArray(select))
      throw new ClientError(
        "invalid_value",
        `Select option needs to specify the names of the fields to return in an array of field names e.g., ["name", "email", "profile.age"]`,
      );

    if (this.definition.omit)
      throw new ClientError(
        "invalid_value",
        `Either fields to include (select) or exclude (omit) can be specified not both`,
      );

    // Filter only the valid string entries and ignore the others
    select = select.filter((entry) => typeof entry === "string" && entry);
    if (select.length === 0) return;

    const finalList: any[] = [];
    const errorList: string[] = [];

    // Check validity of field names whether they are part the base model or joined models
    for (const fieldName of select) {
      const fieldObj = this.getFieldObject(fieldName, join);
      if (fieldObj) finalList.push({ fieldName, ...fieldObj });
      else errorList.push(fieldName);
    }

    if (errorList.length > 0) {
      throw new ClientError(
        "invalid_field",
        `Select option needs to specify the names of valid fields of the base model or fields of the joined models. The following fields cannot be specified in select option '${errorList.join(
          ", ",
        )}'`,
      );
    }

    this.definition.select = finalList;
  }

  /**
   * Sets the select part of the db action definition
   * @param {string} select The names of the fields to include in returned objects
   * @param {JoinDefinition} join The join definition
   */
  setOmit(omit: string[] | null | undefined, join: any | null | undefined) {
    if (!omit) return;

    if (!isArray(omit))
      throw new ClientError(
        "invalid_value",
        `Select option needs to specify the names of the fields to return in an array of field names e.g., ["name", "email", "profile.age"]`,
      );

    if (this.definition.select)
      throw new ClientError(
        "invalid_value",
        `Either fields to include (select) or exclude (omit) can be specified not both`,
      );

    // Filter only the valid string entries and ignore the others
    omit = omit.filter((entry) => typeof entry === "string" && entry);
    if (omit.length === 0) return;

    const finalList: any[] = [];
    const errorList: string[] = [];

    // Check validity of field names whether they are part the base model or joined models
    for (const fieldName of omit) {
      const fieldObj = this.getFieldObject(fieldName, join);
      if (fieldObj) finalList.push({ fieldName, ...fieldObj });
      else errorList.push(fieldName);
    }

    if (errorList.length > 0) {
      throw new ClientError(
        "invalid_field",
        `Omit option needs to specify the names of valid fields of the base model or fields of the joined models. The following fields cannot be specified in omit option '${errorList.join(
          ", ",
        )}'`,
      );
    }

    this.definition.omit = finalList;
  }

  /**
   * Returns the field object matching the name
   * @param {string} fieldName The field name to check
   * @param {JoinDefinition | null | undefined} join The join definition
   * @returns Field object definition includind fieldPath, field itself joinType and joinModel if field can be identified otherwise null
   */
  getFieldObject(fieldName: string, join: any | null | undefined): any {
    // Filter all field paths starting with the positional operator '$'
    const fieldPath = fieldName
      .split(".")
      .filter((entry) => !entry.startsWith("$"));
    // Check if we have a field path in dot notation e.g., fieldName.subFieldName
    if (fieldPath.length === 1) {
      const field = this.model.getField(fieldName);
      // If we have a valid field then add it to our list and move to the next one
      if (field)
        return {
          fieldPath: fieldName,
          field,
          joinType: "none",
          joinModel: this.model,
        };
      else {
        // Check if this is directly the joined model
        const joinDefinition = this.getJoinDefinition(fieldName, join);
        if (joinDefinition) {
          const joinedModel = this.model.getDb().model(joinDefinition.from);
          if (joinedModel) {
            return {
              fieldPath: fieldName,
              field: new JoinField({ name: joinDefinition.as }, joinedModel),
              joinType: "complex",
              joinModel: joinedModel,
            };
          }
        }
        return null;
      }
    } else {
      let model: any = this.model;
      let joinType: string = "none";
      // At this point we have a field path, iterate over the path to find out whether the provided field is a valid one or not
      for (let i = 0; i < fieldPath.length; i++) {
        const element = fieldPath[i];
        const field = model.getField(element);

        // Check if we have a metching field to the fieldPath entry
        if (field) {
          // If we are not at the end of the field path then it should be either an object, object-list or looked up reference field
          const fieldType = field.getType();
          if (i !== fieldPath.length - 1) {
            if (fieldType === "object" || fieldType === "object-list") {
              model = field.getSubModel();
            } else if (
              fieldType === "reference" &&
              this.isFieldInJoinDefinition(field.getQueryPath(), join)
            ) {
              model = this.model.getDb().getModelByIId(field.getRefModelIId());
              joinType = joinType === "complex" ? joinType : "simple";
            } else return null;
          } else
            return {
              fieldPath: fieldName,
              field,
              joinType,
              joinModel: model,
            };
        } else if (i === 0) {
          // We do not have a matching field to the path fragment. Check to see if the field is a joined model field
          const joinDefinition = this.getJoinDefinition(element, join);
          if (joinDefinition) {
            const joinedModel = this.model.getDb().model(joinDefinition.from);
            if (joinedModel) {
              model = joinedModel;
              joinType = "complex";
            } else return null;
          } else return null;
        } else return null;
      }

      return null;
    }
  }

  /**
   * Checks whether the field name matches to a joined model
   * @param {string} fieldName The field name to check
   * @param {JoinDefinition | null | undefined} join The join definition
   * @returns True if the field is in the Join definition otherwise false
   */
  isFieldInJoinDefinition(
    fieldName: string,
    join: any | null | undefined,
  ): boolean {
    if (!join) return false;

    if (typeof join === "string" && fieldName === join) return true;
    if (
      typeof join === "object" &&
      !Array.isArray(join) &&
      join.as === fieldName
    )
      return true;

    if (Array.isArray(join)) {
      for (const entry of join) {
        if (typeof entry === "string" && fieldName === entry) return true;
        if (
          typeof entry === "object" &&
          !Array.isArray(entry) &&
          entry.as === fieldName
        )
          return true;
      }
    }

    return false;
  }

  /**
   * Returns the join definition of the field
   * @param {string} fieldName The field name to check
   * @param {JoinDefinition | null | undefined} join The join definition
   * @returns Join definition if the field name matches to a complex join otherwise null
   */
  getJoinDefinition(fieldName: string, join: any | null | undefined): any {
    if (!join) return null;

    if (typeof join === "string" && fieldName === join) return null;
    if (
      typeof join === "object" &&
      !Array.isArray(join) &&
      join.as === fieldName
    )
      return join;

    if (Array.isArray(join)) {
      for (const entry of join) {
        if (typeof entry === "string" && fieldName === entry) return null;
        if (
          typeof entry === "object" &&
          !Array.isArray(entry) &&
          entry.as === fieldName
        )
          return entry;
      }
    }

    return null;
  }

  /**
   * Sets the join part of the db action definition
   * @param {JoinDefinition} join The join definition
   */
  setJoin(join: any | null | undefined) {
    if (!join) return;

    // Join definition can be one of the following
    // 1. A single string definition which basically specifies a reference field name of the model
    // 2. A single joing definition which basically defines the complex join structure with the name of the joined model, alias and query structure
    // 3. A combination of the above two in an array
    const finalJoin: any[] = [];

    // Check to see if this is a single string definition
    if (typeof join === "string")
      this.processStringBasedJoin(join, join, finalJoin);
    else if (typeof join === "object" && !Array.isArray(join))
      this.processObjectBasedJoin(join, join, finalJoin);
    else if (Array.isArray(join)) {
      for (const entry of join) {
        if (typeof entry === "string")
          this.processStringBasedJoin(entry, join, finalJoin);
        else if (typeof entry === "object" && !Array.isArray(entry))
          this.processObjectBasedJoin(entry, join, finalJoin);
        else
          throw new ClientError(
            "invalid_join",
            `Not a valid join definition. The join array needs to include either reference field names as string or complex join definition as JSON object with 'as', 'from' and 'where' values.`,
          );
      }
    } else
      throw new ClientError("invalid_join", `Not a valid join definition.`);

    this.definition.join = finalJoin;
  }

  /**
   * Processes a string based join
   * @param {string} refFieldName The reference field name
   * @param {JoinDefinition} join The join definition
   * @param {any[]} joinList The final join definition list to store join config
   */
  processStringBasedJoin(refFieldName: string, join: any, joinList: any[]) {
    const fieldDef = this.getFieldObject(refFieldName, join);
    if (!fieldDef || fieldDef.field.getType() !== "reference")
      throw new ClientError(
        "invalid_join",
        `'${refFieldName}' is not a valid reference field to join. You can either join reference fields or define join queries.`,
      );

    const joinModel = this.model
      .getDb()
      .getModelByIId(fieldDef.field.getRefModelIId());

    if (joinList.find((entry) => entry.as === refFieldName))
      throw new ClientError(
        "invalid_join",
        `There is already a join definition with the alias '${refFieldName}'.`,
      );

    joinList.push({
      fieldPath: fieldDef.fieldName,
      field: fieldDef.field,
      joinType: "simple",
      joinModel,
      where: null,
      as: refFieldName,
      from: joinModel.getName(),
    });
  }

  /**
   * Processes an object based join
   * @param {object} joinDef The join defintion object
   * @param {JoinDefinition} join The join definition
   * @param {any[]} joinList The final join definition list to store join config
   */
  processObjectBasedJoin(joinDef: any, join: any, joinList: any[]) {
    if (!joinDef.as || !joinDef.from || !joinDef.where)
      throw new ClientError(
        "invalid_join",
        `The 'from', 'as' and 'where' parameters of a join definition need to be specified.`,
      );

    if (!isString(joinDef.as))
      throw new ClientError(
        "invalid_join",
        `The 'as' parameter of the join definition needs to be string value.`,
      );

    if (joinDef.as.includes("."))
      throw new ClientError(
        "invalid_join",
        `The 'as' parameter of the join definition cannot include '.'(dot) characters.`,
      );

    // Check for duplicate field name
    const duplicateField = this.model.getField(joinDef.as);
    if (duplicateField)
      throw new ClientError(
        "invalid_join",
        `The 'as' parameter should not conflict with an existing field of the base model. There is already a field named '${
          joinDef.as
        }' in model '${this.model.getName()}'`,
      );

    if (!isString(joinDef.from))
      throw new ClientError(
        "invalid_join",
        `The 'from' parameter of the join definition needs to be string value.`,
      );

    // Check for joined model existence
    const model = this.model.getDb().model(joinDef.from);
    if (!model)
      throw new ClientError(
        "invalid_join",
        `The 'from' parameter should match to the model to join. There no model named '${this.model.getName()}' in datababase '${this.model
          .getDb()
          .getName()}'`,
      );

    if (!isObject(joinDef.where))
      throw new ClientError(
        "invalid_join",
        `The 'where' parameter of the join definition needs to define the query structure as a JSON object.`,
      );

    const fieldDef = this.getFieldObject(joinDef.as, join);
    if (
      !fieldDef ||
      fieldDef.joinType !== "complex" ||
      fieldDef.field.getType() !== "join"
    )
      throw new ClientError(
        "invalid_join",
        `Join from '${joinDef.from}' as '${joinDef.as}' is not a valid join definition. You can either join reference fields or define join queries.`,
      );

    const expression = this.processWhereCondition(
      joinDef.where,
      join,
      ConditionType.QUERY,
    );
    if (!expression)
      throw new ClientError(
        "invalid_join",
        `The 'where' condition of the join definition is missing.`,
      );

    if (joinList.find((entry) => entry.as === joinDef.as))
      throw new ClientError(
        "invalid_join",
        `There is already a join definition with the alias '${joinDef.as}'.`,
      );

    joinList.push({
      ...fieldDef,
      where: expression,
      as: joinDef.as,
      from: joinDef.from,
    });
  }

  /**
   * Returns the expression of the where condition
   * @param {string} condition The where condition
   * @param {JoinDefinition} join The join definition
   * @param {number} expType The type of the expression
   * @returns Where condition expression
   */
  processWhereCondition(
    condition: any,
    join: any | null | undefined,
    expType: number,
  ): Expression | null {
    if (!condition) return null;
    const entries = Object.entries(condition);
    // If there are not entries in the where condition then return null
    if (entries.length === 0) return null;

    // If there is more than one entry then we assume that these entries are combined in logical AND operator
    if (entries.length > 1) {
      const and = new FunctionManager["$and"]();
      for (const [key, value] of entries) {
        const expression = this.processExpression(key, value, join, expType);
        and.addParam(expression);
      }
      // Validate the expression
      if (expType === ConditionType.QUERY)
        and.validate(this.model.getDb().getType());
      else and.validateForPull(this.model.getDb().getType());
      return and;
    } else {
      const [key, value] = entries[0];
      return this.processExpression(key, value, join, expType);
    }
  }

  /**
   * Processes a single query function and returns its expression
   * @param {string} key The function name
   * @param {any} value The function parameters
   * @param {JoinDefinition} join The join definition
   * @param {number} expType The type of the expression
   * @returns The function expression
   */
  processExpression(
    key: string,
    value: any,
    join: any | null | undefined,
    expType: number,
  ): Expression {
    // Check if this is a function
    const funcDefinition = FunctionManager[key.toLowerCase()];
    if (funcDefinition) {
      const func = new funcDefinition();

      if (Array.isArray(value)) {
        for (const entry of value) {
          const param = this.parseValue(entry, join, expType);
          func.addParam(param);
        }
      } else {
        const param = this.parseValue(value, join, expType);
        func.addParam(param);
      }

      // Validate function before returning
      if (expType === ConditionType.QUERY)
        func.validate(this.model.getDb().getType());
      else func.validateForPull(this.model.getDb().getType());
      return func;
    } else {
      // Check if this is a field value, this is the shorthand for {fieldName: value} equality check
      const fieldObj = this.getFieldObject(key, join);
      if (fieldObj && fieldObj.field.getType() !== "join") {
        const eq = new FunctionManager["$eq"]();
        const left = this.parseValue(key, join, expType);
        const right = this.parseValue(value, join, expType);
        eq.addParam(left);
        eq.addParam(right);
        // Validate function before returning
        if (expType === ConditionType.QUERY)
          eq.validate(this.model.getDb().getType());
        else eq.validateForPull(this.model.getDb().getType());
        return eq;
      } else if (
        !fieldObj &&
        typeof key === "string" &&
        expType === ConditionType.ARRAY_FILTER
      ) {
        // This can be an array filter entry
        const eq = new FunctionManager["$eq"]();
        const left = new ArrayFilterFieldValue(
          new ArrayFilterField({ name: key }, this.model, key),
          key,
          "none",
          this.model,
        );
        const right = this.parseValue(value, join, expType);
        eq.addParam(left);
        eq.addParam(right);
        // Validate function before returning
        eq.validateForPull(this.model.getDb().getType());
        return eq;
      }
      // The entry is neither a comparison operator, logical operator or function definition then throw an error
      else
        throw new ClientError(
          "invalid_expression",
          `There is no comparison operator, logical operator, function or model field named '${key}'.`,
        );
    }
  }

  /**
   * Parses a value and returns its expression
   * @param {any} value The function parameters
   * @param {JoinDefinition} join The join definition
   * @param {number} expType The type of the expression
   * @returns The value expression
   */
  parseValue(
    value: any,
    join: any | null | undefined,
    expType: number,
  ): Expression {
    // If this is a static value then create a static object
    if (
      typeof value === "boolean" ||
      typeof value === "number" ||
      value === null
    )
      return new StaticValue(value);
    else if (typeof value === "string") {
      // The type of the value is string, first check whether this is a field value or not
      const fieldObj = this.getFieldObject(value, join);

      // If field object return a new FieldValeu otherwise return static text value
      if (fieldObj) {
        return new FieldValue(
          fieldObj.field,
          fieldObj.fieldPath,
          fieldObj.joinType,
          fieldObj.JoinModel,
        );
      } else if (
        typeof value === "string" &&
        expType === ConditionType.ARRAY_FILTER
      ) {
        // This can be an array filter entry
        // Usually the array filter identifier can be mixed with static text, in any case array filter returns its name/value during query building
        return new ArrayFilterFieldValue(
          new ArrayFilterField({ name: value }, this.model, value),
          value,
          "none",
          this.model,
        );
      } else return new StaticValue(value);
    } else if (typeof value === "object" && !Array.isArray(value)) {
      // This means that we can a JSON object here
      const entries = Object.entries(value);
      // If there are not entries in the where condition then return null
      if (entries.length === 0)
        throw new ClientError(
          "invalid_parameter",
          `Not a valid function or opeartor parameter '${value}' to specify in a where condition.`,
        );
      else if (entries.length > 1) {
        throw new ClientError(
          "invalid_parameter",
          `Not a valid query expression. Query expression objects have a single { key: value } pair. The provided expression '${JSON.stringify(
            value,
          )}' has ${entries.length} keys.`,
        );
      }

      const [objKey, objValue] = entries[0];
      return this.processExpression(objKey, objValue, join, expType);
    } else if (Array.isArray(value)) {
      const arrayObj = new ArrayValue();
      for (const entry of value) {
        const expression = this.parseValue(entry, join, expType);
        arrayObj.addEntry(expression);
      }

      return arrayObj;
    } else {
      throw new ClientError(
        "invalid_parameter",
        `Not a valid function or operator parameter '${value}' to specify in a where condition.`,
      );
    }
  }

  /**
   * Sets the sort part of the db action definition
   * @param {SortingOrder} sort The fields and their sorting order
   * @param {JoinDefinition} join The join definition
   */
  setSort(sort: any | null | undefined, join: any | null | undefined) {
    if (!sort) return;

    if (!isObject(sort))
      throw new ClientError(
        "invalid_value",
        `Sort definition needs to specify the fields and  their sorting order e.g., {"field1": "asc", "field2": "desc"}`,
      );

    const sortList: any[] = [];
    // Check validity of field names whether they are part the base model or joined models
    const keys = Object.keys(sort);
    for (const fieldName of keys) {
      const fieldObj = this.getFieldObject(fieldName, join);
      if (!fieldObj) {
        throw new ClientError(
          "invalid_field",
          `'${fieldName}' is not a valid field that can be used to sort query results.`,
        );
      }

      const order = sort[fieldName];
      if (order !== "asc" && order !== "desc") {
        throw new ClientError(
          "invalid_field",
          `Sorting order '${order}' is not a valid ordering type for '${fieldName}'. Ordering can be either 'asc' or 'desc'.`,
        );
      }

      sortList.push({ fieldName, order, ...fieldObj });
    }

    if (sortList.length > 0) this.definition.sort = sortList;
  }

  /**
   * Sets the number of rercords to skip
   * @param {number} skip The number of records to skip
   */
  setSkip(skip: number | null | undefined) {
    if (skip === null || skip === undefined) return;

    if (!isInteger(skip) || skip < 0)
      throw new ClientError(
        "invalid_value",
        `Skip count can be zero or positive integer`,
      );

    this.definition.skip = skip;
  }

  /**
   * Sets the maximum number of records to return
   * @param {number} limit The max number of records to return
   */
  setLimit(limit: number | null | undefined) {
    if (!limit) return;

    if (!isPositiveInteger(limit))
      throw new ClientError(
        "invalid_value",
        `Limit needs to be a positive integer value`,
      );

    this.definition.limit = limit;
  }

  /**
   * Sets the flag whether to use the read-replica of the database
   * @param {boolean | null | undefined} useReadReplica Flag to specify read-replica database or not
   */
  setReadReplica(useReadReplica: boolean | null | undefined) {
    if (!useReadReplica) return;

    if (!isBoolean(useReadReplica))
      throw new ClientError(
        "invalid_value",
        `Use read replica needs to be a boolean (true or fale) value`,
      );

    this.definition.useReadReplica = useReadReplica;
  }

  /**
   * Sets the createData part of the db action definition
   * @param {any | any[]} createData The object(s) that will be created in the database
   */
  async setCreateData(createData: any | any[]) {
    if (!createData) {
      throw new ClientError(
        "invalid_value",
        `The data to create in the database table/collection needs to be provided`,
      );
    }

    if (!isObject(createData) && !isArray(createData))
      throw new ClientError(
        "invalid_value",
        `The data to create in the database table/collection needs to be a single or an array of JSON objects`,
      );

    if (isObject(createData)) {
      const result: any = {};
      const processedData = await this.model.prepareFieldValues(
        createData,
        true,
        result,
      );

      if (result.errors?.length > 0) {
        throw new ClientError(
          "validation_errors",
          `The input data provided has failed to pass validation rules`,
          result.errors,
        );
      }

      this.definition.createData = processedData;
    } else {
      const processedDataList: any = [];
      const allResponses: any = [];

      for (let i = 0; i < createData.length; i++) {
        const result: any = {};
        const entry = createData[i];
        if (!entry) continue;

        const processedData = await this.model.prepareFieldValues(
          entry,
          true,
          result,
        );

        if (result.errors?.length > 0) {
          allResponses.push({ entry: i, errors: result.errors });
        } else processedDataList.push(processedData);
      }

      if (allResponses.length > 0) {
        throw new ClientError(
          "validation_errors",
          `The input data provided has failed to pass validation rules`,
          allResponses,
        );
      }

      this.definition.createData = processedDataList;
    }
  }

  /**
   * Sets the update structure
   * @param {object} updates Record update instructions
   */
  async setUpdates(updates: object, join: any | null | undefined) {
    const keys = Object.keys(updates);
    if (keys.length === 0)
      throw new ClientError(
        "invalid_value",
        `The updates object needs to define at least one key-value pair`,
      );

    // Set values keep direct value assignment to a field, main is the root model and sub are the sub-model field values
    const setValues: any = { main: {}, sub: {} };
    // Field updates hold data for all other update instruction including inc, mul, max, push, pull etc.
    const fieldUpdates: any[] = [];
    // Iterare over all update entries
    for (const [fieldName, value] of Object.entries(updates)) {
      const fieldObj = this.getFieldObject(fieldName, join);
      if (!fieldObj) {
        throw new ClientError(
          "invalid_field",
          `There is no field named '${fieldName}' in model '${this.model.getName()}'`,
        );
      }

      if (fieldObj.joinType !== "none") {
        throw new ClientError(
          "invalid_field",
          `Field '${fieldName}' is a field of a joined model. Only fields of model '${this.model.getName()}' can be updated.`,
        );
      }

      // Ok we have the field value, check to see whether it is system managed field or not
      if (fieldObj.field.isSystemField()) {
        throw new ClientError(
          "invalid_field",
          `Field '${fieldName}' is a system managed field. System managed fields cannot be upddate manually.'`,
        );
      }

      // Ok we have the field value, check to see whether it is system managed field or not
      if (fieldObj.field.isReadOnly()) {
        throw new ClientError(
          "invalid_field",
          `Field '${fieldName}' is a a read-only field. Read-only fields cannot be upddated.'`,
        );
      }

      // At this point let's check the value part
      if (value === null) {
        if (fieldObj.field.isRequired()) {
          throw new ClientError(
            "invalid_value",
            `Field '${fieldName}' is a a required field. Null value cannot be assigned to a required field.`,
          );
        } else {
          await this.setValue(setValues, fieldObj, null);
        }
      } else if (
        (typeof value !== "object" && !Array.isArray(value)) ||
        value instanceof Date ||
        (Array.isArray(value) &&
          fieldObj.field.getType() === "basic-values-list") ||
        (Array.isArray(value) && fieldObj.field.getType() === "geo-point")
      ) {
        // At this point we are trying to assign a value to a field
        await this.setValue(setValues, fieldObj, value);
      } else if (typeof value === "object" && !Array.isArray(value)) {
        await this.processUpdateInstruction(
          fieldObj,
          value,
          setValues,
          fieldUpdates,
        );
      } else {
        throw new ClientError(
          "invalid_value",
          `Unrecognized value '${value}' in update operation. Update instruction should be key-value paris where the value can be the value to set for the field or udpate instruction object e.g., { $inc: 4 }`,
        );
      }
    }

    // Do a check on the set values
    const result: any = {};
    const processedData = await this.model.prepareFieldValues(
      setValues.main,
      false,
      result,
    );

    if (result.errors?.length > 0) {
      throw new ClientError(
        "validation_errors",
        `The field update data provided has failed to pass validation rules`,
        result.errors,
      );
    }

    this.definition.updateData = {
      set: { ...processedData, ...setValues.sub },
      others: fieldUpdates,
    };
  }

  /**
   * Sets the value of the updated field value. In MongoDb we have fields with name "user.profile.email" or "user.addresses.$[elem].street" etc. These needs to be processed differently, the prepareField method does not process these type of entries.
   * @param {any} setValues The object that is keeping the field value updates
   * @param {any} fieldObj The field object
   * @param {any} value The value to set
   */
  async setValue(setValues: any, fieldObj: any, value: any) {
    // If the field model is different than the current base model then we are trying to set the value of a sub-model or sub-model object-list field
    // For this reason we need to perform additional validation
    if (fieldObj.field.getModel().getIid() !== this.model.getIid()) {
      const processedData: any = {};
      const response: any = {};
      await fieldObj.field.prepare(value, processedData, response, false);

      if (response.errors?.length > 0) {
        throw new ClientError(
          "validation_errors",
          `The input data provided has failed to pass validation rules`,
          response.errors,
        );
      }

      setValues.sub[fieldObj.fieldPath] =
        processedData[fieldObj.field.getName()];
    } else setValues.main[fieldObj.fieldPath] = value;
  }

  /**
   * Processes the update instruction
   * @param {any} fieldObj The field object
   * @param {any} instruction The field value update instruction
   * @param {any} setValues The object that is keeping the field value updates
   * @param {any[]} fieldUpdates The field update instructions
   */
  async processUpdateInstruction(
    fieldObj: any,
    instruction: any,
    setValues: any,
    fieldUpdates: any[],
  ): Promise<void> {
    const keys = Object.keys(instruction);
    if (keys.length > 0) {
      const opType2 = keys[0];
      if (
        !UpdateOperators.includes(opType2) &&
        fieldObj.field.getType() === "json"
      ) {
        await this.setValue(setValues, fieldObj, instruction);
        return;
      }
    } else if (fieldObj.field.getType() === "json") {
      await this.setValue(setValues, fieldObj, instruction);
      return;
    }

    if (keys.length > 1) {
      throw new ClientError(
        "invalid_update_instruction",
        `Update instruction should be single key-value pair where the value can be the udpate instruction object e.g., { $inc: 4 }`,
      );
    }

    const opType = keys[0];
    const opValue = instruction[opType];

    if (!UpdateOperators.includes(opType)) {
      throw new ClientError(
        "invalid_update_instruction",
        `Update type '${opType}' is not valid. Allowed update operators are '${UpdateOperators.join(
          ", ",
        )}'.`,
      );
    }

    switch (opType) {
      case "$set":
        await this.processSetInstruction(fieldObj, opValue, setValues);
        break;
      case "$unset":
        this.processUnsetInstruction(fieldObj, fieldUpdates);
        break;
      case "$inc":
      case "$mul":
      case "$min":
      case "$max":
        this.processNumericInstruction(fieldObj, opType, opValue, fieldUpdates);
        break;
      case "$push":
        await this.processPushInstruction(fieldObj, opValue, fieldUpdates);
        break;
      case "$pull":
        this.processPullInstruction(fieldObj, opValue, fieldUpdates);
        break;
      case "$pop":
      case "$shift":
        this.processPopShiftInstruction(fieldObj, opType, fieldUpdates);
        break;
      default:
        break;
    }
  }

  /**
   * Processes the $set update instruction
   * @param {any} fieldObj The field object
   * @param {any} value The field set value
   * @param {any} setValues The object that is keeping the field value updates
   */
  async processSetInstruction(
    fieldObj: any,
    value: any,
    setValues: any,
  ): Promise<void> {
    if (typeof value === "object") {
      throw new ClientError(
        "invalid_value",
        `Update type '$set' can have a primitive data value such as number, string, boolean but not an object.`,
      );
    }

    if (
      (value === null || value === undefined) &&
      fieldObj.field.isRequired()
    ) {
      throw new ClientError(
        "invalid_value",
        `Field '${fieldObj.fieldPath}' is a a required field. Null value cannot be assigned to a required field.`,
      );
    }

    await this.setValue(setValues, fieldObj, value);
  }

  /**
   * Processes the $unset update instruction
   * @param {any} fieldObj The field object
   * @param {any[]} fieldUpdates The field update instructions
   */
  processUnsetInstruction(fieldObj: any, fieldUpdates: any[]): void {
    if (fieldObj.field.isRequired()) {
      throw new ClientError(
        "invalid_update_instruction",
        `Field '${fieldObj.fieldPath}' is a a required field and its value cannot be unset.`,
      );
    }

    if (this.model.getDb().getType() !== DBTYPE.MONGODB) {
      throw new ClientError(
        "invalid_update_instruction",
        `Update type '$$unset' cannot be used in '${this.model
          .getDb()
          .getType()}' databases.`,
      );
    }

    fieldUpdates.push({
      fieldName: fieldObj.fieldPath,
      field: fieldObj.field,
      type: "$unset",
      value: "",
    });
  }

  /**
   * Processes the $set update instruction
   * @param {any} fieldObj The field object
   * @param {any} opType The update operation type
   * @param {any} value The field set value
   * @param {any[]} fieldUpdates The field update instructions
   */
  processNumericInstruction(
    fieldObj: any,
    opType: any,
    value: any,
    fieldUpdates: any[],
  ): void {
    if (!["integer", "decimal"].includes(fieldObj.field.getType())) {
      throw new ClientError(
        "invalid_update_instruction",
        `Update type '${opType}' is used to update numeric field values and it cannot be used to update field '${
          fieldObj.fieldPath
        }' which has '${fieldObj.field.getType()}' type.`,
      );
    }

    if (typeof value !== "number") {
      throw new ClientError(
        "invalid_value",
        `Update type '${opType}' needs to have a numeric value.`,
      );
    }

    if (
      typeof value === "number" &&
      fieldObj.field.getType() === "integer" &&
      !isInteger(value)
    ) {
      throw new ClientError(
        "invalid_value",
        `Update type '${opType}' needs to have an integer value to update field '${fieldObj.fiendName}' which has 'integer' type.`,
      );
    }

    fieldUpdates.push({
      fieldName: fieldObj.fieldPath,
      field: fieldObj.field,
      type: opType,
      value,
    });
  }

  /**
   * Processes the $set update instruction
   * @param {any} fieldObj The field object
   * @param {any} value The field set value
   * @param {any[]} fieldUpdates The field update instructions
   */
  async processPushInstruction(
    fieldObj: any,
    value: any,
    fieldUpdates: any[],
  ): Promise<void> {
    if (
      !["object-list", "basic-values-list"].includes(fieldObj.field.getType())
    ) {
      throw new ClientError(
        "invalid_update_instruction",
        `Update type '$push' is used to manage array fields (e.g., basic values list or object-list) and it cannot be used to update field '${
          fieldObj.fieldPath
        }' which has '${fieldObj.field.getType()}' type.`,
      );
    }

    if (!value && fieldObj.field.getType() === "object-list") {
      throw new ClientError(
        "invalid_value",
        `Field '${fieldObj.fieldPath}' is an object-list field. You cannot add a null value to this field.`,
      );
    }

    if (fieldObj.field.getType() === "object-list") {
      if (typeof value !== "object") {
        throw new ClientError(
          "invalid_value",
          `Field '${
            fieldObj.fieldPath
          }' is an object-list field. You can only push a new object(s) of type '${fieldObj.field
            .getSubModel()
            .getName()}' to this array.`,
        );
      }

      let objList = [];
      if (typeof value === "object" && !Array.isArray(value))
        objList.push(value);
      else {
        objList = value;
      }

      if (objList.length > 0) {
        // Ok we need to validate the values of the pushed objects
        const newAction = new DBAction(fieldObj.field.getSubModel());
        await newAction.setCreateData(objList);

        fieldUpdates.push({
          fieldName: fieldObj.fieldPath,
          field: fieldObj.field,
          type: "$push",
          value: { $each: newAction.getCreateData() },
        });
      }
    }

    if (fieldObj.field.getType() === "basic-values-list") {
      if (typeof value === "object" && !Array.isArray(value)) {
        throw new ClientError(
          "invalid_value",
          `Field '${fieldObj.fieldPath}' is a basic values list field. You can only add basic values (e.g., number, text, boolean) or array of basic values to this field.`,
        );
      }

      if (Array.isArray(value)) {
        for (const entry of value) {
          if (
            (typeof entry === "object" && Array.isArray(entry) === false) ||
            Array.isArray(entry)
          ) {
            throw new ClientError(
              "invalid_value",
              `Field '${fieldObj.fieldPath}' is a basic values list field. You can only add basic values (e.g., number, text, boolean) or array of basic values to this field.`,
            );
          }
        }
      }

      fieldUpdates.push({
        fieldName: fieldObj.fieldPath,
        field: fieldObj.field,
        type: "$push",
        value: Array.isArray(value) ? { $each: value } : value,
      });
    }
  }

  /**
   * Processes the $set update instruction
   * @param {any} fieldObj The field object
   * @param {any} opType The update operation type
   * @param {any[]} fieldUpdates The field update instructions
   */
  processPopShiftInstruction(
    fieldObj: any,
    opType: any,
    fieldUpdates: any[],
  ): void {
    if (
      !["object-list", "basic-values-list"].includes(fieldObj.field.getType())
    ) {
      throw new ClientError(
        "invalid_update_instruction",
        `Update type '${opType}' is used to manage array fields (e.g., basic values list or object-list) and it cannot be used to update field '${
          fieldObj.fieldPath
        }' which has '${fieldObj.field.getType()}' type.`,
      );
    }

    fieldUpdates.push({
      fieldName: fieldObj.fieldPath,
      field: fieldObj.field,
      type: "$pop",
      value: opType === "$pop" ? 1 : -1,
    });
  }

  /**
   * Processes the $set update instruction
   * @param {any} fieldObj The field object
   * @param {any} value The field set value
   * @param {any[]} fieldUpdates The field update instructions
   */
  processPullInstruction(fieldObj: any, value: any, fieldUpdates: any[]): void {
    if (
      !["object-list", "basic-values-list"].includes(fieldObj.field.getType())
    ) {
      throw new ClientError(
        "invalid_update_instruction",
        `Update type '$pull' is used to manage array fields (e.g., basic values list or object-list) and it cannot be used to update field '${
          fieldObj.fieldPath
        }' which has '${fieldObj.field.getType()}' type.`,
      );
    }

    if (!value) {
      throw new ClientError(
        "invalid_update_instruction",
        `Update type '$pull' requires a condition to identify the array values to pull (remove).`,
      );
    }

    if (fieldObj.field.getType() === "object-list") {
      // Ok we need to validate the values of the pushed objects
      const newAction = new DBAction(fieldObj.field.getSubModel());
      newAction.setWhere(value, null, ConditionType.PULL_CONDITION);
      fieldUpdates.push({
        fieldName: fieldObj.fieldPath,
        field: fieldObj.field,
        type: "$pull",
        value: newAction.getWhere(),
        exp: true,
        includeFields: true,
      });
    } else {
      if (Array.isArray(value)) {
        throw new ClientError(
          "invalid_value",
          `Field '${fieldObj.fieldPath}' is a basic values list field. You can only remove basic values (e.g., number, text, boolean) values from this field.`,
        );
      }

      if (typeof value === "object") {
        // Ok we need to validate the values of the pushed objects
        const newAction = new DBAction(this.model);
        newAction.setWhere(value, null, ConditionType.PULL_CONDITION);
        fieldUpdates.push({
          fieldName: fieldObj.fieldPath,
          field: fieldObj.field,
          type: "$pull",
          value: newAction.getWhere(),
          exp: true,
          includeFields: false,
        });
      } else {
        fieldUpdates.push({
          fieldName: fieldObj.fieldPath,
          field: fieldObj.field,
          type: "$pull",
          exp: false,
          includeFields: false,
          value,
        });
      }
    }
  }

  /**
   * Sets the array filters of the MongoDB update operations
   * @param {any} arrayFilters The list of array filter expressions
   */
  setArrayFilters(arrayFilters: any) {
    if (!arrayFilters || this.model.getDb().getType() !== DBTYPE.MONGODB)
      return;

    if (!Array.isArray(arrayFilters)) {
      throw new ClientError(
        "invalid_value",
        `Array filters need to be an array of conditions.`,
      );
    }

    const filters = [];
    for (const entry of arrayFilters) {
      const newAction = new DBAction(this.model);
      newAction.setWhere(entry, null, ConditionType.ARRAY_FILTER);
      filters.push(newAction.getWhere());
    }

    this.definition.arrayFilters = filters;
  }

  /**
   * Sets groupBy part of the action definition
   * @param {GroupByDefinition} groupBy The groupBy definition
   */
  setGroupBy(groupBy: any | null | undefined, join: any | null | undefined) {
    if (!groupBy) return;

    // GroupBy definition can be one of the following
    // 1. A single string definition which basically specifies a field name of the model
    // 2. A single group by definition which basically defines the complex goup by structure with the alias and grouping expression
    // 3. A combination of the above two in an array
    const groupList: any[] = [];

    // Check to see if this is a single string definition
    if (typeof groupBy === "string")
      this.processStringBasedGrouping(groupBy, join, groupList);
    else if (typeof groupBy === "object" && !Array.isArray(groupBy))
      this.processObjectBasedGrouping(groupBy, join, groupList);
    else if (Array.isArray(groupBy)) {
      for (const entry of groupBy) {
        if (typeof entry === "string")
          this.processStringBasedGrouping(entry, join, groupList);
        else if (typeof entry === "object" && !Array.isArray(entry))
          this.processObjectBasedGrouping(entry, join, groupList);
        else
          throw new ClientError(
            "invalid_grouping",
            `Not a valid grouping definition. The grouping array needs to include either field names as string or group by definitions as JSON object with 'as' and 'expression' values.`,
          );
      }
    } else
      throw new ClientError(
        "invalid_grouping",
        `Not a valid grouping definition.`,
      );

    this.definition.groupBy = groupList;
  }

  /**
   * Processes a string based grouping
   * @param {string} fieldName The field name
   * @param {JoinDefinition} join The join definition
   * @param {any[]} groupList The final grouping definition list to store group by config
   */
  processStringBasedGrouping(fieldName: string, join: any, groupList: any[]) {
    const fieldDef = this.getFieldObject(fieldName, join);
    if (!fieldDef)
      throw new ClientError(
        "invalid_grouping_entry",
        `'${fieldName}' is not a valid field to group database records.`,
      );

    if (groupList.find((entry) => entry.as === fieldDef.field.getName))
      throw new ClientError(
        "invalid_grouping_entry",
        `There is already a grouping with the alias '${fieldName}'.`,
      );

    groupList.push({
      as: fieldName,
      expression: new FieldValue(
        fieldDef.field,
        fieldDef.fieldPath,
        fieldDef.joinType,
        fieldDef.joinModel,
      ),
    });
  }

  /**
   * Processes an object based grouping
   * @param {object} groupDef The join defintion object
   * @param {JoinDefinition} join The join definition
   * @param {any[]} groupList The final join definition list to store join config
   */
  processObjectBasedGrouping(groupDef: any, join: any, groupList: any[]) {
    if (!groupDef.as || !groupDef.expression)
      throw new ClientError(
        "invalid_grouping_entry",
        `The 'as' and 'expression' parameters of a group definition needs to be specified.`,
      );

    if (!isString(groupDef.as))
      throw new ClientError(
        "invalid_grouping_entry",
        `The 'as' parameter of the group definition needs to be string value.`,
      );

    if (groupDef.as.includes("."))
      throw new ClientError(
        "invalid_grouping_entry",
        `The 'as' parameter of the group definition cannot include '.'(dot) characters.`,
      );

    if (!isObject(groupDef.expression))
      throw new ClientError(
        "invalid_grouping_entry",
        `The 'expression' parameter of the group definition needs to define the grouping expression as a JSON object.`,
      );

    const expression = this.processWhereCondition(
      groupDef.expression,
      join,
      ConditionType.QUERY,
    );

    if (!expression)
      throw new ClientError(
        "invalid_grouping_entry",
        `The 'expression' of the group definition is missing.`,
      );

    if (groupList.find((entry) => entry.as === groupDef.as))
      throw new ClientError(
        "invalid_grouping_entry",
        `There is already a grouping with the alias '${groupDef.as}'.`,
      );

    groupList.push({
      as: groupDef.as,
      expression,
    });
  }

  /**
   * Sets computations part of the action definition
   * @param {GroupByDefinition} groupBy The groupBy definition
   */
  setComputations(
    computations: any | null | undefined,
    join: any | null | undefined,
  ) {
    // Computations definition can be one of the following
    // 1. A single computation by definition which basically defines the complex computation structure with the alias and compute expression
    // 2. An array of computation objects
    const compList: any[] = [];
    const finalist: any[] = [];

    if (
      typeof computations === "object" &&
      !Array.isArray(computations) &&
      computations
    )
      compList.push(computations);
    else if (Array.isArray(computations)) {
      compList.push(...computations);
    } else {
      throw new ClientError(
        "invalid_computations",
        `The computations definition needs to be either a single computation object or an array of computation objects.`,
      );
    }

    if (compList.length === 0) {
      throw new ClientError(
        "invalid_computations",
        `At least one computation needs to be defined for the aggreation operation.`,
      );
    }

    for (const comp of compList) {
      if (!isString(comp.as))
        throw new ClientError(
          "invalid_computation_entry",
          `The 'as' parameter of the computation definition needs to be string value.`,
        );

      if (comp.as.includes("."))
        throw new ClientError(
          "invalid_computation_entry",
          `The 'as' parameter of the computation definition cannot include '.'(dot) characters.`,
        );

      if (!isObject(comp.compute))
        throw new ClientError(
          "invalid_computations",
          `The 'compute' parameter of the computation definition needs to define the calculation expression as a JSON object.`,
        );

      const keys = Object.keys(comp.compute);
      if (keys.length > 1 || keys.length === 0) {
        throw new ClientError(
          "invalid_computation_entry",
          `The 'compute' parameter needs to be in following format: {$computeOperator : <expression>}. The compute operator can be any of the following: $'{ComputeOperators.join(
						", "
					)}'`,
        );
      }

      const operator = keys[0];
      if (!ComputeOperators.includes(operator)) {
        throw new ClientError(
          "invalid_computation_operator",
          `Computation type '${operator}' is not valid. Allowed computation operators are '${ComputeOperators.join(
            ", ",
          )}'.`,
        );
      }

      let expression = null;
      if (operator !== "$count") {
        expression = this.parseValue(
          comp.compute[operator],
          join,
          ConditionType.QUERY,
        );

        const returnType = expression.getReturnType();
        if (
          operator === "$countIf" &&
          returnType !== ReturnType.BOOLEAN &&
          returnType !== ReturnType.STATICBOOLEAN
        ) {
          throw new ClientError(
            "invalid_computation_operator",
            `Computation type '${operator}' expects a boolean computation but received a computation which returns '${expression.getReturnTypeText(
              returnType,
            )}'.`,
          );
        } else if (
          operator !== "$countIf" &&
          returnType !== ReturnType.NUMBER
        ) {
          throw new ClientError(
            "invalid_computation_operator",
            `Computation type '${operator}' expects a numeric computation but received a computation which returns '${expression.getReturnTypeText(
              returnType,
            )}'.`,
          );
        }
      }

      if (
        finalist.find((entry) => entry.as === comp.as) ||
        this.definition.groupBy?.find((entry: any) => entry.as === comp.as)
      )
        throw new ClientError(
          "invalid_computation_entry",
          `There is already a computation or grouping with the alias '${comp.as}'.`,
        );

      finalist.push({ as: comp.as, operator, compute: expression });
    }

    this.definition.computations = finalist;
  }

  /**
   * Sets the sort part of the db grouping action definition
   * @param {SortingOrder} sort The fields and their sorting order
   */
  setGroupSort(sort: any | null | undefined) {
    if (!sort) return;

    // Create the groupby model definition
    const model = this.createGroupingModel();
    const action = new DBAction(model);
    action.setSort(sort, null);

    this.definition.sort = action.getSort();
  }

  /**
   * Sets the haing part of the db grouping action definition
   * @param {WhereCondition} having The fields and their sorting order
   */
  setHaving(having: any | null | undefined) {
    if (!having) return;

    // Create the groupby model definition
    const model = this.createGroupingModel();
    const action = new DBAction(model);
    action.setWhere(having, null, ConditionType.QUERY);

    this.definition.having = action.getWhere();
  }

  /**
   * Returns the group by model which includes the groupby and computations as its fields
   */
  createGroupingModel() {
    const fields = [];
    if (this.definition.groupBy) {
      for (const groupBy of this.definition.groupBy) {
        fields.push({ name: groupBy.as, type: "text" });
      }
    }

    if (this.definition.computations) {
      for (const comp of this.definition.computations) {
        fields.push({ name: comp.as, type: "integer" });
      }
    }

    const model = new ModelBase(
      { name: "dummy", type: "model", fields },
      null,
      this.model.getDb(),
    );

    return model;
  }

  /**
   * Executes the database action
   */
  async execute(): Promise<any> {
    let result = null;
    const db = this.model.getDb();

    switch (this.definition.method) {
      case "createOne":
        result = await db
          .getAdapterObj(false)
          .createOne(
            db.getMetaObj(),
            this.model.getMetaObj(),
            this.definition.createData,
          );
        break;
      case "createMany":
        result = await db
          .getAdapterObj(false)
          .createMany(
            db.getMetaObj(),
            this.model.getMetaObj(),
            this.definition.createData,
          );
        break;
      case "deleteById":
        result = await db
          .getAdapterObj(false)
          .deleteById(
            db.getMetaObj(),
            this.model.getMetaObj(),
            this.definition,
          );
        break;
      case "deleteOne":
        result = await db
          .getAdapterObj(false)
          .deleteOne(db.getMetaObj(), this.model.getMetaObj(), this.definition);
        break;
      case "deleteMany":
        result = await db
          .getAdapterObj(false)
          .deleteMany(
            db.getMetaObj(),
            this.model.getMetaObj(),
            this.definition,
          );
        break;
      case "findById":
        result = await db
          .getAdapterObj(this.definition.useReadReplica)
          .findById(db.getMetaObj(), this.model.getMetaObj(), this.definition);
        break;
      case "findOne":
        result = await db
          .getAdapterObj(this.definition.useReadReplica)
          .findOne(db.getMetaObj(), this.model.getMetaObj(), this.definition);
        break;
      case "findMany":
        result = await db
          .getAdapterObj(this.definition.useReadReplica)
          .findMany(db.getMetaObj(), this.model.getMetaObj(), this.definition);
        break;
      case "updateById":
        result = await db
          .getAdapterObj(false)
          .updateById(
            db.getMetaObj(),
            this.model.getMetaObj(),
            this.definition,
          );
        break;
      case "updateOne":
        result = await db
          .getAdapterObj(false)
          .updateOne(db.getMetaObj(), this.model.getMetaObj(), this.definition);
        break;
      case "updateMany":
        result = await db
          .getAdapterObj(false)
          .updateMany(
            db.getMetaObj(),
            this.model.getMetaObj(),
            this.definition,
          );
        break;
      case "aggregate":
        result = await db
          .getAdapterObj(false)
          .aggregate(db.getMetaObj(), this.model.getMetaObj(), this.definition);
        break;
      case "searchText":
        result = await db
          .getAdapterObj(false)
          .searchText(
            db.getMetaObj(),
            this.model.getMetaObj(),
            this.definition,
          );
        break;
    }

    return result;
  }
}
