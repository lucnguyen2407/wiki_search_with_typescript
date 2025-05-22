function searchInput() {
  let searchInput: HTMLInputElement;
  searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search Wikipedia...";
  searchInput.className =
    "flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
  searchInput.setAttribute("aria-label", "Search Wikipedia");
  searchInput.setAttribute("required", "true");
  return searchInput;
}

export default searchInput;
