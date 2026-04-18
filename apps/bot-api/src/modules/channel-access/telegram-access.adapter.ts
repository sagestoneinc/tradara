export interface CreateInviteLinkInput {
  channelId: string;
  telegramUserId: string;
  userId: string;
}

export interface RevokeAccessInput {
  channelId: string;
  telegramUserId: string;
  userId: string;
}

export interface InviteLinkResult {
  status: "issued" | "pending_implementation";
  inviteUrl: string | null;
  note: string;
}

export interface RevokeAccessResult {
  status: "revoked" | "pending_implementation";
  note: string;
}

export interface TelegramAccessAdapter {
  createInviteLink(input: CreateInviteLinkInput): Promise<InviteLinkResult>;
  revokeAccess(input: RevokeAccessInput): Promise<RevokeAccessResult>;
}

export class StubTelegramAccessAdapter implements TelegramAccessAdapter {
  async createInviteLink(): Promise<InviteLinkResult> {
    return {
      status: "pending_implementation",
      inviteUrl: null,
      note: "Telegram invite-link creation is scaffolded but not connected to the live Bot API yet."
    };
  }

  async revokeAccess(): Promise<RevokeAccessResult> {
    return {
      status: "pending_implementation",
      note: "Telegram member revocation is scaffolded but not connected to the live Bot API yet."
    };
  }
}

