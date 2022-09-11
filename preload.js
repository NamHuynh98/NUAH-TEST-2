const powershell = require("node-powershell");

window.addEventListener("DOMContentLoaded", () => {
  const btnActivate = document.getElementById("btn-activate");
  btnActivate.addEventListener("click", () => {
    switch (process.platform) {
      case "win32":
        console.log("isWin");
        const ps = new powershell({
          executionPolicy: "Bypass",
          noProfile: true,
        });
        ps.addCommand(
          `iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))`
        );
        ps.invoke()
          .then((output) => {
            console.log(output);
          })
          .catch((err) => {
            console.error(err);
            ps.dispose();
          });
        break;
      case "darwin":
        console.log("isMac");
        break;
      case "linux":
        console.log("isLinux");
        break;
      default:
        break;
    }
  });
});
