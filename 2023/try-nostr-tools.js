// license: Unlicense (public domain)
// for try-nostr-tools.html

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.hash);
  const loadParams = () => {
    if (params.has("ver")) {
      toolsVer.value = params.get("ver");
      loadNostrTools();
    }
  };
  window.onhashchange = loadParams;
  reloadTools.onclick = () => {
    if (toolsVer.value) {
      params.set("ver", toolsVer.value);
    } else {
      params.delete("ver");
    }
    location.hash = params.toString();
    // loadNostrTools();
  };
  const getToolsVersions = async () => {
    const res = await fetch(
      "https://registry.npmjs.org/nostr-tools",
      { mode: "cors" }
    );
    const json = await res.json();
    const versions = Object.keys(json.versions);
    const toolsVerDatalist = document.querySelector("#toolsVerDatalist");
    const versionsAfterV1 = versions.slice(versions.indexOf("1.0.0")).reverse();
    versionsAfterV1.forEach((ver) => {
      const option = document.createElement("option");
      option.value = ver;
      toolsVerDatalist.appendChild(option);
    });
    toolsVer.placeholder = versionsAfterV1[0];
  };
  const loadNostrTools = () => {
    const ver = toolsVer.value || toolsVer.placeholder;
    document.querySelector(`script[data-id="nostr-tools"]`)?.remove();
    window.NostrTools = undefined;
    const script = document.createElement("script");
    script.dataset.id = "nostr-tools";
    script.onload = () => {
      if (window.NostrTools) {
        console.log(
          `nostr-tools ver:${ver} loaded. you can use NostrTools variable.`
        );
      }
    };
    script.src = `https://cdn.jsdelivr.net/npm/nostr-tools@${ver}/lib/nostr.bundle.min.js`;
    document.body.appendChild(script);
  };
  const init = async () => {
    const params = new URLSearchParams(location.hash);
    if (params.has("ver")) {
      toolsVer.value = params.get("ver");
    }
    eruda.init({
      tool: ["console"],
    });
    await getToolsVersions();
    loadNostrTools();
  };
  window.onload = init;
});
