
# GWD Kollam Dashboard

This is the GWD Kollam Dashboard project, built with Next.js, Tailwind CSS, ShadCN UI, Firebase, and Genkit.

## Getting Started

First, ensure you have Node.js and npm installed.

Then, to run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Firebase Setup
1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
2. Register a web app in your Firebase project settings.
3. Copy your Firebase config object.
4. Replace the placeholder values in `src/lib/firebase.ts` with your actual Firebase project configuration.
5. In the Firebase console, go to Authentication > Sign-in method and enable the Email/Password provider.
6. Ensure your Firebase project is on the Blaze (pay-as-you-go) plan for App Hosting.

## Genkit Setup
To run Genkit flows locally for development (e.g., for AI features):
```bash
npm run genkit:dev
```
This usually starts on port 4000 or similar. Check the Genkit CLI output.

## Deployment
This project is configured for Firebase App Hosting.
1. Install the Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase in your project directory (if not already done): `firebase init` (select Hosting, link to your project). Ensure `firebase.json` uses App Hosting rewrites.
4. Build the project: `npm run build`
5. Deploy: `firebase deploy --only hosting`

