# Quick Login Test Script
# This will help debug the authentication issue

Write-Host "🔍 Testing Login Functionality" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Checklist:" -ForegroundColor Yellow
Write-Host "1. Server is running on http://localhost:3000"
Write-Host "2. Open browser and go to: http://localhost:3000/login"
Write-Host "3. Try logging in with existing account:"
Write-Host "   Email: rkritikshama0@gmail.com"
Write-Host "   Password: [your password]"
Write-Host ""

Write-Host "❓ What to check:" -ForegroundColor Yellow
Write-Host "- Does the login page load?"
Write-Host "- What error message appears when you click 'Sign in'?"
Write-Host "- Check browser console (F12) for errors"
Write-Host "- Check terminal for Supabase errors"
Write-Host ""

Write-Host "🔧 Common Issues:" -ForegroundColor Yellow
Write-Host "1. 'Invalid login credentials' → Wrong password or email not in Supabase"
Write-Host "2. 'Network error' → Supabase credentials missing in .env"
Write-Host "3. No error but doesn't redirect → Check browser console"
Write-Host ""

Write-Host "💡 Quick Fix:" -ForegroundColor Green
Write-Host "If you can't login with existing account, create a NEW account:"
Write-Host "1. Go to: http://localhost:3000/signup"
Write-Host "2. Use a NEW email (e.g., test@example.com)"
Write-Host "3. Password: minimum 6 characters"
Write-Host "4. Then login with those credentials"
Write-Host ""

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
