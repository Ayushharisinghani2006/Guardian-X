importScripts(chrome.runtime.getURL('assets/tf.min.js'));

// Function to extract features from a URL
function extractFeatures(url) {
    const domain = new URL(url).hostname;

    // Extracting features from the URL
    const domainLength = domain.length;
    const hasHttps = url.startsWith('https') ? 1 : 0;
    const numSubdomains = domain.split('.').length - 2;
    const pathLength = new URL(url).pathname.length;
    const queryLength = new URL(url).searchParams.toString().length;

    // Example of suspicious keywords
    const suspiciousKeywords = ['login', 'pay', 'secure', 'verify'];
    const hasSuspiciousKeywords = suspiciousKeywords.some(keyword => domain.includes(keyword) || url.includes(keyword)) ? 1 : 0;

    return [domainLength, hasHttps, numSubdomains, pathLength, queryLength, hasSuspiciousKeywords];
}

// Sample dataset
const data = [
    { url: "https://secure-login.example.com", isPhishing: 1 },
    { url: "https://www.google.com", isPhishing: 0 },
    // Expand with more URLs...
];

// Extract features and labels
const features = data.map(item => extractFeatures(item.url));
const labels = data.map(item => [item.isPhishing]);

const xs = tf.tensor(features);
const ys = tf.tensor(labels);

// Create an advanced model
const model = tf.sequential();
model.add(tf.layers.dense({ units: 64, inputShape: [6], activation: 'relu' }));
model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
model.add(tf.layers.dropout({ rate: 0.5 }));
model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

// Compile the model
model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy'],
});

// Train the model
async function trainModel() {
    await model.fit(xs, ys, {
        epochs: 20,
        batchSize: 8,
        validationSplit: 0.2,
        callbacks: {
            onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}, accuracy = ${logs.acc}`)
        }
    });
    console.log('Model trained.');
}

// Save the model
async function saveModel() {
    await trainModel();
    await model.save('localstorage://phishing_model');
    console.log('Model saved to local storage.');
}

saveModel();
