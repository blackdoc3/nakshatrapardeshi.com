# NRI Cleanup Desk Android APK MVP

This setup creates a simple Android APK MVP for **NRI Cleanup Desk**.

It is intentionally a wrapper app, not a full native Android rebuild.

The app opens the live NRI Cleanup Desk page:

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

The app remains UK-focused and admin-support only.

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

## How the APK is built automatically

The GitHub Actions workflow is here:

```text
.github/workflows/build-nri-cleanup-apk.yml
```

It builds a debug APK automatically when:

- code is pushed to `codex/nri-cleanup-android-apk`
- the workflow is run manually from GitHub Actions
- the draft PR is updated

The workflow:

1. checks out the repo
2. sets up Node.js
3. sets up Java for Android
4. sets up Android SDK
5. installs npm dependencies
6. generates the simple `NC` icon/splash source assets
7. generates the Android project with Capacitor
8. generates Android launcher icon/splash assets
9. syncs Capacitor Android
10. builds the debug APK
11. uploads the APK as a GitHub Actions artifact

Artifact name:

```text
nri-cleanup-desk-debug-apk
```

APK path inside the artifact:

```text
app-debug.apk
```

Original build path in CI:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## How to download the APK from GitHub Actions

Use this when you want the actual APK file without building anything on your laptop.

1. Go to the GitHub repo:

```text
https://github.com/blackdoc3/nakshatrapardeshi.com
```

2. Open the **Actions** tab.

3. Click the latest workflow run named:

```text
Build NRI Cleanup Desk Debug APK
```

4. Make sure the run has a green tick / successful status.

5. Scroll down to **Artifacts**.

6. Download:

```text
nri-cleanup-desk-debug-apk
```

7. GitHub will usually download it as a ZIP file.

8. Unzip the downloaded file.

9. Inside, find:

```text
app-debug.apk
```

10. Transfer `app-debug.apk` to your Android phone.

11. Tap the APK file on your phone and install it.

## Exact steps to install APK on Android phone

1. Download the artifact from GitHub Actions.
2. Unzip it if GitHub downloaded a ZIP file.
3. Find:

```text
app-debug.apk
```

4. Send it to your Android phone using USB cable, Google Drive, email, WhatsApp to yourself, or nearby share.
5. On your Android phone, tap `app-debug.apk`.
6. Android may say installation from this source is not allowed. This is normal for a debug APK.
7. Tap **Settings**.
8. Turn on **Allow from this source** for the app you used to open the APK, for example Files, Chrome, Gmail, or Drive.
9. Go back and tap **Install**.
10. Open **NRI Cleanup Desk**.
11. Make sure your phone has internet, because this MVP loads the live website.

## How to test the app

Use this checklist after installing the APK:

- [ ] App opens on Android.
- [ ] Page loads correctly.
- [ ] CTA scrolls to intake.
- [ ] Form can be completed.
- [ ] Score gauge updates.
- [ ] Score band appears.
- [ ] Recommended product appears.
- [ ] Copy summary works.
- [ ] Email summary opens email app.
- [ ] WhatsApp summary opens WhatsApp or browser fallback.
- [ ] Legal/footer sections are visible.
- [ ] No unnecessary permissions are requested.
- [ ] App works on a normal Android phone screen.

Also check permissions:

- [ ] The app does not ask for camera.
- [ ] The app does not ask for microphone.
- [ ] The app does not ask for contacts.
- [ ] The app does not ask for storage/files.
- [ ] The app does not ask for location.
- [ ] The app does not ask for SMS.
- [ ] The app does not ask for phone permission.

The live-wrapper app only needs internet access to load the website.

## What tools you need locally

If you download the APK from GitHub Actions, you do **not** need Android Studio just to install and test the APK.

You only need:

- a GitHub account with access to the repo
- an Android phone
- internet on your phone

You need Android Studio only if you want to build the APK yourself on your laptop or create a signed release APK/AAB later.

## Optional: build the debug APK locally

Install these once on your laptop:

1. Git
2. Node.js LTS
3. Android Studio

Then run:

```bash
git clone https://github.com/blackdoc3/nakshatrapardeshi.com.git
cd nakshatrapardeshi.com
git checkout codex/nri-cleanup-android-apk
npm install
npm run assets:create
npm run cap:add:android
npm run assets:generate
npm run cap:sync
npm run cap:open
```

Then in Android Studio:

1. Click **Build**.
2. Click **Build Bundle(s) / APK(s)**.
3. Click **Build APK(s)**.
4. Wait for the build to finish.
5. Click **Locate**.

Local debug APK path:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

You can also try command-line build after Android is generated:

```bash
npm run android:debug
```

## Debug APK vs release APK

### Debug APK

A debug APK is okay for personal testing.

Use it to:

- install on your own Android phone
- test the MVP
- show a few trusted people manually

Do not treat the debug APK as a polished public release.

### Release APK / AAB

A signed release APK is needed for wider direct distribution.

If you publish to Google Play later, you will probably need an Android App Bundle (`.aab`) instead of only an APK.

For release, create your own private signing key/keystore in Android Studio and keep it safe.

Never share or commit:

- `.jks` files
- `.keystore` files
- signing key passwords
- keystore passwords
- `key.properties`
- release signing files

The `.gitignore` blocks common signing-key files, but you must still be careful.

## Android Studio signed release instructions for later

Use this only after the debug APK works.

1. Run:

```bash
npm run cap:open
```

2. In Android Studio, click **Build**.
3. Click **Generate Signed Bundle / APK**.
4. Choose **Android App Bundle** for Google Play, or **APK** for direct sharing.
5. Click **Next**.
6. Click **Create new...** under key store path.
7. Save the keystore outside the repo, for example:

```text
Documents/android-signing/nri-cleanup-desk.jks
```

8. Create a strong password and save it in your password manager.
9. Use an alias like:

```text
nri-cleanup-desk
```

10. Set validity to a long period, for example 25 years.
11. Fill in your name/organisation details.
12. Click **OK**.
13. Choose the **release** build variant.
14. Click **Create** or **Finish**.
15. Save the signed output safely.

Important: if you lose the signing key, future updates may become difficult or impossible depending on how you distribute the app.

## Common problems

### Workflow did not run

Go to the PR branch and push a tiny commit, or open **Actions > Build NRI Cleanup Desk Debug APK > Run workflow** if the workflow is available there.

Note: GitHub manual workflow runs may only appear reliably once the workflow exists on the default branch. The push trigger is the main build path for this draft PR branch.

### No artifact appears

Open the workflow run and check whether it has a green tick. Artifacts appear only after the build succeeds.

### APK downloads as ZIP

That is normal. Unzip it and install `app-debug.apk`.

### Phone blocks installation

Allow installs from the app you used to open the APK, such as Files, Gmail, Drive, or Chrome.

### App opens but page does not load

Check phone internet and open this URL in Chrome on the same phone:

```text
https://www.nakshatrapardeshi.com/nri-cleanup/
```

### WhatsApp opens browser instead of WhatsApp

Install WhatsApp, make sure you are logged in, and try again. The `wa.me` link can also fall back to the browser.

### Email summary does not open email app

Install Gmail or Outlook and make sure an email account is added.

## Notes for future improvements

This MVP is good for private testing and early user feedback.

Before wide public distribution or Google Play publishing, consider:

- packaging the static page locally instead of using `server.url`
- turning the web page into a proper PWA
- creating a production-ready Android project with committed native files
- reviewing Google Play policies for apps that mainly wrap websites
- reviewing legal/privacy wording with a qualified professional

Do not add backend, database, login, payment, document upload, or regulated advice features unless you intentionally redesign the product scope.
