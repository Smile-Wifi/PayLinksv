(function () {
  var script = document.currentScript;
  if (!script) {
    var all = document.querySelectorAll("script[data-paylink-key]");
    script = all[all.length - 1] || null;
  }
  if (!script) return;
  var key = script.getAttribute("data-paylink-key") || "";
  var scriptUrl = new URL(script.src, window.location.href);
  var prefixMatch = scriptUrl.pathname.match(/^(\/hds-[a-z0-9]+-\d+-[a-z0-9]+)/i);
  var prefix = prefixMatch ? prefixMatch[1] : "";
  var endpoint = scriptUrl.origin + prefix + "/api/v1/charges";

  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || !target.closest) return;
    var el = target.closest("[data-paylink]");
    if (!el || el.getAttribute("data-paylink-busy") === "1") return;
    event.preventDefault();
    var amount = el.getAttribute("data-amount");
    var description = el.getAttribute("data-description") || "Payment";
    var returnAttr = el.getAttribute("data-return") || "";
    var returnUrl = "";
    if (returnAttr) {
      if (/^https?:\/\//i.test(returnAttr)) returnUrl = returnAttr;
      else if (returnAttr.charAt(0) === "/") returnUrl = scriptUrl.origin + prefix + returnAttr;
      else {
        try {
          returnUrl = new URL(returnAttr, window.location.href).toString();
        } catch (err) {
          returnUrl = "";
        }
      }
    }
    el.setAttribute("data-paylink-busy", "1");
    fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-paylink-key": key,
      },
      body: JSON.stringify({
        amount: amount,
        description: description,
        returnUrl: returnUrl,
        source: "widget",
      }),
    })
      .then(function (response) {
        return response.json().then(function (body) {
          return { ok: response.ok, body: body };
        });
      })
      .then(function (result) {
        if (!result.ok || !result.body) {
          window.alert((result.body && result.body.error) || "Could not start payment");
          el.removeAttribute("data-paylink-busy");
          return;
        }
        var path = result.body.payPath || "";
        if (path) {
          window.location.href = scriptUrl.origin + prefix + path;
          return;
        }
        if (result.body.payUrl) window.location.href = result.body.payUrl;
      })
      .catch(function () {
        window.alert("Could not reach PayLink PH");
        el.removeAttribute("data-paylink-busy");
      });
  });
})();
