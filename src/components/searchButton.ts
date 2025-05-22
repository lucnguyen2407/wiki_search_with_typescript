function searchButtonComponent() {
  let searchButton: HTMLButtonElement;
  searchButton = document.createElement("button");
  searchButton.textContent = "Search";
  searchButton.className =
    "px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors";
  searchButton.setAttribute("type", "submit");
  return searchButton;
}

export default searchButtonComponent;
