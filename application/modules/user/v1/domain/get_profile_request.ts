import Ajv, { JSONSchemaType } from 'ajv';
import { Result } from '../../../../../lib';

let ajv!: Ajv;
ajv ??= new Ajv({ allErrors: true });

export interface IGetProfileRequest {
  id: string;
}

// json schema
const schema: JSONSchemaType<IGetProfileRequest> = {
  $schema: 'http://json-schema.org/draft-07/schema',
  title: '',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      minLength: 1
    }
  },
  required: ['id'],
  additionalProperties: false
};

const validate = ajv.compile(schema);

export function validateAndParseRequest(
  data: any
): Result<IGetProfileRequest | null, string | null> {
  if (!validate(data)) {
    return Result.from(null, 'request invalid');
  }

  return Result.from({ id: data.id }, null);
}
