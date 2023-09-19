import { Expression } from "./Expression";
import {
  ReturnType,
  ExpressionType,
  QueryFunctionDefinition,
  DBTYPE,
  UpdatePullFunctions,
} from "../utils/types";
import { ClientError } from "../utils/ClientError";

/**
 * Defines a single parameter function
 *
 * @export
 * @class Expression
 */
export class Function extends Expression {
  /**
   * The function name
   * @protected
   * @type {string}
   */
  protected name: string;

  /**
   * The function definition
   * @protected
   * @type {QueryFunctionDefinition}
   */
  protected definition: QueryFunctionDefinition;

  /**
   * The reference to the Field object
   * @protected
   * @type {Expression[]}
   */
  protected parameters: Expression[];

  constructor(name: string, definition: QueryFunctionDefinition) {
    super();
    this.name = name;
    this.definition = definition;
    this.parameters = [];
  }

  /**
   * Returns the function name, only applicable for function expressions
   * @returns Function name
   */
  getFunctionName(): string | null {
    return this.name;
  }

  /**
   * Returns the expression type
   * @returns Expression type
   */
  getExpressionType(): ExpressionType {
    return ExpressionType.FUNCTION;
  }

  /**
   * Returns the value type of the expression
   * @returns Value type of the expression
   */
  getReturnType(): ReturnType {
    return this.definition.returnType;
  }

  /**
   * Adds a parameter to the function
   * @param {Expression} param The parameter expression to add
   */
  addParam(param: Expression): void {
    this.parameters.push(param);
  }

  /**
   * Validates the function and its parameters
   * @param {string} dbType The database type
   */
  validate(dbType: string): void {
    const paramCount = this.parameters.length;
    if (this.definition.mapping[dbType] === "n/a")
      throw new ClientError(
        "unsupported_function",
        `Function '${this.name}' cannot be used to define queries in ${dbType} databases.`,
      );

    if (this.definition.paramCount === -1 && paramCount < 2)
      throw new ClientError(
        "invalid_parameter",
        `Function '${this.name}' expects at least two input parameters.`,
      );

    if (
      paramCount !== this.definition.paramCount &&
      this.definition.paramCount !== -1
    )
      throw new ClientError(
        "invalid_parameter",
        `Function '${this.name}' expects ${this.definition.paramCount} input parameter(s) but received ${paramCount}.`,
      );

    // Check validitiy of input parameters
    for (let i = 0; i < this.parameters.length; i++) {
      const param = this.parameters[i];
      const paramType = param.getReturnType();
      const expectedType: ReturnType = Array.isArray(this.definition.params)
        ? this.definition.params[i]
        : this.definition.params;

      // Check compatibility of return types
      if (expectedType === ReturnType.ANY) continue;
      if (
        (expectedType === ReturnType.DATE ||
          expectedType === ReturnType.DATETIME) &&
        (paramType === ReturnType.DATE || paramType === ReturnType.DATETIME)
      )
        continue;
      else if (expectedType === ReturnType.PRIMITIVE) {
        if (
          [
            ReturnType.OBJECT,
            ReturnType.ARRAY,
            ReturnType.BINARY,
            ReturnType.JSON,
          ].includes(paramType)
        )
          throw new ClientError(
            "invalid_parameter",
            `Function '${this.name}' expects a '${this.getReturnTypeText(
              expectedType,
            )}' input for parameter #${
              i + 1
            } but received '${this.getReturnTypeText(paramType)}'.`,
          );
      } else if (expectedType === ReturnType.STATICBOOLEAN) {
        if (
          paramType !== ReturnType.BOOLEAN &&
          param.getExpressionType() !== ExpressionType.STATIC
        )
          throw new ClientError(
            "invalid_parameter",
            `Function '${
              this.name
            }' expects a 'constant boolean' input for parameter #${
              i + 1
            } but received ${this.getReturnTypeText(paramType)}.`,
          );
      } else if (expectedType !== paramType) {
        throw new ClientError(
          "invalid_parameter",
          `Function '${this.name}' expects a '${this.getReturnTypeText(
            expectedType,
          )}' input for parameter #${
            i + 1
          } but received '${this.getReturnTypeText(paramType)}'.`,
        );
      }

      // Validate the expression itself also
      param.validate(dbType);
    }
  }

