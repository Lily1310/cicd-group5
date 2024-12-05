document.addEventListener("DOMContentLoaded", async () => {
    const updateButtons = document.querySelectorAll(".update-btn");
    const updateBox = document.getElementById("update-box");
    const fieldNameSpan = document.getElementById("field-name");
    const updateValueInput = document.getElementById("update-value");
    const saveBtn = document.getElementById("save-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const passwordPromptBox = document.getElementById("password-prompt-box");
    const passwordInput = document.getElementById("password-input");
    const passwordSubmitBtn = document.getElementById("password-submit-btn");

    let currentField = null;
    let userId = localStorage.getItem("userId");

    // Fetch profile data and display it
    async function fetchProfileData() {
        try {
            const response = await fetch(`/profile/${userId}`);
            const userData = await response.json();
            document.getElementById("username").textContent = userData.username || "N/A";
            document.getElementById("email").textContent = userData.email || "N/A";
        } catch (error) {
            console.error("Error loading profile data:", error);
        }
    }

    await fetchProfileData();

    // When clicking on update button, show the password prompt and clear previous data
    updateButtons.forEach((button) => {
        button.addEventListener("click", () => {
            currentField = button.dataset.field;
            fieldNameSpan.textContent = currentField.charAt(0).toUpperCase() + currentField.slice(1); // Capitalize first letter of field name
            passwordPromptBox.classList.remove("hidden");

            // Clear the previous input field values when switching fields
            updateValueInput.value = ""; // Reset update input field
            passwordInput.value = ""; // Reset password input field
            updateBox.classList.add("hidden"); // Hide the update box until password is verified
        });
    });

    passwordSubmitBtn.addEventListener("click", async () => {
        const password = passwordInput.value.trim();
        try {
            const response = await fetch(`/profile/verify-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, password }),
            });

            if (!response.ok) throw new Error("Incorrect password");

            // Hide password prompt and show the update box
            passwordPromptBox.classList.add("hidden");
            updateBox.classList.remove("hidden");
        } catch (error) {
            alert("Password verification failed. Please try again.");
        }
    });

    // Save the updated value
    saveBtn.addEventListener("click", async () => {
        const value = updateValueInput.value.trim();
        if (currentField === "email" && !validateEmail(value)) {
            alert("Please enter a valid email address.");
            return; // Stop the update if email is not valid
        }

        try {
            const response = await fetch(`/profile/${currentField}/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, value }),
            });

            if (!response.ok) throw new Error("Failed to update");

            // Fetch updated profile data and hide the update box
            await fetchProfileData();
            updateBox.classList.add("hidden");
        } catch (error) {
            alert("It already exists!! Use another one!");
        }
    });

    // Cancel the update process and hide the update box
    cancelBtn.addEventListener("click", () => {
        updateBox.classList.add("hidden");
    });

    // Function to validate email
    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }
});
