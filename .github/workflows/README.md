# GitHub Pages Deployment

## Setup Instructions

To enable GitHub Pages deployment:

1. **Go to Repository Settings**

   - Navigate to `https://github.com/shuyangsun/pricing-sheet/settings/pages`

2. **Configure GitHub Pages**

   - Under "Build and deployment"
   - Set **Source** to: `GitHub Actions` (NOT "Deploy from a branch")

3. **Push Changes**

   - Commit and push the workflow file to trigger deployment

   ```bash
   git add .github/workflows/deploy-pages.yml
   git commit -m "Add GitHub Pages deployment workflow"
   git push origin main
   ```

4. **Monitor Deployment**
   - Go to the "Actions" tab in your repository
   - Watch the "Deploy Prototype Pages" workflow run
   - Once completed, the site will be available at: `https://shuyangsun.github.io/pricing-sheet/`

## Troubleshooting 404 Errors

If you see a 404 error:

1. **Check if GitHub Pages is enabled**

   - Go to Settings → Pages
   - Verify "Source" is set to "GitHub Actions"

2. **Check workflow status**

   - Go to Actions tab
   - Verify the "Deploy Prototype Pages" workflow completed successfully
   - Look for any error messages in the workflow logs

3. **Verify permissions**

   - The workflow needs `pages: write` and `id-token: write` permissions
   - These should be automatically granted, but check Settings → Actions → General → Workflow permissions

4. **Wait for DNS propagation**
   - Sometimes it takes 5-10 minutes after the first deployment for the site to become accessible

## Viewing Deployed Versions

Once deployed:

- **Landing page**: `https://shuyangsun.github.io/pricing-sheet/`
- **Version 0**: `https://shuyangsun.github.io/pricing-sheet/v0/`

## Manual Deployment

You can manually trigger a deployment:

1. Go to Actions tab
2. Select "Deploy Prototype Pages" workflow
3. Click "Run workflow"
4. Select the `main` branch
5. Click "Run workflow"
