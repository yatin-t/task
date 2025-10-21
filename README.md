# Task Manager

A small, professional task management web app built with plain HTML, CSS, and JavaScript. It stores tasks in localStorage and supports adding, editing, completing, deleting, searching, and filtering tasks.

Why this project
- Lightweight, framework-free app that can be wrapped as a mobile app using Capacitor or Cordova.

Files
- `index.html` — main UI
- `style.css` — styles
- `app.js` — application logic and persistence

Run locally
1. Open `index.html` in your browser. For file-based entry, double-click or run a quick static server for better feature parity (recommended):

```powershell
# from project root
python -m http.server 5500
# then open http://localhost:5500 in your browser
```

Convert to mobile (Capacitor) - quick steps (Windows PowerShell)
1. Install Node.js and npm if not already installed.
2. From project root, initialize npm and install Capacitor:

```powershell
npm init -y
npm install @capacitor/core @capacitor/cli --save
npx cap init my-task-manager com.example.taskmanager
```

3. Build web assets (if you use a bundler). For this simple app, ensure files are in `www/`.

```powershell
# copy files to www or configure build step
mkdir www; cp index.html style.css app.js www\
```

4. Add a native platform (Android example):

```powershell
npx cap add android
npx cap copy
npx cap open android
```

Capacitor will open Android Studio where you can build and run on device/emulator.

Notes
- The README provides high-level instructions. I can automate Capacitor setup in this project if you'd like — tell me whether you'd prefer Android, iOS, or both.
