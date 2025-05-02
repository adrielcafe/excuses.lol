# excuses.lol

## Setup and Running Locally

1.  **Clone the repository (if you haven't already):**

    ```bash
    git clone https://github.com/adrielcafe/excuses.lol
    cd excuses.lol
    ```

2.  **Install dependencies:**
    Make sure you have Node.js and npm installed.

    ```bash
    npm install
    ```

3.  **Run the development server:**
    This will start a local development server, usually at `http://localhost:5173`.
    ```bash
    npm run dev
    ```

## Building for Production (Static Site Generation)

To generate the static site files (for deployment on platforms like GitHub Pages):

1.  **Build the project:**

    ```bash
    npm run build
    ```

    This command will create a `dist` directory containing the optimized static assets (`index.html`, CSS, JavaScript).

2.  **Preview the build locally (optional):**
    ```bash
    npm run preview
    ```

## Deployment to GitHub Pages

```bash
npm run publish
```
