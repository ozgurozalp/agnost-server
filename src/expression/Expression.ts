import { ReturnType, ExpressionType } from "../utils/types";

/**
 * Base class to model the where condition structure
 *
 * @export
 * @class Expression
 */
export abstract class Expression {
  /**
   * Returns the function name, only applicable for function expressions
   * @returns Function name
   */
  getFunctionName(): string | null {
    return null;
  }

  /**
   * Returns the expression type
   * @returns Expression type
   */
  abstract getExpressionType(): ExpressionType;

  /**
   * Returns the database specific query structure of the where condition
   * @param {string} dbType The database type
   * @param {function} callback Used to fetch the name of the field to handle complex lookup cases. Mainly used for MongoDB database field names.
   * @returns Query structure
   */
  abstract getQuery(
    dbType: string,
    callback?: (fieldPath: string) => string,
  ): any;

  /**
   * Returns the database specific query structure of the select condition of $pull update operation
   * @param {string} dbType The database type
   * @param {boolean} dropFieldName Do not include the field name in queries (used mainly for basic values list type fields)
   * @returns Query structure
   */
  abstract getPullQuery(dbType: string, dropFieldName: boolean): any;

  /**
   * Returns the value type of the expression
   * @returns Value type of the expression
   */
  getReturnType(): ReturnType {
    return ReturnType.UNDEFINED;
  }

  /**
   * Validates the expression. If expression is not valid throwns an exception.
   * @param {string} dbType The database type
   */
  validate(dbType: string): void {
    return;
  }

  /**
   * Validates the expression for $pull update operation. If expression is not valid throwns an exception.
   * @param {string} dbType The database type
   */
  validateForPull(dbType: string): void {
    return;
  }

  /**
   * Checks whether if the expression includes a joined field value
   * @returns True if the expressin includes at least one joined field value, otherwise false
   */
  hasJoinFieldValues(): boolean {
    return false;
  }

  /**
   * Returns the text representation of the return type
   * @param {ReturnType} type The return type
   */
  getReturnTypeText(type: ReturnType): string {
    switch (type) {
      case ReturnType.NUMBER:
        return "numeric";
      case ReturnType.TEXT:
        return "string";
      case ReturnType.BOOLEAN:
        return "boolean";
      case ReturnType.OBJECT:
        return "object";
      case ReturnType.DATETIME:
        return "datetime";
      case ReturnType.NULL:
        return "null";
      case ReturnType.BINARY:
        return "binary";
      case ReturnType.JSON:
        return "json";
      case ReturnType.ID:
        return "id";
      case ReturnType.ARRAY:
        return "array";
      case ReturnType.GEOPOINT:
        return "geopoint";
      case ReturnType.UNDEFINED:
        return "undefined";
      case ReturnType.ANY:
        return "any";
      case ReturnType.PRIMITIVE:
        return "number, string, boolean or date";
      case ReturnType.DATE:
        return "date";
      case ReturnType.TIME:
        return "time";
      case ReturnType.STATICBOOLEAN:
        return "constant boolean";
      default:
        return type;
    }
  }
}
