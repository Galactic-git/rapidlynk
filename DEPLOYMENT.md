# Deploying and updating Rapidlynk

Rapidlynk has three releases: the AWS backend, the Go CLI, and the static website. Publishing one does not publish the others.

## Existing production versus a new environment

The production AWS configuration was inspected on 2026-10-08. See [PRODUCTION.md](PRODUCTION.md) for verified function names, handlers, API routing, S3 lifecycle/events, DynamoDB settings, and inspected execution policies. Production includes a separate S3-triggered upload-metrics Lambda absent from the checked-in source. Its code and the website hosting settings remain unverified.

[`infrastructure/template.yaml`](infrastructure/template.yaml) creates a **new environment** with independently generated resource names. It does not import or adopt the manually configured production resources. Existing secrets refer to objects in the old bucket; changing API endpoints does not move those objects.

The template defines:

- Node.js 24 Lambda, handler `index.handler`, x86_64, 256 MB memory, 30-second timeout.
- HTTP API with `GET /health`, `POST /api/upload-url`, and `GET /api/download-url/{id}`, payload format 2.0 and a `$default` stage.
- Private S3 bucket, public access blocked, server-side AES256 encryption in addition to the CLI encryption.
- DynamoDB on-demand metrics table with string partition key `month` and point-in-time recovery.
- Lambda permissions for objects under `bundles/*`, bucket lookup, and metrics updates/description, plus SAM's logging permissions.
- Fourteen-day Lambda log retention by default. No automatic bundle expiry; S3 and DynamoDB are retained when the stack is deleted or resources are replaced. Retained resources continue to incur charges.

The current API is unauthenticated. Presigned transfers expire after 900 seconds; encrypted uploads are limited to 500 MiB. This template deliberately has no browser CORS setup because the CLI transfers files. The diagnostic `/test-s3` route is not exposed through this template; its source still targets a hardcoded production bucket.

## Prerequisites

Install Node.js 24 with npm, AWS CLI v2, and AWS SAM CLI. Authenticate to the intended AWS account with a named profile or your normal AWS credential mechanism. The deployment identity needs CloudFormation, artifact-bucket, API Gateway, Lambda, IAM role/pass-role, S3, DynamoDB, and CloudWatch Logs provisioning permissions. Those deployment permissions are separate from the narrower Lambda execution role.

Keep credentials out of Git. Use AWS SSO or an appropriate authenticated profile. The PowerShell scripts can run from any working directory.

## Deploy a new backend

From the repository root:

```powershell
.\scripts\deploy-backend.ps1 -StackName rapidlynk-dev -Environment dev -Region ap-south-1 -Profile YOUR_PROFILE
```

The script installs locked backend dependencies, builds the bundled Lambda artifact, prints the authenticated AWS account, and asks SAM to display a change set for confirmation. SAM uploads local code and provisions the resources. Use the same stack name, account, and region for future updates; a different stack name creates another environment.

`npm run build:lambda` produces `server/dist/lambda/index.cjs`. Its explicit CommonJS format and `.cjs` extension avoid ambiguity from `server/package.json`'s `type:module`. SAM packages that directory with the handler file at the ZIP root. No `sam build` is needed for this prebundled workflow.

After deployment, read the `ApiUrl`, `FunctionName`, `BucketName`, and `TableName` outputs. Point a CLI session at the new API:

```powershell
$env:RAPIDLYNK_SERVER = 'https://YOUR_API_ID.execute-api.ap-south-1.amazonaws.com'
```

The CLI's compiled default remains the existing API. To route future released binaries to a different backend, deliberately change `defaultServerBaseURL` in `cli/http.go` and publish a new CLI release. Existing installations retain their old default unless users set `RAPIDLYNK_SERVER` or upgrade.

Operator checks after deployment: request `/health`, push a disposable directory, pull into a separate empty directory, compare contents, and check Lambda logs and the metrics table. Never pull into a directory containing files you want to preserve: extraction replaces matching paths. These are release instructions, not checks performed while authoring this documentation.

## Capture the existing deployment

Use the read-only helper after identifying the actual function name:

```powershell
.\scripts\inspect-backend.ps1 -FunctionName YOUR_FUNCTION -ApiId plit6sl6b8 -Region ap-south-1 -Profile YOUR_PROFILE
```

It prints selected Lambda configuration, aliases, HTTP API configuration, routes, integrations, and stages. It only selects `S3_BUCKET` and `DYNAMODB_TABLE` from the Lambda environment; it does not dump arbitrary environment secrets. If the original API is not an HTTP API, use the `aws apigateway` commands instead of `apigatewayv2`.

Also capture these settings with AWS CLI or the AWS console:

