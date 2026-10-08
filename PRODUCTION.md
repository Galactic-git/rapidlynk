# Rapidlynk production AWS configuration

Observed on 2026-10-08 using read-only AWS API calls through the local `rapidlynk` profile. This records configuration, not an end-to-end transfer test or proof that deployed code matches a Git commit. No AWS resources were changed.

## Account and region

| Setting | Value |
| --- | --- |
| AWS account | `398915901698` |
| Region | `ap-south-1` |
| API origin | `https://plit6sl6b8.execute-api.ap-south-1.amazonaws.com` |
| Inspection IAM user | `rapidlynk-inspect` |

The inspection profile belongs to this AWS account independently of the local `default` profile. Credentials are not part of this runbook.

## Request routing

HTTP API `RapidlynkApiGateway` (`plit6sl6b8`) has one route, `ANY /{proxy+}`, with authorization `NONE` and no API key requirement. It points to integration `jzzi2gn`, an `AWS_PROXY` integration for `RapidLynkAPI`, payload format `2.0`, integration method `POST`, and integration timeout 30,000 ms.

The `$default` stage has `AutoDeploy: true`. Stage auto-deploy applies API Gateway configuration changes; it does not build or deploy code from GitHub. Detailed route metrics are disabled. No explicit throttling limits were returned in stage route settings.

The integration targets the unqualified Lambda function ARN, with no version or alias qualifier. `RapidLynkAPI` has no aliases. Its resource policy permits invocation by API Gateway from this API's proxy route.

## Lambda functions

| Setting | API function | Upload metrics function |
| --- | --- | --- |
| Function name | `RapidLynkAPI` | `RapidLynkMetrics` |
| Runtime | `nodejs24.x` | `nodejs24.x` |
| Handler | `lambda.handler` | `index.handler` |
| Architecture | `x86_64` | `x86_64` |
| Memory | 128 MB | 128 MB |
| Timeout | 3 seconds | 3 seconds |
| Package type | ZIP | ZIP |
| Execution role | `RapidLynkAPI-role-n8ib9ocs` | `RapidLynkMetrics-role-973w7cv3` |
| Last modified | 2026-09-01 17:35:49 UTC | 2026-09-01 13:12:19 UTC |

No Lambda layers or VPC configuration were returned for either function. The selected `S3_BUCKET` and `DYNAMODB_TABLE` environment variables were not set. The checked-in API source falls back to `rapidlynk-storage-prod` and `rapidlynk-metrics`; the deployed code package was not inspected to establish its own defaults.

Both `/aws/lambda/RapidLynkAPI` and `/aws/lambda/RapidLynkMetrics` log groups have no configured retention period. The API's three-second Lambda timeout is independent of the API Gateway integration's thirty-second timeout.

## Storage and upload metrics

Bucket `rapidlynk-storage-prod` is in `ap-south-1`. All four public-access-block settings are enabled. Default server-side encryption is `AES256` (in addition to CLI encryption); the encryption response also reports `BucketKeyEnabled: true` and SSE-C as a blocked encryption type.

The enabled lifecycle rule `rapidlynk-object-expiration` has an empty filter (all objects) and expiration `Days: 2`. This is the production file-retention configuration. Lifecycle expiration follows S3 scheduling; it is not an exact 48-hour availability guarantee. It is separate from the 900-second presigned URL lifetime in the source.

AWS returned `NoSuchCORSConfiguration` and `NoSuchBucketPolicy`: neither bucket CORS nor a bucket policy is configured. Access is controlled by IAM and presigned requests. The versioning API returned an empty configuration: bucket versioning is not enabled. Object data was not downloaded.

S3 notification `rapidlynk-upload-metrics` sends `s3:ObjectCreated:*` events for the prefix `bundles/` to `RapidLynkMetrics`. That function's invocation policy allows S3 from this bucket and account. This explains the upload-metrics trigger even though the API route does not call its `recordUpload` helper.

**Repository gap:** no separate `RapidLynkMetrics` entry point is present in the inspected source. The S3 trigger and DynamoDB write permission are verified; its actual code and metric calculations are not. Export and review that function's source before trying to reproduce or update it.

## DynamoDB and execution policies

Table `rapidlynk-metrics` is `ACTIVE`, uses `PAY_PER_REQUEST`, and has string partition key `month` with no sort key. TTL is disabled. Point-in-time recovery is disabled; AWS reports continuous backups enabled, which does not imply PITR is enabled.

The API role has inline policy `RapidLynkAPI-S3-DynamoDB`:

- `dynamodb:DescribeTable`, `dynamodb:GetItem`, `dynamodb:UpdateItem` on `rapidlynk-metrics`.
- `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject`, `s3:AbortMultipartUpload` on `rapidlynk-storage-prod/bundles/*`.
- `s3:ListBucket` on `rapidlynk-storage-prod`.

The metrics role has inline policy `RapidLynkMetricsDynamoDBAccess`, permitting `dynamodb:UpdateItem` on `rapidlynk-metrics`.

Each role also has an attached customer-managed policy whose name begins with `AWSLambdaBasicExecutionRole-`. The attached names were read; their policy documents and the role trust policies were not inspected. The permissions above describe the inspected inline policies, not a full effective-permissions audit.

## Updating the existing API

The new SAM template in `infrastructure/template.yaml` creates a separate environment. It does not adopt this production API, bucket, table, or metrics Lambda. Keep using the existing endpoint and bucket when preserving existing sharing secrets.

The repository build now emits `server/dist/lambda/index.cjs`, but production expects `lambda.handler`. Package the same CommonJS bundle as **`lambda.cjs` at the ZIP root** to preserve that handler. Example preparation from the repository root:

```powershell
Push-Location server
npm ci
npm run build:lambda
Pop-Location
# Continue only if both npm commands succeeded.
New-Item -ItemType Directory -Force -Path server/dist/production | Out-Null
Copy-Item -LiteralPath server/dist/lambda/index.cjs -Destination server/dist/production/lambda.cjs
Compress-Archive -LiteralPath server/dist/production/lambda.cjs -DestinationPath server/dist/rapidlynk-api.zip -Force
```

An operator with deployment permissions can upload that ZIP to `RapidLynkAPI`. The `rapidlynk-inspect` read-only user is not a deployment identity. Code-only updates should preserve the handler, role, bucket/table, and route configuration. The API currently invokes the unqualified function, so updating its code changes what requests execute once the update completes. There is no alias-based gradual rollout configured.

Before a deployment, record the current handler/settings, retain the previous deployable ZIP in private release storage, and record the new source commit. After deployment, check health and push/pull using disposable files and an empty destination. For a code rollback, upload the previous compatible ZIP and wait for the update to complete; recheck transfer behavior. These are operator instructions, not actions performed during this inspection.

## Differences from the new-environment template

| Area | Observed production | New SAM environment |
| --- | --- | --- |
| API route | `ANY /{proxy+}` | Three explicit health/upload/download routes |
| Lambda handler | `lambda.handler` | `index.handler` |
| Memory / timeout | 128 MB / 3 s | 256 MB / 30 s |
| Bucket retention | Two-day lifecycle expiration | No automatic expiry |
| Upload metrics | Separate S3-triggered Lambda | Separate metrics function not included |
| DynamoDB PITR | Disabled | Enabled |
| Log retention | Unset | 14 days |

These differences are intentional defaults for a separate environment, not a faithful production clone. Completing a production infrastructure migration still requires the metrics function source, matching settings, and a supported resource-import plan.

Website hosting configuration remains unverified; it is not discoverable from these backend AWS settings.
