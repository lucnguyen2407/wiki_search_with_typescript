function searchButtonComponent() {
  let searchButton: HTMLButtonElement;
  searchButton = document.createElement("button");
  searchButton.textContent = "Search";
  searchButton.className = "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed disabled:hover:bg-blue-300";
  searchButton.setAttribute("type", "submit");
  return searchButton;
}
export default searchButtonComponent;

