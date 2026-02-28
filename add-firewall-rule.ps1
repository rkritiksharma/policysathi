# Run this script as Administrator
# Right-click → Run with PowerShell (as Administrator)

Write-Host "Adding Firewall Rule for Next.js Dev Server..." -ForegroundColor Yellow

try {
    # Add firewall rule for port 3000
    New-NetFirewallRule -DisplayName "Next.js Dev Server (Port 3000)" `
                        -Direction Inbound `
                        -Protocol TCP `
                        -LocalPort 3000 `
                        -Action Allow `
                        -Profile Any `
                        -ErrorAction Stop

    Write-Host "`n✅ SUCCESS! Firewall rule added successfully!" -ForegroundColor Green
    Write-Host "`nYou can now access your app on mobile at:" -ForegroundColor Cyan
    Write-Host "http://192.168.29.16:3000" -ForegroundColor White
    Write-Host "`nPress any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
catch {
    Write-Host "`n❌ ERROR: Failed to add firewall rule" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "`nMake sure you ran this script as Administrator!" -ForegroundColor Yellow
    Write-Host "`nPress any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
