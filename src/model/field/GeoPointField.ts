import { ModelBase } from "../ModelBase";
import { Field } from "../Field";
import { DBTYPE } from "../../utils/types";

/**
 * The GeePoint field
 *
 * @export
 * @class Field
 */
export class GeoPointField extends Field {
  /**
   * Creates an instance of the field object.
   * @param {any} meta Provides access to the application the version configuration
   * @param {ModelBase} model Reference to the {@link ModelBase} of the field
   */
  constructor(meta: any, model: ModelBase) {
    super(meta, model);
  }

  /**
   * Assigns the value of the field. This method is overriden by the fhe specific field classes
   * @param {object} value Value of the field
   * @param {object} processedData The target processed object data where the prepared field value will be set
   * @param {object} response Provides infor about the preparation of the field
   * @param {boolean} isCreate Whether this is a create or update operation
   * @param {number} index Index number for object in a sub-model-list, mainly used in error messages
   * @throws Throws an exception if the field value cannot pass validation rules
   */
  async setValue(
    value: any,
    processedData: any,
    response: any,
    isCreate: boolean = true,
    index: number = -1,
  ): Promise<any> {
    if (!isCreate && this.isReadOnly()) return;

    // Unsetting the value of the field
    if (!isCreate && value === null && this.isRequired() === false) {
      processedData[this.getName()] = null;
      return;
    }

    // Geolocation point data needs to be an array with 2 entries [<longitude>, <latitude>]

    if (!Array.isArray(value) || value.length !== 2) {
      return (
        this.addValidationError(response, value, "not_geopoint_value"), index
      );
    }

    if (typeof value[0] !== "number" || !isFinite(value[0])) {
      return this.addValidationError(
        response,
        value,
        "invalid_longitude_value",
        index,
      );
    }

    if (typeof value[1] !== "number" || !isFinite(value[1])) {
      return this.addValidationError(
        response,
        value,
        "invalid_latitude_value",
        index,
      );
    }

    // Valid longitude values are between -180 and 180, both inclusive.
    // Valid latitude values are between -90 and 90, both inclusive.
    const lon = value[0];
    const lat = value[1];

    if (lon < -180 || lon > 180) {
      return this.addValidationError(
        response,
        value,
        "invalid_longitude_value",
        index,
      );
    }

    if (lat < -90 || lat > 90) {
      return this.addValidationError(
        response,
        value,
        "invalid_latitude_value",
        index,
      );
    }

    switch (this.getDBType()) {
      case DBTYPE.MONGODB:
        processedData[this.getName()] = { type: "Point", coordinates: value };
        break;
      case DBTYPE.POSTGRESQL:
        processedData[this.getName()] = `POINT(${lon}, ${lat})`;
        break;
      case DBTYPE.MYSQL:
        processedData[this.getName()] = `POINT(${lon}, ${lat})`;
        break;
      case DBTYPE.SQLSERVER:
        processedData[
          this.getName()
        ] = `geography::Point(${lon}, ${lat}, 4326)`;
        break;
      case DBTYPE.ORACLE:
        processedData[this.getName()] = `SDO_GEOMETRY(
					2001,            
					NULL,           
					SDO_POINT_TYPE(${lon}, ${lat}, NULL), 
					NULL,            
					NULL             
				)`;
        break;
    }
  }
}
