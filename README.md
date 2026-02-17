## Expense Tracker (Expo + Firebase)

An expense tracking mobile app built with **Expo** and **React Native** where users can track their spending, organize expenses by category, and view insightful summaries of where their money goes. The app uses **Firebase Authentication** and **Cloud Firestore** as the backend, with real‑time updates and a modern, theme‑aware UI.

### Features

- **Authentication**
  - Email/password signup and login
  - Google sign‑in (web)
  - Onboarding flow for new users
  - Persistent auth state via Firebase

- **Expense Management**
  - Add new expenses with title, amount, and category
  - View a list of recent expenses
  - Category‑based organization (Food, Transport, Entertainment, Shopping, Bills, Others, etc.)
  - Real‑time updates using Firestore listeners

- **Analytics & Summary**
  - Total spending overview (e.g. weekly/monthly)
  - Category‑wise spending breakdown
  - Percentage calculations per category
  - Visual summary using charts (pie chart via `react-native-chart-kit`)

- **Groups (UI)**
  - Group expense / split bill interface (currently powered by mock/dummy data)
  - Group stats and member avatars
  - Active / inactive group filtering in the UI

- **Profile & Settings**
  - User profile screen
  - Dark / Light theme toggle
  - Settings and account actions (including logout)

- **UI/UX**
  - Dark mode support
  - Blur / glassmorphism effects
  - Gradient backgrounds
  - Custom bottom tab bar with animated icons and labels

### Tech Stack

- **Framework & Platform**
  - Expo SDK 54
  - React Native 0.81.5
  - React 19.1.0
  - Expo Router (file‑based routing)

- **State & Architecture**
  - React Context API for authentication and theming
  - Custom hooks (`useAuth`, `useTheme`, etc.)
  - Feature‑oriented folder structure (services, components, utils, css)
  - SOLID‑friendly separation of concerns (UI components, services, context, and utilities are clearly separated)

- **Backend & Data**
  - Firebase Authentication (email/password, Google)
  - Cloud Firestore for expenses and user profiles

- **UI Libraries**
  - `expo-linear-gradient` for gradients
  - `expo-blur` for blur / glass effects
  - `@expo/vector-icons` for icons
  - `react-native-chart-kit` for charts
  - `@react-native-picker/picker` and other React Native UI primitives

- **Tooling**
  - TypeScript
  - ESLint with `eslint-config-expo`

### Project Structure

High‑level layout of the project:

```text
expense_tracker-frontend/
├── app/                     # Expo Router entry + screens
│   ├── (auth)/              # Auth flow (onboarding, login, signup)
│   ├── (tabs)/              # Protected tabs: home, add expense, summary, groups, profile
│   │   ├── _layout.tsx      # Custom bottom tab navigator and theming
│   │   ├── index.tsx        # Home (recent expenses)
│   │   ├── add-expense.tsx  # Add expense form
│   │   ├── summary.tsx      # Analytics / summary screen
│   │   ├── groups.tsx       # Groups (UI using mock data)
│   │   └── profile.tsx      # Profile & settings
│   ├── _layout.tsx          # Root layout, providers (auth, theme, etc.)
│   └── index.tsx            # Entry screen / redirects
│
├── src/
│   ├── components/          # Reusable, presentation‑only components
│   ├── context/             # React contexts (auth, theme)
│   ├── hooks/               # Custom hooks (auth, theme colors, color scheme)
│   ├── services/            # Firebase integration (auth, expenses, user)
│   ├── utils/               # Pure utilities (category metadata, stats, theme colors)
│   ├── css/                 # Screen‑specific style objects
│   └── constants/           # Legacy / shared constants
│
├── assets/                  # Images, icons, fonts
├── app.json                 # Expo configuration
├── package.json             # Scripts and dependencies
├── tsconfig.json            # TypeScript configuration
└── eslint.config.js         # Linting configuration
```

### Frontend ↔ Backend Integration

This project does **not** use a custom REST API server. All backend functionality is provided by **Firebase**:

- **Authentication**
  - Firebase Authentication handles user sign‑up, login, logout, and Google sign‑in.
  - The `AuthContext` wraps Firebase auth methods and exposes them to the UI via custom hooks.

- **Data (Expenses & Users)**
  - Cloud Firestore stores:
    - `expenses` documents with fields like `userId`, `title`, `amount`, `category`, `createdAt`.
    - `users` documents for user profiles (uid, email, name, provider, createdAt, etc.).
  - Service modules (e.g. `src/services/expense.ts`, `src/services/user.ts`) encapsulate Firestore reads/writes and listeners, keeping UI components simple and following SOLID principles.
  - Real‑time updates use Firestore `onSnapshot` listeners so expense lists update automatically.

### Environment Variables

Firebase configuration is injected via environment variables (loaded by Expo):

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Create a `.env` file in the project root and fill these with your Firebase project values (never commit real secrets to public repos).

### Getting Started

#### Prerequisites

- Node.js (v18+ recommended)
- `npm` or `yarn`
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your device **or** an Android emulator / iOS simulator

#### Installation

```bash
# install dependencies
npm install
```

#### Running the App

```bash
# start the Expo development server
npm start

# or run on a specific platform
npm run android
npm run ios
npm run web
```

Scan the QR code with the Expo Go app or open the project in an emulator/simulator to use the app.

#### Linting

```bash
npm run lint
```

### Notes

- The **Groups** screen currently uses mock data and serves as a UI/UX preview for future group‑expense features.
- The theme system (light/dark) is centralized in a theme context and utility functions; all screens should use theme‑aware values from the theme utilities instead of hard‑coded colors.
- The codebase is organized with clear separation between **UI components**, **context/state**, **services (Firebase)**, and **pure utilities** to keep the implementation maintainable and aligned with SOLID principles.

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
