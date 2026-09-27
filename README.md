# 🖥️ ZepVm

A modern Vercel-ready VM/container dashboard starter.

## ⚠️ Important

Vercel cannot run a real privileged Ubuntu host or LXD daemon. This project provides the **web dashboard**.

For real:
- root Ubuntu containers
- LXD / Incus
- `lxd init`
- real terminal
- VM/container create/start/stop

you need a separate Ubuntu host/backend.

## 🚀 Deploy to Vercel

1. Upload this project to GitHub.
2. Open Vercel and import the GitHub repository.
3. Framework: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy.

## 🔌 Connect an LXD backend

Create a Vercel environment variable:

`VITE_API_URL=https://YOUR-BACKEND-URL`

The frontend expects API routes such as:

- `GET /api/vms`
- `POST /api/vms/:id/start`
- `POST /api/vms/:id/stop`

The backend should communicate with LXD/Incus on the Ubuntu host.

## 🐧 Ubuntu host

The actual LXD setup belongs on the Ubuntu machine, not Vercel.

Example host-side workflow:

```bash
sudo apt update
sudo apt install lxd
sudo lxd init
```

Then configure your backend/API to securely control the containers.

Never expose an unrestricted root/LXD socket directly to the public internet.
