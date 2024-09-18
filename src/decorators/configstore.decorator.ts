import { Inject } from '@nestjs/common';
import { CONFIGSTORE_INSTANCE } from '../configstore.constants';

export const InjectConfigstore = (): ParameterDecorator => {
  return Inject(CONFIGSTORE_INSTANCE);
};