| Resource | Settings to record |
| --- | --- |
| Lambda | Runtime, handler, architecture, memory, timeout, role, aliases/version used by API, VPC/layers if any |
| Execution role | Attached and inline policies; trust policy |
| API Gateway | Routes, integration function/alias, payload format, stage, throttling and authentication |
| S3 | Actual bucket, region, public-access block, encryption, bucket policy, CORS and lifecycle rules |
| DynamoDB | Table name, key schema, billing mode, backups and TTL settings |
| Hosting | Provider/project, connected repository, production branch, root/build/output settings, SPA rewrites |

Record reviewed non-secret values in a production runbook. Account IDs and resource names are identifiers, not passwords, but inspect policy/output files before publishing. Do not commit credentials, arbitrary environment dumps, signed URLs, or sharing secrets. Absence of an S3 lifecycle configuration means no lifecycle rule has been configured; an AccessDenied response does not establish absence.

Bringing existing resources into infrastructure management is a separate migration: inventory them, author matching definitions, plan supported resource imports, and preserve the original bucket and API behavior. Do not run this new-environment template expecting it to adopt production automatically.

## Backend updates and rollback

Commit the code change, rerun the deployment script for the same stack, review the change set, and confirm. Preserve the CLI contract: upload POST returns `url`, `fileId`, and `fields`; download GET returns `url`. Retain the `bundles/<id>` layout and existing encryption format if old secrets must continue working.

Keep the last known-good Git commit and record each deployment's commit, stack, account, region, and output names. For a code rollback, build and deploy the known-good code through the same stack from an isolated checkout. If that commit predates this template, apply the known-good backend source to a checkout containing this deployment tooling. Review any infrastructure differences before applying them. CloudFormation rollback on a failed update does not make an incompatible API or deleted data recoverable.

This template integrates the function directly and does not set a traffic-shifting alias. For an existing manually managed production Lambda, follow its existing deployment procedure until its configuration is inventoried; updating a function version may not update an alias that API Gateway targets.

## CLI and installer releases

See [`PUBLISHING.md`](PUBLISHING.md). Update `cli/main.go` and `npm/package.json` versions together, cross-compile six binaries with `scripts/build-all.ps1` or `.sh`, and publish from `npm/`. The deprecated `rapidlynk-npm/` directory is not the release package.

Build the Windows installer using `scripts/build-installer.ps1 -BuildBinary`. It obtains its version from `cli/main.go`. The build-all scripts' version arguments do not stamp binaries; the Go version constant controls reported version.

For GitHub releases, the installer must have the actual stable filename referenced by the website. For an example 1.0.2 release:

```powershell
Copy-Item -LiteralPath 'installer\Output\Rapidlynk-Setup-1.0.2-x64.exe' -Destination 'dist\RapidLynk-Setup-latest-x64.exe'
gh release create v1.0.2 --target YOUR_RELEASE_COMMIT --title 'Rapidlynk v1.0.2' --generate-notes 'dist\RapidLynk-Setup-latest-x64.exe' 'dist\rapidlynk-windows-amd64.exe' 'dist\rapidlynk-windows-arm64.exe' 'dist\rapidlynk-linux-amd64' 'dist\rapidlynk-linux-arm64' 'dist\rapidlynk-darwin-amd64' 'dist\rapidlynk-darwin-arm64'
```

Replace the version and release commit intentionally. In `gh`, `file#text` changes the display label, not the filename. The latest release needs every exact asset name linked by the website. Website links update future downloads; they do not update installed executables. npm users upgrade explicitly with `npm install -g rapidlynk@latest`; installer users rerun the new installer; standalone users replace their binary.

## Website deployment

The website is built independently from `web/`:

```powershell
cd web
npm ci
npm run build
```

Configure the static host with project root `web`, build command `npm run build`, output `dist`, and fallback to `index.html` for BrowserRouter app routes. If the provider uses repository-root paths, output is `web/dist`. Existing docs mention Vercel, but the live provider and Git integration have not been verified. Document the actual production branch in the hosting settings; a Git push only deploys if that integration is configured.

Hardcoded version labels in `Header.tsx`, `HomePage.tsx`, and `DownloadPage.tsx` need a website release. Changing latest GitHub assets does not require rebuilding unchanged download links. Website content currently advertises channel flags not implemented by this CLI; text changes do not add that feature.

## Automation and references

Deployment is manual through the checked-in script. A future GitHub Actions deployment can use AWS OIDC with a role restricted to the repository/branch or GitHub environment; no long-lived AWS keys are needed. Add automation after confirming the target account and production migration plan.

- [AWS SAM function specification](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html)
- [SAM deploy and change-set options](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-deploy.html)
- [Lambda Node.js module formats and handlers](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)
- [GitHub release asset upload labels](https://cli.github.com/manual/gh_release_upload)
