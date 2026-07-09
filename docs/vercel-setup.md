Vercel setup and usage

This file explains how to connect this repository to Vercel so that every push to branches (and every PR) will produce a preview deployment URL.

Steps to enable Vercel preview deployments

1. Sign in to Vercel
   - Go to https://vercel.com and sign in with your GitHub account (authorize access to your repositories). If you prefer, you can use a different OAuth provider but GitHub is simplest.

2. Create a new project / import repository
   - Click "New Project" → "Import Git Repository" → select or paste the repository `zhouhanlin-0982/Floor-plan-design`.

3. Configure project settings
   - Framework Preset: Vite (or "Other" with the build settings below)
   - Root Directory: (leave empty or set if your app is in a subfolder)
   - Build Command: npm run build
   - Output Directory: dist
   - Install Command: npm install

4. Environment variables
   - No special environment variables are required by default for the frontend preview.
   - If you later add keys (e.g., for third-party services), add them here (VERCEL envs are available to preview and production separately).

5. Deploy and enable Pull Request Previews
   - Click "Deploy". Vercel will run the build and give you a deployment URL.
   - By default, Vercel creates preview deployments for branches/PRs. Confirm in Project Settings -> Git that "Automatically create Preview Deployments for Pull Requests" is enabled.

6. How to use
   - Every push to `feat/mobile-nlp` (or any branch you use) will trigger a preview deployment. The Vercel project dashboard lists recent deployments and preview URLs.
   - You can paste the preview URL here or open it on your phone to review changes without pulling locally.

Notes & troubleshooting

- If the build fails, check the build logs in the Vercel dashboard. Common issues:
  - Missing dependencies: ensure package.json lists all required packages.
  - Vite config expecting env vars: set them in Project Settings -> Environment Variables.

- If you want me to help further, I can:
  - Tweak the vercel.json or package.json build scripts for better compatibility.
  - Provide a small GitHub Action that posts the preview URL to PR comments automatically.

