import { DBTYPE } from "./types";

const HELPER = (global as any).helper;

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
 * Check whether the input value is a string or numeric value or not
 * @param  {any} value
 */
export function isKey(value: any): boolean {
  return (
    (typeof value === "string" && value !== "" && value.trim().length !== 0) ||
    typeof value === "number"
  );
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
 * Check whether the input value is a positive integer or zero or not
 * @param  {any} value
 */
export function isPositiveIntegerOrZero(value: any) {
  // Check if the value is a number and an integer
  if (typeof value === "number" && Number.isInteger(value)) {
    // Check if the value is positive or zero
    return value >= 0;
  }

  return false;
}

/**
 * Check whether the input value is a positive integer or not
 * @param  {any} value
 */
export function isInteger(value: any) {
  // Check if the value is a number and an integer
  if (typeof value === "number" && Number.isInteger(value)) {
    return true;
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

/**
 * Check whether the input value is a string value or not
 * @param  {any} value
 */
export function isValidId(value: any, dbType: string): boolean {
  if (!value) return false;

  switch (dbType) {
    case DBTYPE.MONGODB:
      // Check if the value is a valid mongodb id
      if (!HELPER.isValidId(value.toString())) return false;
      return true;
    case DBTYPE.POSTGRESQL:
    case DBTYPE.MYSQL:
    case DBTYPE.SQLSERVER:
    case DBTYPE.ORACLE:
      return true;
    default:
      return false;
  }
}

/**
 * Creates a MongoDB object identifer
 * @param  {any} value
 */
export function objectId(value: string): any {
  return HELPER.objectId(value);
}

/**
 * Checks whether the input field value is specified or not.
 * @export
 * @param {any} value Field value
 * @param {any} checkEmptyString Flag to check empty strings or not
 */
export function checkRequired(value: any, checkEmptyString: boolean = true) {
  if (value === null || value === undefined) return false;

  if (
    checkEmptyString &&
    (value === "" || (typeof value === "string" && value.trim() === ""))
  )
    return false;

  return true;
}
