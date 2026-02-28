# Mobile Access Fix Guide

## समस्या: Mobile से "Unreachable" दिख रहा है

**कारण:** Windows Firewall port 3000 को block कर रहा है।

## ✅ Solution (3 तरीके):

---

### तरीका 1: PowerShell Script (सबसे आसान) ⭐

1. File Explorer में जाएं: `c:\Users\Ritik\Desktop\pyhton\policysathi\`
2. `add-firewall-rule.ps1` file को **Right-click** करें
3. **"Run with PowerShell"** select करें
4. अगर UAC prompt आए तो **"Yes"** click करें
5. Script success message दिखाएगी

---

### तरीका 2: Manual Firewall Setting

1. Windows Search में type करें: **"Windows Defender Firewall"**
2. **"Advanced settings"** पर click करें
3. Left side में **"Inbound Rules"** select करें
4. Right side में **"New Rule..."** click करें
5. **"Port"** select करें → **Next**
6. **"TCP"** select करें
7. **"Specific local ports:"** में `3000` type करें → **Next**
8. **"Allow the connection"** select करें → **Next**
9. सभी checkboxes (Domain, Private, Public) को **check** करें → **Next**
10. **Name:** `Next.js Dev Server` type करें → **Finish**

---

### तरीका 3: Command Line (Administrator PowerShell)

PowerShell को **Administrator के रूप में** खोलें और run करें:

```powershell
New-NetFirewallRule -DisplayName "Next.js Dev Server" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -Profile Any
```

---

## 📱 Test करें:

Firewall rule add करने के बाद:

1. **Mobile browser** खोलें
2. Type करें: `http://192.168.29.16:3000/dashboard`
3. Page load होना चाहिए! ✅

---

## 🔍 Verify करें:

### Check if firewall rule added:

PowerShell में run करें:
```powershell
Get-NetFirewallRule -DisplayName "Next.js Dev Server*"
```

### Check if port is listening:

PowerShell में run करें:
```powershell
netstat -an | findstr :3000
```

आपको `0.0.0.0:3000` दिखना चाहिए (not just `127.0.0.1:3000`)

---

## ⚠️ Still Not Working?

### Check 1: Same WiFi?
- PC और mobile **same WiFi network** पर हैं?
- कुछ routers 2.4GHz और 5GHz को isolate करते हैं

### Check 2: IP Changed?
```powershell
ipconfig
```
Confirm करें कि IP अभी भी `192.168.29.16` है

### Check 3: Server Running?
Terminal में check करें कि `npm run dev -- --hostname 0.0.0.0` चल रहा है

---

## 🎉 Success होने पर:

Mobile पर ये URLs try करें:
- Dashboard: `http://192.168.29.16:3000/dashboard`
- Mobile Demo: `http://192.168.29.16:3000/mobile-demo`
- All Features: `http://192.168.29.16:3000/all-features`

---

## 📝 Notes:

- Firewall rule **permanent** है - एक बार add करने के बाद हमेशा काम करेगी
- Server restart करने की जरूरत नहीं
- Mobile और PC **same WiFi** पर होने चाहिए
