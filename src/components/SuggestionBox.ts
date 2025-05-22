function searchButtonComponent() {
    let suggestionsBox: HTMLDivElement;
    suggestionsBox = document.createElement("div");
    suggestionsBox.className =
        "absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg hidden z-10";
    suggestionsBox.style.maxHeight = "300px";
    suggestionsBox.style.overflowY = "auto";
    return suggestionsBox;
}

export default searchButtonComponent;
