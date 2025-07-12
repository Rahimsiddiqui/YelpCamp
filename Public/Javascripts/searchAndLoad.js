const searchBox = document.getElementById("search");
const cards = document.querySelectorAll(".card");
const noResultShow = document.getElementById(`noResults`);

window.addEventListener("load", () => {
  const spinner = document.getElementById("spinner");
  setTimeout(() => {
    if (spinner) {
      spinner.remove();
    }
  }, 2000);
  const content = document.getElementById("mainContent");
  if (content) {
    content.style.display = "block";
  }

  searchBox.addEventListener("input", () => {
    const searchedKey = searchBox.value.trim().toLowerCase();

    cards.forEach((card) => {
      const titleElement = card.querySelector(".card-title");
      const titleText = titleElement?.textContent?.toLowerCase() || "";

      if (titleText.includes(searchedKey)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });

    const visibleCard = Array.from(cards).some(
      (card) => card.style.display !== "none"
    );

    if (!visibleCard) {
      noResultShow.style.display = "block";
      noResultShow.classList.add("animation");
    } else {
      noResultShow.style.display = "none";
      noResultShow.classList.remove("animation");
    }
  });
});
