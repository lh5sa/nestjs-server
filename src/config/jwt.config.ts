import { registerAs } from "@nestjs/config";

export default registerAs("jwt", () => ({
  accessTokenOptions: {
    secret: "mock-access-token-secret-string",
    signOptions: {
      expiresIn: "20s",
    },
  },
  refreshTokenOptions: {
    secret: "mock-refresh-token-secret-string",
    expiresIn: "5m",
  },
}));
