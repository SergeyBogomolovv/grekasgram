import { registerAs } from '@nestjs/config';

export default registerAs('files', () => {
  return {
    region: process.env.OBJECT_STORAGE_REGION,
    endpoint: process.env.OBJECT_STORAGE_ENDPOINT,
    credentials: {
      accessKeyId: process.env.OBJECT_STORAGE_ACCESS,
      secretAccessKey: process.env.OBJECT_STORAGE_SECRET,
    },
  };
});
