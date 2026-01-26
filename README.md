# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ nvm use
$ npm ci
```

### Local Development

```
$ npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### PR Preview Deployments

When you open a pull request, a preview deployment is automatically created and deployed to GitHub Pages. This allows reviewers to see your changes live before merging.

**How it works:**
- Every PR gets a unique preview URL with a random identifier (e.g., `https://opentdf.io/preview-a1b2c3d4/`)
- The preview is automatically updated when you push new commits
- A comment with the preview URL is posted on your PR
- When the PR is closed or merged, the preview is automatically cleaned up

**Manual rebuild:**
If your preview needs to be rebuilt (e.g., after a production deployment), you can manually trigger it:
1. Go to [Actions → Deploy PR Preview](https://github.com/opentdf/docs/actions/workflows/pr-preview.yaml)
2. Click "Run workflow"
3. Enter your PR number
4. Click "Run workflow"

**Note:** Production deployments to `main` will remove all PR previews. They can be restored by pushing a new commit or manually triggering the workflow.
