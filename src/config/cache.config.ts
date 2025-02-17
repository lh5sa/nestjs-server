import { CacheModuleOptions } from "@nestjs/cache-manager";
import { registerAs } from "@nestjs/config";

export default registerAs(
  "cache",
  (): CacheModuleOptions => ({
    // store: 默认内存缓存(memory)
    ttl: 3 * 1000, // 缓存时间 3s
  })
);
