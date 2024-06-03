import { isJWT } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Auth, configService } from '../../config/env.config';
import { Logger } from '../../config/logger.config';
import { name } from '../../../package.json';
import { InstanceDto } from '../dto/instance.dto';
import { JwtPayload } from '../services/auth.service';
import { ForbiddenException, UnauthorizedException } from '../../exceptions';
import { repository } from '../whatsapp.module';

const logger = new Logger('GUARD');

async function jwtGuard(req: Request, res: Response, next: NextFunction) {
  const key = req.get('apikey');

  if (key && configService.get<Auth>('AUTHENTICATION').API_KEY.KEY !== key) {
    throw new UnauthorizedException();
  }

  if (configService.get<Auth>('AUTHENTICATION').API_KEY.KEY === key) {
    return next();
  }

  if (
    (req.originalUrl.includes('/instance/create') ||
      req.originalUrl.includes('/instance/fetchInstances')) &&
    !key
  ) {
    throw new ForbiddenException(
      'Missing global api key',
      'The global api key must be set',
    );
  }

  const jwtOpts = configService.get<Auth>('AUTHENTICATION').JWT;
  try {
    const [bearer, token] = req.get('authorization').split(' ');

    if (bearer.toLowerCase() !== 'bearer') {
      throw new UnauthorizedException();
    }

    if (!isJWT(token)) {
      throw new UnauthorizedException();
    }

    const param = req.params as unknown as InstanceDto;
    const decode = jwt.verify(token, jwtOpts.SECRET, {
      ignoreExpiration: jwtOpts.EXPIRIN_IN === 0,
    }) as JwtPayload;

    if (param.instanceName !== decode.instanceName || name !== decode.apiName) {
      throw new UnauthorizedException();
    }

    return next();
  } catch (error) {
    logger.error(error);
    throw new UnauthorizedException();
  }
}

async function apikey(req: Request, res: Response, next: NextFunction) {
  const env = configService.get<Auth>('AUTHENTICATION').API_KEY;
  const key = req.get('apikey');

  if (env.KEY === key) {
    return next();
  }

  if (
    (req.originalUrl.includes('/instance/create') ||
      req.originalUrl.includes('/instance/fetchInstances')) &&
    !key
  ) {
    throw new ForbiddenException(
      'Missing global api key',
      'The global api key must be set',
    );
  }

  try {
    const param = req.params as unknown as InstanceDto;
    const instanceKey = await repository.auth.find(param.instanceName);
    if (instanceKey.apikey === key) {
      return next();
    }
  } catch (error) {}

  throw new UnauthorizedException();
}

export const authGuard = { jwt: jwtGuard, apikey };
