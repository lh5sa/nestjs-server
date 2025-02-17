import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  name: "simple-admin-nestjs-server",
  isDev: process.env.NODE_ENV === "development",
}));
