# `tbox`

> **Note**: This tool is currently in active development. The API may change until version 1.0.0.

**`tbox`** is your personal CLI template manager. Save frequently used file structures, configs, and entire projects to reuse them with a single command!

## Features

- Quickly save and reuse files, project structures, and configurations
- Simple commands for template management: `save`, `get`, `delete`, `list`
- Support for glob patterns and recursive directory copying
- **Currently supports Unix-based systems (Windows support coming soon)**

## Quick Start

### Installation

```bash
npm install -g @alexlar/tbox
```

### Basic Usage

```bash
# Save your current project structure as a template
tbox save my-project ./ --recursive

# Save specific files using glob patterns and overwrite old one
tbox save my-template "./src/**/*.ts" "*.json" --force

# Create a new project from the template
tbox get my-template ./new-project

# List all available templates
tbox list

# Delete a template
tbox delete my-template

# Delete multiple templates at once
tbox delete old-template temp-backup
```

**Note:** When using glob patterns in the `save` command, make sure to wrap them in quotes to prevent shell expansion.

## Documentation

### Commands

#### `save <template-name> <source...> [options]`

Saves specified files and directories as a local template.

**Options:**

- `-f`, `--force` — Overwrite the template if it exists and ignore some errors.
- `-p`, `--preserve-last-dir` — Preserve only the final directory name from path patterns (ignored for file sources).
- `-r`, `--recursive` — Copy directories recursively (behaves like the `dir/**` glob pattern; without this flag, it behaves like `dir/*`).
- `-x`, `--exclude <patterns>` — Exclude files/directories matching the specified comma-separated glob patterns.

**Example glob patterns for `--exclude`:**

```
node_modules    # Excludes all node_modules directories
*.log           # Excludes all files with the .log extension
./config.json   # Excludes only the config.json file in the root directory
```

#### `get <template-name> [destination]`

Copies the specified template to the given destination path. If no destination is provided, the current working directory is used.

#### `delete <template-name...>`

Deletes the specified template(s).

#### `list`

Lists all saved templates.
