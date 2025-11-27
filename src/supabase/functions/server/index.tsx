import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const BASE_PATH = "/make-server-984e3078";

// Health check endpoint
app.get(`${BASE_PATH}/health`, (c) => {
  return c.json({ status: "ok" });
});

// KV Get
app.post(`${BASE_PATH}/kv/get`, async (c) => {
  try {
    const { key } = await c.req.json();
    if (!key) return c.json({ error: "Key is required" }, 400);
    
    const value = await kv.get(key);
    return c.json({ value });
  } catch (error) {
    console.error("KV Get Error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// KV Set
app.post(`${BASE_PATH}/kv/set`, async (c) => {
  try {
    const { key, value } = await c.req.json();
    if (!key) return c.json({ error: "Key is required" }, 400);
    
    await kv.set(key, value);
    return c.json({ success: true });
  } catch (error) {
    console.error("KV Set Error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
