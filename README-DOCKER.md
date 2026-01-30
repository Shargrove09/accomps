# Docker Deployment Guide for Accomplishments Tracker

This guide explains how to deploy the **agent service** using Docker while keeping the Next.js frontend on Vercel. The agent runs locally with Ollama for AI-powered accomplishment parsing and is exposed to Vercel via Cloudflare Tunnel.

## Architecture Overview

```
Email → Resend Webhook
              ↓
         Vercel (Next.js App)
              ↓
         Cloudflare Tunnel (in Docker)
              ↓
         Agent Service (FastAPI + Ollama in Docker)
              ↓
         Database (PostgreSQL - managed service)
```

## Prerequisites

- **Docker Desktop** installed and running (with WSL2 on Windows)
- **Cloudflare account** (free tier is sufficient)
- **Vercel deployment** of the Next.js app
- **At least 4GB RAM** available for Docker containers
- **10GB disk space** for Ollama model storage

## Quick Start

### 1. Set Up Cloudflare Tunnel (One-Time Setup)

#### a. Install cloudflared CLI

**Windows:**

```powershell
winget install cloudflare.cloudflared
```

**macOS:**

```bash
brew install cloudflared
```

**Linux:**

```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

#### b. Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

This opens a browser. **Select your domain** (or skip if using auto-generated URL) and authorize.

#### c. Create a named tunnel

```bash
cloudflared tunnel create accomps-agent
```

This generates credentials at `~/.cloudflared/<tunnel-id>.json`. Note the tunnel ID from the output.

#### d. Copy tunnel credentials to project

```bash
# Create cloudflared directory (already exists with config template)
# Copy credentials file
cp ~/.cloudflared/<tunnel-id>.json ./cloudflared/credentials.json
```

**Windows (PowerShell):**

```powershell
Copy-Item "$env:USERPROFILE\.cloudflared\<tunnel-id>.json" -Destination ".\cloudflared\credentials.json"
```

#### e. Create tunnel configuration

```bash
# Copy template and edit
cp cloudflared/config.yml.example cloudflared/config.yml
```

Edit `cloudflared/config.yml` and replace `<TUNNEL-ID>` with your actual tunnel ID:

```yaml
tunnel: abc123-your-tunnel-id-here
credentials-file: /etc/cloudflared/credentials.json

ingress:
  - service: http://agent:8000
```

#### f. Route DNS to tunnel (optional - for custom domain)

If you want to use a custom domain like `agent.yourdomain.com`:

```bash
cloudflared tunnel route dns accomps-agent agent.yourdomain.com
```

Otherwise, your tunnel URL will be `https://<tunnel-id>.cfargotunnel.com`.

#### g. Get your tunnel URL

To find your tunnel URL:

```bash
cloudflared tunnel info accomp-agent
```

Or it will be displayed when you start the Docker containers in the next section.

---

### 2. Configure Environment Variables

#### a. Create local .env file

```bash
cp .env.example .env
```

Edit `.env` and set:

```bash
# Must match the AGENT_API_KEY in Vercel
AGENT_API_KEY=your-secure-random-key-here

# Ollama model (default is fine for most users)
OLLAMA_MODEL=llama3.2:3b

# Port (default is fine)
PORT=8000
```

**Generate a secure API key:**

```bash
# On Linux/macOS
openssl rand -hex 32

# On Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

#### b. Update Vercel environment variables

In your **Vercel dashboard** → Project Settings → Environment Variables, add/update:

```bash
AGENT_EMAIL_URL=https://<your-tunnel-url>/api/parse-message
AGENT_SMS_URL=https://<your-tunnel-url>/api/parse-message
AGENT_API_KEY=same-key-as-local-env
```

Replace `<your-tunnel-url>` with your Cloudflare Tunnel URL (e.g., `abc123.cfargotunnel.com` or `agent.yourdomain.com`).

**Redeploy** Vercel app to pick up new environment variables.

---

### 3. Start Docker Containers

#### Production Mode (recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

**First-time startup:**

- Ollama will download the `llama3.2:3b` model (~1.9GB) - takes 2-5 minutes
- Agent will wait for Ollama to be healthy before starting
- Cloudflared tunnel will connect once agent is ready

#### Development Mode (with hot reload)

```bash
# Start with dev overrides
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# This enables:
# - Live code reloading for agent changes
# - Debug logging
# - Volume mounts for easy development
```

---

### 4. Verify Everything Works

#### a. Check Docker services

```bash
docker-compose ps
```

All services should show "Up" and "healthy".

#### b. Test agent health endpoint

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{ "status": "ok", "model": "llama3.2:3b" }
```

#### c. Test tunnel connectivity

```bash
curl https://<your-tunnel-url>/health
```

Should return the same health response.

#### d. Test agent parsing (local)

```bash
curl -X POST http://localhost:8000/api/parse-message \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key-here" \
  -d '{"input": "Completed code review for authentication PR", "source": "test"}'
```

Expected response with parsed accomplishment structure.

#### e. Send test email

Send an email to your Resend inbound address. Check:

- Vercel function logs (should show agent call)
- Docker logs: `docker-compose logs agent`
- Database for new accomplishment entry

---

## Maintenance

### Stop containers

```bash
docker-compose down
```

### Update agent code

```bash
# Rebuild agent image
docker-compose build agent

# Restart with new image
docker-compose up -d
```

