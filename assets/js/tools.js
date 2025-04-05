document.addEventListener('DOMContentLoaded', function() {
    // Define all tool objects with their HTML templates and initialization functions
    window.allTools = {
        // Page 1 Tools
        'text-speech': {
            html: `
                <div class="tool-icon"><i class="fas fa-microphone-alt"></i></div>
                <h3>Text-to-Speech</h3>
                <div class="tool-content">
                    <textarea placeholder="Enter text to convert to speech..."></textarea>
                    <button class="tool-button">Speak</button>
                </div>
            `,
            init: function(toolCard) {
                const textarea = toolCard.querySelector('textarea');
                const speakBtn = toolCard.querySelector('.tool-button');
                
                speakBtn.addEventListener('click', function() {
                    const text = textarea.value;
                    if (text && 'speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(text);
                        window.speechSynthesis.speak(utterance);
                    } else {
                        alert('Please enter text or your browser does not support speech synthesis.');
                    }
                });
            }
        },
        'password': {
            html: `
                <div class="tool-icon"><i class="fas fa-key"></i></div>
                <h3>Password Generator</h3>
                <div class="tool-content">
                    <div class="tool-controls">
                        <label>Length: <input type="number" min="8" max="32" value="12"></label>
                        <label><input type="checkbox" checked> Uppercase</label>
                        <label><input type="checkbox" checked> Numbers</label>
                        <label><input type="checkbox" checked> Symbols</label>
                    </div>
                    <input type="text" readonly class="generated-password">
                    <button class="tool-button">Generate</button>
                </div>
            `,
            init: function(toolCard) {
                const lengthInput = toolCard.querySelector('input[type="number"]');
                const uppercaseCheck = toolCard.querySelector('input[type="checkbox"]:nth-of-type(1)');
                const numbersCheck = toolCard.querySelector('input[type="checkbox"]:nth-of-type(2)');
                const symbolsCheck = toolCard.querySelector('input[type="checkbox"]:nth-of-type(3)');
                const generatedPassword = toolCard.querySelector('.generated-password');
                const generateBtn = toolCard.querySelector('.tool-button');
                
                generateBtn.addEventListener('click', function() {
                    const length = parseInt(lengthInput.value) || 12;
                    const includeUppercase = uppercaseCheck.checked;
                    const includeNumbers = numbersCheck.checked;
                    const includeSymbols = symbolsCheck.checked;
                    
                    generatedPassword.value = generatePassword(length, includeUppercase, includeNumbers, includeSymbols);
                });
                
                // Copy to clipboard functionality
                generatedPassword.addEventListener('click', function() {
                    if (generatedPassword.value) {
                        generatedPassword.select();
                        document.execCommand('copy');
                        showTooltip(generatedPassword, 'Copied!');
                    }
                });
                
                function generatePassword(length, upper, numbers, symbols) {
                    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
                    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    const numberChars = '0123456789';
                    const symbolChars = '!@#$%^&*()_-+=<>?/[]{}';
                    
                    let allChars = lowerChars;
                    if (upper) allChars += upperChars;
                    if (numbers) allChars += numberChars;
                    if (symbols) allChars += symbolChars;
                    
                    let password = '';
                    for (let i = 0; i < length; i++) {
                        const randomIndex = Math.floor(Math.random() * allChars.length);
                        password += allChars.charAt(randomIndex);
                    }
                    
                    return password;
                }
            }
        },
        'qrcode': {
            html: `
                <div class="tool-icon"><i class="fas fa-qrcode"></i></div>
                <h3>QR Code Generator</h3>
                <div class="tool-content">
                    <input type="text" placeholder="Enter text or URL">
                    <div class="qrcode-output"></div>
                    <button class="tool-button">Generate QR</button>
                </div>
            `,
            init: function(toolCard) {
                const input = toolCard.querySelector('input[type="text"]');
                const qrcodeOutput = toolCard.querySelector('.qrcode-output');
                const generateBtn = toolCard.querySelector('.tool-button');
                
                // Load QR code library dynamically
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';
                document.head.appendChild(script);
                
                script.onload = function() {
                    generateBtn.addEventListener('click', function() {
                        const text = input.value.trim();
                        if (text) {
                            qrcodeOutput.innerHTML = '';
                            new QRCode(qrcodeOutput, {
                                text: text,
                                width: 128,
                                height: 128,
                                colorDark: '#ffffff',
                                colorLight: 'rgba(20, 5, 50, 0)',
                                correctLevel: QRCode.CorrectLevel.H
                            });
                        } else {
                            alert('Please enter text or URL for the QR code.');
                        }
                    });
                };
            }
        },
        'wordcount': {
            html: `
                <div class="tool-icon"><i class="fas fa-font"></i></div>
                <h3>Word Counter</h3>
                <div class="tool-content">
                    <textarea placeholder="Type or paste text here..."></textarea>
                    <div class="counter-results">
                        <div>Words: <span class="word-count">0</span></div>
                        <div>Characters: <span class="char-count">0</span></div>
                    </div>
                </div>
            `,
            init: function(toolCard) {
                const textarea = toolCard.querySelector('textarea');
                const wordCount = toolCard.querySelector('.word-count');
                const charCount = toolCard.querySelector('.char-count');
                
                textarea.addEventListener('input', function() {
                    const text = this.value;
                    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
                    const chars = text.length;
                    
                    wordCount.textContent = words;
                    charCount.textContent = chars;
                });
            }
        },
        'textanalyzer': {
            html: `
                <div class="tool-icon"><i class="fas fa-chart-pie"></i></div>
                <h3>Text Analyzer</h3>
                <div class="tool-content">
                    <textarea placeholder="Enter text to analyze..."></textarea>
                    <button class="tool-button">Analyze</button>
                    <div class="analyzer-results"></div>
                </div>
            `,
            init: function(toolCard) {
                const textarea = toolCard.querySelector('textarea');
                const analyzeBtn = toolCard.querySelector('.tool-button');
                const resultsDiv = toolCard.querySelector('.analyzer-results');
                
                analyzeBtn.addEventListener('click', function() {
                    const text = textarea.value.trim();
                    if (!text) {
                        alert('Please enter text to analyze.');
                        return;
                    }
                    
                    // Simple text analysis
                    const words = text.split(/\s+/);
                    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^\w]/g, '')));
                    
                    // Count word frequency
                    const wordFreq = {};
                    words.forEach(word => {
                        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
                        if (cleanWord) {
                            wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
                        }
                    });
                    
                    // Sort by frequency
                    const sortedWords = Object.entries(wordFreq)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5);
                    
                    // Very simple sentiment analysis
                    const positiveWords = ['good', 'great', 'happy', 'positive', 'excellent', 'wonderful', 'love', 'best', 'beautiful'];
                    const negativeWords = ['bad', 'awful', 'hate', 'terrible', 'worst', 'sad', 'negative', 'poor', 'horrible'];
                    
                    let positiveCount = 0;
                    let negativeCount = 0;
                    
                    words.forEach(word => {
                        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
                        if (positiveWords.includes(cleanWord)) positiveCount++;
                        if (negativeWords.includes(cleanWord)) negativeCount++;
                    });
                    
                    let sentiment = 'Neutral';
                    if (positiveCount > negativeCount) sentiment = 'Positive';
                    if (negativeCount > positiveCount) sentiment = 'Negative';
                    
                    // Display results
                    resultsDiv.innerHTML = `
                        <div class="result-item">
                            <span>Words:</span> ${words.length}
                        </div>
                        <div class="result-item">
                            <span>Unique Words:</span> ${uniqueWords.size}
                        </div>
                        <div class="result-item">
                            <span>Sentiment:</span> ${sentiment}
                        </div>
                        <div class="result-item">
                            <span>Top Words:</span>
                            <ul>
                                ${sortedWords.map(([word, count]) => `<li>${word}: ${count}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                });
            }
        },
        
        // Page 2 Tools
        'base64': {
            html: `
                <div class="tool-icon"><i class="fas fa-exchange-alt"></i></div>
                <h3>Base64 Encode/Decode</h3>
                <div class="tool-content">
                    <textarea placeholder="Enter text to encode or decode..."></textarea>
                    <div class="button-group">
                        <button class="tool-button encode-btn">Encode</button>
                        <button class="tool-button decode-btn">Decode</button>
                    </div>
                    <div class="result-output"></div>
                </div>
            `,
            init: function(toolCard) {
                const textarea = toolCard.querySelector('textarea');
                const encodeBtn = toolCard.querySelector('.encode-btn');
                const decodeBtn = toolCard.querySelector('.decode-btn');
                const resultOutput = toolCard.querySelector('.result-output');
                
                encodeBtn.addEventListener('click', function() {
                    const text = textarea.value;
                    if (text) {
                        const encoded = btoa(text);
                        resultOutput.innerHTML = `
                            <h4>Encoded:</h4>
                            <div class="result-text">${encoded}</div>
                        `;
                    }
                });
                
                decodeBtn.addEventListener('click', function() {
                    const text = textarea.value;
                    try {
                        const decoded = atob(text);
                        resultOutput.innerHTML = `
                            <h4>Decoded:</h4>
                            <div class="result-text">${decoded}</div>
                        `;
                    } catch(e) {
                        resultOutput.innerHTML = `
                            <div class="error">Invalid Base64 string</div>
                        `;
                    }
                });
            }
        },
        'json': {
            html: `
                <div class="tool-icon"><i class="fas fa-code"></i></div>
                <h3>JSON Formatter</h3>
                <div class="tool-content">
                    <textarea placeholder="Paste your JSON here..."></textarea>
                    <button class="tool-button">Format JSON</button>
                    <div class="json-output"></div>
                </div>
            `,
            init: function(toolCard) {
                const textarea = toolCard.querySelector('textarea');
                const formatBtn = toolCard.querySelector('.tool-button');
                const output = toolCard.querySelector('.json-output');
                
                formatBtn.addEventListener('click', function() {
                    const jsonStr = textarea.value.trim();
                    if (!jsonStr) {
                        alert('Please enter JSON to format.');
                        return;
                    }
                    
                    try {
                        const parsed = JSON.parse(jsonStr);
                        const formatted = JSON.stringify(parsed, null, 2);
                        output.innerHTML = `<pre>${escapeHtml(formatted)}</pre>`;
                    } catch (e) {
                        output.innerHTML = `<div class="error">Invalid JSON: ${e.message}</div>`;
                    }
                });
                
                function escapeHtml(text) {
                    return text
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&#039;");
                }
            }
        },
        'markdown': {
            html: `
                <div class="tool-icon"><i class="fas fa-file-alt"></i></div>
                <h3>Markdown Viewer</h3>
                <div class="tool-content">
                    <textarea placeholder="Enter markdown text..." rows="5">## Hello Markdown\n\nThis is **bold** and this is *italic*.</textarea>
                    <div class="markdown-preview"></div>
                </div>
            `,
            init: function(toolCard) {
                const textarea = toolCard.querySelector('textarea');
                const preview = toolCard.querySelector('.markdown-preview');
                
                // Simple markdown to HTML converter
                function convertMarkdown(md) {
                    return md
                        // Headers
                        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                        // Bold
                        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
                        // Italic
                        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
                        // Links
                        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
                        // Lists
                        .replace(/^\- (.*$)/gim, '<li>$1</li>')
                        // Line breaks
                        .replace(/\n/gim, '<br>');
                }
                
                // Initial render
                preview.innerHTML = convertMarkdown(textarea.value);
                
                // Update preview on input
                textarea.addEventListener('input', function() {
                    preview.innerHTML = convertMarkdown(this.value);
                });
            }
        },
        'lorem': {
            html: `
                <div class="tool-icon"><i class="fas fa-paragraph"></i></div>
                <h3>Lorem Ipsum Generator</h3>
                <div class="tool-content">
                    <div class="tool-controls">
                        <label>
                            Paragraphs: 
                            <input type="number" min="1" max="10" value="3" class="paragraphs-input">
                        </label>
                    </div>
                    <button class="tool-button">Generate</button>
                    <div class="lorem-output"></div>
                </div>
            `,
            init: function(toolCard) {
                const input = toolCard.querySelector('.paragraphs-input');
                const generateBtn = toolCard.querySelector('.tool-button');
                const output = toolCard.querySelector('.lorem-output');
                
                const loremText = [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
                    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium."
                ];
                
                generateBtn.addEventListener('click', function() {
                    const count = parseInt(input.value) || 3;
                    let result = '';
                    
                    for (let i = 0; i < count; i++) {
                        let paragraph = '';
                        // Generate 3-6 sentences per paragraph
                        const sentenceCount = Math.floor(Math.random() * 4) + 3;
                        
                        for (let j = 0; j < sentenceCount; j++) {
                            paragraph += loremText[Math.floor(Math.random() * loremText.length)] + ' ';
                        }
                        
                        result += `<p>${paragraph}</p>`;
                    }
                    
                    output.innerHTML = result;
                });
            }
        },
        'regex': {
            html: `
                <div class="tool-icon"><i class="fas fa-search"></i></div>
                <h3>Regex Tester</h3>
                <div class="tool-content">
                    <div class="input-group">
                        <label>Regex Pattern:</label>
                        <input type="text" class="regex-pattern" placeholder="Enter regex (e.g. \\w+)">
                    </div>
                    <div class="input-group">
                        <label>Test String:</label>
                        <textarea class="test-string" placeholder="Enter text to test against..."></textarea>
                    </div>
                    <button class="tool-button">Test Regex</button>
                    <div class="regex-results"></div>
                </div>
            `,
            init: function(toolCard) {
                const patternInput = toolCard.querySelector('.regex-pattern');
                const testString = toolCard.querySelector('.test-string');
                const testBtn = toolCard.querySelector('.tool-button');
                const results = toolCard.querySelector('.regex-results');
                
                testBtn.addEventListener('click', function() {
                    const pattern = patternInput.value.trim();
                    const text = testString.value;
                    
                    if (!pattern || !text) {
                        results.innerHTML = '<div class="error">Please enter both a regex pattern and test string.</div>';
                        return;
                    }
                    
                    try {
                        const regex = new RegExp(pattern, 'g');
                        const matches = [...text.matchAll(regex)];
                        
                        if (matches.length > 0) {
                            results.innerHTML = `
                                <div class="success">Found ${matches.length} matches:</div>
                                <ul>
                                    ${matches.map(match => `<li>"${match[0]}"</li>`).join('')}
                                </ul>
                            `;
                        } else {
                            results.innerHTML = '<div class="info">No matches found.</div>';
                        }
                    } catch (e) {
                        results.innerHTML = `<div class="error">Invalid regex: ${e.message}</div>`;
                    }
                });
            }
        }
    };
    
    // Define tool groups for pagination (5 tools per page)
    const toolGroups = {
        1: ['text-speech', 'password', 'qrcode', 'wordcount', 'textanalyzer'],
        2: ['base64', 'json', 'markdown', 'lorem', 'regex'],
        3: ['unit-converter', 'bmi', 'age-calculator', 'timer', 'number-words'],
        4: ['quote', 'color-picker', 'text-case', 'ip-info', 'typing-test']
    };
    
    // Get container and pagination elements
    const toolsContainer = document.querySelector('.tools-container');
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    
    // Function to render a specific page of tools
    function renderToolsPage(pageNum) {
        // Clear existing tools
        toolsContainer.innerHTML = '';
        
        // Get tools for this page
        const toolsForPage = toolGroups[pageNum];
        
        if (!toolsForPage) return;
        
        // Create and append each tool card
        toolsForPage.forEach(toolId => {
            const tool = window.allTools[toolId];
            
            if (tool) {
                const toolCard = document.createElement('div');
                toolCard.className = 'tool-card';
                toolCard.setAttribute('data-tool', toolId);
                toolCard.innerHTML = tool.html;
                
                toolsContainer.appendChild(toolCard);
                
                // Initialize tool functionality
                if (tool.init) {
                    tool.init(toolCard);
                }
            }
        });
    }
    
    // Set up pagination event listeners
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            // Update active button
            paginationBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Render the selected page
            renderToolsPage(parseInt(page));
        });
    });
    
    // Initialize with page 1
    renderToolsPage(1);
    
    // Helper function for showing tooltips
    function showTooltip(element, message) {
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.textContent = message;
        
        // Style the tooltip
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.fontSize = '14px';
        tooltip.style.zIndex = '1000';
        
        // Position the tooltip above the element
        const rect = element.getBoundingClientRect();
        tooltip.style.top = `${rect.top - 30}px`;
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.transform = 'translateX(-50%)';
        
        // Add to document and remove after delay
        document.body.appendChild(tooltip);
        setTimeout(() => {
            document.body.removeChild(tooltip);
        }, 2000);
    }
});