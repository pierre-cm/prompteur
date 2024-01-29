import { spawnSync } from "child_process"
import { existsSync } from "fs"

if (!existsSync("./dist"))
  spawnSync("npm run build", { stdio: "inherit", shell: true })
