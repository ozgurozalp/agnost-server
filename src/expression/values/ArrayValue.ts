import { Expression } from "../Expression";
import { ReturnType, ExpressionType, DBTYPE } from "../../utils/types";

/**
 * Defines an array of expression values
 *
 * @export
 * @class Expression
 */
export class ArrayValue extends Expression {
	/**
	 * The array value
	 * @protected
	 * @type {Expression[]}
	 */
	protected array: Expression[];

	constructor() {
		super();
		this.array = [];
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
		return ReturnType.ARRAY;
	}

	/**
	 * Adds an expression to the array
	 * @param {Expression} value The expression to add
	 */
	addEntry(value: Expression): void {
		this.array.push(value);
	}

	/**
	 * Validates the array values.
	 * @param {string} dbType The database type
	 */
	validate(dbType: string): void {
		for (const entry of this.array) {
			entry.validate(dbType);
		}
	}

	/**
	 * Validates the expression for $pull update operation. If expression is not valid throwns an exception.
	 * @param {string} dbType The database type
	 */
	validateForPull(dbType: string): void {
		for (const entry of this.array) {
			entry.validateForPull(dbType);
		}
	}

	/**
	 * Returns the database specific query structure of the where condition
	 * @param {string} dbType The database type
	 * @returns Query structure
	 */
	getQuery(dbType: string, callback?: (fieldPath: string) => string): any {
		const output = [];
		for (const entry of this.array) {
			output.push(entry.getQuery(dbType, callback));
		}

		switch (dbType) {
			case DBTYPE.MONGODB:
				return output;
			case DBTYPE.POSTGRESQL:
			case DBTYPE.MYSQL:
				return `${output.join(", ")}`;
			default:
				return output;
		}
	}

	/**
	 * Returns the database specific query structure of the select condition of $pull update operation
	 * @param {string} dbType The database type
	 * @param {boolean} dropFieldName Do not include the field name in queries (used mainly for basic values list type fields)
	 * @returns Query structure
	 */
	getPullQuery(dbType: string, dropFieldName: boolean): any {
		const output = [];
		for (const entry of this.array) {
			output.push(entry.getPullQuery(dbType, dropFieldName));
		}

		return output;
	}

	/**
	 * Checks whether if the expression includes a joined field value
	 * @returns True if the expressin includes at least one joined field value, otherwise false
	 */
	hasJoinFieldValues(): boolean {
		for (const entry of this.array) {
			if (entry.hasJoinFieldValues()) return true;
		}
		return false;
	}
}
