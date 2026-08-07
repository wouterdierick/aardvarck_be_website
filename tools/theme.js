// tools/theme.js
import { execSync, spawn } from "child_process";

const themePath = "web/themes/custom/aardvarck";
const sassPath = `${themePath}/scss`;
const cssPath = `${themePath}/css`;
const componentsPath = `${themePath}/components`;

function run(command) {
  execSync(command, { stdio: "inherit" });
}

function runParallel(commands) {
  const children = commands.map(cmd =>
    spawn(cmd, { shell: true, stdio: "inherit" })
  );

  process.on("SIGINT", () => {
    children.forEach(child => child.kill("SIGINT"));
    process.exit();
  });
}

function dev() {
  // Run both SASS watchers in parallel
  runParallel([
    `sass --style=expanded \
      --embed-source-map \
      --load-path=node_modules \
      --load-path=${sassPath} \
      --watch ${sassPath}/main.scss ${cssPath}/main.css`,

    `sass --style=expanded \
      --embed-source-map \
      --load-path=node_modules \
      --load-path=${sassPath} \
      --watch ${componentsPath}:${componentsPath}`
  ]);
}

function build() {
  run(`sass --style=compressed \
    --load-path=node_modules \
    --load-path=${sassPath} \
    ${sassPath}/main.scss ${cssPath}/main.css`);

  run(`sass --style=compressed \
    --load-path=node_modules \
    --load-path=${sassPath} \
    ${componentsPath}:${componentsPath}`);
}

const command = process.argv[2];

if (command === "dev") {
  dev();
} else if (command === "build") {
  build();
} else {
  console.error("Usage: node tools/theme.js [dev|build]");
  process.exit(1);
}

