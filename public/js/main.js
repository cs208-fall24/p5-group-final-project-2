// TODO: Add any JavaScript here to make your page fancy :)
// Wait for the DOM to fully load before executing JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // Handle the Add Comment functionality
    const commentForm = document.querySelector("#commentForm");
    const commentInput = document.querySelector("#commentInput");
    const commentList = document.querySelector("#commentList");

    if (commentForm) {
        commentForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent the default form submission

            const commentText = commentInput.value.trim(); // Get the input text

            if (commentText) {
                // Create a new list item for the comment
                const newComment = document.createElement("li");
                newComment.textContent = commentText;

                // Append the new comment to the list
                commentList.appendChild(newComment);

                // Clear the input field
                commentInput.value = "";
            } else {
                alert("Please enter a comment before submitting.");
            }
        });
    }

    // Add interactivity to images (optional, for a cool effect)
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
        img.addEventListener("mouseover", () => {
            img.style.transform = "scale(1.05)";
            img.style.transition = "transform 0.3s ease";
        });

        img.addEventListener("mouseout", () => {
            img.style.transform = "scale(1)";
        });
    });

    // Things To Do section hover effect (optional)
    const todoItems = document.querySelectorAll(".things-to-do li");
    todoItems.forEach((item) => {
        item.addEventListener("mouseover", () => {
            item.style.backgroundColor = "#f4f4f9";
            item.style.borderLeft = "5px solid #4a90e2";
            item.style.transition = "all 0.3s ease";
        });

        item.addEventListener("mouseout", () => {
            item.style.backgroundColor = "transparent";
            item.style.borderLeft = "none";
        });
    });
});
