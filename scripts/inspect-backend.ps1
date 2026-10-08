param(
  [Parameter(Mandatory = $true)][string]$FunctionName,
  [Parameter(Mandatory = $true)][string]$ApiId,
  [string]$Region = 'ap-south-1',
  [string]$Profile = ''
)

# Read-only inventory. Does not print arbitrary Lambda environment variables.
$ErrorActionPreference = 'Stop'
$awsArgs = @('--region', $Region, '--no-cli-pager')
if ($Profile) { $awsArgs += @('--profile', $Profile) }
function Read-Aws {
  param([string[]]$Arguments)
  & aws @Arguments @awsArgs
  if ($LASTEXITCODE -ne 0) { throw 'AWS inventory command failed' }
}

Read-Aws -Arguments @('lambda', 'get-function-configuration', '--function-name', $FunctionName,
  '--query', '{FunctionName:FunctionName,Runtime:Runtime,Handler:Handler,MemorySize:MemorySize,Timeout:Timeout,Role:Role,Architectures:Architectures,Bucket:Environment.Variables.S3_BUCKET,Table:Environment.Variables.DYNAMODB_TABLE}', '--output', 'json')
Read-Aws -Arguments @('lambda', 'list-aliases', '--function-name', $FunctionName, '--output', 'json')
Read-Aws -Arguments @('apigatewayv2', 'get-api', '--api-id', $ApiId, '--output', 'json')
Read-Aws -Arguments @('apigatewayv2', 'get-routes', '--api-id', $ApiId, '--output', 'json')
Read-Aws -Arguments @('apigatewayv2', 'get-integrations', '--api-id', $ApiId, '--output', 'json')
Read-Aws -Arguments @('apigatewayv2', 'get-stages', '--api-id', $ApiId, '--output', 'json')
