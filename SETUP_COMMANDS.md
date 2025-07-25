# After installing Node.js, run these commands in order:

# 1. Verify Node.js installation
node --version
npm --version

# 2. Clean any previous installations
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# 3. Install all project dependencies
npm install

# 4. Start your live development server
npm run dev

# Your website will be available at: http://localhost:3000
# The server automatically reloads when you save files!
