#!/usr/bin/env node
import { execSync } from 'node:child_process';
import process from 'node:process';

const PORT = process.argv[2] ?? '3000';
const platform = process.platform;

const findPids = () => {
  if (platform === 'win32') {
    const out = execSync(`netstat -ano | findstr :${PORT}`, { encoding: 'utf8' }).split('\n');
    return [
      ...new Set(
        out
          .filter((l) => l.includes('LISTENING'))
          .map((l) => l.trim().split(/\s+/).pop())
          .filter(Boolean),
      ),
    ];
  }
  const out = execSync(`lsof -ti tcp:${PORT}`, { encoding: 'utf8' });
  return out.split('\n').filter(Boolean);
};

const kill = (pid) => {
  if (platform === 'win32') execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
  else execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
};

try {
  const pids = findPids();
  if (pids.length === 0) {
    console.log(`:${PORT} free`);
  } else {
    pids.forEach((pid) => {
      try {
        kill(pid);
        console.log(`killed pid ${pid} on :${PORT}`);
      } catch {}
    });
  }
} catch {
  console.log(`:${PORT} free`);
}