**Note:** The agent uses [uv](https://github.com/astral-sh/uv)

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f agent
docker-compose logs -f ollama
docker-compose logs -f cloudflared
```

### Update Ollama model

```bash
# Enter ollama container
docker-compose exec ollama bash

# Pull new model
ollama pull llama3.2:3b

# Or switch models
ollama pull llama3.1:8b

# Exit container
exit

# Update .env with new model name
# Restart agent
docker-compose restart agent
```

### Backup Ollama models

```bash
# Create backup of models volume
docker run --rm -v accomps_ollama-models:/data -v $(pwd):/backup \
  ubuntu tar czf /backup/ollama-models-backup.tar.gz -C /data .

# Restore from backup
docker run --rm -v accomps_ollama-models:/data -v $(pwd):/backup \
  ubuntu tar xzf /backup/ollama-models-backup.tar.gz -C /data
```

---

## Troubleshooting

### Agent can't connect to Ollama

**Symptom:** Agent logs show connection errors to Ollama

**Solution:**

```bash
# Check Ollama is running
docker-compose ps ollama

# Check Ollama health
docker-compose exec ollama ollama list

# Verify model is downloaded
docker-compose exec ollama ollama list | grep llama3.2
```

### Cloudflare Tunnel not connecting

**Symptom:** `cloudflared` container keeps restarting

**Solution:**

```bash
# Check tunnel logs
docker-compose logs cloudflared

# Common issues:
# 1. Missing credentials.json file
# 2. Wrong tunnel ID in config.yml
# 3. Credentials file not readable (permissions)

# Verify credentials exist
ls -la cloudflared/credentials.json

# Verify config is correct
cat cloudflared/config.yml
```

### Vercel can't reach agent

**Symptom:** Email webhooks fail with connection timeout

**Solution:**

1. Verify tunnel is running: `docker-compose ps cloudflared`
2. Test tunnel URL from external location: `curl https://<tunnel-url>/health`
3. Check Vercel env vars match tunnel URL
4. Verify API key matches between Vercel and local `.env`
5. Check Cloudflare dashboard for tunnel status

### Out of memory

**Symptom:** Ollama container crashes or is very slow

**Solution:**

```bash
# Check Docker Desktop resource limits
# Increase memory to at least 4GB

# For smaller model (uses less RAM):
# Edit .env
OLLAMA_MODEL=llama3.2:1b

# Restart
docker-compose down
docker-compose up -d
```

### Port already in use

**Symptom:** Error binding to port 8000

**Solution:**

```bash
# Find process using port 8000
# Windows (PowerShell)
Get-NetTCPConnection -LocalPort 8000

# macOS/Linux
lsof -i :8000

# Kill the process or change port in .env
PORT=8001

# Restart containers
docker-compose down
docker-compose up -d
```

---

## Advanced Configuration

### Using GPU acceleration (Linux with NVIDIA GPU)

Edit `docker-compose.yml`, add to `ollama` service:

```yaml
services:
  ollama:
    # ... existing config ...
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
```

Requires `nvidia-docker` runtime installed.

### Custom domain with SSL

Cloudflare Tunnel automatically provides SSL. To use a custom domain:

1. Add domain to Cloudflare DNS
2. Run: `cloudflared tunnel route dns accomps-agent agent.yourdomain.com`
3. Update Vercel env vars with custom domain
4. SSL is handled automatically by Cloudflare

### Running on server/VPS instead of local machine

Same setup, but:

- Use persistent storage for volumes
- Set up automatic startup via systemd
- Configure firewall to allow Docker
- Consider using `docker-compose.prod.yml` with additional security

---

## Windows-Specific Notes

### WSL2 Backend

Docker Desktop on Windows uses WSL2. For best performance:

1. Store project files in WSL2 filesystem (not Windows `/mnt/c/`)
2. Access via: `\\wsl$\Ubuntu\home\username\accomps`

### File Permissions

Windows file permissions can cause issues. If you get permission errors:

```powershell
# Fix credentials file permissions
icacls .\cloudflared\credentials.json /inheritance:r /grant:r "$($env:USERNAME):(R)"
```

### Path Separators

Docker Compose handles both `/` and `\` on Windows, but use `/` in `docker-compose.yml` for cross-platform compatibility.

---

## Security Best Practices

1. **Never commit** `.env` or `cloudflared/*.json` files (already in `.gitignore`)
2. **Use strong API keys** (32+ random characters)
3. **Rotate API keys** periodically and update both Vercel and `.env`
4. **Restrict tunnel access** via Cloudflare Access policies (optional)
5. **Monitor logs** for unauthorized access attempts
6. **Keep Docker images updated**: `docker-compose pull && docker-compose up -d`

---

## Next Steps

After successful deployment:

1. **Test email-to-accomplishment flow** end-to-end
2. **Set up monitoring** for container health (Portainer, Uptime Kuma, etc.)
3. **Configure automated backups** for Ollama models volume
4. **Add Resend webhook URL** in Resend dashboard pointing to Vercel
5. **Configure Vercel cron secret** for daily reminder job

---

## Support Resources

- **Docker Docs**: https://docs.docker.com
- **Cloudflare Tunnel Docs**: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- **Ollama Docs**: https://github.com/ollama/ollama
- **Project Issues**: https://github.com/Shargrove09/accomps/issues

---

## Summary

You now have:

- ✅ Agent service running in Docker with Ollama
- ✅ Cloudflare Tunnel exposing agent to Vercel
- ✅ Auto-restart on system boot
- ✅ Development environment for easy coding
- ✅ Production-ready multi-stage Docker builds

The Next.js app on Vercel can now communicate with your local agent for AI-powered accomplishment parsing!
