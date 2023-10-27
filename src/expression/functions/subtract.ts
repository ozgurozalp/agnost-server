import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Subtracts the numbers
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("subtract", {
			paramCount: 2,
			returnType: ReturnType.NUMBER,
			params: [ReturnType.NUMBER, ReturnType.NUMBER],
			mapping: {
				MongoDB: "$subtract",
				PostgreSQL: "-",
				MySQL: "-",
			},
		});
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

				return `(${funcParams[0]} - ${funcParams[1]})`;
			default:
				return null;
		}
	}
}
