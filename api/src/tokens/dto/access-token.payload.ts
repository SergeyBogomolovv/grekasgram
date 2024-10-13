export class AccessTokenPayload {
  constructor(payload: AccessTokenPayload) {
    this.userId = payload.userId;
  }
  userId: string;
}
