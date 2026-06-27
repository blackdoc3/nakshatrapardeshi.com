# NRI Cleanup Desk Android APK MVP

This folder setup creates a simple Android APK MVP for **NRI Cleanup Desk**.

It is intentionally a wrapper app, not a full native Android rebuild.

## A. What this APK project does

The Android app opens the live NRI Cleanup Desk page:

```text
https://www.nakshatrapardeshi.com/nri-cleanup/
```

Chosen approach: **Option B — live website URL wrapper**.

Why this was chosen:

- It is easiest for a beginner to maintain.
- Website changes automatically appear in the Android app without rebuilding the APK.
- The existing static page already has the intake form, score logic, score gauge, copy summary, email summary, WhatsApp summary, and legal/footer sections.
- It avoids adding a backend, database, login, accounts, dashboard, document upload, payment processing, AI automation, or storage.

Important limitation: because this app loads the live URL, it needs internet. If the website is down or the phone has no connection, the app cannot show the full experience.

## Product scope preserved

This APK does **not** add:

- backend
- database
- login
- user accounts
- dashboard
- payment processing
- document upload
- automatic storage
- AI automation
- US/global support
- investment/tax/legal/accounting/financial advice features

The app must remain UK-focused and admin-support only.

The existing page boundaries are preserved:

- Admin support only
- No investment advice
- No tax advice
- No legal advice
- No accounting advice
- No regulated financial advice
- No tax filing
- No compliance guarantee
- No recommendation to buy, sell, hold, redeem, transfer, or switch financial products
- Money Mess Score is admin complexity score only
- No passwords, OTPs, card numbers, Aadhaar OTPs, account numbers, login details, or document uploads

## B. What tools you need to install

Install these once on your laptop:

1. **Git**
   - Needed to download the repo and switch to the APK branch.

2. **Node.js LTS**
   - Needed for Capacitor commands.
   - After installing, check it works:

```bash
node --version
npm --version
```

3. **Android Studio**
   - Needed to sync Gradle, build the APK, and later create a signed release APK/AAB.
   - When Android Studio opens, allow it to install the Android SDK and required build tools.

You do **not** need Google Play Console for your own testing.

## C. Exact beginner steps to build the debug APK

### 1. Clone the repo

```bash
git clone https://github.com/blackdoc3/nakshatrapardeshi.com.git
cd nakshatrapardeshi.com
```

### 2. Switch to this APK branch

```bash
git checkout codex/nri-cleanup-android-apk
```

### 3. Install npm dependencies

```bash
npm install
```

### 4. Create the simple NC icon and splash source assets

```bash
npm run assets:create
```

This creates PNG files inside `assets/`.

### 5. Generate the Android project

```bash
npm run cap:add:android
```

This creates an `android/` folder.

If Android already exists, do not run this again. Use:

```bash
npm run cap:sync
```

### 6. Generate the Android launcher icon and splash assets

```bash
npm run assets:generate
```

### 7. Sync Capacitor to Android

```bash
npm run cap:sync
```

### 8. Open the Android project

```bash
npm run cap:open
```

This opens Android Studio.

### 9. In Android Studio, sync Gradle

When Android Studio opens:

1. Wait for the project to load.
2. If you see a blue bar or prompt saying **Sync Now**, click **Sync Now**.
3. Wait until the sync finishes.
4. If Android Studio asks to install missing SDK/build tools, click **Install** or **Accept**.

### 10. Build a debug APK from Android Studio

In Android Studio:

1. Click **Build** in the top menu.
2. Click **Build Bundle(s) / APK(s)**.
3. Click **Build APK(s)**.
4. Wait for the build to finish.
5. Click the notification that says **APK(s) generated successfully**.
6. Click **Locate**.

The debug APK should be here:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

### Optional terminal build

After Android has been generated and synced, you can also try:

```bash
npm run android:debug
```

The APK path is still:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## D. Exact beginner steps to install APK on your Android phone

1. Find this file on your laptop:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

2. Transfer it to your Android phone using one of these:
   - USB cable
   - Google Drive
   - email to yourself
   - nearby share

3. On your Android phone, tap the APK file.

4. Android may say installation from this source is not allowed. This is normal for a debug APK.

5. Tap **Settings**.

6. Turn on **Allow from this source** for the app you used to open the APK, for example Files, Chrome, Gmail, or Drive.

7. Go back and tap **Install**.

8. Open **NRI Cleanup Desk**.

9. Make sure your phone has internet, because this MVP loads the live website.

## E. How to test the app

Use this checklist after installing the APK:

- [ ] 1. App opens on Android.
- [ ] 2. Page loads correctly.
- [ ] 3. CTA scrolls to intake.
- [ ] 4. Form can be completed.
- [ ] 5. Score gauge updates.
- [ ] 6. Score band appears.
- [ ] 7. Recommended product appears.
- [ ] 8. Copy summary works.
- [ ] 9. Email summary opens email app.
- [ ] 10. WhatsApp summary opens WhatsApp.
- [ ] 11. Legal/footer sections are visible.
- [ ] 12. No unnecessary permissions are requested.
- [ ] 13. App works on a normal Android phone screen.

Also test this safety checklist:

