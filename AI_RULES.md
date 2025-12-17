# AI Studio Application Rules

This document outlines the core technologies and best practices for developing within this application.

## Tech Stack Overview

1.  **React & TypeScript:** The application is built using React for its component-based UI architecture, with TypeScript providing strong typing for improved code quality and maintainability.
2.  **Tailwind CSS:** All styling is handled using Tailwind CSS, a utility-first CSS framework, for rapid and consistent UI development.
3.  **Google Gemini API:** AI functionalities, such as generating daily insights and chat responses, are powered by the Google Gemini API via the `@google/genai` library.
4.  **Three.js:** Complex 3D scenes and animations, like the `TempleScene`, are rendered using the Three.js library.
5.  **Vite:** The project uses Vite as its build tool, offering a fast development server and optimized builds.
6.  **Local Storage:** User profiles, habits, and book progress are persisted client-side using the browser's `localStorage`.
7.  **Web Speech API:** Text-to-speech capabilities within the Library component leverage the native Web Speech API.
8.  **shadcn/ui & Radix UI:** A collection of pre-built, accessible UI components from shadcn/ui (which is built on Radix UI) is available for use.
9.  **Lucide React:** A comprehensive icon library, `lucide-react`, is installed and should be used for all iconography.

## Library Usage Guidelines

*   **UI Components:**
    *   For new UI elements, prioritize using components from the **shadcn/ui** library.
    *   If a specific shadcn/ui component doesn't fit the need, create custom components using **React** and style them with **Tailwind CSS**.
    *   Avoid creating new components within existing files; always create a new file for each new component.
*   **Styling:**
    *   Exclusively use **Tailwind CSS** classes for all styling. Avoid inline styles or custom CSS files unless absolutely necessary for specific animations or global overrides.
*   **AI Interactions:**
    *   All communication with AI models must be done through the **`@google/genai`** library, as demonstrated in `services/geminiService.ts`.
*   **3D Graphics:**
    *   Any 3D rendering or complex visual effects should utilize **Three.js**.
*   **State Management:**
    *   For component-level and global application state, use **React's `useState` and `useEffect` hooks**.
    *   For client-side data persistence, use **`localStorage`**.
*   **Routing:**
    *   The application should use **React Router** for navigation, with routes defined and managed within `src/App.tsx`.
*   **Icons:**
    *   Use icons from the **`lucide-react`** package. Avoid using inline SVGs or emojis for new icons.
*   **Dependencies:**
    *   Before adding new npm packages, check if existing libraries can fulfill the requirement. If a new dependency is needed, ensure it's lightweight and well-maintained.