const path = require('path')
const { exec } = require("child_process");

async function main() {
    const run = command => new Promise((resolve, reject) => 
        exec(command, (err, stdout, stderr) => err ? reject(stderr) : resolve(stdout))
    )
    const root = path.join(__dirname, '..')

    await run('npx tsc-alias')
    require(`${root}/build`)
}

main()
    .then(stdout => stdout == null || console.log(stdout))
    .catch(stderr => stderr == null || console.error(stderr))
