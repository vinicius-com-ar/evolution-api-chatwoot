import { Schema } from 'mongoose';
import { dbserver } from '../../db/db.connect';

export class ChatwootRaw {
  _id?: string;
  enabled?: boolean;
  account_id?: string;
  token?: string;
  url?: string;
  name_inbox?: string;
  sign_msg?: boolean;
}

const chatwootSchema = new Schema<ChatwootRaw>({
  _id: { type: String, _id: true },
  enabled: { type: Boolean, required: true },
  account_id: { type: String, required: true },
  token: { type: String, required: true },
  url: { type: String, required: true },
  name_inbox: { type: String, required: true },
  sign_msg: { type: Boolean, required: true },
});

export const ChatwootModel = dbserver?.model(
  ChatwootRaw.name,
  chatwootSchema,
  'chatwoot',
);
export type IChatwootModel = typeof ChatwootModel;
