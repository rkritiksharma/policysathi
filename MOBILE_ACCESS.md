# Mobile Access Guide

## आपका Local IP Address: **192.168.29.16**

## Steps to Access on Mobile:

### 1. Stop Current Server
- Press `Ctrl+C` in the terminal where `npm run dev` is running

### 2. Start Server with Network Access
```bash
npm run dev -- --hostname 0.0.0.0
```

या package.json में script update करें:
```json
"scripts": {
  "dev": "next dev --hostname 0.0.0.0"
}
```

### 3. Mobile पर Open करें
अपने mobile browser में जाएं:
```
http://192.168.29.16:3000
```

## Important Notes:

✅ **दोनों devices same WiFi पर होने चाहिए**
✅ **Windows Firewall allow करना पड़ सकता है**
✅ **Port 3000 accessible होना चाहिए**

## Firewall Issue होने पर:

1. Windows Defender Firewall खोलें
2. "Allow an app through firewall" पर click करें
3. Node.js को allow करें (Private और Public दोनों networks के लिए)

## Alternative: Use ngrok (Internet से access के लिए)

```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 3000
```

यह आपको एक public URL देगा जो कहीं से भी accessible होगा।

## Test URLs:

- **Dashboard:** http://192.168.29.16:3000/dashboard
- **UI Demo:** http://192.168.29.16:3000/ui-demo
- **Mobile Demo:** http://192.168.29.16:3000/mobile-demo
- **All Features:** http://192.168.29.16:3000/all-features

## Troubleshooting:

❌ **Connection refused?**
- Check if server is running with `--hostname 0.0.0.0`
- Check Windows Firewall settings

❌ **Can't connect?**
- Verify both devices on same WiFi
- Try `ipconfig` again to confirm IP hasn't changed

❌ **Slow loading?**
- Normal for first load on mobile
- Subsequent loads will be faster
