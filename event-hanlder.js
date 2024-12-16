document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("add-to-list");

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
                alert("An unexpected error occurred. " + error.message);
            });
    });
});