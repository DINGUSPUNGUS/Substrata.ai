# 🌐 DNS Setup for substrata-ai.xyz

## ✅ DOMAIN STATUS
- ✅ Domain purchased: `substrata-ai.xyz`
- ✅ Domain added to Vercel project
- 🔄 DNS records needed at your registrar

## 🔧 DNS RECORDS TO ADD

Since you can't change nameservers, add these DNS records at your domain registrar:

### Required DNS Records:
```
Type: A
Name: @ (or leave blank for root domain)
Value: 76.76.19.61
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

## 📍 WHERE TO ADD THESE RECORDS

### At Your Domain Registrar:
1. **Login to your domain registrar** (where you bought substrata-ai.xyz)
2. **Find DNS Management** (usually called "DNS", "DNS Records", or "Advanced DNS")
3. **Add the A record** for the root domain (@)
4. **Add the CNAME record** for www subdomain
5. **Save changes**

## 🕐 TIMELINE

- **Immediate**: DNS records saved at registrar
- **15-60 minutes**: Changes start propagating
- **2-24 hours**: Full global propagation
- **Automatic**: Vercel detects domain and issues SSL certificate

## 🔍 VERIFICATION

### Check if it's working:
1. **Wait 1-2 hours** after adding DNS records
2. **Visit**: https://substrata-ai.xyz
3. **Also try**: https://www.substrata-ai.xyz

### DNS Propagation Checker:
- Visit: https://whatsmydns.net
- Enter: substrata-ai.xyz
- Check if A record shows: 76.76.19.61

## ⚠️ COMMON REGISTRAR LOCATIONS

### Popular Registrars - Where to find DNS:
- **Namecheap**: Domain List → Manage → Advanced DNS
- **GoDaddy**: My Products → DNS → Manage Zones
- **Google Domains**: DNS → Custom Records
- **Cloudflare**: DNS → Records
- **NameSilo**: Domain Manager → DNS Records

## 🎯 EXPECTED RESULT

Once DNS propagates (usually 2-24 hours):
- ✅ https://substrata-ai.xyz → Your conservation platform
- ✅ https://www.substrata-ai.xyz → Your conservation platform
- ✅ Automatic SSL certificate from Vercel
- ✅ Professional custom domain ready

## 🆘 TROUBLESHOOTING

### If it's not working after 24 hours:
1. **Double-check DNS records** are exactly as shown above
2. **Remove any conflicting records** (other A or CNAME records for @ or www)
3. **Contact your registrar support** for DNS help
4. **Check Vercel dashboard** for domain status

---

**Current Status**: Add the DNS records above at your registrar, then wait for propagation! 🚀
