import {
  WAPrivacyOnlineValue,
  WAPrivacyValue,
  WAReadReceiptsValue,
  proto,
} from '@whiskeysockets/baileys';

export class OnWhatsAppDto {
  constructor(
    public readonly jid: string,
    public readonly exists: boolean,
    public readonly name?: string,
  ) {}
}

export class getBase64FromMediaMessageDto {
  message: proto.WebMessageInfo;
  convertToMp4?: boolean;
}

export class WhatsAppNumberDto {
  numbers: string[];
}

export class NumberDto {
  number: string;
}

export class ProfileNameDto {
  name: string;
}

export class ProfileStatusDto {
  status: string;
}

export class ProfilePictureDto {
  number?: string;
  // url or base64
  picture?: string;
}

class Key {
  id: string;
  fromMe: boolean;
  remoteJid: string;
}
export class ReadMessageDto {
  readMessages: Key[];
}

class LastMessage {
  key: Key;
  messageTimestamp?: number;
}

export class ArchiveChatDto {
  lastMessage: LastMessage;
  archive: boolean;
}

class PrivacySetting {
  readreceipts: WAReadReceiptsValue;
  profile: WAPrivacyValue;
  status: WAPrivacyValue;
  online: WAPrivacyOnlineValue;
  last: WAPrivacyValue;
  groupadd: WAPrivacyValue;
}

export class PrivacySettingDto {
  privacySettings: PrivacySetting;
}

export class DeleteMessage {
  id: string;
  fromMe: boolean;
  remoteJid: string;
  participant?: string;
}
