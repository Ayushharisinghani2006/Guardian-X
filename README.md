# AI Protector

## Introduction
**AI Protector** is an AI-powered Chrome extension designed to secure your browsing experience. It protects against phishing attacks, filters harmful content in real time, and provides tailored safety alerts based on user behavior. With AI Protector, you can browse smarter, safer, and with greater confidence.

## Key Features
- **Real-Time Phishing Detection**: Identifies and blocks phishing attempts to secure your sensitive data.
- **Adaptive Content Filtering**: Dynamically filters harmful content based on customizable rules.
- **Autofill Privacy Protection**: Safeguards sensitive information during autofill processes.
- **User Behavior Analysis**: Offers personalized safety warnings based on browsing patterns.

## Project Folder Structure
. ├── manifest.json # Chrome extension manifest file ├── popup.js # Frontend logic for popup interface ├── popup.html # HTML for the extension popup ├── background.js # Background script for core functionality ├── content.js # Script for webpage interaction ├── tensorflow.js # TensorFlow.js for AI processing ├── assets/ # Folder for AI models and configuration files │ ├── rules.json # Content filtering rules │ ├── phishing_model.json # Phishing detection AI model ├── ai/ # Backend Spring Boot application │ ├── ContentFilterController.java │ ├── BehaviourRequest.java │ ├── BehaviourModel.java ├── image/ # Icons and visual assets │ ├── icon.png | icon16.png| incon48.png| |icon.128.png|

markdown
Copy code

## Installation

### Prerequisites
- **Google Chrome** (latest version)
- **Java** (JDK 11 or higher)
- **Maven** (for Spring Boot backend)
- **Node.js** (if working on frontend development)
- ### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Ayushharisinghani2006/AI-PROTECTOR-2024.git
   cd ai-protector
Load the Chrome extension:
Open Chrome and navigate to chrome://extensions/.
Enable Developer Mode.
Click Load unpacked and select the project root folder.
Run the backend service:
Navigate to the ai folder and start the Spring Boot application:
bash
Copy code
mvn spring-boot:run
Test the extension:
Browse websites to see phishing warnings, content filtering, and privacy alerts in action.
Usage
Enable the extension from the Chrome toolbar.
Configure rules and preferences via the popup interface.
Browse as usual—the extension will handle threats and privacy in the background.
Review warnings and notifications to stay informed.
Technologies Used
Frontend: JavaScript, HTML, CSS
Backend: Java (Spring Boot)
AI: TensorFlow.js for phishing detection and adaptive filtering
Storage: JSON-based configuration files
Contributions
We welcome contributions to improve AI Protector! Here's how you can help:

Fork the repository.
Create a new branch for your feature:
bash
Copy code
git checkout -b feature-name
Commit your changes:
bash
Copy code
git commit -m "Add feature name"
Push the branch and submit a pull request for review.
Future Enhancements
Integration with cloud-based AI for faster and more accurate detection.
Multi-language support to cater to a global audience.
Advanced user customization options for rules and filters.
License
This project is licensed under the MIT License.

# AI Protector Backend

## Introduction
The backend of **AI Protector** is built using **Java Spring Boot**. It powers the extension by handling AI-based phishing detection, content filtering logic, and user behavior analysis. The backend serves as the central hub for processing data and providing actionable insights to the frontend.

## Features
- **Phishing Detection API**: Uses AI models to detect phishing attempts and evaluate page safety.
- **Content Filtering Rules Engine**: Processes rules defined in `rules.json` to filter unsafe content dynamically.
- **User Behavior Analysis**: Analyzes browsing patterns and generates tailored safety warnings.

## Folder Structure
ai/ ├── ContentFilterController.java # REST controller for content filtering logic ├── BehaviourRequest.java # Model for user behavior data ├── BehaviourModel.java # Data model for behavior analysis

markdown
Copy code

## Prerequisites
- **Java** (JDK 11 or higher)
- **Maven** (for dependency management and build)

