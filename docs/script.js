(function () {
  const nav = document.querySelector("#site-nav");
  const menuButton = document.querySelector(".menu-button");
  const search = document.querySelector("#doc-search");
  const sections = Array.from(document.querySelectorAll(".doc-section[id], .hero"));
  const navLinks = Array.from(document.querySelectorAll(".sidebar a"));
  const copyButtons = Array.from(document.querySelectorAll(".copy-button"));
  const checklistItems = Array.from(document.querySelectorAll("[data-check]"));

  menuButton?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      const id = visible.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    },
    { rootMargin: "-20% 0px -65% 0px", threshold: [0.05, 0.2, 0.5] }
  );

  sections.forEach((section) => observer.observe(section));

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const code = button.parentElement?.querySelector("code")?.innerText ?? "";
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = "Copied";
        button.classList.add("done");
        setTimeout(() => {
          button.textContent = "Copy";
          button.classList.remove("done");
        }, 1300);
      } catch {
        button.textContent = "Select";
      }
    });
  });

  search?.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    sections.forEach((section) => {
      const text = `${section.textContent} ${section.dataset.search ?? ""}`.toLowerCase();
      section.classList.toggle("hidden-by-search", Boolean(query) && !text.includes(query));
    });
  });

  checklistItems.forEach((item) => {
    const key = `xml-client-docs:${item.dataset.check}`;
    item.checked = localStorage.getItem(key) === "true";
    item.addEventListener("change", () => {
      localStorage.setItem(key, String(item.checked));
    });
  });
})();
