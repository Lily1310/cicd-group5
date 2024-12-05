document.addEventListener("DOMContentLoaded", async () => {
     // Get user ID and role from localStorage
     const token = localStorage.getItem("token");
     const role = localStorage.getItem("role");
 
     // Get navbar elements
     const loggedInNavbar = document.getElementById("logged-in-navbar");
     const publicNavbar = document.getElementById("public-navbar");
 
     // Check if the user is logged in and is an admin
     if (token && role === 'admin') {
         loggedInNavbar.style.display = 'block';
         if (publicNavbar) publicNavbar.style.display = 'none';
     } else {
         loggedInNavbar.style.display = 'none';
         if (publicNavbar) publicNavbar.style.display = 'block';
         alert('You must be logged in as an admin to access this page.');
         window.location.href = '/login.html';  
         return;
     }
 
     // Logout functionality
     document.getElementById('logout-link').addEventListener('click', function (event) {
         event.preventDefault(); // Prevent default link behavior
 
         // Clear localStorage and redirect to login page
         localStorage.removeItem('token');
         localStorage.removeItem('userId');
         localStorage.removeItem('role');
         alert('You have been logged out.');
         window.location.href = '/login.html';
     });
 

    const supplierAdminId = localStorage.getItem("userId");
    // Extract suapplyId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const suapplyId = urlParams.get("suapplyId");

    if (!suapplyId) {
        alert("Supplier application ID is missing from the URL.");
        return;
    }

    // Fetch application details and pre-fill the form
    try {
        const response = await fetch(`/supplier/application/details/${suapplyId}`);
        if (response.ok) {
            const application = await response.json();
            document.getElementById("personId").value = application.personId; // From application
            document.getElementById("companyName").value = application.companyName;
            document.getElementById("productType").value = application.productType;
        } else {
            alert("Failed to fetch application details.");
            return;
        }
    } catch (error) {
        console.error("Error fetching application details:", error);
        alert("An error occurred while fetching application details.");
        return;
    }

    // Ensure supplierAdminId is set in the form
    if (supplierAdminId) {
        document.getElementById("supplierAdminId").value = supplierAdminId;
    } else {
        alert("Admin ID not found in local storage.");
        return;
    }

    // Handle form submission
    const form = document.getElementById("create-supplier-form");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const personId = document.getElementById("personId").value.trim(); // Fetched from the application
        const companyName = document.getElementById("companyName").value.trim();
        const productType = document.getElementById("productType").value.trim();
        const supplierAdminId = document.getElementById("supplierAdminId").value.trim();

        // Validate form inputs
        if (!personId || !companyName || !productType || !supplierAdminId) {
            alert("Please fill out all fields.");
            return;
        }

        // Prepare the data
        const requestData = {
            personId,
            companyName,
            productType,
            supplierAdminId,
        };

        try {
            const response = await fetch("/supplier/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message || "Supplier created successfully!");
                form.reset();

                // Redirect to the supplierAdmin.html page after successful creation
                window.location.href = "/supplierAdmin.html";  // Redirects to supplierAdmin.html
            } else {
                const error = await response.json();
                alert(`Error: ${error.message || "Failed to create supplier"}`);
            }
        } catch (error) {
            console.error("Error creating supplier:", error);
            alert("An error occurred. Please try again.");
        }
    });
});