## Setup Instructions
1. Navigate to the `ai` folder:
   ```bash
   cd ai
Install dependencies using Maven:
bash
Copy code
mvn clean install
Run the backend application:
bash
Copy code
mvn spring-boot:run
The backend will start on the default port 8080. Verify by accessing:
arduino
Copy code
http://localhost:8080
API Endpoints
1. Content Filtering Endpoint
URL: /api/filter
Method: POST
Request Body:
json
Copy code
{
  "content": "The webpage content to analyze"
}
Response:
json
Copy code
{
  "isSafe": true,
  "warnings": []
}

2. Behavior Analysis Endpoint
URL: /api/behavior
Method: POST
Request Body:
json
Copy code
{
  "actions": ["clicked_link", "submitted_form"],
  "timeSpent": 120
}
Response:
json
Copy code
{
  "warningLevel": "low",
  "recommendations": ["Enable two-factor authentication"]
}
Customization
Rules JSON (rules.json): Add or modify content filtering rules here. Each rule is applied dynamically to the analyzed content.
AI Model (phishing_model.json): Update the phishing detection model as needed to enhance detection accuracy.
Testing the Backend
Use Postman or any REST client to test the endpoints.

Technologies Used
Spring Boot: For creating RESTful APIs.
JSON: Configuration for content filtering rules.
AI Integration: Phishing detection using pre-trained models.
Future Improvements
Add logging and monitoring for backend activity.
Implement a caching layer for faster rule processing.
Enhance AI models with real-time learning capabilities.
# Assets Folder

## Introduction
The `assets` folder contains important configuration files and AI models used by the **AI Protector** project. These files play a crucial role in enabling dynamic content filtering, phishing detection, and other AI-based functionalities.

## Files in the Assets Folder
### 1. **rules.json**
- **Purpose**: 
  Contains content filtering rules that define how potentially harmful or unwanted content should be handled.
- **Structure**:
  ```json
  {
    "rules": [
      {
        "type": "block",
        "pattern": ".*phishing.*",
        "action": "block"
      },
      {
        "type": "alert",
        "pattern": ".*ads.*",
        "action": "warn"
      }
    ]
  }
Explanation:

type: Describes the type of rule (e.g., block, alert).
pattern: The regex pattern used to identify content.
action: Specifies what action to take (block, warn, etc.).
Usage: Modify this file to add or update rules for custom content filtering.

2. phishing_model.json
Purpose: A pre-trained AI model used for real-time phishing detection. The model analyzes URLs and webpage content to predict potential threats.

Structure:

json
Copy code
{
  "modelVersion": "1.0",
  "threshold": 0.8,
  "data": { ... }
}
Explanation:

modelVersion: Indicates the version of the phishing detection model.
threshold: The confidence level required to flag a site as phishing.
data: The serialized weights and structure of the AI model.
Usage: Replace or update this file when training a new phishing detection model.

Guidelines for Modifying Files
Backup: Always create a backup of existing files before making changes.
Editing rules.json:
Use a text editor or JSON editor to add new patterns or actions.
Validate the JSON format to avoid syntax errors.
Updating phishing_model.json:
Ensure the new model is compatible with the backend code and TensorFlow.js.
Update the modelVersion to track changes.
Future Additions
Include language-specific rules for multilingual content filtering.
Store user-specific customization files for personalized settings.
# Image Folder

## Introduction
The `image` folder contains all the visual assets used in the **AI Protector** project. These include icons, logos, and other graphical elements required for the Chrome extension interface and documentation.

## Files in the Image Folder

### 1. **icon.png**
- **Purpose**: 
  - Used as the Chrome extension icon.
  - Displayed in the Chrome toolbar and `chrome://extensions/` page.
- **Recommended Size**: 
  - 128x128 pixels (for optimal display across all platforms).
- **Usage**: 
  - Specified in `manifest.json` under the `icons` section:
    ```json
    "icons": {
      "16": "image/icon.png",
      "48": "image/icon.png",
      "128": "image/icon.png"
    }
    ```

---

