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
   git clone <repository-link>
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