- [ ] The app does not ask for contacts.
- [ ] The app does not ask for storage/files.
- [ ] The app does not ask for camera.
- [ ] The app does not ask for microphone.
- [ ] The app does not ask for location.
- [ ] The app does not ask for SMS.
- [ ] The app does not ask for phone permission.

The live-wrapper app only needs internet access to load the website.

## F. What can go wrong and how to fix it

### Problem: `npm` command not found

Fix: install Node.js LTS, then close and reopen Terminal.

Check again:

```bash
node --version
npm --version
```

### Problem: `npm install` fails

Fixes to try:

```bash
npm cache verify
npm install
```

If it still fails, check that your internet connection works.

### Problem: `npm run cap:add:android` says Android already exists

That is okay. Run:

```bash
npm run cap:sync
npm run cap:open
```

### Problem: Android Studio Gradle sync fails

Fixes to try:

1. Open Android Studio.
2. Let it install missing SDK/build tools.
3. Use Android Studio's bundled JDK if prompted.
4. Click **File > Sync Project with Gradle Files**.
5. Try building again.

### Problem: App opens but page does not load

Fixes to try:

1. Check phone Wi‑Fi/mobile data.
2. Open this URL in Chrome on the same phone:

```text
https://www.nakshatrapardeshi.com/nri-cleanup/
```

3. If the website works in Chrome but not the app, run again:

```bash
npm run cap:sync
```

Then rebuild the APK.

### Problem: WhatsApp summary opens browser instead of WhatsApp

Fixes to try:

1. Install WhatsApp on the phone.
2. Make sure WhatsApp is logged in.
3. Tap the WhatsApp link again.
4. Android may ask which app to use; choose WhatsApp.

### Problem: Email summary does not open email app

Fixes to try:

1. Install Gmail or Outlook.
2. Add your email account.
3. Tap the email link again.

### Problem: Copy summary does not work

Fix: long press the generated summary text and copy it manually. The page already shows a fallback message if clipboard copy fails.

### Problem: App icon still shows the default Capacitor icon

Run these again after the Android project exists:

```bash
npm run assets:create
npm run assets:generate
npm run cap:sync
```

Then rebuild the APK.

## G. Difference between debug APK and release APK

### Debug APK

A debug APK is for your own testing.

Use it to:

- install on your own phone
- test the MVP
- show a few trusted people manually

Debug APK path:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Do not treat the debug APK as a polished public release.

### Release APK

A release APK is for wider distribution outside your own phone.

For release, you must sign the app with your own private signing key/keystore.

If you publish on Google Play later, you will probably need an **Android App Bundle (`.aab`)** instead of only an APK.

## H. Do I need Android Studio?

Yes, for a beginner, use Android Studio.

Technically, APKs can be built from the command line after everything is installed, but Android Studio is the easiest way to:

- install Android SDK/build tools
- sync Gradle
- build APKs
- create signed APK/AAB files later
- debug build problems

## I. Do I need Google Play Console yet?

No.

For your own testing, you only need a debug APK installed manually on your phone.

You need Google Play Console only if you decide to publish the app publicly or test through Google Play tracks.

For Google Play, expect to create a signed **Android App Bundle (`.aab`)**.

## J. What not to share publicly

Never share or commit:

- `.jks` files
- `.keystore` files
- `key.properties`
- signing key passwords
- keystore passwords
- private API keys
- private release credentials

The `.gitignore` file blocks common signing-key files, but you should still be careful.

## Android Studio signed release instructions for later

Use this only after the debug APK works.

### Create signed APK or AAB

1. Open the Android project:

```bash
npm run cap:open
```

2. In Android Studio, click **Build**.

3. Click **Generate Signed Bundle / APK**.

4. Choose one:
   - **Android App Bundle** if you may publish on Google Play.
   - **APK** if you want a signed APK for direct sharing.

5. Click **Next**.

6. Click **Create new...** under key store path.

7. Save the keystore outside the repo, for example:

```text
Documents/android-signing/nri-cleanup-desk.jks
```

8. Create a strong password and save it safely in your password manager.

9. Use an alias like:

```text
nri-cleanup-desk
```

10. Set validity to a long period, for example 25 years.

11. Fill in your name/organisation details.

12. Click **OK**.

13. Choose **release** build variant.

14. Click **Create** or **Finish**.

15. Save the signed output safely.

Important: if you lose the signing key, future updates may become difficult or impossible depending on how you distribute the app.

## Manual steps you still must do

I cannot avoid these because they need your laptop/phone:

1. Install Node.js LTS.
2. Install Android Studio.
3. Clone the repo and switch to the branch.
4. Run the npm/Capacitor commands.
5. Open Android Studio.
6. Build the APK.
7. Transfer the APK to your phone.
8. Allow install from unknown sources.
9. Test on a real Android phone.

## Notes for future improvements

This MVP is good for private testing and early user feedback.

Before wide public distribution or Google Play publishing, consider:

- packaging the static page locally instead of using `server.url`
- turning the web page into a proper PWA
- creating a production-ready Android project with committed native files
- reviewing Google Play policies for apps that mainly wrap websites
- reviewing legal/privacy wording with a qualified professional

Do not add backend, database, login, payment, document upload, or regulated advice features unless you intentionally redesign the product scope.
