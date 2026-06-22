# TaskManager

A small Expo React Native app for managing personal tasks.

## What is implemented

- Task list with empty, loading, and API error states
- Add a task with title and description validation
- Mark tasks as completed or active
- Delete tasks
- Task details screen with Expo Router navigation
- Search by task title
- Filter by all, active, or completed tasks
- Local persistence for user-created tasks
- Public API fetch for a small task tip
- Reusable task form, task card, and filter components

## Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npx expo start
```

Then open the app with Expo Go, an Android emulator, an iOS simulator, or the web option from the Expo CLI.

## Notes

The app uses Expo SDK 56, React Native 0.85, TypeScript, functional components, and hooks. Tasks are saved locally with the `expo-sqlite` localStorage polyfill, so user-created tasks are restored after closing and reopening the app. The public API requirement is covered by a small tip fetched from `https://api.adviceslip.com/advice`; it does not create tasks automatically.

## Screenshots

Screenshots can be captured from the local development server after running the app.
