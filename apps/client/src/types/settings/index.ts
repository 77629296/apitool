import { GlobalBaseSettings } from './base';

export * from './base';

export interface GlobalServerConfig {
  enabledOAuthSSO?: boolean;
}

/**
 * 配置设置
 */
export interface GlobalSettings extends GlobalBaseSettings {}
