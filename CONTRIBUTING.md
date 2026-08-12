# Contributing to DevMirror

Thank you for helping build DevMirror into the standard developer infrastructure tool for running GitHub repositories locally!

## Local Setup

1. Prerequisites: Node.js >= 20, Docker Desktop or Docker Engine.
2. Clone repository:
   ```bash
   git clone https://github.com/devmirror/devmirror.join
   cd devmirror
   npm install
   ```
3. Build workspace:
   ```bash
   npm run build
   ```
4. Run tests:
   ```bash
   npm test
   ```
5. Test CLI locally:
   ```bash
   npm run dev:cli analyze ./examples/demo-fullstack
   ```

## Adding a Plugin

To support a new language or framework, add a plugin inside `plugins/`:
1. Implement `DevMirrorPlugin` interface.
2. Export detection and analysis handlers.
3. Register the plugin in `@devmirror/detectors`.
