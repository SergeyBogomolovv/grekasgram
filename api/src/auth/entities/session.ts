export class SessionPayload {
  constructor(payload: SessionPayload) {
    this.userId = payload.userId;
  }
  userId: string;
}
