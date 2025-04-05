document.addEventListener('DOMContentLoaded', function() {
    // Add these tools to the global allTools object
    if (typeof window.allTools !== 'undefined') {
        Object.assign(window.allTools, {
            // Page 4 Tools
            'quote': {
                html: `
                    <div class="tool-icon"><i class="fas fa-quote-right"></i></div>
                    <h3>Random Quote Generator</h3>
                    <div class="tool-content">
                        <div class="quote-display">Click the button to generate a quote</div>
                        <button class="tool-button">Generate Quote</button>
                    </div>
                `,
                init: function(toolCard) {
                    const quoteDisplay = toolCard.querySelector('.quote-display');
                    const generateBtn = toolCard.querySelector('.tool-button');
                    
                    const quotes = [
                        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
                        { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
                        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
                        { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
                        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
                        { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
                        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
                        { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
                        { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
                        { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" }
                    ];
                    
                    generateBtn.addEventListener('click', function() {
                        const randomIndex = Math.floor(Math.random() * quotes.length);
                        const quote = quotes[randomIndex];
                        
                        quoteDisplay.innerHTML = `
                            <blockquote>
                                <p>"${quote.text}"</p>
                                <footer>— ${quote.author}</footer>
                            </blockquote>
                        `;
                    });
                }
            },
            'color-picker': {
                html: `
                    <div class="tool-icon"><i class="fas fa-palette"></i></div>
                    <h3>Color Picker</h3>
                    <div class="tool-content">
                        <input type="color" class="color-input" value="#8a2be2">
                        <div class="color-info">
                            <div class="color-preview"></div>
                            <div class="color-values">
                                <div>HEX: <span class="hex-value">#8a2be2</span></div>
                                <div>RGB: <span class="rgb-value">rgb(138, 43, 226)</span></div>
                                <div>HSL: <span class="hsl-value">hsl(271, 76%, 53%)</span></div>
                            </div>
                        </div>
                    </div>
                `,
                init: function(toolCard) {
                    const colorInput = toolCard.querySelector('.color-input');
                    const colorPreview = toolCard.querySelector('.color-preview');
                    const hexValue = toolCard.querySelector('.hex-value');
                    const rgbValue = toolCard.querySelector('.rgb-value');
                    const hslValue = toolCard.querySelector('.hsl-value');
                    
                    // Style the color preview
                    colorPreview.style.width = '30px';
                    colorPreview.style.height = '30px';
                    colorPreview.style.borderRadius = '50%';
                    colorPreview.style.marginRight = '10px';
                    
                    // Style the color info container
                    toolCard.querySelector('.color-info').style.display = 'flex';
                    toolCard.querySelector('.color-info').style.alignItems = 'center';
                    
                    function updateColorInfo(color) {
                        // Update color preview
                        colorPreview.style.backgroundColor = color;
                        
                        // Update HEX value
                        hexValue.textContent = color;
                        
                        // Convert to RGB
                        const r = parseInt(color.slice(1, 3), 16);
                        const g = parseInt(color.slice(3, 5), 16);
                        const b = parseInt(color.slice(5, 7), 16);
                        rgbValue.textContent = `rgb(${r}, ${g}, ${b})`;
                        
                        // Convert to HSL
                        const rNorm = r / 255;
                        const gNorm = g / 255;
                        const bNorm = b / 255;
                        
                        const max = Math.max(rNorm, gNorm, bNorm);
                        const min = Math.min(rNorm, gNorm, bNorm);
                        
                        let h, s, l = (max + min) / 2;
                        
                        if (max === min) {
                            h = s = 0; // achromatic
                        } else {
                            const d = max - min;
                            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                            
                            switch (max) {
                                case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
                                case gNorm: h = (bNorm - rNorm) / d + 2; break;
                                case bNorm: h = (rNorm - gNorm) / d + 4; break;
                            }
                            
                            h /= 6;
                        }
                        
                        h = Math.round(h * 360);
                        s = Math.round(s * 100);
                        l = Math.round(l * 100);
                        
                        hslValue.textContent = `hsl(${h}, ${s}%, ${l}%)`;
                    }
                    
                    // Initialize with default color
                    updateColorInfo(colorInput.value);
                    
                    // Update on color change
                    colorInput.addEventListener('input', function() {
                        updateColorInfo(this.value);
                    });
                }
            },
            'text-case': {
                html: `
                    <div class="tool-icon"><i class="fas fa-font"></i></div>
                    <h3>Text Case Converter</h3>
                    <div class="tool-content">
                        <textarea placeholder="Enter text to convert..." class="case-input"></textarea>
                        <div class="button-group">
                            <button class="tool-button" data-case="upper">UPPERCASE</button>
                            <button class="tool-button" data-case="lower">lowercase</button>
                            <button class="tool-button" data-case="title">Title Case</button>
                            <button class="tool-button" data-case="sentence">Sentence case</button>
                        </div>
                    </div>
                `,
                init: function(toolCard) {
                    const textarea = toolCard.querySelector('.case-input');
                    const buttons = toolCard.querySelectorAll('.tool-button');
                    
                    buttons.forEach(button => {
                        button.addEventListener('click', function() {
                            const text = textarea.value;
                            if (!text) return;
                            
                            const caseType = this.getAttribute('data-case');
                            let result;
                            
                            switch (caseType) {
                                case 'upper':
                                    result = text.toUpperCase();
                                    break;
                                case 'lower':
                                    result = text.toLowerCase();
                                    break;
                                case 'title':
                                    result = text
                                        .toLowerCase()
                                        .split(' ')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(' ');
                                    break;
                                case 'sentence':
                                    result = text
                                        .toLowerCase()
                                        .replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
                                    break;
                            }
                            
                            textarea.value = result;
                        });
                    });
                }
            },
            'ip-info': {
                html: `
                    <div class="tool-icon"><i class="fas fa-network-wired"></i></div>
                    <h3>IP Address Info</h3>
                    <div class="tool-content">
                        <button class="tool-button">Get IP Info</button>
                        <div class="ip-result"></div>
                    </div>
                `,
                init: function(toolCard) {
                    const button = toolCard.querySelector('.tool-button');
                    const result = toolCard.querySelector('.ip-result');
                    
                    button.addEventListener('click', function() {
                        result.innerHTML = '<div class="loading">Loading...</div>';
                        
                        // Get user agent info (available client-side)
                        const userAgent = navigator.userAgent;
                        
                        // Note: In a real implementation, we'd use a server or API
                        // Since this is client-side only, we'll create a mock response
                        setTimeout(() => {
                            result.innerHTML = `
                                <div class="result-item">
                                    <span>User Agent:</span> ${userAgent}
                                </div>
                                <div class="result-item">
                                    <span>IP Address:</span> (Client-side limitation)
                                </div>
                                <div class="result-item">
                                    <span>Browser:</span> ${/chrome/i.test(userAgent) ? 'Chrome' : /firefox/i.test(userAgent) ? 'Firefox' : /safari/i.test(userAgent) ? 'Safari' : 'Other'}
                                </div>
                                <div class="result-item">
                                    <span>OS:</span> ${/windows/i.test(userAgent) ? 'Windows' : /mac/i.test(userAgent) ? 'MacOS' : /linux/i.test(userAgent) ? 'Linux' : 'Other'}
                                </div>
                            `;
                        }, 1000);
                    });
                }
            },
            'typing-test': {
                html: `
                    <div class="tool-icon"><i class="fas fa-keyboard"></i></div>
                    <h3>Typing Speed Test</h3>
                    <div class="tool-content">
                        <div class="typing-text">The quick brown fox jumps over the lazy dog.</div>
                        <textarea placeholder="Start typing here..." class="typing-input" disabled></textarea>
                        <div class="typing-results"></div>
                        <button class="tool-button start-test">Start Test</button>
                    </div>
                `,
                init: function(toolCard) {
                    const sampleText = toolCard.querySelector('.typing-text');
                    const input = toolCard.querySelector('.typing-input');
                    const results = toolCard.querySelector('.typing-results');
                    const startButton = toolCard.querySelector('.start-test');
                    
                    let startTime;
                    let testInProgress = false;
                    
                    // Sample texts for typing test
                    const sampleTexts = [
                        "The quick brown fox jumps over the lazy dog.",
                        "Pack my box with five dozen liquor jugs.",
                        "How vexingly quick daft zebras jump!",
                        "Sphinx of black quartz, judge my vow."
                    ];
                    
                    startButton.addEventListener('click', function() {
                        if (!testInProgress) {
                            // Start new test
                            const randomIndex = Math.floor(Math.random() * sampleTexts.length);
                            sampleText.textContent = sampleTexts[randomIndex];
                            
                            input.value = '';
                            input.disabled = false;
                            input.focus();
                            
                            results.innerHTML = '';
                            startTime = new Date();
                            
                            startButton.textContent = 'Stop Test';
                            testInProgress = true;
                        } else {
                            // End test and calculate results
                            finishTest();
                        }
                    });
                    
                    input.addEventListener('input', function() {
                        if (this.value === sampleText.textContent) {
                            finishTest();
                        }
                    });
                    
                    function finishTest() {
                        const endTime = new Date();
                        const elapsedSeconds = (endTime - startTime) / 1000;
                        const wordCount = sampleText.textContent.split(/\s+/).length;
                        const charCount = sampleText.textContent.length;
                        
                        // Calculate WPM and accuracy
                        const wpm = Math.round((wordCount / elapsedSeconds) * 60);
                        
                        // Simple accuracy - just check if they match
                        const userText = input.value;
                        let correctChars = 0;
                        for (let i = 0; i < Math.min(userText.length, charCount); i++) {
                            if (userText[i] === sampleText.textContent[i]) {
                                correctChars++;
                            }
                        }
                        
                        const accuracy = Math.round((correctChars / charCount) * 100);
                        
                        results.innerHTML = `
                            <div class="result-item">
                                <span>WPM:</span> ${wpm}
                            </div>
                            <div class="result-item">
                                <span>Accuracy:</span> ${accuracy}%
                            </div>
                            <div class="result-item">
                                <span>Time:</span> ${elapsedSeconds.toFixed(1)} seconds
                            </div>
                        `;
                        
                        input.disabled = true;
                        startButton.textContent = 'Start Test';
                        testInProgress = false;
                    }
                }
            }
        });
    }
});