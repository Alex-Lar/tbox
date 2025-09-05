const fourGlobEntryObjects = [
  {
    name: 'file1.txt',
    path: '/test/file1.txt',
    dirent: {
      isDirectory: () => false,
      isFile: () => true,
    },
  },
  {
    name: 'file2.txt',
    path: '/test/file2.txt',
    dirent: {
      isDirectory: () => false,
      isFile: () => true,
    },
  },
  {
    name: 'subfile.txt',
    path: '/test/dir/subfile.txt',
    dirent: {
      isDirectory: () => false,
      isFile: () => true,
    },
  },
  {
    name: 'subdir',
    path: '/test/dir/subdir',
    dirent: {
      isDirectory: () => true,
      isFile: () => false,
    },
  },
];

export { fourGlobEntryObjects };
