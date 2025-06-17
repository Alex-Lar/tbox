import TemplateManager from "./template-manager";
import { TemplateManagerConfig } from "./types";

const createTemplateManager = (
  config: TemplateManagerConfig
): TemplateManager => {
  return new TemplateManager(config);
};

export default createTemplateManager;
