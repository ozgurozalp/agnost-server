import { Function } from "../Function";
import { ReturnType, DBTYPE } from "../../utils/types";

/**
 * Returns the first count characters from the beginning of the main string as a new string
 *
 * @export
 * @class Function
 */
export default class FunctionImplementation extends Function {
	constructor() {
		super("left", {
			paramCount: 2,
			returnType: ReturnType.TEXT,
			params: [ReturnType.TEXT, ReturnType.NUMBER],
			mapping: {
				MongoDB: "$custom",
				PostgreSQL: "LEFT",
				MySQL: "LEFT",
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
					$substrCP: [
						this.parameters[0].getQuery(dbType, callback),
						0,
						this.parameters[1].getQuery(dbType, callback),
					],
				};
			case DBTYPE.POSTGRESQL:
			case DBTYPE.MYSQL:
				return super.getQuery(dbType, callback);
			default:
				return null;
		}
	}
}
