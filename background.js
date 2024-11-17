// Define variables for user behavior tracking
let interactionCount = 0;
let riskyClickCount = 0;
const behaviorThreshold = 5;  // General interaction threshold
const riskyClickThreshold = 3;  // Threshold for risky URLs

// Safe-browsing indicators (adjust or expand this list as needed)
const threatIndicators = [
    "suspicious", "phishing", "login", "verify", "secure", "account", "confirm",
    "bank", "crypto", "investment", "free", "prize", "offer"
];

// Handle content check request
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'checkContent') {
        chrome.storage.sync.get(["blockedKeywords", "adaptiveFilteringEnabled"], (settings) => {
            const blockedWords = settings.blockedKeywords || ["default", "blocked"];
            const adaptiveEnabled = settings.adaptiveFilteringEnabled !== false; // Default to true
            const isSafe = !blockedWords.some(word => message.content.toLowerCase().includes(word));

            if (isSafe) {
                sendResponse({ safe: true });
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "images/icon.png",
                    title: "Content Safe",
                    message: "This page content is safe."
                });
            } else {
                sendResponse({ safe: false });
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "images/icon.png",
                    title: "Blocked Keyword Detected",
                    message: "Unsafe content detected based on blocked keywords."
                });

                // Adaptive Filtering Logic
                if (adaptiveEnabled) {
                    chrome.scripting.executeScript({
                        target: { tabId: sender.tab.id },
                        func: (blockedWords) => {
                            const elements = document.querySelectorAll('p, div, span');
                            elements.forEach(el => {
                                if (blockedWords.some(word => el.innerText.toLowerCase().includes(word))) {
                                    el.style.display = 'none';
                                }
                            });
                        },
                        args: [blockedWords]
                    });
                }
            }
        });
        return true;  // Keeps the message channel open for async response
    }

    // Handle autofill protection
    if (message.type === 'checkAutofill') {
        const sensitiveFields = ["password", "credit card", "ssn"];
        const protect = sensitiveFields.some(field => 
            message.fieldType.toLowerCase().includes(field) || message.fieldValue.toLowerCase().includes(field)
        );

        if (protect) {
            sendResponse({ protect: true });
            chrome.notifications.create({
                type: "basic",
                iconUrl: "images/icon.png",
                title: "Autofill Protection",
                message: "Sensitive field detected. Autofill protection is enabled."
            });
        } else {
            fetch("http://localhost:8080/api/checkAutofill", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fieldType: message.fieldType, fieldValue: message.fieldValue })
            })
            .then(response => response.json())
            .then(data => sendResponse(data))
            .catch(error => {
                console.error("Fetch error in checkAutofill:", error);
                sendResponse({ protect: false });
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "images/icon.png",
                    title: "Error",
                    message: "An error occurred while checking autofill data."
                });
            });
        }
        return true;
    }

    // Start content filtering notification
    if (message.action === 'startFiltering') {
        console.log('Content filtering started.');
        sendResponse({ message: 'Content filtering started.' });
        chrome.notifications.create({
            type: "basic",
            iconUrl: "images/icon.png",
            title: "Content Filtering",
            message: "Content filtering has started."
        });
    }

    // Enable autofill protection notification
    if (message.action === 'enableAutofill') {
        console.log('Autofill protection enabled.');
        sendResponse({ message: 'Autofill protection enabled.' });
        chrome.notifications.create({
            type: "basic",
            iconUrl: "images/icon.png",
            title: "Autofill Protection",
            message: "Autofill protection is now enabled."
        });
    }
});

// Function to track user behavior and generate safety warnings
function trackUserBehavior(url) {
    interactionCount++;
    chrome.storage.local.get(["riskyClickCount"], (data) => {
        if (chrome.runtime.lastError) {
            console.error("Error retrieving data from storage:", chrome.runtime.lastError);
            return;
        }
        riskyClickCount = data.riskyClickCount || 0;
        const isRisky = threatIndicators.some(keyword => url.toLowerCase().includes(keyword));
        if (isRisky) riskyClickCount++;

        // Save counters
        chrome.storage.local.set({ riskyClickCount, interactionCount });

        // Check thresholds
        if (interactionCount >= behaviorThreshold || riskyClickCount >= riskyClickThreshold) {
            generateSafetyWarning();
            // Reset counters after warning
            chrome.storage.local.set({ riskyClickCount: 0, interactionCount: 0 });
        }
    });
}

// Function to generate tailored safety warning based on behavior
function generateSafetyWarning() {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "images/icon.png",
        title: "Safety Warning",
        message: "Unusual browsing behavior detected. Please proceed with caution.",
    });
}

// Function to analyze and predict threat level of URL
function predictThreatLevel(url) {
    const isThreat = threatIndicators.some(indicator => url.includes(indicator));

    if (isThreat) {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "images/icon.png",
            title: "Threat Prediction Alert",
            message: `Potential threat detected at ${url}. Proceed with caution.`,
        });
    }
}

// Tab update listener
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        if (!/^https?:\/\//.test(tab.url)) {
            console.warn("Skipping non-HTTP(S) page:", tab.url);
            return; // Skip tabs with unsupported URLs
        }

        setTimeout(() => {
            chrome.tabs.sendMessage(tabId, { type: "analyzeUrl", url: tab.url }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error in sending message to content script:", chrome.runtime.lastError.message);
                } else {
                    console.log("Response from content script:", response);
                }
            });
        }, 500);
    }
});

// AI Content Analysis, Summarization, and Rewriting
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'analyzeContent') {
        analyzeContentWithAI(message.content, sendResponse);
        return true; // Keeps the response channel open for async API call
    }

    if (message.type === 'summarizeContent') {
        summarizeContent(message.content, sendResponse);
        return true;
    }

    if (message.type === 'rewriteContent') {
        rewriteContent(message.content, sendResponse);
        return true;
    }
});

// Function to analyze content using AI
async function analyzeContentWithAI(content, sendResponse) {
    const apiUrl = 'https://chrome-ai.googleapis.com/v1/prompt';
    const prompt = `Analyze the following content and identify potential threats: ${content}`;
    const body = {
        model: 'GeminiNano',
        prompt: prompt
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_API_KEY`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        sendResponse({ analysis: data.result });
    } catch (error) {
        console.error("Error analyzing content:", error);
        sendResponse({ error: "Failed to analyze content." });
    }
}

// Function to summarize unsafe content
async function summarizeContent(content, sendResponse) {
    const apiUrl = 'https://chrome-ai.googleapis.com/v1/summarize';
    const body = {
        model: 'GeminiNano',
        text: content
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_API_KEY`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        sendResponse({ summary: data.summary });
    } catch (error) {
        console.error("Error summarizing content:", error);
        sendResponse({ error: "Failed to summarize content." });
    }
}

// Function to rewrite unsafe content
async function rewriteContent(content, sendResponse) {
    const apiUrl = 'https://chrome-ai.googleapis.com/v1/rewrite';
    const body = {
        model: 'GeminiNano',
        text: content
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_API_KEY`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        sendResponse({ rewrittenContent: data.rewrittenContent });
    } catch (error) {
        console.error("Error rewriting content:", error);
        sendResponse({ error: "Failed to rewrite content." });
    }
}
