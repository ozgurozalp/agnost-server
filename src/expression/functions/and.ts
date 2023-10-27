import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Defines logical and function
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("and", {
			paramCount: -1,
			returnType: ReturnType.BOOLEAN,
			params: ReturnType.BOOLEAN,
			mapping: {
				MongoDB: "$and",
				PostgreSQL: "AND",
				MySQL: "AND",
			},
		});
	}

	/**
	 * Returns the database specific query structure of the select condition of $pull update operation
	 * @param {string} dbType The database type
	 * @param {boolean} dropFieldName Do not include the field name in queries (used mainly for basic values list type fields)
	 * @returns Query structure
	 */
	getPullQuery(dbType: string, dropFieldName: boolean): any {
		if (dropFieldName) {
			const funcParams = [];
			for (const entry of this.parameters) {
				funcParams.push(entry.getPullQuery(dbType, dropFieldName));
			}

			return Object.assign({}, ...funcParams);
		} else return super.getPullQuery(dbType, dropFieldName);
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
				const funcParams = [];
				for (const entry of this.parameters) {
					funcParams.push(entry.getQuery(dbType, callback));
				}

				return `(${funcParams.join(" AND ")})`;
			default:
				return null;
		}
	}
}
