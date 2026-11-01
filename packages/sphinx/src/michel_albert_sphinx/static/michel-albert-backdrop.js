// Michel Albert design system: draw the project's seeded backdrop behind the reading sheet.
// The style and seed come from the build (data-style, data-seed on this script tag); the
// drawing comes from backdrops.js, the generator every surface shares. Dark pages use the
// 'dark' palette, light pages 'paper': both start from surface-100, the page background.
(function () {
  var script = document.currentScript;
  var style = script.getAttribute("data-style"), seed = script.getAttribute("data-seed");
  var wide = window.matchMedia("screen and (min-width: 76.25em)");  // the sheet's breakpoint
  var canvas = null, drawn = "";

  function palette() {
    return document.body.getAttribute("data-md-color-scheme") === "slate" ? "dark" : "paper";
  }

  function draw() {
    if (!wide.matches || !window.MaBackdrops) return;
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.className = "ma-backdrop";
      canvas.setAttribute("aria-hidden", "true");
      document.body.insertBefore(canvas, document.body.firstChild);
    }
    // 16:9 at the resolution needed to cover the screen; object-fit crops the rest
    var scale = Math.max(window.innerWidth / 1920, window.innerHeight / 1080) * Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.round(1920 * scale), h = Math.round(1080 * scale), key = w + "x" + h + ":" + palette();
    if (key === drawn) return;
    canvas.width = w; canvas.height = h;
    window.MaBackdrops.drawBackdrop(canvas.getContext("2d"), style, seed, palette());
    drawn = key;
  }

  var t; function later() { clearTimeout(t); t = setTimeout(draw, 150); }
  function start() {
    draw();
    new MutationObserver(draw).observe(document.body, { attributes: true, attributeFilter: ["data-md-color-scheme"] });
    window.addEventListener("resize", later);
    if (wide.addEventListener) wide.addEventListener("change", draw);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
