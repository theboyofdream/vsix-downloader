const $ = (selector) => document.querySelector(selector);

async function getVsixDownloadLink(publisher, name) {
    try {
        const res = await fetch(
            "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json;api-version=3.0-preview.1",
                },
                body: JSON.stringify({
                    filters: [
                        {
                            criteria: [{ filterType: 7, value: `${publisher}.${name}` }],
                        },
                    ],
                    flags: 0x1bf,
                }),
            }
        );

        const data = await res.json();
        const ext = data.results?.[0]?.extensions?.[0];
        if (!ext) {
            alert("❌ Extension not found");
            return false;
        }

        const version = ext.versions?.[0];
        const vsixAsset = version.files.find(
            (f) => f.assetType === "Microsoft.VisualStudio.Services.VSIXPackage"
        );

        return vsixAsset.source;
    } catch (err) {
        console.log("❌ Failed to fetch .vsix link:", err);
        alert("❌ Failed to fetch .vsix link");
        return false;
    }
}

async function downloadFile(url, filename) {
    const res = await fetch(url);
    if (!res.ok) {
        return false;
    }
    const blobUrl = URL.createObjectURL(await res.blob());

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(blobUrl);
    return true;
}

async function downloadVsixFromLink(marketplaceUrl) {
    $("form input").disabled = true;
    $("form button").disabled = true;
    $("form button").classList.add("loading");

    const match = marketplaceUrl.match(/itemName=([^&]+)/);
    if (!match) return alert("❌ Invalid Marketplace URL");

    const [publisher, name] = match[1].split(".");

    let downloadUrl = `https://ms-vscode.gallery.vsassets.io/_apis/public/gallery/publisher/${publisher}/extension/${name}/latest/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage`;

    if (!(await downloadFile(downloadUrl, `${name}.vsix`))) {
        downloadUrl = await getVsixDownloadLink(publisher, name);
    } else {
        await downloadFile(downloadUrl, `${name}.vsix`);
    }

    $("form button").classList.remove("loading");
    $("form button").disabled = false;
    $("form input").disabled = false;
}

$("form").addEventListener("submit", (e) => {
    e.preventDefault();
    downloadVsixFromLink(e.target.url.value);
});

function Theme() {
    return {
        init() {
            this.set(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
            window.matchMedia("(prefers-color-scheme: dark)")
                .addEventListener("change", () => {
                    this.set(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
                })
        },
        /**
         * @param {"light"|"dark"} theme 
         */
        set(theme) {
            if (theme === "light") {
                $("body").classList.remove("dark")
                $("#theme-btn span").textContent = "light"
            } else {
                $("body").classList.add("dark")
                $("#theme-btn span").textContent = "dark"
            }
        },
        toggle() {
            this.set($("body").classList.contains("dark") ? "light" : "dark")
        }
    }
}
const theme = Theme()
theme.init()
