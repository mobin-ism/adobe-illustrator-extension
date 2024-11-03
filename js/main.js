document.addEventListener('DOMContentLoaded', function () {
    // Initialize CSInterface
    const csInterface = new CSInterface();
    const fileList = document.getElementById('fileList');
    const loadingDiv = document.getElementById('loading');
    const refreshButton = document.getElementById('refreshButton');
    const authContainer = document.getElementById('authContainer');
    const fileContainer = document.getElementById('fileContainer');
    const loginButton = document.getElementById('loginButton');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const authMessage = document.getElementById('authMessage');

    // Function to open file in Illustrator
    function openInIllustrator(filePath) {
        const script = `app.open(new File('${filePath}'));`;
        csInterface.evalScript(script);
    }

    // Function to fetch data from the API
    async function fetchFiles() {
        try {
            loadingDiv.style.display = 'block'; // Show loading message
            const response = await fetch('http://localhost:3000/files');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const files = data.result;

            // Hide loading message after data is fetched
            loadingDiv.style.display = 'none';
            fileList.innerHTML = ''; // Clear the existing list

            for (const file of files) {
                const li = document.createElement('li');
                li.className = 'file-item'; // Add class for styling
                const button = document.createElement('button');
                button.innerText = "Open in Illustrator";
                button.addEventListener('click', () => openInIllustrator(file.path));
                li.textContent = `${file.name} `;
                li.appendChild(button);
                fileList.appendChild(li);
            }
        } catch (error) {
            loadingDiv.textContent = 'Error loading files: ' + error.message;
            console.error('Error:', error);
        }
    }

    // Add event listener to the refresh button
    refreshButton.addEventListener('click', fetchFiles);

    // Add event listener to the login button
    loginButton.addEventListener('click', async () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const result = await response.json();
            if (result.success) {
                authContainer.style.display = 'none'; // Hide auth container
                fileContainer.style.display = 'block'; // Show file container
                fetchFiles(); // Fetch files after successful login
            } else {
                authMessage.textContent = 'Authentication failed. Please try again.';
            }
        } catch (error) {
            authMessage.textContent = error.message;
            console.error('Authentication error:', error);
        }
    });

    // Call the function to fetch files initially
    // fetchFiles(); // Removed to prevent auto-fetch before authentication
});
