# 🎨 ColorScheme

A full-stack web application for creating, previewing, and sharing terminal color schemes.  
Built with **React + TypeScript + Tailwind CSS** on the frontend and **Go (Gin)** on the backend.
Demo: https://colorscheme.onrender.com/

---

## Features

- 🌈 **Live Preview**: Instantly see your color scheme in a terminal and code editor preview.
- 🖌️ **Custom Schemes**: Create, clone, and manage your own color schemes.
- 🔒 **Authentication**: Register and log in to save your schemes.
- 🗂️ **API**: RESTful endpoints for user and color scheme management.
- 🚀 **Stack**: Vite, React, Tailwind CSS, Shiki (syntax highlighting), Gin, PostgreSQL.

---

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/colorscheme.git
cd colorscheme
```

---

### 2. Backend Setup (Go)

#### Install dependencies

```sh
go mod tidy
```

#### Configure

- Copy or edit `config.yaml` for your environment (DB, JWT secret, port, etc).

#### Run the server

```sh
go run main.go
```

The backend will serve the API at `http://localhost:<port>/api` and static frontend files from `./client/dist`.

---

### 3. Frontend Setup (React + Vite)

```sh
cd client
npm install
npm run dev
```

- The dev server runs at `http://localhost:5173` (or as configured).
- For production, build with `npm run build` and serve with the Go backend.

---

## API Endpoints

- `POST /api/register` — Register a new user
- `POST /api/login` — Login and receive JWT
- `GET /api/color-schemes` — Get all color schemes (auth required)
- `GET /api/color-schemes/:id` — Get a color scheme by ID (auth required)
- `POST /api/color-schemes` — Create a new color scheme (auth required)

---

## Project Structure

```
|-- main.go # Gin server entrypoint
├── client/ # Frontend (React + Vite + Tailwind)
├── handlers/ # HTTP request handlers
├── repository/ # Data access layer
├── pkg/ # Utilities (db, config, log, etc)
├── db/ Data source
├── config.yaml # App configuration

```

---

## Customization

- **Color Schemes**: Easily add or modify color schemes in the UI.
- **Syntax Highlighting**: Uses Shiki for VS Code-quality code previews.
- **Terminal Preview**: See your scheme in a realistic terminal window.

---

## Development

- **Linting**:
  ```sh
  npm run lint
  ```
- **Type Checking**:
  ```sh
  npm run type-check
  ```
- **Formatting**:
  ```sh
  npx prettier --write .
  ```
