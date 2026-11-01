// Michel Albert design system: mermaid diagrams (figure.ma-diagram, written by diagrams.py).
// Draws each diagram with the mermaid copy sphinx-immaterial ships, in the design system's
// colours, and redraws on a colour scheme change. Every diagram gets an enlarge button that
// opens a full-screen view: pan and zoom (wheel, drag, pinch, + - 0 and arrow keys), fit,
// download as SVG, the caption or nearest heading as title, and a link (#diagram-id) that
// opens the view again after a reload.
(function () {
  var figures = [].slice.call(document.querySelectorAll("figure.ma-diagram"));
  if (!figures.length) return;
  var STATIC = document.currentScript.src.replace(/[^/]*$/, "");  // .../_static/
  var ICONS = {
    enlarge: "M10 21v-2H6.41l4.5-4.5-1.41-1.41-4.5 4.5V14H3v7zm4.5-10.09 4.5-4.5V10h2V3h-7v2h3.59l-4.5 4.5z",
    fit: "M17 4h3a2 2 0 0 1 2 2v2h-2V6h-3zM4 8V6h3V4H4a2 2 0 0 0-2 2v2zm16 8v2h-3v2h3a2 2 0 0 0 2-2v-2zM7 18H4v-2H2v2a2 2 0 0 0 2 2h3z",
    download: "M5 20h14v-2H5zM19 9h-4V3H9v6H5l7 7z",
    close: "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
  };
  var serial = 0, queue = Promise.resolve(), view = null;

  function icon(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + ICONS[name] + '"/></svg>';
  }

  function token(name) {
    return getComputedStyle(document.body).getPropertyValue("--ma-" + name).trim();
  }

  function isDark() {
    return document.body.getAttribute("data-md-color-scheme") === "slate";
  }

  // Mermaid's base theme, filled from the design tokens. Mermaid colours series (pie slices,
  // git branches, timeline and journey sections) from these lists; authors colour flowchart
  // and state nodes by category with the classes cat1 .. cat6.
  function config() {
    var t = token, v = {
      darkMode: isDark(), background: t("surface-200"), fontFamily: t("sans"), fontSize: "16px",
      textColor: t("ink"), titleColor: t("ink"), lineColor: t("ink-muted"),
      primaryColor: t("surface-300"), primaryTextColor: t("ink"), primaryBorderColor: t("line-strong"),
      secondaryColor: t("accent-subtle"), secondaryTextColor: t("ink"), secondaryBorderColor: t("line-strong"),
      tertiaryColor: t("surface-100"), tertiaryTextColor: t("ink"), tertiaryBorderColor: t("line"),
      mainBkg: t("surface-300"), nodeBorder: t("line-strong"), clusterBkg: t("surface-100"), clusterBorder: t("line"),
      edgeLabelBackground: t("surface-200"),
      noteBkgColor: t("warn-subtle"), noteTextColor: t("ink"), noteBorderColor: t("line-strong"),
      actorBkg: t("surface-300"), actorBorder: t("line-strong"), actorTextColor: t("ink"), actorLineColor: t("ink-muted"),
      signalColor: t("ink-muted"), signalTextColor: t("ink"), labelBoxBkgColor: t("surface-300"),
      labelBoxBorderColor: t("line-strong"), labelTextColor: t("ink"), loopTextColor: t("ink"),
      activationBkgColor: t("accent-subtle"), activationBorderColor: t("accent"), sequenceNumberColor: t("on-accent"),
      pieStrokeColor: t("surface-200"), pieOuterStrokeColor: t("line"), pieTitleTextColor: t("ink"),
      pieSectionTextColor: t("ink"), pieLegendTextColor: t("ink"), pieOpacity: "1",
    };
    for (var i = 0; i < 12; i++) {
      var fill = t("diagram-" + (i % 6 + 1)), text = t("on-diagram-" + (i % 6 + 1));
      v["pie" + (i + 1)] = fill;
      v["cScale" + i] = fill; v["cScaleLabel" + i] = text;
      if (i < 8) { v["git" + i] = fill; v["gitBranchLabel" + i] = text; }
    }
    var css = "";
    for (var c = 1; c <= 6; c++) {
      css += ".cat" + c + " :is(rect, polygon, circle, ellipse, path){fill:" + t("diagram-" + c) + " !important;stroke:" + t("line-strong") + " !important}" +
        ".cat" + c + " :is(.nodeLabel, .label, span, p){color:" + t("on-diagram-" + c) + " !important}" +
        ".cat" + c + " text{fill:" + t("on-diagram-" + c) + " !important}";
    }
    return { startOnLoad: false, theme: "base", securityLevel: "strict", fontFamily: t("sans"), themeVariables: v, themeCSS: css };
  }

  // Mermaid gives every pie slice label one colour; give each the text colour of its slice.
  function labelSlices(svg) {
    var paths = svg.querySelectorAll("path.pieCircle"), labels = svg.querySelectorAll("text.slice");
    if (!paths.length || paths.length !== labels.length) return;
    var probe = document.createElement("span"), onColour = {};
    document.body.appendChild(probe);
    for (var i = 1; i <= 6; i++) {
      probe.style.color = token("diagram-" + i);
      onColour[getComputedStyle(probe).color] = token("on-diagram-" + i);
    }
    paths.forEach(function (path, n) {
      probe.style.color = path.getAttribute("fill");
      var text = onColour[getComputedStyle(probe).color];
      if (text) labels[n].style.fill = text;
    });
    probe.remove();
  }

  // Mermaid renders one diagram at a time; a diagram that fails doesn't stop the others.
  function render(source, into) {
    var job = queue.then(function () {
      return window.mermaid.render("ma-mermaid-" + (++serial), source).then(function (r) {
        into.innerHTML = r.svg;
        if (r.bindFunctions) r.bindFunctions(into);
        var svg = into.querySelector("svg");
        labelSlices(svg);
        return svg;
      });
    });
    queue = job.catch(function () {});
    return job;
  }

  function drawAll() {
    window.mermaid.initialize(config());
    figures.forEach(function (f) {
      render(f.maSource, f.maCanvas).then(function () {
        f.classList.add("ma-diagram--drawn");
      }, function (err) {
        f.classList.remove("ma-diagram--drawn");  // the source stays readable
        console.error("michel-albert-sphinx: diagram " + f.id + " failed to draw", err);
      });
    });
    if (view && view.dialog.open) show(view.figure);
  }

  function title(figure) {
    var caption = figure.querySelector(".ma-diagram__caption");
    if (caption) return caption.textContent.trim();
    var heading = null;
    document.querySelectorAll(".md-content :is(h1, h2, h3, h4, h5, h6)").forEach(function (h) {
      if (h.compareDocumentPosition(figure) & Node.DOCUMENT_POSITION_FOLLOWING) heading = h;
    });
    if (!heading) return document.title;
    var copy = heading.cloneNode(true);
    copy.querySelectorAll(".headerlink").forEach(function (a) { a.remove(); });
    return copy.textContent.trim();
  }

  // ---- full-screen view -------------------------------------------------------------------

  function button(name, label, text) {
    return '<button type="button" class="ma-diagram-view__tool" data-action="' + name + '" aria-label="' + label +
      '" title="' + label + '">' + icon(name) + '<span>' + text + "</span></button>";
  }

  function build() {
    var dialog = document.createElement("dialog");
    dialog.className = "ma-diagram-view";
    dialog.setAttribute("aria-labelledby", "ma-diagram-view-title");
    dialog.innerHTML =
      '<div class="ma-diagram-view__bar"><h2 class="ma-diagram-view__title" id="ma-diagram-view-title"></h2>' +
      button("fit", "Fit to screen (0)", "Fit") + button("download", "Download as SVG", "SVG") +
      button("close", "Close (Esc)", "Close") + "</div>" +
      '<div class="ma-diagram-view__stage" tabindex="0" aria-label="Diagram. Drag or use the arrow keys to move, scroll, pinch or use + and - to zoom.">' +
      '<div class="ma-diagram-view__content"></div></div>';
    document.body.appendChild(dialog);
    var v = { dialog: dialog, stage: dialog.querySelector(".ma-diagram-view__stage"),
      content: dialog.querySelector(".ma-diagram-view__content"), svg: null, w: 0, h: 0, s: 1, x: 0, y: 0, figure: null };

    dialog.querySelector(".ma-diagram-view__bar").addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.action === "fit") fit();
      if (b.dataset.action === "download") download();
      if (b.dataset.action === "close") dialog.close();
    });
    dialog.addEventListener("close", function () {
      v.content.innerHTML = ""; v.svg = null;
      if (v.figure && location.hash === "#" + v.figure.id) history.replaceState(history.state, "", location.pathname + location.search);
      if (v.figure) v.figure.querySelector(".ma-diagram__enlarge").focus();
    });
    dialog.addEventListener("keydown", function (e) {
      var r = v.stage.getBoundingClientRect(), step = 60;
      var keys = {
        "+": function () { zoom(1.25, r.width / 2, r.height / 2); }, "=": function () { zoom(1.25, r.width / 2, r.height / 2); },
        "-": function () { zoom(0.8, r.width / 2, r.height / 2); }, "0": fit,
        ArrowLeft: function () { move(step, 0); }, ArrowRight: function () { move(-step, 0); },
        ArrowUp: function () { move(0, step); }, ArrowDown: function () { move(0, -step); },
      };
      if (keys[e.key] && !e.ctrlKey && !e.metaKey && !e.altKey && !e.target.closest("button")) { keys[e.key](); e.preventDefault(); }
    });
    v.stage.addEventListener("wheel", function (e) {
      var r = v.stage.getBoundingClientRect();
      zoom(Math.pow(1.0015, -e.deltaY * (e.deltaMode === 1 ? 33 : 1)), e.clientX - r.left, e.clientY - r.top);
      e.preventDefault();
    }, { passive: false });

    var pointers = {}, last = null;
    function pinch() {
      var p = Object.keys(pointers).map(function (k) { return pointers[k]; });
      if (p.length === 1) return { x: p[0].x, y: p[0].y, d: 0 };
      return { x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2, d: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) };
    }
    v.stage.addEventListener("pointerdown", function (e) {
      v.stage.setPointerCapture(e.pointerId);
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY }; last = pinch();
      v.stage.classList.add("is-dragging");
    });
    v.stage.addEventListener("pointermove", function (e) {
      if (!pointers[e.pointerId]) return;
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      var now = pinch(), r = v.stage.getBoundingClientRect();
      if (last.d && now.d) zoom(now.d / last.d, now.x - r.left, now.y - r.top);
      move(now.x - last.x, now.y - last.y);
      last = now;
    });
    function lift(e) {
      delete pointers[e.pointerId]; last = Object.keys(pointers).length ? pinch() : null;
      if (!last) v.stage.classList.remove("is-dragging");
    }
    v.stage.addEventListener("pointerup", lift);
    v.stage.addEventListener("pointercancel", lift);
    window.addEventListener("resize", function () { if (dialog.open) fit(); });
    return v;
  }

  // The diagram is laid out at its zoomed size (not scaled with a transform), so text stays sharp.
  function place() {
    if (!view.svg) return;
    view.svg.setAttribute("width", view.w * view.s);
    view.svg.setAttribute("height", view.h * view.s);
    view.content.style.transform = "translate(" + view.x + "px, " + view.y + "px)";
  }

  function fit() {
    if (!view.svg) return;
    var r = view.stage.getBoundingClientRect(), pad = 24;
    view.s = Math.min((r.width - 2 * pad) / view.w, (r.height - 2 * pad) / view.h, 4);
    view.x = (r.width - view.w * view.s) / 2; view.y = (r.height - view.h * view.s) / 2;
    place();
  }

  function zoom(factor, px, py) {
    var s = Math.min(Math.max(view.s * factor, 0.1), 40);
    view.x = px - (px - view.x) * s / view.s; view.y = py - (py - view.y) * s / view.s; view.s = s;
    place();
  }

  function move(dx, dy) { view.x += dx; view.y += dy; place(); }

  function show(figure) {
    view.figure = figure;
    view.dialog.querySelector(".ma-diagram-view__title").textContent = title(figure);
    render(figure.maSource, view.content).then(function (svg) {
      var box = svg.viewBox.baseVal;
      view.svg = svg; view.w = box.width; view.h = box.height;
      svg.removeAttribute("style");
      fit();
    });
  }

  function open(figure) {
    if (!window.mermaid) return;
    view = view || build();
    if (!view.dialog.open) view.dialog.showModal();
    view.stage.focus();
    if (location.hash !== "#" + figure.id) history.replaceState(history.state, "", "#" + figure.id);
    show(figure);
  }

  function download() {
    if (!view.svg) return;
    var svg = view.svg.cloneNode(true);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", view.w); svg.setAttribute("height", view.h);
    svg.setAttribute("style", "background-color: " + token("surface-200"));
    var blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = view.figure.id + ".svg";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  // ---- set up -----------------------------------------------------------------------------

  figures.forEach(function (f, i) {
    if (!f.id) f.id = "diagram-" + (i + 1);
    var source = f.querySelector(".ma-diagram__source");
    f.maSource = source.textContent;
    f.maCanvas = document.createElement("div");
    f.maCanvas.className = "ma-diagram__canvas";
    source.after(f.maCanvas);
    var b = document.createElement("button");
    b.type = "button"; b.className = "ma-diagram__enlarge";
    b.setAttribute("aria-label", "Enlarge diagram"); b.title = "Enlarge diagram";
    b.innerHTML = icon("enlarge");
    b.addEventListener("click", function () { open(f); });
    f.appendChild(b);
  });

  function fromHash() {
    var f = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (f && figures.indexOf(f) >= 0) open(f);
  }

  function start() {
    drawAll();
    new MutationObserver(drawAll).observe(document.body, { attributes: true, attributeFilter: ["data-md-color-scheme"] });
    window.addEventListener("hashchange", fromHash);
    fromHash();
  }

  if (window.mermaid && !(window.mermaid instanceof Element)) { start(); return; }
  var script = document.createElement("script");
  script.src = STATIC + "mermaid/mermaid.min.js";
  script.onload = start;
  script.onerror = function () { console.error("michel-albert-sphinx: could not load " + script.src); };
  document.head.appendChild(script);
})();
