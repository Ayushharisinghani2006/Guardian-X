console.log("AI Protector content script is running");

document.addEventListener("DOMContentLoaded", async () => {
    // Ensure document.head is available for script loading
    if (!document.head) {
        console.error("Error: document.head is not available.");
        return;
    }

    // Load TensorFlow.js script if needed
    async function loadTensorFlow() {
        if (typeof tf === 'undefined') {
            const script = document.createElement('script');
            script.src = chrome.runtime.getURL('assets/tf.min.js');
            document.head.appendChild(script);
            await new Promise(resolve => script.onload = resolve);
        }
    }

    // Load phishing model
    let phishingModel;
    async function loadPhishingModel() {
        try {
            phishingModel = await tf.loadLayersModel(chrome.runtime.getURL('assets/phishing_model.json'));
            console.log("Phishing model loaded successfully.");
        } catch (error) {
            console.error("Error loading phishing model:", error);
        }
    }

    await loadTensorFlow();
    await loadPhishingModel();

    // Analyze URL for phishing attempts
    async function analyzeURL(url) {
        if (!phishingModel) return { isPhishing: false, phishingProbability: 0 };

        const urlObj = new URL(url);
        const features = [
            urlObj.hostname.length,
            urlObj.protocol === 'https:' ? 1 : 0,
            urlObj.hostname.split('.').length - 2,
            urlObj.pathname.length,
            urlObj.search.length,
        ];

        const prediction = phishingModel.predict(tf.tensor([features]));
        const phishingProbability = prediction.dataSync()[0];
        return { isPhishing: phishingProbability > 0.5, phishingProbability };
    }

    // Run phishing check on page load
    analyzeURL(window.location.href).then(result => {
        if (result.isPhishing) {
            chrome.runtime.sendMessage({
                type: "phishingDetected",
                url: window.location.href
            });
            chrome.notifications.create({
                type: "basic",
                iconUrl: "images/icon.png",
                title: "Phishing Alert",
                message: "This page may be a phishing attempt!"
            });
        }
    });

    // Fetch blocked words
    async function fetchBlockedWords() {
        return ["inappropriate", "violence", "offensive"];
    }
    const blockedWords = await fetchBlockedWords();

    // Content safety check and warning display
    let pageContent = document.body.innerText;
    chrome.runtime.sendMessage({ type: "checkContent", content: pageContent }, (response) => {
        if (response && response.safe !== undefined) {
            if (!response.safe) {
                displayWarning("Warning: Unsafe content detected on this page.");
            }
        } else {
            console.error("Error: Unexpected response from background script.");
        }
    });

    // Filter DOM content based on blocked words
    function filterContent(elements) {
        const regex = new RegExp(blockedWords.join('|'), 'i');
        elements.forEach(element => {
            if (regex.test(element.textContent)) {
                element.style.display = 'none';
                console.log('Content blocked:', element.textContent);
            }
        });
    }

    // Autofill protection
    function protectAutoFill() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (event) => {
                const inputs = form.querySelectorAll('input');
                inputs.forEach(input => {
                    if (input.autocomplete && input.value) {
                        console.log('Autofill detected, protecting form...');
                        event.preventDefault();
                    }
                });
            });
        });
    }
    protectAutoFill();

    // Debounced input listener for autofill protection
    let timeout;
    document.addEventListener("input", (event) => {
        if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
            const fieldType = event.target.getAttribute("type") || "text";
            if (["password", "email", "tel"].includes(fieldType)) {
                const fieldValue = event.target.value;
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    chrome.runtime.sendMessage({
                        type: "checkAutofill",
                        fieldType: fieldType,
                        fieldValue: fieldValue
                    }, (response) => {
                        if (response && response.protect) {
                            event.target.value = "*******";
                            alert("Sensitive data detected! Autofill is blocked.");
                        }
                    });
                }, 300);
            }
        }
    });

    // Mutation observer for dynamic content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            filterContent(document.querySelectorAll('article, section'));
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    filterContent(document.querySelectorAll('article, section, div, p, span'));

    // Function to display a warning message
    function displayWarning(message) {
        const warningDiv = document.createElement("div");
        warningDiv.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background-color: #d32f2f;
            color: white;
            padding: 10px;
            text-align: center;
            z-index: 10000;
            font-size: 16px;
            font-weight: bold;
        `;
        warningDiv.innerText = message;
        document.body.appendChild(warningDiv);
    }

    // Safe Browsing check integration
    async function fetchSafeBrowsing(url) {
        try {
            const response = await fetch('https://safe-browsing-api-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer your_api_key'
                },
                body: JSON.stringify({ url: url })
            });

            const data = await response.json();
            return data.isSafe;  // Replace with actual response field
        } catch (error) {
            console.error('Safe Browsing API error:', error);
            return false;
        }
    }

    // Analyze user behavior (e.g., clicks, time spent)
    function analyzeUserBehavior(event) {
        const behaviorData = {
            eventType: event.type,
            target: event.target.tagName,
            time: Date.now(),
        };

        chrome.runtime.sendMessage({ type: "logBehavior", behavior: behaviorData });
    }

    // Attach user behavior events
    document.addEventListener("click", analyzeUserBehavior);
    document.addEventListener("input", analyzeUserBehavior);

    // Summarization and Rewriting functionality
    async function processSelectedText(selectedText) {
        // Send text to background script for processing (summarization/rewrite)
        chrome.runtime.sendMessage({ type: "summarizeContent", content: selectedText }, (response) => {
            if (response && response.summary) {
                console.log("Summary:", response.summary);
                alert("Summarized content: " + response.summary);
            }
        });

        chrome.runtime.sendMessage({ type: "rewriteContent", content: selectedText }, (response) => {
            if (response && response.rewritten) {
                console.log("Rewritten text:", response.rewritten);
                alert("Rewritten content: " + response.rewritten);
            }
        });
    }

    document.addEventListener("click", () => {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            processSelectedText(selectedText);
        }
    });
});

// Listen for suspicious behavior alerts from background
chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "suspicious_behavior") {
        alert("Warning: This page may be unsafe due to detected suspicious behaviors.");
    }
});

// Consolidated message listener for URL analysis
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in content.js:", message);

    if (message.type === 'analyzeUrl') {
        sendResponse({ status: "success", message: "URL analyzed in content.js" });
    }
    return false;
});

console.log("Content script injected successfully!");
