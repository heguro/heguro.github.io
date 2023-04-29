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
  const getLatestToolsVer = async () => {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/nostr-tools/package.json",
      { mode: "cors" }
    );
    const json = await res.json();
    toolsVer.placeholder = json.version;
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
    await getLatestToolsVer();
    loadNostrTools();
  };
  window.onload = init;
});
