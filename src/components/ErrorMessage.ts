function errorMessageComponent() {
    let errorMessage: HTMLDivElement;
    errorMessage = document.createElement("div");
    errorMessage.className = "text-red-500 text-sm mt-1 hidden";
    errorMessage.setAttribute("role", "alert");
    return errorMessage;
}

export default errorMessageComponent;
