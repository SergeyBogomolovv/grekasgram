export class VerifyEmailPayload {
  constructor(payload: VerifyEmailPayload) {
    this.token = payload.token;
    this.to = payload.to;
  }
  token: string;
  to: string;
}
