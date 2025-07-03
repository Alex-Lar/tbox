import type { TemplateRepositoryInterface } from '@core/repository';
import type { AddOptions } from '@application/commands/create';
import type FileSystemManager from '@infrastructure/filesystem';

class TemplateRepository implements TemplateRepositoryInterface {
  constructor(private storage: string, private fsManager: FileSystemManager) {
    this.storage = storage;
    this.fsManager = fsManager;
  }

  async create(template: Template, options: AddOptions): Promise<void> {
    // Create Template Logic...
  }
}

export default TemplateRepository;
