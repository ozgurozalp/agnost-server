import { Field } from "../../model/Field";
import { ModelBase } from "../../model/ModelBase";
import { Expression } from "../Expression";
import { ReturnType, ExpressionType, DBTYPE } from "../../utils/types";
import { ClientError } from "../../utils/ClientError";

/**
 * Defines a model field value
 *
 * @export
 * @class Expression
 */
export class FieldValue extends Expression {
  /**
   * The reference to the Field object
   * @protected
   * @type {Field}
   */
  protected field: Field;

  /**
   * The field path string
   * @protected
   * @type {string}
   */
  protected fieldPath: string;

  /**
   * The join type
   * @protected
   * @type {string}
   */
  protected joinType: string;

  /**
   * The joined model
   * @protected
   * @type {ModelBase}
   */
  protected joinModel: ModelBase;

  constructor(
    field: Field,
    fieldPath: string,
    joinType: string,
    joinModel: ModelBase,
  ) {
    super();
    this.field = field;
    this.fieldPath = fieldPath;
    this.joinType = joinType;
    this.joinModel = joinModel;
  }

  /**
   * Returns the expression type
   * @returns Expression type
   */
  getExpressionType(): ExpressionType {
    return ExpressionType.FIELD;
  }

  /**
   * Returns the value type of the expression
   * @returns Value type of the expression
   */
  getReturnType(): ReturnType {
    switch (this.field.getType()) {
      case "id":
      case "reference":
        return ReturnType.ID;
      case "text":
      case "rich-text":
      case "encrypted-text":
      case "email":
      case "link":
      case "phone":
        return ReturnType.TEXT;
      case "createdat":
      case "updatedat":
      case "datetime":
        return ReturnType.DATETIME;
      case "date":
        return ReturnType.DATE;
      case "time":
        return ReturnType.TIME;
      case "enum":
        return ReturnType.TEXT;
      case "boolean":
        return ReturnType.BOOLEAN;
      case "integer":
      case "decimal":
        return ReturnType.NUMBER;
      case "geo-point":
        return ReturnType.GEOPOINT;
      case "binary":
        return ReturnType.BINARY;
      case "json":
        return ReturnType.JSON;
      case "basic-values-list":
        return ReturnType.ARRAY;
      case "object-list":
        return ReturnType.ARRAY;
      case "object":
        return ReturnType.OBJECT;
      case "join":
        return ReturnType.ARRAY;
      case "array-filter":
        return ReturnType.ANY;
      default:
        return ReturnType.UNDEFINED;
    }
  }

  /**
   * Returns the database specific query structure of the where condition
   * @param {string} dbType The database type
   * @returns Query structure
   */
  getQuery(dbType: string, callback?: (fieldPath: string) => string): any {
    switch (dbType) {
      case DBTYPE.MONGODB:
        if (this.joinType === "none" && callback)
          return `$${callback(this.fieldPath)}`;
        else if (this.joinType === "complex") {
          if (callback) return `$${this.field.getQueryPath()}`;
          else return `$${this.fieldPath}`;
        } else return `$${this.fieldPath}`;
      case DBTYPE.POSTGRESQL:
      case DBTYPE.MYSQL:
        if (this.joinType === "none") {
          const modelName = this.field.getModel().getName();
          if (modelName !== "$$dummy")
            return `${this.field.getModel().getName()}.${this.field.getName()}`;
          else return this.field.getName();
        } else return this.fieldPath;
      default:
        return this.fieldPath;
    }
  }

  /**
   * Returns the database specific query structure of the select condition of $pull update operation
   * @param {string} dbType The database type
   * @param {boolean} dropFieldName Do not include the field name in queries (used mainly for basic values list type fields)
   * @returns Query structure
   */
  getPullQuery(dbType: string, dropFieldName: boolean): any {
    // For $pull update operation field names we do not append the '$' sign
    return this.field.getName();
  }

  /**
   * Checks whether if the expression includes a joined field value
   * @returns True if the expressin includes at least one joined field value, otherwise false
   */
  hasJoinFieldValues(): boolean {
    if (this.joinType === "simple" || this.joinType === "complex") return true;
    return false;
  }

  /**
   * Validates the expression for $pull update operation. If expression is not valid throwns an exception.
   * @param {string} dbType The database type
   */
  validateForPull(dbType: string): void {
    if (this.field.getModel().getType() !== "sub-model-list")
      throw new ClientError(
        "invalid_field",
        `Only fields of a sub-model list object can be used in $pull update operator. '${
          this.fieldPath
        }' is a field of model '${this.field
          .getModel()
          .getName()}' which has a type of '${this.field
          .getModel()
          .getType()}'`,
      );
  }
}