### 2. **logo.png**
- **Purpose**:
  - Represents the branding of AI Protector.
  - Can be used in the popup interface or promotional materials.
- **Recommended Size**:
  - 256x256 pixels (or scalable vector graphics for flexibility).
- **Usage**:
  - Displayed in the extension popup (`popup.html`) or about section.


## Guidelines for Adding New Images
1. **File Format**:
   - Use `.png` or `.svg` for high-quality and scalable images.
2. **Naming Convention**:
   - Use descriptive and consistent file names (e.g., `error_icon.png`, `info_icon.png`).
3. **Optimization**:
   - Compress images to reduce file size without compromising quality (use tools like TinyPNG or ImageOptim).
4. **Size Recommendations**:
   - Follow Chrome's guidelines for extension assets:
     - Toolbar icons: 16x16, 48x48, 128x128 pixels.
     - Popup images: 256x256 pixels or scalable
    
     5. README.md for Frontend
markdown
Copy code
# Frontend (UI) - AI Protector

## Introduction
The frontend of **AI Protector** is responsible for the user interface, including the popup window and interactions with the backend. The interface displays safety warnings, phishing alerts, content filtering messages, and provides the user with options to manage settings.

## Folder Structure
frontend/ ├── popup.js # Frontend logic for handling popup UI ├── popup.html # HTML structure for the popup window ├── content.js # Script for interacting with webpage content ├── style.css # Styles for the popup UI

markdown
Copy code

## Key Components

### 1. **popup.js**
- **Purpose**: Handles the logic for displaying the popup interface.
- **Functions**:
  - Listens for user interactions (e.g., clicks, form submissions).
  - Fetches data from the backend (e.g., phishing detection results).
  - Dynamically updates the popup based on user settings and backend responses.

### 2. **popup.html**
- **Purpose**: Defines the structure of the popup interface.
- **Contains**:
  - Input fields for custom filtering rules.
  - Display sections for warnings and alerts.
  - Buttons for interacting with the backend (e.g., test phishing detection, enable/disable filtering).

### 3. **content.js**
- **Purpose**: Injected into web pages to interact with the content and communicate with the background script.
- **Functions**:
  - Monitors page content for phishing indicators.
  - Applies content filtering rules as defined by the user.
  - Provides real-time safety warnings and alerts.

## Styling
- The popup UI is styled using **style.css**.
- The design is simple, ensuring that the warnings and alerts are easy to read and understand.

## Installation
1. Clone the repository and navigate to the `frontend` folder:
   ```bash
   git clone https://github.com/Ayushharisinghani2006/AI-PROTECTOR-2024.git
   cd ai-protector/frontend
Load the extension in Chrome:
Open Chrome and go to chrome://extensions/.
Enable Developer mode.
Click Load unpacked and select the frontend folder.
Future Improvements
Enhance the UI for a better user experience (UX).
Add support for custom themes (e.g., light/dark mode).
Extend frontend features with more detailed safety insights.


## Backend Tests
The `backend_tests` folder contains unit tests for the Spring Boot backend. These tests ensure that the core APIs work as expected.

- **ContentFilterControllerTest.java**:
  - Tests the `/api/filter` endpoint for content filtering functionality.
  
- **BehaviourRequestTest.java**:
  - Tests the logic for user behavior analysis and safety warnings.

## Frontend Tests
The `frontend_tests` folder contains tests for the popup and content scripts.

- **popup.test.js**:
  - Tests interactions and UI updates in the popup (e.g., rule creation and backend responses).
  
- **content.test.js**:
  - Tests how `content.js` interacts with web pages (e.g., injecting content and applying filtering rules).

## Development Tools
The `dev_tools` folder includes utilities for simulating backend responses and testing with mock data.

- **test_data.json**: Contains sample inputs and expected outputs for AI models to validate their functionality.
- **mock_server.js**: A mock server for testing frontend-to-backend communication without needing a live backend.

## Running Tests
1. To run backend tests, use Maven:
   ```bash
   mvn test
2.For frontend tests, use a test runner like Jest:
bash
Copy code
npm test
