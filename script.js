/* ==========================================================================
   script.js — renders project cards, language filters and email copying
   ========================================================================== */

(function () {
  "use strict";

  const GITHUB_USER = "forklift-operator";
  const repoUrl = (name) => `https://github.com/${GITHUB_USER}/${name}`;

  /* ------------------------------------------------------------------ */
  /* 1. Render project cards                                             */
  /* ------------------------------------------------------------------ */

  const grid = document.getElementById("projectsGrid");

  /** "artisan-marketplace-fe" -> "AM" */
  function initials(title) {
    return title
      .split(/[\s\-—]+/)
      .filter((w) => /[A-Za-z0-9]/.test(w))
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }

  function cardHtml(p) {
    const tags = p.tags.map((t) => `<span class="tag">${t}</span>`).join("");
    const forkBadge = p.fork ? `<span class="badge-fork">fork</span>` : "";

    return `
      <article class="project-card" data-lang="${p.lang}">
        <a class="project-banner" href="${repoUrl(p.name)}" target="_blank"
           rel="noopener" aria-label="Open ${p.title} on GitHub">
          <span class="banner-lang">${p.lang}</span>
          <span class="banner-mark">${initials(p.title)}</span>
          <span class="banner-open">&#8599;</span>
        </a>

        <div class="project-body">
          <div class="project-head">
            <p class="project-title">${p.title}</p>
            <span class="project-year">${p.year}</span>
          </div>

          <p class="project-desc">${p.desc}</p>

          <div class="project-tags">
            ${tags}
            ${forkBadge}
          </div>

          <div class="project-actions">
            <a class="project-btn" href="${repoUrl(p.name)}" target="_blank"
               rel="noopener">Source Code &#8599;</a>
          </div>
        </div>
      </article>`;
  }

  // newest first
  const ordered = PROJECTS.slice();
  grid.innerHTML = ordered.map(cardHtml).join("");

  /* ------------------------------------------------------------------ */
  /* 2. Language filter                                                  */
  /* ------------------------------------------------------------------ */

  const filterBar = document.getElementById("filterBar");
  const cards = Array.from(grid.querySelectorAll(".project-card"));

  // add a count next to each language in the filter bar
  filterBar.querySelectorAll(".filter-btn").forEach((btn) => {
    const key = btn.dataset.filter;
    const n =
      key === "all"
        ? ordered.length
        : ordered.filter((p) => p.lang === key).length;
    if (n === 0) {
      btn.remove();
      return;
    }
    btn.insertAdjacentHTML("beforeend", ` <span class="count">${n}</span>`);
  });

  filterBar.addEventListener("click", (event) => {
    const btn = event.target.closest(".filter-btn");
    if (!btn) return;

    const key = btn.dataset.filter;

    filterBar
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.toggle("is-active", b === btn));

    cards.forEach((card) => {
      const show = key === "all" || card.dataset.lang === key;
      card.classList.toggle("is-hidden", !show);
    });

    // keep ordering visible even when a filter empties the grid
    const anyVisible = cards.some((c) => !c.classList.contains("is-hidden"));
    let empty = grid.querySelector(".project-empty");
    if (!anyVisible) {
      if (!empty) {
        empty = document.createElement("p");
        empty.className = "project-empty";
        empty.textContent = "No projects in this language.";
        grid.appendChild(empty);
      }
    } else if (empty) {
      empty.remove();
    }
  });

  /* ------------------------------------------------------------------ */
  /* 3. Click-to-copy email                                              */
  /* ------------------------------------------------------------------ */

  function flash(element) {
    if (!element) return;
    element.classList.add("is-visible");
    clearTimeout(element._timer);
    element._timer = setTimeout(() => element.classList.remove("is-visible"), 1600);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // fallback for non-secure contexts / older browsers
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        return true;
      } catch (e) {
        return false;
      }
    }
  }

  const emailLink = document.querySelector(".about-link.email-link");
  const copyMsg = document.querySelector(".copy-msg");

  if (emailLink) {
    emailLink.addEventListener("click", async () => {
      const value = emailLink.dataset.email;
      if (await copyText(value)) flash(copyMsg);
    });
  }

  const contactEmail = document.querySelector(".contact-link.email-contact");
  if (contactEmail) {
    contactEmail.addEventListener("click", async () => {
      const value = contactEmail.dataset.email;
      const badge = contactEmail.querySelector(".contact-email-copy");
      if (await copyText(value)) flash(badge);
    });
  }
})();
