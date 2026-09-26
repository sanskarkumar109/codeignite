export const toggleClass = (el, className) => {
  let elem = document.querySelector(el);
  if (elem) elem.classList.toggle(className);
};

export const removeClass = (el, className) => {
  let elem = document.querySelector(el);
  if (elem) elem.classList.remove(className);
};

export const api_base_url = "http://localhost:3000";

export const getStoredTheme = () => {
  const saved = localStorage.getItem("theme");
  if (saved) return saved;
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
};

export const applyTheme = (theme) => {
  localStorage.setItem("theme", theme);
  if (theme === "light") {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  }
  // Dispatch event for real-time reactivity across all components
  window.dispatchEvent(new CustomEvent("themeChange", { detail: theme }));
};