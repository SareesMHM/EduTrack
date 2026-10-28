# Deployment
1. Create migrations (`prisma migrate dev --name init`) and commit them.
2. Tag `vX.Y.Z`; `deploy.yml` builds and pushes three images to GHCR, then SSHes to the host (secrets: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_KEY`) and runs `docker compose pull && up -d && prisma migrate deploy`. Adapt to your host; `/opt/edutrack/docker-compose.yml` must reference the pushed images.
3. Production env: strong unique secrets, `NODE_ENV=production`, `ENV=production` for ml-service (disables training endpoint), HTTPS in front (Caddy/nginx), `CLIENT_URL` set to the real origin, build the client with `VITE_API_URL` pointing at the public API.
4. Back up the Postgres volume and the uploads volume.
