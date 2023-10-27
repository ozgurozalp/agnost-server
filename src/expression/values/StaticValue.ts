import { Expression } from "../Expression";
import { ReturnType, ExpressionType, DBTYPE } from "../../utils/types";

/**
 * Defines a static value such as a number, boolean, text
 *
 * @export
 * @class Expression
 */
export class StaticValue extends Expression {
  /**
   * The static value
   * @protected
   * @type {number | string | boolean}
   */
  protected value: number | string | boolean | null;

  constructor(value: number | string | boolean | null) {
    super();
    this.value = value;
  }

  /**
   * Returns the expression type
   * @returns Expression type
   */
  getExpressionType(): ExpressionType {
    return ExpressionType.STATIC;
  }

  /**
   * Returns the value type of the expression
   * @returns Value type of the expression
   */
  getReturnType(): ReturnType {
    if (this.value === null) return ReturnType.NULL;
    else if (typeof this.value === "string") return ReturnType.TEXT;
    else if (typeof this.value === "number") return ReturnType.NUMBER;
    else return ReturnType.BOOLEAN;
  }

  /**
   * Returns the database specific query structure of the where condition
   * @param {string} dbType The database type
   * @returns Query structure
   */
  getQuery(dbType: string, callback?: (fieldPath: string) => string): any {
    switch (dbType) {
      case DBTYPE.MONGODB:
        return this.value;
      case DBTYPE.POSTGRESQL:
        if (this.value === null) return "NULL";
        else if (typeof this.value === "string") return `'${this.value}'`;
        else return this.value;
      case DBTYPE.MYSQL:
        if (this.value === null) return "NULL";
        else if (typeof this.value === "string") return `'${this.value}'`;
        else if (typeof this.value === "boolean") return this.value ? 1 : 0;
        else return this.value;
      default:
        return this.value;
    }
  }

  /**
   * Returns the database specific query structure of the select condition of $pull update operation
   * @param {string} dbType The database type
   * @param {boolean} dropFieldName Do not include the field name in queries (used mainly for basic values list type fields)
   * @returns Query structure
   */
  getPullQuery(dbType: string, dropFieldName: boolean): any {
    return this.getQuery(dbType);
  }
}
