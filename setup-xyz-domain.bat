@echo off
echo.
echo ========================================
echo   🌐 SUBSTRATA-AI.XYZ SETUP GUIDE
echo ========================================
echo.
echo ✅ STATUS:
echo    - Domain purchased: substrata-ai.xyz
echo    - Domain configured in Vercel: ✅
echo    - DNS records needed at registrar
echo.
echo 🔧 ADD THESE DNS RECORDS AT YOUR REGISTRAR:
echo.
echo Record 1:
echo    Type: A
echo    Name: @ (or blank for root)
echo    Value: 76.76.19.61
echo    TTL: 3600
echo.
echo Record 2:
echo    Type: CNAME
echo    Name: www
echo    Value: cname.vercel-dns.com
echo    TTL: 3600
echo.
echo 📍 WHERE TO ADD:
echo    1. Login to your domain registrar
echo    2. Find "DNS Management" or "DNS Records"
echo    3. Add both records above
echo    4. Save changes
echo.
echo ⏰ TIMELINE:
echo    - 15-60 minutes: Changes start working
echo    - 2-24 hours: Full global propagation
echo    - Automatic: SSL certificate issued
echo.
echo 🎯 RESULT: https://substrata-ai.xyz will show your platform!
echo.
echo 📚 Full guide: XYZ_DOMAIN_SETUP.md
echo.
pause
