# 🌐 Complete Custom Domain Setup for Substrata-ai.com

## ✅ AUTOMATED STEPS COMPLETED

### Vercel Configuration (Done Automatically)
- ✅ Project deployed: `substrata-ai-conservation`
- ✅ Production URL: https://substrata-ai-conservation-hyphae.vercel.app
- ✅ Domains added to project:
  - `substrata-ai.com`
  - `www.substrata-ai.com`
- ✅ SSL certificates will be auto-issued once DNS is configured

## 🎯 REMAINING STEPS (You Need To Do)

### Step 1: Purchase the Domain
**Option A: Buy through Vercel (Easiest)**
1. Go to: https://vercel.com/dashboard
2. Find your project: `substrata-ai-conservation`
3. Go to Settings → Domains
4. You'll see "substrata-ai.com" listed
5. Click "Buy Domain" if available

**Option B: Buy from Domain Registrar**
Popular options:
- **Namecheap**: https://namecheap.com (Usually cheapest)
- **GoDaddy**: https://godaddy.com
- **Google Domains**: https://domains.google
- **Cloudflare**: https://cloudflare.com

Search for: `substrata-ai.com`
Cost: Usually $10-15/year

### Step 2: Configure DNS Records
Once you own the domain, add these DNS records in your domain provider's control panel:

```
Record Type: A
Name: @
Value: 76.76.19.61
TTL: 3600

Record Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### Step 3: Verification Process
1. **Add DNS records** at your domain provider
2. **Wait 24-48 hours** for DNS propagation
3. **Check propagation**: https://whatsmydns.net
4. **Verify in Vercel**: Dashboard → Project → Settings → Domains
5. **SSL Certificate**: Automatically issued by Vercel

## 🔧 DOMAIN PROVIDER SPECIFIC INSTRUCTIONS

### Namecheap
1. Login → Domain List → Manage
2. Advanced DNS → Add New Record
3. Add the A and CNAME records above

### GoDaddy
1. Login → My Products → DNS
2. Add Records → Choose A or CNAME
3. Add the records above

### Google Domains
1. Login → DNS → Custom Records
2. Add the A and CNAME records

### Cloudflare
1. Login → DNS → Records
2. Add A and CNAME records
3. Make sure proxy is OFF (gray cloud)

## 🎉 FINAL RESULT

Once DNS propagates (24-48 hours), your conservation platform will be live at:
- ✅ https://substrata-ai.com
- ✅ https://www.substrata-ai.com

Both will redirect to your fully functional conservation management platform!

## 🆘 TROUBLESHOOTING

### DNS Not Propagating
- Wait longer (can take up to 48 hours)
- Check multiple DNS checkers
- Clear browser cache

### SSL Certificate Issues
- Vercel handles this automatically
- May take a few hours after DNS propagates

### Domain Shows Vercel Error Page
- DNS records are correct
- Domain not purchased yet
- Need to wait for propagation

## 📞 SUPPORT
- **Vercel Support**: https://vercel.com/help
- **Domain Issues**: Contact your domain provider
- **DNS Help**: Most providers have 24/7 chat support

---
**Current Status**: ✅ Vercel configuration complete, waiting for domain purchase and DNS setup.
