<#
.SYNOPSIS
  Upload an artifact file to Azure Blob Storage and optionally update metadata.json.

.DESCRIPTION
  Uploads a file to the correct blob path based on offering group and category.
  If Title and Description are provided, updates the metadata.json for that group.

.EXAMPLE
  .\upload-artifact.ps1 -File "C:\path\to\file.pdf" -Group "DT" -Category "tools"

.EXAMPLE
  .\upload-artifact.ps1 -File "C:\path\to\video.mp4" -Group "AMM" -Category "video" -Title "AMM Overview" -Description "Overview video"
#>
param(
  [Parameter(Mandatory)][string]$File,
  [Parameter(Mandatory)][ValidateSet('DT','AMM','DPDE')][string]$Group,
  [Parameter(Mandatory)][ValidateSet('video','architecture','tools')][string]$Category,
  [string]$Title,
  [string]$Description
)

$az = 'C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd'
$account = 'ibmnavartifacts'
$container = 'artifacts'

# Validate file exists
if (-not (Test-Path $File)) {
  Write-Error "File not found: $File"
  exit 1
}

$fileName = Split-Path $File -Leaf
$blobName = "$Group-Artifacts/$Category/$fileName"

Write-Host "Uploading: $fileName"
Write-Host "  -> $blobName"
Write-Host ""

# Upload the file
& $az storage blob upload `
  --account-name $account `
  --container-name $container `
  --file $File `
  --name $blobName `
  --overwrite `
  --auth-mode key

if ($LASTEXITCODE -ne 0) {
  Write-Error "Upload failed!"
  exit 1
}

Write-Host ""
Write-Host "File uploaded successfully!"

# Update metadata.json if Title or Description provided
if ($Title -or $Description) {
  Write-Host ""
  Write-Host "Updating metadata.json..."

  $metadataBlobName = "$Group-Artifacts/metadata.json"
  $tempFile = [System.IO.Path]::GetTempFileName()

  # Download existing metadata.json
  & $az storage blob download `
    --account-name $account `
    --container-name $container `
    --name $metadataBlobName `
    --file $tempFile `
    --auth-mode key 2>$null

  # Parse existing or create new
  if (Test-Path $tempFile) {
    $content = Get-Content $tempFile -Raw -ErrorAction SilentlyContinue
    if ($content) {
      $metadata = $content | ConvertFrom-Json
    } else {
      $metadata = @{}
    }
  } else {
    $metadata = @{}
  }

  # Convert PSObject to hashtable if needed
  $hash = @{}
  if ($metadata -is [PSCustomObject]) {
    $metadata.PSObject.Properties | ForEach-Object { $hash[$_.Name] = $_.Value }
  } else {
    $hash = $metadata
  }

  # Add/update the entry
  $entry = @{}
  if ($Title) { $entry.title = $Title }
  if ($Description) { $entry.description = $Description }
  $hash[$blobName] = [PSCustomObject]$entry

  # Write back
  $hash | ConvertTo-Json -Depth 10 | Set-Content $tempFile -Encoding UTF8

  # Upload updated metadata.json
  & $az storage blob upload `
    --account-name $account `
    --container-name $container `
    --file $tempFile `
    --name $metadataBlobName `
    --content-type 'application/json' `
    --overwrite `
    --auth-mode key

  Remove-Item $tempFile -Force

  Write-Host "metadata.json updated with title/description!"
}

Write-Host ""
Write-Host "Done! The file will appear in the app automatically on next page load."
