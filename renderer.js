const powershell = require('node-powershell');
const os = require('os');
const btnActivate = document.getElementById("btn-activate");
const { promisify } = require('util');
const { exec } = require('child_process');

const execute = (func, command) => {
    return promisify(func)(command);
}

btnActivate.addEventListener("click", () => {
    switch (os.platform()) {
        case "win32":
            const ps = new powershell({
                executionPolicy: "Bypass",
                noProfile: true,
            });
            // ps.addCommand(`Get-Process | Select MainWindowTitle | where{$_.MainWindowTitle -ne ""} | ConvertTo-Json`)
            ps.addCommand(
                `Start-Process -Verb RunAs powershell.exe -Args "iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))"`
            );
            ps.invoke()
                .then(() => {
                    ps.addCommand(
                        `Start-Process -Verb RunAs powershell.exe -Args "cinst virtualbox vagrant cyg-get"`
                    );
                    ps.invoke().catch((err) => {
                        console.error(err);
                        ps.dispose();
                    });
                    // const result = JSON.parse(data)
                    // result.filter(r => {

                    //     console.log(r.MainWindowTitle === 'Administrator: Windows PowerShell')
                    // })
                    // console.log( data.filter(d => d === "Administrator: Windows PowerShell"))
                })
                .catch((err) => {
                    console.error(err);
                    ps.dispose();
                });

            break;
        case "darwin":
            console.log("isMac");
            execute(exec, `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`).then(() => {
                execute(exec, `brew install vagrant`).then(() => {
                    execute(exec, `brew install --cask virtualbox`).then(() => {
                        execute(exec, `open /Applications/Virtualbox.app`).then(() => {
                            execute(exec, `VBoxManage startvm "CentOS serve" --type headless`)
                        })
                    })
                })
            }).catch(error => console.log(error))
            break;
        case "linux":
            console.log("isLinux");
            break;
        default:
            break;
    }
});