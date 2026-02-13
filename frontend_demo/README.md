# ERPNext Manufacturing Demo (Frontend)

This is a standalone frontend application built with Vue 3, Vite, and Tailwind CSS to demonstrate the key manufacturing features of ERPNext (Items, Work Orders).

## Features

-   **Dashboard**: Overview of manufacturing metrics.
-   **Item Master**: CRUD operations for managing items (Raw Materials, Sub Assemblies, Finished Goods).
-   **Work Orders**: Manage production orders with status workflow (Pending -> In Progress -> Completed).
-   **Responsive Design**: Mobile-friendly layout.
-   **Local Persistence**: Data is stored in `localStorage` so changes persist across refreshes.

## Development

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run development server:
    ```bash
    npm run dev
    ```

## Deployment (Netlify)

This project is configured for Netlify deployment.

1.  Connect your repository to Netlify.
2.  Set the **Base directory** to `frontend_demo`.
3.  Set the **Build command** to `npm run build`.
4.  Set the **Publish directory** to `frontend_demo/dist`.

Alternatively, use the `netlify.toml` configuration included in this directory.
