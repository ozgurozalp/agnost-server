import { Function } from "../Function";
import { ReturnType, ExpressionType, DBTYPE } from "../../utils/types";
import { ClientError } from "../../utils/ClientError";

/**
 * Defines equality check function
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
  constructor() {
    super("eq", {
      paramCount: 2,
      returnType: ReturnType.BOOLEAN,
      params: [ReturnType.PRIMITIVE, ReturnType.PRIMITIVE],
      mapping: {
        MongoDB: "$eq",
        PostgreSQL: "=",
        MySQL: "=",
      },
    });
  }

  /**
   * Validates the expression for $pull update operation. If expression is not valid throwns an exception.
   * @param {string} dbType The database type
   */
  validate(dbType: string): void {
    super.validate(dbType);

    const param1 = this.parameters[0];
    const param2 = this.parameters[1];

    // If we are comparing an id value to an integer or text or date value to datetime value, then it is OK
    if (
      (param1.getReturnType() === ReturnType.ID &&
        param2.getReturnType() === ReturnType.NUMBER) ||
      (param2.getReturnType() === ReturnType.ID &&
        param1.getReturnType() === ReturnType.NUMBER) ||
      (param1.getReturnType() === ReturnType.ID &&
        param2.getReturnType() === ReturnType.TEXT) ||
      (param2.getReturnType() === ReturnType.ID &&
        param1.getReturnType() === ReturnType.TEXT) ||
      ((param1.getReturnType() === ReturnType.DATE ||
        param1.getReturnType() === ReturnType.DATETIME ||
        param1.getReturnType() === ReturnType.TEXT) &&
        (param2.getReturnType() === ReturnType.DATE ||
          param2.getReturnType() === ReturnType.DATETIME ||
          param2.getReturnType() === ReturnType.TEXT))
    )
      return;

    if (
      param1.getReturnType() !== param2.getReturnType() &&
      param1.getReturnType() !== ReturnType.NULL &&
      param2.getReturnType() !== ReturnType.NULL
    ) {
      throw new ClientError(
        "invalid_field",
        `The first and second parameters of the '${this.name}' function needs to have the same return type.`,
      );
    }
  }

  /**
   * Validates the expression for $pull update operation. If expression is not valid throwns an exception.
   * @param {string} dbType The database type
   */
  validateForPull(dbType: string): void {
    super.validateForPull(dbType);

    const param1 = this.parameters[0];
    if (
      param1.getExpressionType() !== ExpressionType.FIELD &&
      param1.getExpressionType() !== ExpressionType.ARRAY_FIELD
    ) {
      throw new ClientError(
        "invalid_field",
        `The first parameter of the '${this.name}' function when used for a $pull update operation or array filter condition should be a field value. Either you have typed the field name wrong or you have used a static value or function instead of a field value.`,
      );
    }

    const param2 = this.parameters[1];
    if (
      param2.getExpressionType() !== ExpressionType.STATIC &&
      param2.getExpressionType() !== ExpressionType.ARRAY_FIELD
    ) {
      throw new ClientError(
        "invalid_value",
        `The second parameter of the '${this.name}' function when used for a $pull update operation or array filter condition can only be a static value (e.g., number, text, boolean)`,
      );
    }
  }

  /**
   * Returns the database specific query structure of the select condition of $pull update operation
   * @param {string} dbType The database type
   * @param {boolean} dropFieldName Do not include the field name in queries
   * @returns Query structure
   */
  getPullQuery(dbType: string, dropFieldName: boolean): any {
    if (dropFieldName)
      return this.parameters[1].getPullQuery(dbType, dropFieldName);
    else
      return {
        [this.parameters[0].getPullQuery(dbType, dropFieldName)]: {
          $eq: this.parameters[1].getPullQuery(dbType, dropFieldName),
        },
      };
  }

  /**
   * Returns the database specific query structure of the where condition
   * @param {string} dbType The database type
   * @returns Query structure
   */
  getQuery(dbType: string, callback?: (fieldPath: string) => string): any {
    switch (dbType) {
      case DBTYPE.MONGODB:
        return super.getQuery(dbType, callback);
      case DBTYPE.POSTGRESQL:
      case DBTYPE.MYSQL:
        return `${this.parameters[0].getQuery(
          dbType,
          callback,
        )} = ${this.parameters[1].getQuery(dbType, callback)}`;
      default:
        return null;
    }
  }
}
