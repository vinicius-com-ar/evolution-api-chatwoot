import { Router } from 'express';
import { Auth, configService } from '../../config/env.config';
import { instanceExistsGuard, instanceLoggedGuard } from '../guards/instance.guard';
import { authGuard } from '../guards/auth.guard';
import { ChatRouter } from './chat.router';
import { GroupRouter } from './group.router';
import { InstanceRouter } from './instance.router';
import { MessageRouter } from './sendMessage.router';
import { ViewsRouter } from './view.router';
import { WebhookRouter } from './webhook.router';
import { ChatwootRouter } from './chatwoot.router';
import fs from 'fs';

enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NOT_FOUND = 404,
  FORBIDDEN = 403,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500,
}

const router = Router();
const authType = configService.get<Auth>('AUTHENTICATION').TYPE;
const guards = [instanceExistsGuard, instanceLoggedGuard, authGuard[authType]];

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

router
  .get('/', (req, res) => {
    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Welcome to the Evolution API, it is working!',
      version: packageJson.version,
    });
  })
  .use(
    '/instance',
    new InstanceRouter(configService, ...guards).router,
    new ViewsRouter(instanceExistsGuard).router,
  )
  .use('/message', new MessageRouter(...guards).router)
  .use('/chat', new ChatRouter(...guards).router)
  .use('/group', new GroupRouter(...guards).router)
  .use('/webhook', new WebhookRouter(...guards).router)
  .use('/chatwoot', new ChatwootRouter(...guards).router);

export { router, HttpStatus };
