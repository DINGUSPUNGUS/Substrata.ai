@echo off
echo.
echo ================================
echo   SUBSTRATA.AI DOMAIN SETUP
echo ================================
echo.
echo ✅ COMPLETED AUTOMATICALLY:
echo    - Vercel project deployed
echo    - Domains added to Vercel
echo    - SSL certificates configured
echo.
echo 📋 WHAT YOU NEED TO DO:
echo.
echo 1. BUY DOMAIN: substrata-ai.com
echo    Recommended: Namecheap.com (usually cheapest)
echo    Alternative: GoDaddy.com, Google Domains
echo.
echo 2. ADD DNS RECORDS (in your domain provider):
echo    Record Type: A
echo    Name: @
echo    Value: 76.76.19.61
echo.
echo    Record Type: CNAME  
echo    Name: www
echo    Value: cname.vercel-dns.com
echo.
echo 3. WAIT: 24-48 hours for DNS propagation
echo.
echo 🎉 RESULT: https://substrata-ai.com will show your conservation platform!
echo.
echo 📚 Full instructions: CUSTOM_DOMAIN_COMPLETE_SETUP.md
echo.
pause
