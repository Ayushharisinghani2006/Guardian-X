document.addEventListener('DOMContentLoaded', function initializePopup() {
    // Element references
    const filterButton = document.getElementById('filterButton');
    const autofillButton = document.getElementById('autofillButton');
    const inputField = document.getElementById('enableProtection');
    const saveSettingsButton = document.getElementById("saveSettings");
    const scanPageButton = document.getElementById("scanPageButton");
    const resultDiv = document.getElementById("result");
    const predictiveAnalysisToggle = document.getElementById("predictiveAnalysisToggle");
    const loadingSpinner = document.getElementById('loadingSpinner');
    const cloudApiUrl = "https://YOUR_CLOUD_FUNCTION_URL_HERE";

    console.log(filterButton, autofillButton, inputField, saveSettingsButton, scanPageButton, predictiveAnalysisToggle);

    // Initialize functions
    setupFilterAndAutofillButtons();
    setupScanPageButton();
    setupSaveSettingsButton();
    setupPredictiveAnalysisToggle();
    setupAddKeywordButton();
    setupAdaptiveFilteringToggle();
    loadAutofillProtectionSetting();
    loadPreferences();

    // Function to toggle the visibility of the loading spinner
    function toggleLoadingSpinner(isLoading) {
        loadingSpinner.style.display = isLoading ? 'block' : 'none';
    }

    // Function to process AI with Cloud API
    async function processAIWithCloud(content) {
        try {
            const response = await fetch(cloudApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: content })
            });
            const data = await response.json();
            return data.prediction ? data.prediction : null;
        } catch (error) {
            console.error("Error calling AI cloud service:", error);
            return null;
        }
    }

    // Function to load WebAssembly
    function loadWebAssembly() {
        const wasmUrl = chrome.runtime.getURL('output.wasm');
        fetch(wasmUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch WebAssembly file at ${wasmUrl}: ${response.statusText}`);
                }
                return response.arrayBuffer();
            })
            .then(bytes => WebAssembly.instantiate(bytes))
            .then(obj => {
                console.log('WebAssembly loaded successfully:', obj.instance);
            })
            .catch(err => {
                console.error('Error loading WebAssembly:', err.message);
                console.error('Check if output.wasm exists, has the correct path, and CSP is configured.');
            });
    }

    // Event listeners for Content Filtering and Autofill buttons
    function setupFilterAndAutofillButtons() {
        if (filterButton) {
            filterButton.addEventListener('click', function () {
                chrome.runtime.sendMessage({ action: 'startFiltering' }, function (response) {
                    response ? console.log(response.message) : console.error('No response from filtering action.');
                });
            });
        } else {
            console.error('Error: filterButton is missing.');
        }

        if (autofillButton) {
            autofillButton.addEventListener('click', function () {
                chrome.runtime.sendMessage({ action: 'enableAutofill' }, function (response) {
                    response ? console.log(response.message) : console.error('No response from autofill action.');
                });
            });
        } else {
            console.error('Error: autofillButton is missing.');
        }
    }

    // Scan Page button logic
    function setupScanPageButton() {
        if (scanPageButton) {
            scanPageButton.addEventListener("click", () => {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        function: () => {
                            chrome.runtime.sendMessage(
                                { type: "checkContent", content: document.body.innerText },
                                (response) => {
                                    if (response) {
                                        resultDiv.textContent = response.safe ? "Page content is safe." : "Unsafe content detected.";
                                        resultDiv.className = response.safe ? "safe" : "unsafe";
                                        resultDiv.style.display = "block";
                                    } else {
                                        console.error("No response received.");
                                    }
                                }
                            );
                        }
                    });
                });
            });
        } else {
            console.error('Error: scanPageButton is missing.');
        }
    }

    // Save Settings button logic
    function setupSaveSettingsButton() {
        if (saveSettingsButton) {
            saveSettingsButton.addEventListener("click", () => {
                const isEnabled = inputField.checked;
                chrome.storage.sync.set({ autofillProtection: isEnabled }, () => {
                    console.log('Autofill protection setting saved:', isEnabled);
                });
            });
        } else {
            console.error('Error: saveSettingsButton is missing.');
        }
    }

    // Load stored setting for autofill protection
    function loadAutofillProtectionSetting() {
        chrome.storage.sync.get("autofillProtection", (data) => {
            if (inputField) {
                inputField.checked = data.autofillProtection ?? true;
            } else {
                console.error('Error: enableProtection checkbox is missing.');
            }
        });
    }

    // Predictive Analysis toggle logic
    function setupPredictiveAnalysisToggle() {
        if (predictiveAnalysisToggle) {
            predictiveAnalysisToggle.addEventListener("change", (e) => {
                chrome.storage.local.set({ predictiveAnalysis: e.target.checked });
                console.log('Predictive Analysis setting saved:', e.target.checked);
            });
        } else {
            console.error('Error: predictiveAnalysisToggle is missing.');
        }
    }

    // Add Keyword Button Logic
    function setupAddKeywordButton() {
        const addKeywordButton = document.getElementById("addKeywordButton");
        if (addKeywordButton) {
            addKeywordButton.addEventListener("click", () => {
                const keywordInput = document.getElementById("addKeyword").value.trim();
                if (keywordInput) {
                    chrome.storage.sync.get("blockedKeywords", (data) => {
                        const keywords = data.blockedKeywords || [];
                        if (!keywords.includes(keywordInput)) {  // Prevent duplicate keywords
                            keywords.push(keywordInput);
                            chrome.storage.sync.set({ blockedKeywords: keywords });
                            updateKeywordList(keywords);
                        } else {
                            console.log("Keyword already exists.");  // Log duplicate warning
                        }
                    });
                    document.getElementById("addKeyword").value = "";
                }
            });
        } else {
            console.error("Error: addKeywordButton is missing.");
        }
    }

    // Load preferences when popup opens
    function loadPreferences() {
        chrome.storage.sync.get(["blockedKeywords", "adaptiveFilteringEnabled"], (data) => {
            updateKeywordList(data.blockedKeywords || []);
            document.getElementById("adaptiveFilteringToggle").checked = data.adaptiveFilteringEnabled || false;
        });
    }

    // Adaptive Filtering Toggle Logic
    function setupAdaptiveFilteringToggle() {
        const adaptiveFilteringToggle = document.getElementById("adaptiveFilteringToggle");
        if (adaptiveFilteringToggle) {
            adaptiveFilteringToggle.addEventListener("change", (e) => {
                chrome.storage.sync.set({ adaptiveFilteringEnabled: e.target.checked });
                console.log('Adaptive Filtering setting saved:', e.target.checked);
            });
        } else {
            console.error("Error: adaptiveFilteringToggle is missing.");
        }
    }

    // Function to update the UI with the current keyword list
    function updateKeywordList(keywords) {
        const keywordListContainer = document.getElementById("keywordList");
        if (keywordListContainer) {
            keywordListContainer.innerHTML = "";  // Clear existing keywords
            keywords.forEach(keyword => {
                const listItem = document.createElement("li");
                listItem.textContent = keyword;
                keywordListContainer.appendChild(listItem);
            });
        } else {
            console.error("Error: keywordList container is missing.");
        }
    }
});
