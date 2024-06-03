/* eslint-disable @typescript-eslint/no-namespace */
import { AuthenticationState, WAConnectionState } from '@whiskeysockets/baileys';

export enum Events {
  APPLICATION_STARTUP = 'application.startup',
  QRCODE_UPDATED = 'qrcode.updated',
  CONNECTION_UPDATE = 'connection.update',
  STATUS_INSTANCE = 'status.instance',
  MESSAGES_SET = 'messages.set',
  MESSAGES_UPSERT = 'messages.upsert',
  MESSAGES_UPDATE = 'messages.update',
  MESSAGES_DELETE = 'messages.delete',
  SEND_MESSAGE = 'send.message',
  CONTACTS_SET = 'contacts.set',
  CONTACTS_UPSERT = 'contacts.upsert',
  CONTACTS_UPDATE = 'contacts.update',
  PRESENCE_UPDATE = 'presence.update',
  CHATS_SET = 'chats.set',
  CHATS_UPDATE = 'chats.update',
  CHATS_UPSERT = 'chats.upsert',
  CHATS_DELETE = 'chats.delete',
  GROUPS_UPSERT = 'groups.upsert',
  GROUPS_UPDATE = 'groups.update',
  GROUP_PARTICIPANTS_UPDATE = 'group-participants.update',
}

export declare namespace wa {
  export type QrCode = { count?: number; base64?: string; code?: string };
  export type Instance = {
    qrcode?: QrCode;
    authState?: { state: AuthenticationState; saveCreds: () => void };
    name?: string;
    wuid?: string;
    profileName?: string;
    profilePictureUrl?: string;
  };

  export type LocalWebHook = {
    enabled?: boolean;
    url?: string;
    events?: string[];
    webhook_by_events?: boolean;
  };

  export type LocalChatwoot = {
    enabled?: boolean;
    account_id?: string;
    token?: string;
    url?: string;
    name_inbox?: string;
    sign_msg?: boolean;
  };

  export type StateConnection = {
    instance?: string;
    state?: WAConnectionState | 'refused';
    statusReason?: number;
  };

  export type StatusMessage =
    | 'ERROR'
    | 'PENDING'
    | 'SERVER_ACK'
    | 'DELIVERY_ACK'
    | 'READ'
    | 'DELETED'
    | 'PLAYED';
}

export const TypeMediaMessage = [
  'imageMessage',
  'documentMessage',
  'audioMessage',
  'videoMessage',
  'stickerMessage',
];

export const MessageSubtype = [
  'ephemeralMessage',
  'documentWithCaptionMessage',
  'viewOnceMessage',
  'viewOnceMessageV2',
];
