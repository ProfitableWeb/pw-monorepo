module.exports = {
  apps: [
    {
      name: "api",
      cwd: "./apps/api",
      script: "uv",
      args: "run uvicorn src.main:app --host 127.0.0.1 --port 8000",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "web",
      cwd: "./apps/web",
      script: "bun",
      args: "run start",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "admin",
      cwd: "./apps/admin",
      script: "bun",
      args: "run preview",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
