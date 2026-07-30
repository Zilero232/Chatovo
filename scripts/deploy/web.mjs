import { NodeSSH } from 'node-ssh';

import { requireEnv } from '../lib/env.mjs';
import { $, reporter, workspace } from '../lib/shell.mjs';

const log = reporter('deploy:web');

const creds = requireEnv([
  'GITHUB_TOKEN',
  'GHCR_OWNER',
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_LIVEKIT_URL',
  'DEPLOY_SSH_HOST',
  'DEPLOY_SSH_USER',
  'DEPLOY_SSH_PASSWORD',
  'DEPLOY_PATH'
]);

const owner = creds.GHCR_OWNER.toLowerCase();
const port = Number(process.env.DEPLOY_SSH_PORT ?? '22');

const webImage = `ghcr.io/${owner}/chatovo-web`;
const apiImage = `ghcr.io/${owner}/chatovo-server`;

const dockerLogin = async () => {
  log.step(`docker login ghcr.io as ${owner}`);

  await $`docker login ghcr.io -u ${owner} --password-stdin < ${new Response(creds.GITHUB_TOKEN)}`;
};

const buildAndPush = async ({ image, dockerfile, buildArgs }) => {
  log.step(`build & push ${image}`);

  const args = buildArgs.flatMap((arg) => ['--build-arg', arg]);

  await $`docker build -f ${dockerfile} ${args} -t ${`${image}:latest`} .`;
  await $`docker push ${`${image}:latest`}`;
};

const remote = async () => {
  const ssh = new NodeSSH();

  log.step(`ssh ${creds.DEPLOY_SSH_USER}@${creds.DEPLOY_SSH_HOST}`);

  await ssh.connect({
    host: creds.DEPLOY_SSH_HOST,
    port,
    username: creds.DEPLOY_SSH_USER,
    password: creds.DEPLOY_SSH_PASSWORD
  });

  const path = creds.DEPLOY_PATH;

  log.step('copy docker-compose.yml to VPS');
  await ssh.putFile(`${workspace}/docker-compose.yml`, `${path}/docker-compose.yml`);

  const exec = async (title, script) => {
    log.step(title);

    const result = await ssh.execCommand(`set -e; cd '${path}'; ${script}`);

    if (result.stdout) {
      log.info(result.stdout);
    }

    if (result.code !== 0) {
      ssh.dispose();
      log.fail(result.stderr || `remote command failed: ${title}`);
    }
  };

  await exec(
    'pull images and restart',
    'docker compose pull web server && docker compose up -d && docker image prune -f'
  );

  ssh.dispose();
};

await dockerLogin();
await buildAndPush({
  image: webImage,
  dockerfile: 'apps/client/Dockerfile',
  buildArgs: [
    `NEXT_PUBLIC_API_URL=${creds.NEXT_PUBLIC_API_URL}`,
    `NEXT_PUBLIC_LIVEKIT_URL=${creds.NEXT_PUBLIC_LIVEKIT_URL}`
  ]
});
await buildAndPush({ image: apiImage, dockerfile: 'apps/server/Dockerfile', buildArgs: [] });
await remote();

log.info('web + server deployed');

process.exit(0);
