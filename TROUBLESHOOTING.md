# Advanced Troubleshooting for Mobile Access

## Current Status:
✅ Server running on `0.0.0.0:3000` (confirmed via netstat)
✅ Firewall rule added
❌ Still unreachable from IP address

## Additional Solutions to Try:

### Solution 1: Windows Defender Firewall - Public Network Rule

Sometimes Windows needs separate rules for Public networks:

```powershell
# Run as Administrator
New-NetFirewallRule -DisplayName "Next.js Dev Server (Public)" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -Profile Public
```

### Solution 2: Check Network Profile

Your WiFi might be set as "Public" instead of "Private":

1. Open **Settings** → **Network & Internet**
2. Click on **WiFi** → Click your network name
3. Under **Network profile type**, select **Private**
4. Restart server

### Solution 3: Disable Windows Firewall Temporarily (Testing Only)

⚠️ **Only for testing - remember to turn it back on!**

1. Search "Windows Defender Firewall"
2. Click "Turn Windows Defender Firewall on or off"
3. Turn OFF for **Private networks** only
4. Test mobile connection
5. **Turn it back ON immediately after testing**

### Solution 4: Use ngrok (Alternative)

If local network access keeps failing, use ngrok for internet-based access:

```bash
# Install ngrok
npm install -g ngrok

# Expose your server
ngrok http 3000
```

This will give you a public URL like: `https://abc123.ngrok.io`

### Solution 5: Check Router Settings

Some routers have "AP Isolation" or "Client Isolation" enabled:

1. Open router admin panel (usually `192.168.29.1` or `192.168.1.1`)
2. Look for "AP Isolation" or "Client Isolation"
3. **Disable** it
4. Restart router

### Solution 6: Try Different Port

Maybe port 3000 is blocked by something:

1. Stop current server (Ctrl+C)
2. Run: `npm run dev -- --hostname 0.0.0.0 --port 3001`
3. Add firewall rule for port 3001:
   ```powershell
   New-NetFirewallRule -DisplayName "Next.js Port 3001" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow -Profile Any
   ```
4. Try: `http://192.168.29.16:3001/dashboard`

## Diagnostic Commands:

### Check if port is accessible from localhost:
```powershell
Test-NetConnection -ComputerName 192.168.29.16 -Port 3000
```

Should show: `TcpTestSucceeded : True`

### Check firewall rules:
```powershell
Get-NetFirewallRule -DisplayName "*Next.js*" | Format-Table -AutoSize
```

### Check network profile:
```powershell
Get-NetConnectionProfile
```

## Quick Test Checklist:

- [ ] Server running with `--hostname 0.0.0.0`
- [ ] Firewall rule added for port 3000
- [ ] Network profile set to "Private"
- [ ] Both devices on same WiFi
- [ ] Router AP Isolation disabled
- [ ] Antivirus not blocking connections

## Still Not Working?

Try ngrok as the easiest alternative:

```bash
npx ngrok http 3000
```

You'll get a URL like: `https://abc123.ngrok-free.app`

Use this URL on your mobile - it will work from anywhere!
