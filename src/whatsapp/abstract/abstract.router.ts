import { InstanceDto } from '../dto/instance.dto';
import { JSONSchema7 } from 'json-schema';
import { Request } from 'express';
import { validate } from 'jsonschema';
import { BadRequestException } from '../../exceptions';
import 'express-async-errors';
import { Logger } from '../../config/logger.config';
import { GetParticipant, GroupInvite, GroupJid } from '../dto/group.dto';

type DataValidate<T> = {
  request: Request;
  schema: JSONSchema7;
  ClassRef: any;
  execute: (instance: InstanceDto, data: T) => Promise<any>;
};

const logger = new Logger('Validate');

export abstract class RouterBroker {
  constructor() {}
  public routerPath(path: string, param = true) {
    // const route = param ? '/:instanceName/' + path : '/' + path;
    let route = '/' + path;
    param ? (route += '/:instanceName') : null;

    return route;
  }

  public async dataValidate<T>(args: DataValidate<T>) {
    const { request, schema, ClassRef, execute } = args;

    const ref = new ClassRef();
    const body = request.body;
    const instance = request.params as unknown as InstanceDto;

    if (request?.query && Object.keys(request.query).length > 0) {
      Object.assign(instance, request.query);
    }

    if (request.originalUrl.includes('/instance/create')) {
      Object.assign(instance, body);
    }

    Object.assign(ref, body);

    const v = schema ? validate(ref, schema) : { valid: true, errors: [] };

    if (!v.valid) {
      const message: any[] = v.errors.map(({ property, stack, schema }) => {
        let message: string;
        if (schema['description']) {
          message = schema['description'];
        } else {
          message = stack.replace('instance.', '');
        }
        return {
          property: property.replace('instance.', ''),
          message,
        };
      });
      logger.error([...message]);
      throw new BadRequestException(...message);
    }

    return await execute(instance, ref);
  }

  public async groupNoValidate<T>(args: DataValidate<T>) {
    const { request, ClassRef, schema, execute } = args;

    const instance = request.params as unknown as InstanceDto;

    const ref = new ClassRef();

    Object.assign(ref, request.body);

    const v = validate(ref, schema);

    if (!v.valid) {
      const message: any[] = v.errors.map(({ property, stack, schema }) => {
        let message: string;
        if (schema['description']) {
          message = schema['description'];
        } else {
          message = stack.replace('instance.', '');
        }
        return {
          property: property.replace('instance.', ''),
          message,
        };
      });
      logger.error([...message]);
      throw new BadRequestException(...message);
    }

    return await execute(instance, ref);
  }

  public async groupValidate<T>(args: DataValidate<T>) {
    const { request, ClassRef, schema, execute } = args;

    const groupJid = request.query as unknown as GroupJid;

    if (!groupJid?.groupJid) {
      throw new BadRequestException(
        'The group id needs to be informed in the query',
        'ex: "groupJid=120362@g.us"',
      );
    }

    const instance = request.params as unknown as InstanceDto;
    const body = request.body;

    const ref = new ClassRef();

    Object.assign(body, groupJid);
    Object.assign(ref, body);

    const v = validate(ref, schema);

    if (!v.valid) {
      const message: any[] = v.errors.map(({ property, stack, schema }) => {
        let message: string;
        if (schema['description']) {
          message = schema['description'];
        } else {
          message = stack.replace('instance.', '');
        }
        return {
          property: property.replace('instance.', ''),
          message,
        };
      });
      logger.error([...message]);
      throw new BadRequestException(...message);
    }

    return await execute(instance, ref);
  }

  public async inviteCodeValidate<T>(args: DataValidate<T>) {
    const { request, ClassRef, schema, execute } = args;

    const inviteCode = request.query as unknown as GroupInvite;

    if (!inviteCode?.inviteCode) {
      throw new BadRequestException(
        'The group invite code id needs to be informed in the query',
        'ex: "inviteCode=F1EX5QZxO181L3TMVP31gY" (Obtained from group join link)',
      );
    }

    const instance = request.params as unknown as InstanceDto;
    const body = request.body;

    const ref = new ClassRef();

    Object.assign(body, inviteCode);
    Object.assign(ref, body);

    const v = validate(ref, schema);

    if (!v.valid) {
      const message: any[] = v.errors.map(({ property, stack, schema }) => {
        let message: string;
        if (schema['description']) {
          message = schema['description'];
        } else {
          message = stack.replace('instance.', '');
        }
        return {
          property: property.replace('instance.', ''),
          message,
        };
      });
      logger.error([...message]);
      throw new BadRequestException(...message);
    }

    return await execute(instance, ref);
  }

  public async getParticipantsValidate<T>(args: DataValidate<T>) {
    const { request, ClassRef, schema, execute } = args;

    const getParticipants = request.query as unknown as GetParticipant;

    if (!getParticipants?.getParticipants) {
      throw new BadRequestException(
        'The getParticipants needs to be informed in the query',
      );
    }

    const instance = request.params as unknown as InstanceDto;
    const body = request.body;

    const ref = new ClassRef();

    Object.assign(body, getParticipants);
    Object.assign(ref, body);

    const v = validate(ref, schema);

    if (!v.valid) {
      const message: any[] = v.errors.map(({ property, stack, schema }) => {
        let message: string;
        if (schema['description']) {
          message = schema['description'];
        } else {
          message = stack.replace('instance.', '');
        }
        return {
          property: property.replace('instance.', ''),
          message,
        };
      });
      logger.error([...message]);
      throw new BadRequestException(...message);
    }

    return await execute(instance, ref);
  }
}
