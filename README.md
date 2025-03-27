# NestBase

A modern web application built with NestJS and React, featuring task automation for development workflow.

## Task Automation

This project uses Taskfile for task automation. Here are the available tasks:

### Initialize Workspace

```bash
task init
```

Sets up your development environment by:

- Installing npm dependencies
- Creating environment files from examples (.env, .env.development, .env.production)

### Generate New Module

```bash
task gen name=your-module-name
```

Generates a new module in the API application with:

- NestJS resource generation
- Automatic module integration
- NX workspace cache reset

### Development Mode

```bash
task dev
```

Starts both API and Admin UI applications in development mode with:

- Hot-reload enabled
- Development environment configuration
- Concurrent application running

### Build Applications

```bash
task build
```

Builds both applications for production:

- Builds API with NX production configuration
- Builds Admin UI with Vite
- Generates optimized production assets

### Production Mode

```bash
task prod
```

Runs the applications in production mode:

- Starts the API server
- Serves the Admin UI

## Development with NX

To execute tasks with Nx use the following syntax:

```bash
npx nx <target> <project> <...options>
```

You can also run multiple targets:

```bash
npx nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```bash
npx nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/features/run-tasks).

## Docker Support

The project includes Docker support for containerized deployment:

1. Build the Docker image:

```bash
docker build -t nestbase .
```

2. Run the container:

```bash
docker run -p 3000:3000 nestbase
```

The container exposes port 3000 for the API service.
