# Church Nexus APK Setup Script
# This script automates the entire Capacitor setup and APK building process

Write-Host "Starting Church Nexus APK Setup..." -ForegroundColor Green
Write-Host ""

# Step 1: Initialize Capacitor
Write-Host "Step 1: Initializing Capacitor..." -ForegroundColor Cyan
npx cap init "Whitefield Methodist Church" "com.church.app" --skip-appid-validation

if ($LASTEXITCODE -ne 0) {
    Write-Host "Capacitor initialization failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Capacitor initialized" -ForegroundColor Green
Write-Host ""

# Step 2: Add Android Platform (skip if already exists)
Write-Host "Step 2: Checking Android platform..." -ForegroundColor Cyan
if (Test-Path "android") {
    Write-Host "Android platform already exists, skipping add step" -ForegroundColor Yellow
} else {
    npx cap add android
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Android platform addition failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "Android platform added" -ForegroundColor Green
}
Write-Host ""

# Step 3: Sync Files (Android only)
Write-Host "Step 3: Syncing Android files..." -ForegroundColor Cyan
npx cap sync android

Write-Host "Android files synced" -ForegroundColor Green
Write-Host ""

# Step 4: Open Android Studio
Write-Host "Step 4: Opening Android Studio..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Android Studio will open shortly..." -ForegroundColor Yellow
Write-Host ""
Write-Host "NEXT STEPS IN ANDROID STUDIO:" -ForegroundColor Magenta
Write-Host "1. Wait for Gradle to sync (automatic)" -ForegroundColor White
Write-Host "2. Click: Build > Build Bundle(s) / APK(s) > Build APK(s)" -ForegroundColor White
Write-Host "3. Wait for the build to complete" -ForegroundColor White
Write-Host "4. APK file will be in: android/app/build/outputs/apk/debug/" -ForegroundColor White
Write-Host ""

npx cap open android

Write-Host ""
Write-Host "Setup complete! Android Studio is open." -ForegroundColor Green
Write-Host "Build your APK from Android Studio (Build > Build APK)" -ForegroundColor Cyan
