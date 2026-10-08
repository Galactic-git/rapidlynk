param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^[a-zA-Z][a-zA-Z0-9-]{0,127}$')]
  [string]$StackName,
  [string]$Region = 'ap-south-1',
  [ValidatePattern('^[a-z][a-z0-9-]{0,19}$')]
  [string]$Environment = 'dev',
  [string]$Profile = ''
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
foreach ($command in @('npm.cmd', 'sam', 'aws')) {
  if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
    throw "Required command missing: $command. See DEPLOYMENT.md."
  }
}

Push-Location (Join-Path $projectRoot 'server')
try {
  & npm.cmd ci
  if ($LASTEXITCODE -ne 0) { throw 'npm ci failed' }
  & npm.cmd run build:lambda
  if ($LASTEXITCODE -ne 0) { throw 'Lambda build failed' }
} finally {
  Pop-Location
}

$templatePath = Join-Path $projectRoot 'infrastructure/template.yaml'
$awsArgs = @('--region', $Region)
if ($Profile) { $awsArgs += @('--profile', $Profile) }
& aws sts get-caller-identity @awsArgs
if ($LASTEXITCODE -ne 0) { throw 'AWS authentication failed' }

# SAM displays the change set and asks before applying it.
& sam deploy --template-file $templatePath --stack-name $StackName `
  --resolve-s3 --capabilities CAPABILITY_IAM --confirm-changeset `
  --no-fail-on-empty-changeset --parameter-overrides "Environment=$Environment" @awsArgs
if ($LASTEXITCODE -ne 0) { throw 'SAM deployment failed' }

& aws cloudformation describe-stacks --stack-name $StackName `
  --query 'Stacks[0].Outputs' --output table @awsArgs
if ($LASTEXITCODE -ne 0) { throw 'Could not read stack outputs' }
