# ⏰ Mellow Visual Timer

[![ko1](https://img.shields.io/badge/Nomad%20Coders%20커뮤니티-Visual%20Timer%20소개-4A7658)](https://nomadcoders.co/community/thread/10687)
[![ko2](https://img.shields.io/badge/Velog%20포스트-Visual%20Timer%20--%20쉽고%20간단하게%20시각적으로%20시간%20관리하기-9079C9)](https://velog.io/@do0ori/Visual-Timer-쉽고-간단하게-시각적으로-시간-관리하기)

**Mellow Visual Timer** is a user-friendly, customizable web-based timer application designed to help users efficiently manage their time. It features a **base timer**, a **timer list** for creating predefined timers (basic timers), and a **routine timer** to sequentially execute timers—making it perfect for techniques like the Pomodoro method. The app also provides focus statistics, shareable achievement cards, customizable themes, and flexible timer and sound settings.

## 🛠️ Usage

👉 [**Try it out**](https://do0ori.github.io/visual-timer) | Experience Mellow Visual Timer and take control of your time effectively!

[![visual-timer-UI-Design](https://github.com/user-attachments/assets/23eabb3c-1689-4492-b051-e5d7fd53f28b)](https://do0ori.github.io/visual-timer)

1. **Set the Timer**:
    - Use the **unit toggle button** to switch between **minutes** and **seconds**.
    - **Drag** on the clock face or **click** to set your desired time quickly and easily.
2. **Create Your Own Timers**:
    - Save your frequently used timers as **Basic Timers** in the **Timer List**.
    - Combine multiple Basic Timers into a **Routine Timer** for sequential execution, then edit, reorder, or remove its individual steps.
3. **Start the Timer**:
    - Press the **Play** button and watch the timer progress in real-time.
    - The timer will continue running even if you switch tabs or minimize the app.
4. **Stay Notified**:
    - A **popup notification** and **alarm sound** will alert you when the timer finishes.
    - Set a preset or uploaded audio file, then adjust its volume in **Timer & Sound** settings.
5. **Track Your Focus**:
    - Review today's focus time, seven-day total, completed session history, and current streak.
    - Download a shareable daily achievement card from **Focus Stats & Share** settings.
6. **Switch Between Modes**:
    - The app automatically optimizes its layout for both **portrait** and **landscape** modes.

## ✨ Key Features

### 1. **Base Timer (Default Timer)**

-   Quickly set a timer by **dragging and clicking** on the clock interface.
-   Ideal for simple, immediate use without additional setup.

### 2. **Customizable User Timers**

-   **Basic Timer**
    -   Create single timers with predefined durations and custom colors.
-   **Routine Timer**
    -   Group multiple Basic Timers to run sequentially.
    -   Add, edit, reorder, or remove individual timer steps, including each step's duration, color, and alarm interval.
    -   Start a routine once or enable repeat mode while it runs.
    -   **Use cases**:
        -   Pomodoro sessions (e.g., 50-minute focus + 10-minute break).
        -   Workout routines with different exercises and rest periods.
        -   Extending beyond the default 60-minute limit by chaining timers together.

### 3. **Focus Stats & Share Cards**

-   Automatically records completed focus sessions.
-   View today's focused time, a seven-day total, session history, and day streaks.
-   Generate a shareable daily achievement card for social media.

### 4. **Customizable Themes**

-   Choose from five built-in themes:
    -   **Beige Green**
    -   **Gray Purple**
    -   **Black Green**
    -   **Sky Blue**
    -   **Lovely Pink**
-   Adjust the color of the timer disk independently for a personalized look.
-   It is also possible to create your own custom themes.

### 5. **Customizable Timer & Sound Settings**

-   Set the timer direction to clockwise or counter-clockwise from one settings tab.
-   Choose a preset alarm tone, control its volume, or upload a custom audio file.

### 6. **Screen Wake Lock**

-   Prevents the screen from turning off while the timer is running, ensuring uninterrupted visibility during tasks like workouts or study sessions.

### 7. **Background Functionality with Notifications**

-   Even when the app is in the background, the timer continues to function.
-   Notifications provide real-time updates on the remaining time or when the timer finishes.

### 8. **Intuitive and Familiar Controls**

-   Close the timer using the **ESC key** or cancel actions with the **back button**—supporting both web and app-like usage.

### 9. **Optimized for Both Portrait and Landscape Modes**

-   Automatically adjusts the layout based on device orientation for a more user-friendly experience.

### 10. **PWA Support for Web and Mobile**

-   Fully functional on both web and mobile platforms.

    <details>

    <summary><strong>Install as a web app</strong> for an app-like experience on desktop and mobile devices.</summary>

    -   On **desktop**, click the monitor icon in the address bar on Chrome to install.
        ![](https://velog.velcdn.com/images/do0ori/post/e6511118-a852-4715-adbb-ab95ea089d40/image.png)
    -   On **mobile**, a prompt will appear automatically to install the app:
        ![](https://velog.velcdn.com/images/do0ori/post/964a854d-8575-482e-a554-bc37c5f0029f/image.png)
        -   If not, use the menu (three dots) to find the mobile icon with "Install App" or "Add to Home Screen" option:
            ![](https://velog.velcdn.com/images/do0ori/post/ee7afc63-dcc0-4695-9685-3ad292326d04/image.jpg)

    </details>

## 🌐 Browser Compatibility

| Browser                                                                                                                              | Support |
| ------------------------------------------------------------------------------------------------------------------------------------ | :-----: |
| <img alt="Chrome logo" src="https://www.google.com/chrome/static/images/chrome-logo.svg" width="16"> Chrome                          |    ○    |
| <img alt="Edge logo" src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Microsoft_Edge_logo_%282019%29.png" width="16"> Edge   |    ○    |
| <img alt="Firefox logo" src="https://github.com/user-attachments/assets/a8d5ba30-7372-47ed-b6a9-3e3495330882" width="16"> Firefox    |    ○    |
| <img alt="Android logo" src="https://upload.wikimedia.org/wikipedia/commons/3/31/Android_robot_head.svg" width="16"> WebView Android |    ○    |
| <img alt="Safari logo" src="https://github.com/user-attachments/assets/e2fc20ce-c6eb-4f71-b137-df4357a56984" width="16"> iOS Safari  |    △    |

※ [For more information](https://github.com/do0ori/visual-timer/issues/4)

## 💻 Technology Stack

<p>
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white">
    <img src="https://img.shields.io/badge/Typescript-2d79c7?style=for-the-badge&logo=Typescript&logoColor=white">
    <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white">
    <img src="https://img.shields.io/badge/Tailwind CSS-131729?style=for-the-badge&logo=tailwindcss&logoColor=78baf2">
    <img src="https://img.shields.io/badge/Zustand-494237?style=for-the-badge&logo=React">
    <img src="https://img.shields.io/badge/PWA-vite--plugin--pwa-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white">
</p>

-   **UI & routing:** React 18, React Router 7, Headless UI, React Icons
-   **State & forms:** Zustand 5, React Hook Form
-   **Build & styling:** Vite 6, TypeScript 5, Tailwind CSS 3
-   **Offline support:** Vite PWA and Workbox

## 📦 Setup and Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/do0ori/visual-timer.git
    ```

2. Navigate to the project folder and install dependencies:

    ```bash
    cd visual-timer
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Create a production build or preview it locally:

    ```bash
    npm run build
    npm run preview
    ```

## 🤝 Contributions

Contributions are welcome! To contribute:

1. **Fork** the repository.
2. Create a new **branch** for your feature/bug fix.
3. Submit a **pull request** with a clear description of your changes.

Feel free to open [issues](https://github.com/do0ori/visual-timer/issues) for bug reports or feature suggestions.

## Release History

- **v0.3.0:** Vite migration, focus stats, custom alarm audio, unified settings, updated themes, and version information.
- **v0.4.0:** A streamlined Routine Timer editing flow with clearer step creation, inline editing, reordering, deletion, context-aware timer creation, and compact timer cards.
