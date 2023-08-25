/**
 * Check whether the input value is a JS object or not
 * @param  {any} value
 */
export function isObject(value: any): boolean {
	if (typeof value === "object" && !Array.isArray(value) && value !== null)
		return true;

	return false;
}

/**
 * Check whether the input value is a boolean value or not
 * @param  {any} value
 */
export function isBoolean(value: any): boolean {
	return typeof value === "boolean";
}

/**
 * Check whether the input value is a string value or not
 * @param  {any} value
 */
export function isString(value: any): boolean {
	return typeof value === "string" && value !== "" && value.trim().length !== 0;
}

/**
 * Check whether the value is not undefined or null
 * @param  {any} value
 */
export function valueExists(value: any): boolean {
	if (value === null || value === undefined) return false;

	return true;
}

/**
 * Check whether the input value is a positive integer or not
 * @param  {any} value
 */
export function isPositiveInteger(value: any) {
	// Check if the value is a number and an integer
	if (typeof value === "number" && Number.isInteger(value)) {
		// Check if the value is positive
		return value > 0;
	}

	return false;
}

/**
 * Check whether the input value is a string value or not
 * @param  {any} value
 */
export function isArray(value: any): boolean {
	return Array.isArray(value);
}
