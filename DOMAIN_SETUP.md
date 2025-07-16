# Custom Domain Setup for Substrata.ai

## Current Deployment
- **Live URL**: https://substrata-ai-conservation-nlti7pxpt-hyphae.vercel.app
- **Vercel Project**: substrata-ai-conservation

## Custom Domain Instructions

### Quick Setup with Vercel CLI
```bash
# Add custom domain via CLI
vercel domains add substrata-ai.com
vercel domains add www.substrata-ai.com

# Check domain status
vercel domains ls
```

### DNS Configuration
Configure these records at your domain provider:

```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Alternative CNAME Setup
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Domain Providers
- **GoDaddy**: [godaddy.com](https://godaddy.com)
- **Namecheap**: [namecheap.com](https://namecheap.com)
- **Cloudflare**: [cloudflare.com](https://cloudflare.com)
- **Google Domains**: [domains.google](https://domains.google)

## Verification Steps
1. Add domain in Vercel dashboard
2. Configure DNS records at domain provider
3. Wait 24-48 hours for propagation
4. Verify SSL certificate is issued
5. Test: https://substrata-ai.com

## Troubleshooting
- **DNS Propagation**: Use [whatsmydns.net](https://whatsmydns.net) to check
- **SSL Issues**: Vercel handles SSL automatically once DNS is configured
- **Subdomain Problems**: Ensure both @ and www records are set

## Support
- **Vercel Docs**: [vercel.com/docs/custom-domains](https://vercel.com/docs/custom-domains)
- **DNS Help**: Contact your domain provider's support
