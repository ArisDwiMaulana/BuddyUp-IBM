<#
.SYNOPSIS
    Create a PocketBase superuser/admin account in Windows PowerShell.
.EXAMPLE
    .\mk_superuser.ps1 admin password123
    .\mk_superuser.ps1 admin@buddyup.com password123
#>

param(
    [Parameter(Position=0, Mandatory=$false)]
    [string]$Username,
    
    [Parameter(Position=1, Mandatory=$false)]
    [string]$Password
)

$ContainerName = "buddyup-pocketbase"

if (-not $Username -or -not $Password) {
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "  BuddyUp — PocketBase Superuser Creator  " -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "Usage:"
    Write-Host "  .\mk_superuser.ps1 <username_or_email> <password>"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\mk_superuser.ps1 admin password123"
    Write-Host "  .\mk_superuser.ps1 admin@buddyup.com password123"
    Write-Host "==========================================" -ForegroundColor Cyan
    exit 1
}

$Email = $Username
if (-not ($Email -like "*@*")) {
    $Email = "$Email@buddyup.com"
    Write-Host "[i] Username formatted as email: $Email" -ForegroundColor Gray
}

Write-Host "[*] Creating superuser '$Email' in container '$ContainerName'..." -ForegroundColor Yellow

$commands = @(
    "docker exec $ContainerName /pocketbase superuser create $Email $Password --dir=/pb_data",
    "docker exec $ContainerName pocketbase superuser create $Email $Password --dir=/pb_data",
    "docker exec $ContainerName /pocketbase admin create $Email $Password --dir=/pb_data",
    "docker exec $ContainerName pocketbase admin create $Email $Password --dir=/pb_data"
)

$success = $false
foreach ($cmd in $commands) {
    try {
        $output = Invoke-Expression "$cmd 2>&1"
        if ($LASTEXITCODE -eq 0) {
            $success = $true
            break
        }
    } catch {
        # continue to next attempt
    }
}

if ($success) {
    Write-Host "[✓] Superuser '$Email' successfully created!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now log in to the PocketBase Admin Panel at:" -ForegroundColor Cyan
    Write-Host "👉 http://localhost:8090/_/" -ForegroundColor White
} else {
    Write-Host "[!] Failed to create superuser. Please ensure container '$ContainerName' is running and password has at least 8 characters." -ForegroundColor Red
    exit 1
}
