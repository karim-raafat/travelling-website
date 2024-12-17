document.addEventListener("DOMContentLoaded", () => {
    // Select all buttons with the "add-to-list" class
    const buttons = document.querySelectorAll(".add-to-list");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const destination = button.getAttribute("data-destination");

            // Send a POST request to the server to add the destination
            fetch("/add-to-want-to-go-list", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ destination }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        alert(`${destination} has been added to your Want-to-Go List!`);
                    } else {
                        alert(`Error: ${data.message}`);
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("An unexpected error occurred.");
                });
        });
    });
});
