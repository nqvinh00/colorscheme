# ----------- Step 1: Build Frontend -----------
FROM node:23.2.0-alpine AS frontend

WORKDIR /app/client

# Copy only package files first for better caching
COPY client/package.json client/package-lock.json ./

# Use npm ci for clean, reproducible installs (requires lockfile)
RUN npm ci

# Copy the rest of the frontend source
COPY client/ ./

RUN npm run build

# ----------- Step 2: Build Backend -----------
FROM golang:1.23.0-alpine AS backend

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .    
COPY --from=frontend /app/client/dist ./client/dist

RUN go build -o server main.go

# ----------- Step 3: Final Image -----------
FROM gcr.io/distroless/static-debian12

COPY --from=backend /app/server .
COPY --from=backend /app/client/dist ./client/dist
COPY --from=backend /app/config.yaml ./config.yaml
CMD ["/server"]

EXPOSE 8080