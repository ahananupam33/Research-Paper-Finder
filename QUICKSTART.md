# Quick Start Guide

Get Research Paper Finder up and running in 5 minutes!

## Prerequisites Check

Before starting, verify you have these installed:

```bash
# Check Python version (need 3.9+)
python --version

# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version

# Check git
git --version
```

If any are missing, install them first:
- **Python**: https://www.python.org/downloads/
- **Node.js**: https://nodejs.org/
- **Git**: https://git-scm.com/

---

## 🚀 5-Minute Setup

### Step 1: Clone Repository (30 seconds)

```bash
cd ~/Downloads  # or your preferred directory
git clone <repository-url>
cd Research-Paper-Finder
```

### Step 2: Setup Backend (2 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Verify installation
python -c "import fastapi; print('✓ Backend ready!')"
```

### Step 3: Setup Frontend (2 minutes)

```bash
# Open a NEW terminal window
cd Research-Paper-Finder/paper-search-ui

# Install dependencies
npm install

# Verify installation
npm list next react --depth=0
```

### Step 4: Run Application (30 seconds)

**Terminal 1 - Backend:**
```bash
cd Research-Paper-Finder/backend
source venv/bin/activate  # Skip on Windows
python paper-search-backend.py
```

Wait for: `Uvicorn running on http://0.0.0.0:8000`

**Terminal 2 - Frontend:**
```bash
cd Research-Paper-Finder/paper-search-ui
npm run dev
```

Wait for: `Ready in X.Xs`

### Step 5: Open Application

Open your browser and go to:
```
http://localhost:3000
```

🎉 **You're ready to search for papers!**

---

## 🧪 Quick Test

Try searching for:
- "machine learning"
- "quantum computing"
- "neural networks"
- "climate change"

You should see results within 2-3 seconds.

---

## 🔧 Configuration (Optional)

### Change Backend URL (Frontend)

Edit `paper-search-ui/app/action.tsx`:

```typescript
// Line 5: Change the API URL
const API_URL = 'http://localhost:8000';  // For local development
```

### Change Port Numbers

**Backend Port:**
```bash
# Edit line 64 in backend/paper-search-backend.py
uvicorn.run("paper-search-backend:app", host="0.0.0.0", port=8000)
#                                                             ^^^^
# Change 8000 to your preferred port
```

**Frontend Port:**
```bash
npm run dev -- -p 3001  # Use port 3001 instead of 3000
```

---

## 📝 Common First-Time Issues

### Issue 1: "Command not found: python"

**Solution:**
```bash
# Try python3 instead
python3 --version
python3 -m venv venv
```

### Issue 2: "Port already in use"

**Backend (Port 8000):**
```bash
# macOS/Linux:
lsof -ti:8000 | xargs kill -9

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Frontend (Port 3000):**
```bash
# Just use a different port:
npm run dev -- -p 3001
```

### Issue 3: "Module not found"

**Backend:**
```bash
# Make sure venv is activated (you should see (venv) in terminal)
source venv/bin/activate
pip install -r requirements.txt
```

**Frontend:**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: "Cannot connect to backend"

1. Verify backend is running: `curl http://localhost:8000`
2. Check firewall isn't blocking port 8000
3. Verify API URL in `action.tsx` matches your backend URL

---

## 🎯 Next Steps

Now that you're set up:

1. **Read the full README**: `README.md` for detailed documentation
2. **Explore the API**: Visit http://localhost:8000/docs
3. **Customize the UI**: Edit `paper-search-ui/app/page.tsx`
4. **Add features**: Check `README.md` Future Scope section
5. **Contribute**: See `CONTRIBUTING.md`

---

## 📚 Quick Reference

### Start Development

```bash
# Terminal 1: Backend
cd backend && source venv/bin/activate && python paper-search-backend.py

# Terminal 2: Frontend
cd paper-search-ui && npm run dev
```

### Stop Servers

Press `Ctrl + C` in each terminal window

### Deactivate Virtual Environment

```bash
deactivate
```

### Update Dependencies

**Backend:**
```bash
cd backend
source venv/bin/activate
pip install --upgrade -r requirements.txt
```

**Frontend:**
```bash
cd paper-search-ui
npm update
```

---

## 🆘 Need Help?

- **Documentation**: Check `README.md` for detailed guide
- **Architecture**: Read `ARCHITECTURE.md` for system design
- **Issues**: Open an issue on GitHub
- **API Docs**: Visit http://localhost:8000/docs

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:8000
- [ ] API docs load at http://localhost:8000/docs
- [ ] Search returns results
- [ ] Pagination works
- [ ] Paper links open arXiv pages

If all checked, you're good to go! 🚀

---

**Pro Tip**: Bookmark this page for quick reference during development!
