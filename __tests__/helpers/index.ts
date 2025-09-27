import { mockInvalidPrettyError, mockPrettyError } from '__tests__/helpers/error';
import {
    getFastGlobStreamMock,
    mockDirent,
    mockDirentDir,
    mockDirentFile,
    mockGlobEntryStream,
} from '__tests__/helpers/file-system';
import { mockSaveOptions, mockSaveTemplateProps } from '__tests__/helpers/template';
import { createMemfsStructureFromPaths } from './memfs';

export {
    createMemfsStructureFromPaths,
    mockInvalidPrettyError,
    mockPrettyError,
    getFastGlobStreamMock,
    mockDirent,
    mockDirentDir,
    mockDirentFile,
    mockGlobEntryStream,
    mockSaveTemplateProps,
    mockSaveOptions,
};