  /**
   * Validates the function and its parameters for $pull update operation
   * @param {string} dbType The database type
   */
  validateForPull(dbType: string): void {
    if (!UpdatePullFunctions.includes(`$${this.name}`)) {
      throw new ClientError(
        "unsupported_function",
        `Function '${this.name}' cannot be used to define $pull update queries.`,
      );
    }

    const paramCount = this.parameters.length;
    if (this.definition.mapping[dbType] === "n/a")
      throw new ClientError(
        "unsupported_function",
        `Function '${this.name}' cannot be used to define queries in ${dbType} databases.`,
      );

    if (this.definition.paramCount === -1 && paramCount < 2)
      throw new ClientError(
        "invalid_parameter",
        `Function '${this.name}' expects at least two input parameters.`,
      );

    if (
      paramCount !== this.definition.paramCount &&
      this.definition.paramCount !== -1
    )
      throw new ClientError(
        "invalid_parameter",
        `Function '${this.name}' expects ${this.definition.paramCount} input parameter(s) but received ${paramCount}.`,
      );

    // Check validitiy of input parameters
    for (let i = 0; i < this.parameters.length; i++) {
      const param = this.parameters[i];
      const paramType = param.getReturnType();
      const expectedType: ReturnType = Array.isArray(this.definition.params)
        ? this.definition.params[i]
        : this.definition.params;

      // For pull operations the first parameter should always be a field
      if (
        i === 0 &&
        (param.getExpressionType() === ExpressionType.FIELD ||
          param.getExpressionType() === ExpressionType.ARRAY_FIELD)
      )
        continue;

      // Check compatibility of return types
      if (expectedType === ReturnType.ANY) continue;
      else if (expectedType === ReturnType.PRIMITIVE) {
        if (
          [
            ReturnType.OBJECT,
            ReturnType.ARRAY,
            ReturnType.BINARY,
            ReturnType.JSON,
          ].includes(paramType)
        )
          throw new ClientError(
            "invalid_parameter",
            `Function '${this.name}' expects a '${this.getReturnTypeText(
              expectedType,
            )}' input for parameter #${
              i + 1
            } but received '${this.getReturnTypeText(paramType)}'.`,
          );
      } else if (expectedType === ReturnType.STATICBOOLEAN) {
        if (
          paramType !== ReturnType.BOOLEAN &&
          param.getExpressionType() !== ExpressionType.STATIC
        )
          throw new ClientError(
            "invalid_parameter",
            `Function '${
              this.name
            }' expects a 'constant boolean' input for parameter #${
              i + 1
            } but received ${this.getReturnTypeText(paramType)}.`,
          );
      } else if (expectedType !== paramType) {
        throw new ClientError(
          "invalid_parameter",
          `Function '${this.name}' expects a '${this.getReturnTypeText(
            expectedType,
          )}' input for parameter #${
            i + 1
          } but received '${this.getReturnTypeText(paramType)}'.`,
        );
      }

      // Validate the expression itself also
      param.validateForPull(dbType);
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
        const mappedName = this.definition.mapping[dbType];
        if (this.parameters.length === 1) {
          return {
            [mappedName]: this.parameters[0].getQuery(dbType, callback),
          };
        } else {
          const funcParams = [];
          for (const entry of this.parameters) {
            funcParams.push(entry.getQuery(dbType, callback));
          }

          return {
            [mappedName]: funcParams,
          };
        }
      default:
        return null;
    }
  }

  /**
   * Returns the database specific query structure of the select condition of $pull update operation
   * @param {string} dbType The database type
   * @param {boolean} dropFieldName Do not include the field name in queries (used mainly for basic values list type fields)
   * @returns Query structure
   */
  getPullQuery(dbType: string, dropFieldName: boolean): any {
    switch (dbType) {
      case DBTYPE.MONGODB:
        const mappedName = this.definition.mapping[dbType];
        if (this.parameters.length === 1) {
          return {
            [mappedName]: this.parameters[0].getPullQuery(
              dbType,
              dropFieldName,
            ),
          };
        } else {
          const funcParams = [];
          for (const entry of this.parameters) {
            funcParams.push(entry.getPullQuery(dbType, dropFieldName));
          }

          return {
            [mappedName]: funcParams,
          };
        }
      default:
        return null;
    }
  }

  /**
   * Checks whether if the expression includes a joined field value
   * @returns True if the expressin includes at least one joined field value, otherwise false
   */
  hasJoinFieldValues(): boolean {
    for (const entry of this.parameters) {
      if (entry.hasJoinFieldValues()) return true;
    }
    return false;
  }
}
