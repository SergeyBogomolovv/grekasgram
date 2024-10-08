export class SessionPayload {
  constructor(payload: SessionPayload) {
    this.userId = payload.userId;
    this.device = payload.device;
    this.ip = payload.ip;
    this.createdAt = payload.createdAt;
    this.expiresAt = payload.expiresAt;
  }
  userId: string;
  device: string;
  ip: string;
  createdAt: Date;
  expiresAt: Date;
}
