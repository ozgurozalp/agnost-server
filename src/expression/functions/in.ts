import { Function } from "../Function";
import { ReturnType, DBTYPE, ExpressionType } from "../../utils/types";
import { ClientError } from "../../utils/ClientError";

/**
 * 	Checks whether the value is in an array
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("in", {
			paramCount: 2,
			returnType: ReturnType.BOOLEAN,
			params: [ReturnType.PRIMITIVE, ReturnType.ARRAY],
			mapping: {
				MongoDB: "$custom",
			},
		});
	}

	/**
	 * Returns the database specific query structure of the where condition
	 * @param {string} dbType The database type
	 * @returns Query structure
	 */
	getQuery(dbType: string, callback: (fieldPath: string) => string): any {
		switch (dbType) {
			case DBTYPE.MONGODB:
				return {
					$in: [
						this.parameters[0].getQuery(dbType, callback),
						{
							$ifNull: [this.parameters[1].getQuery(dbType, callback), []],
						},
					],
				};
			default:
				return null;
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
				`The first parameter of the '${this.name}' function when used for a $pull update operation or array filter condition should be a field value. Either you have typed the field name wrong or you have used a static value or function instead of a field value.`
			);
		}

		const param2 = this.parameters[1];
		if (
			param2.getExpressionType() !== ExpressionType.STATIC &&
			param2.getExpressionType() !== ExpressionType.ARRAY_FIELD
		) {
			throw new ClientError(
				"invalid_value",
				`The second parameter of the '${this.name}' function when used for a $pull update operation or array filter condition can only be a static value (e.g., number, text, boolean)`
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
			return {
				$in: this.parameters[1].getPullQuery(dbType, dropFieldName),
			};
		else
			return {
				[this.parameters[0].getPullQuery(dbType, dropFieldName)]: {
					$in: this.parameters[1].getPullQuery(dbType, dropFieldName),
				},
			};
	}
}
