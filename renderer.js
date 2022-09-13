const powershell = require('node-powershell');
const os = require('os');
const { promisify } = require('util');
const { exec } = require('child_process');
const btnActivate = document.getElementById("btn-activate");
const modalStatus = document.getElementById("modal-status");
const statusVagrant = document.getElementById("status-vagrant");
const statusVbox = document.getElementById("status-vbox");
const STATUS_TRUE = '&#10003';
const STATUS_FALSE = '&#10005';


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
                `Start-Process -Verb RunAs powershell.exe -WindowStyle Hidden -PassThru -Wait -Args "iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))"`
            );
            ps.invoke()
                .then(() => {
                    ps.addCommand(
                        `Start-Process -Verb RunAs powershell.exe -Args "cinst virtualbox vagrant cyg-get" -WindowStyle Hidden -PassThru -Wait`
                    );
                    ps.invoke().then(() => {

                    }).catch((err) => {
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
            modalStatus.style.display = "block";
            execute(exec, `brew -v`)
            execute(exec, `brew install vagrant`).then(() => {
                statusVagrant.innerHTML = STATUS_TRUE;
                execute(exec, `brew install --cask virtualbox`).then(() => {
                    statusVbox.innerHTML = STATUS_TRUE;
                    modalStatus.style.display = "none";
                    execute(exec, `virtualbox`)
                }).catch(() => statusVbox.innerHTML = STATUS_FALSE)
            }).catch(() => statusVagrant.innerHTML = STATUS_FALSE)
            statusVbox.innerHTML = STATUS_FALSE
            statusVagrant.innerHTML = STATUS_FALSE
            break;
        case "linux":
            console.log("isLinux");
            break;
        default:
            break;
    }
});