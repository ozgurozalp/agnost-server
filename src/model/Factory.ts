import { Model } from "./Model";
import { Field } from "./Field";
import { BasicValuesListField } from "./field/BasicValuesListField";
import { BinaryField } from "./field/BinaryField";
import { BooleanField } from "./field/BooleanField";
import { CreatedAtField } from "./field/CreatedAtField";
import { DateField } from "./field/DateField";
import { DateTimeField } from "./field/DateTimeField";
import { DecimalField } from "./field/DecimalField";
import { EmailField } from "./field/EmailField";
import { EncryptedTextField } from "./field/EncryptedTextField";
import { EnumField } from "./field/EnumField";
import { GeoPointField } from "./field/GeoPointField";
import { IdField } from "./field/IdField";
import { IntegerField } from "./field/IntegerField";
import { JSONField } from "./field/JsonField";
import { LinkField } from "./field/LinkField";
import { ObjectField } from "./field/ObjectField";
import { ObjectListField } from "./field/ObjectListField";
import { PhoneField } from "./field/PhoneField";
import { ReferenceField } from "./field/ReferenceField";
import { RichTextField } from "./field/RichTextField";
import { TextField } from "./field/TextField";
import { TimeField } from "./field/TimeField";
import { UpdatedAtField } from "./field/UpdatedAtField";

/**
 * Creates an instance of the specific field object.
 *
 * @param {any} meta Provides access to the application the version configuration
 * @param {Model | null} model Reference to the {@link Model} of the field
 */
export function createField(meta: any, model: Model): Field | undefined {
	switch (meta.type) {
		case "id":
			return new IdField(meta, model);
		case "text":
			return new TextField(meta, model);
		case "rich-text":
			return new RichTextField(meta, model);
		case "encrypted-text":
			return new EncryptedTextField(meta, model);
		case "email":
			return new EmailField(meta, model);
		case "link":
			return new LinkField(meta, model);
		case "phone":
			return new PhoneField(meta, model);
		case "boolean":
			return new BooleanField(meta, model);
		case "integer":
			return new IntegerField(meta, model);
		case "decimal":
			return new DecimalField(meta, model);
		case "createdat":
			return new CreatedAtField(meta, model);
		case "updatedat":
			return new UpdatedAtField(meta, model);
		case "datetime":
			return new DateTimeField(meta, model);
		case "date":
			return new DateField(meta, model);
		case "time":
			return new TimeField(meta, model);
		case "enum":
			return new EnumField(meta, model);
		case "geo-point":
			return new GeoPointField(meta, model);
		case "binary":
			return new BinaryField(meta, model);
		case "json":
			return new JSONField(meta, model);
		case "reference":
			return new ReferenceField(meta, model);
		case "basic-values-list":
			return new BasicValuesListField(meta, model);
		case "object-list":
			return new ObjectListField(meta, model);
		case "object":
			return new ObjectField(meta, model);
	}
}
