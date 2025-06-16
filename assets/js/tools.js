document.addEventListener('DOMContentLoaded', function() {
    // Define all tool objects with their HTML templates and initialization functions
    window.allTools = {
        // Text Tools (Page 1)
        'text-speech': {
            html: `
                <div class="tool-icon"><i class="fas fa-microphone-alt"></i></div>
                <h3>Text-to-Speech</h3>
                <div class="tool-content">
                    <textarea placeholder="Enter text to convert to speech..."></textarea>
                    <div class="tool-controls">
                        <select class="voice-select">
                            <!-- Will be populated with available voices -->
                        </select>
                    </div>
                    <button class="tool-button">Speak</button>
                </div>
            `,
            init: function(toolCard) {
                const textarea = toolCard.querySelector('textarea');
                const voiceSelect = toolCard.querySelector('.voice-select');
                const speakBtn = toolCard.querySelector('.tool-button');
                
                // Populate voice options
                function populateVoices() {
                    voiceSelect.innerHTML = '';
                    speechSynthesis.getVoices().forEach(voice => {
                        const option = document.createElement('option');
                        option.textContent = `${voice.name} (${voice.lang})`;
                        option.value = voice.name;
                        voiceSelect.appendChild(option);
                    });
                }
                
                populateVoices();
                if (speechSynthesis.onvoiceschanged !== undefined) {
                    speechSynthesis.onvoiceschanged = populateVoices;
                }
                
                speakBtn.addEventListener('click', function() {
                    const text = textarea.value;
                    if (text && 'speechSynthesis' in window) {
                        // Cancel any ongoing speech
                        speechSynthesis.cancel();
                        
                        const utterance = new SpeechSynthesisUtterance(text);
                        const selectedVoice = speechSynthesis.getVoices().find(voice => voice.name === voiceSelect.value);
                        if (selectedVoice) utterance.voice = selectedVoice;
                        
                        speechSynthesis.speak(utterance);
                    } else {
                        alert('Please enter text or check if your browser supports speech synthesis.');
                    }
                });
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
                        <div>Sentences: <span class="sentence-count">0</span></div>
                        <div>Paragraphs: <span class="paragraph-count">0</span></div>
                    </div>
                </div>
            `,
            init: function(toolCard) {
                const textarea = toolCard.querySelector('textarea');
                const wordCount = toolCard.querySelector('.word-count');
                const charCount = toolCard.querySelector('.char-count');
                const sentenceCount = toolCard.querySelector('.sentence-count');
                const paragraphCount = toolCard.querySelector('.paragraph-count');
                
                textarea.addEventListener('input', function() {
                    const text = this.value;
                    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
                    const chars = text.length;
                    const sentences = text.split(/[.!?]+\s/).length - 1;
                    const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0).length;
                    
                    wordCount.textContent = words;
                    charCount.textContent = chars;
                    sentenceCount.textContent = sentences;
                    paragraphCount.textContent = paragraphs;
                });
            }
        },
        'text-case': {
            html: `
                <div class="tool-icon"><i class="fas fa-text-height"></i></div>
                <h3>Text Case Converter</h3>
                <div class="tool-content">
                    <textarea placeholder="Enter text to convert..."></textarea>
                    <div class="button-group">
                        <button class="tool-button" data-case="upper">UPPERCASE</button>
                        <button class="tool-button" data-case="lower">lowercase</button>
                        <button class="tool-button" data-case="title">Title Case</button>
                        <button class="tool-button" data-case="sentence">Sentence case</button>
                    </div>
                </div>
            `,
            init: function(toolCard) {
                const textarea = toolCard.querySelector('textarea');
                const buttons = toolCard.querySelectorAll('.tool-button');
                
                buttons.forEach(button => {
                    button.addEventListener('click', function() {
                        const text = textarea.value;
                        switch(this.dataset.case) {
                            case 'upper':
                                textarea.value = text.toUpperCase();
                                break;
                            case 'lower':
                                textarea.value = text.toLowerCase();
                                break;
                            case 'title':
                                textarea.value = text.toLowerCase().split(' ')
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(' ');
                                break;
                            case 'sentence':
                                textarea.value = text.toLowerCase().replace(/(^\w|\.\s+\w)/g, letter => letter.toUpperCase());
                                break;
                        }
                    });
                });
            }
        },
        'text-diff': {
            html: `
                <div class="tool-icon"><i class="fas fa-code-compare"></i></div>
                <h3>Text Difference</h3>
                <div class="tool-content">
                    <div class="split-view">
                        <textarea placeholder="Original text..."></textarea>
                        <textarea placeholder="Modified text..."></textarea>
                    </div>
                    <button class="tool-button">Compare</button>
                    <div class="diff-result"></div>
                </div>
            `,
            init: function(toolCard) {
                const original = toolCard.querySelector('.split-view textarea:first-child');
                const modified = toolCard.querySelector('.split-view textarea:last-child');
                const compareBtn = toolCard.querySelector('.tool-button');
                const result = toolCard.querySelector('.diff-result');
                
                compareBtn.addEventListener('click', function() {
                    const text1 = original.value;
                    const text2 = modified.value;
                    
                    // Simple diff implementation
                    const words1 = text1.split(/\s+/);
                    const words2 = text2.split(/\s+/);
                    let html = '';
                    
                    const maxLen = Math.max(words1.length, words2.length);
                    for(let i = 0; i < maxLen; i++) {
                        if (words1[i] !== words2[i]) {
                            if (words1[i]) html += `<span class="deleted">${words1[i]}</span> `;
                            if (words2[i]) html += `<span class="added">${words2[i]}</span> `;
                        } else {
                            html += words1[i] + ' ';
                        }
                    }
                    
                    result.innerHTML = html;
                });
            }
        },

        // Converters (Page 2)
        'unit-converter': {
            html: `
                <div class="tool-icon"><i class="fas fa-exchange-alt"></i></div>
                <h3>Unit Converter</h3>
                <div class="tool-content">
                    <select class="conversion-type">
                        <option value="length">Length</option>
                        <option value="weight">Weight</option>
                        <option value="temperature">Temperature</option>
                        <option value="area">Area</option>
                        <option value="volume">Volume</option>
                        <option value="speed">Speed</option>
                    </select>
                    <div class="converter-inputs">
                        <input type="number" class="from-value">
                        <select class="from-unit"></select>
                        <span>to</span>
                        <select class="to-unit"></select>
                        <input type="text" readonly class="to-value">
                    </div>
                    <button class="tool-button">Convert</button>
                </div>
            `,
            init: function(toolCard) {
                // Implementation will be added in additional-tools.js
            }
        },
        'color-converter': {
            html: `
                <div class="tool-icon"><i class="fas fa-palette"></i></div>
                <h3>Color Converter</h3>
                <div class="tool-content">
                    <input type="color" class="color-picker">
                    <div class="color-values">
                        <div>HEX: <input type="text" class="hex-value"></div>
                        <div>RGB: <input type="text" class="rgb-value"></div>
                        <div>HSL: <input type="text" class="hsl-value"></div>
                        <div>CMYK: <input type="text" class="cmyk-value"></div>
                    </div>
                    <div class="color-preview"></div>
                </div>
            `,
            init: function(toolCard) {
                const colorPicker = toolCard.querySelector('.color-picker');
                const hexValue = toolCard.querySelector('.hex-value');
                const rgbValue = toolCard.querySelector('.rgb-value');
                const hslValue = toolCard.querySelector('.hsl-value');
                const cmykValue = toolCard.querySelector('.cmyk-value');
                const preview = toolCard.querySelector('.color-preview');

                function updateValues(color) {
                    const rgb = hexToRgb(color);
                    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

                    hexValue.value = color;
                    rgbValue.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
                    hslValue.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
                    cmykValue.value = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
                    preview.style.backgroundColor = color;
                }

                colorPicker.addEventListener('input', function() {
                    updateValues(this.value);
                });
                updateValues(colorPicker.value);
            }
        },
        'number-base': {
            html: `
                <div class="tool-icon"><i class="fas fa-superscript"></i></div>
                <h3>Number Base Converter</h3>
                <div class="tool-content">
                    <input type="text" class="number-input" placeholder="Enter a number">
                    <div class="base-results">
                        <div>Binary: <span class="binary"></span></div>
                        <div>Octal: <span class="octal"></span></div>
                        <div>Decimal: <span class="decimal"></span></div>
                        <div>Hexadecimal: <span class="hex"></span></div>
                    </div>
                </div>
            `,
            init: function(toolCard) {
                const input = toolCard.querySelector('.number-input');
                const binary = toolCard.querySelector('.binary');
                const octal = toolCard.querySelector('.octal');
                const decimal = toolCard.querySelector('.decimal');
                const hex = toolCard.querySelector('.hex');

                input.addEventListener('input', function() {
                    try {
                        const num = parseInt(this.value);
                        if (isNaN(num)) throw new Error('Invalid number');

                        binary.textContent = convertBase(num, 10, 2);
                        octal.textContent = convertBase(num, 10, 8);
                        decimal.textContent = num;
                        hex.textContent = convertBase(num, 10, 16).toUpperCase();
                    } catch (e) {
                        binary.textContent = octal.textContent = decimal.textContent = hex.textContent = 'Invalid input';
                    }
                });
            }
        },
        'json-yaml': {
            html: `
                <div class="tool-icon"><i class="fas fa-code"></i></div>
                <h3>JSON ↔ YAML</h3>
                <div class="tool-content">
                    <div class="split-view">
                        <textarea placeholder="Enter JSON or YAML..."></textarea>
                        <textarea readonly></textarea>
                    </div>
                    <div class="button-group">
                        <button class="tool-button json-to-yaml">JSON to YAML</button>
                        <button class="tool-button yaml-to-json">YAML to JSON</button>
                    </div>
                </div>
            `,
            init: function(toolCard) {
                const input = toolCard.querySelector('textarea:first-child');
                const output = toolCard.querySelector('textarea:last-child');
                const jsonToYamlBtn = toolCard.querySelector('.json-to-yaml');
                const yamlToJsonBtn = toolCard.querySelector('.yaml-to-json');

                jsonToYamlBtn.addEventListener('click', function() {
                    try {
                        const json = JSON.parse(input.value);
                        output.value = jsyaml.dump(json);
                    } catch (e) {
                        output.value = 'Error: Invalid JSON\n' + e.message;
                    }
                });

                yamlToJsonBtn.addEventListener('click', function() {
                    try {
                        const json = jsyaml.load(input.value);
                        output.value = JSON.stringify(json, null, 2);
                    } catch (e) {
                        output.value = 'Error: Invalid YAML\n' + e.message;
                    }
                });
            }
        },

        // Generators (Page 3)
        'password': {
            html: `
                <div class="tool-icon"><i class="fas fa-key"></i></div>
                <h3>Password Generator</h3>
                <div class="tool-content">
                    <div class="tool-controls">
                        <label>Length: <input type="number" min="8" max="64" value="16"></label>
                        <label><input type="checkbox" checked> Uppercase</label>
                        <label><input type="checkbox" checked> Numbers</label>
                        <label><input type="checkbox" checked> Symbols</label>
                    </div>
                    <input type="text" readonly class="generated-password">
                    <div class="password-strength"></div>
                    <button class="tool-button">Generate</button>
                </div>
            `,
            init: function(toolCard) {
                const lengthInput = toolCard.querySelector('input[type="number"]');
                const uppercaseCheck = toolCard.querySelector('input[type="checkbox"]:nth-of-type(1)');
                const numbersCheck = toolCard.querySelector('input[type="checkbox"]:nth-of-type(2)');
                const symbolsCheck = toolCard.querySelector('input[type="checkbox"]:nth-of-type(3)');
                const output = toolCard.querySelector('.generated-password');
                const generateBtn = toolCard.querySelector('.tool-button');
                const strengthIndicator = toolCard.querySelector('.password-strength');
                
                function generatePassword() {
                    const length = parseInt(lengthInput.value);
                    const useUpper = uppercaseCheck.checked;
                    const useNumbers = numbersCheck.checked;
                    const useSymbols = symbolsCheck.checked;
                    
                    let chars = 'abcdefghijklmnopqrstuvwxyz';
                    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    if (useNumbers) chars += '0123456789';
                    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
                    
                    let password = '';
                    for (let i = 0; i < length; i++) {
                        password += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    
                    output.value = password;
                    
                    // Calculate password strength
                    let strength = 0;
                    if (password.length >= 12) strength++;
                    if (useUpper) strength++;
                    if (useNumbers) strength++;
                    if (useSymbols) strength++;
                    
                    const strengthText = ['Weak', 'Fair', 'Good', 'Strong'][strength - 1];
                    strengthIndicator.textContent = `Strength: ${strengthText}`;
                    strengthIndicator.className = 'password-strength ' + strengthText.toLowerCase();
                }
                
                generateBtn.addEventListener('click', generatePassword);
                generatePassword(); // Generate initial password
            }
        },
        'qrcode': {
            html: `
                <div class="tool-icon"><i class="fas fa-qrcode"></i></div>
                <h3>QR Code Generator</h3>
                <div class="tool-content">
                    <input type="text" placeholder="Enter text or URL">
                    <div class="qr-options">
                        <label>Size: <input type="number" min="100" max="500" value="200" step="50"></label>
                        <label>Color: <input type="color" value="#000000"></label>
                    </div>
                    <div class="qrcode-output"></div>
                    <button class="tool-button">Generate QR</button>
                    <button class="tool-button download-btn" style="display:none">Download</button>
                </div>
            `,
            init: function(toolCard) {
                const input = toolCard.querySelector('input[type="text"]');
                const sizeInput = toolCard.querySelector('input[type="number"]');
                const colorInput = toolCard.querySelector('input[type="color"]');
                const output = toolCard.querySelector('.qrcode-output');
                const generateBtn = toolCard.querySelector('.tool-button');
                const downloadBtn = toolCard.querySelector('.download-btn');
                let qr = null;
                
                generateBtn.addEventListener('click', function() {
                    const text = input.value;
                    const size = parseInt(sizeInput.value);
                    const color = colorInput.value;
                    
                        if (text) {
                        output.innerHTML = '';
                        qr = new QRCode(output, {
                                text: text,
                            width: size,
                            height: size,
                            colorDark: color,
                            colorLight: "#ffffff",
                                correctLevel: QRCode.CorrectLevel.H
                            });
                        downloadBtn.style.display = 'inline-block';
                    }
                });
                
                downloadBtn.addEventListener('click', function() {
                    const canvas = output.querySelector('canvas');
                    if (canvas) {
                        const link = document.createElement('a');
                        link.download = 'qrcode.png';
                        link.href = canvas.toDataURL();
                        link.click();
                    }
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
                            Type:
                            <select class="type-select">
                                <option value="paragraphs">Paragraphs</option>
                                <option value="sentences">Sentences</option>
                                <option value="words">Words</option>
                            </select>
                        </label>
                        <label>
                            Count:
                            <input type="number" min="1" max="50" value="3" class="count-input">
                        </label>
                    </div>
                    <button class="tool-button">Generate</button>
                    <div class="lorem-output"></div>
                </div>
            `,
            init: function(toolCard) {
                const typeSelect = toolCard.querySelector('.type-select');
                const countInput = toolCard.querySelector('.count-input');
                const generateBtn = toolCard.querySelector('.tool-button');
                const output = toolCard.querySelector('.lorem-output');

                generateBtn.addEventListener('click', function() {
                    const type = typeSelect.value;
                    const count = parseInt(countInput.value);

                    let text = '';
                    switch(type) {
                        case 'words':
                            text = loremIpsum.generateWords(count);
                            break;
                        case 'sentences':
                            text = loremIpsum.generateSentences(count);
                            break;
                        case 'paragraphs':
                            text = loremIpsum.generateParagraphs(count);
                            break;
                    }

                    output.innerHTML = text.split('\n').map(p => `<p>${p}</p>`).join('');
                });
            }
        },
        'uuid': {
            html: `
                <div class="tool-icon"><i class="fas fa-fingerprint"></i></div>
                <h3>UUID Generator</h3>
                <div class="tool-content">
                    <div class="tool-controls">
                        <label>
                            Version:
                            <select>
                                <option value="4">v4 (Random)</option>
                                <option value="1">v1 (Timestamp)</option>
                            </select>
                        </label>
                    </div>
                    <input type="text" readonly class="uuid-output">
                    <button class="tool-button">Generate UUID</button>
                </div>
            `,
            init: function(toolCard) {
                const versionSelect = toolCard.querySelector('select');
                const output = toolCard.querySelector('.uuid-output');
                const generateBtn = toolCard.querySelector('.tool-button');

                generateBtn.addEventListener('click', function() {
                    const version = parseInt(versionSelect.value);
                    output.value = generateUUID(version);
                });

                // Generate initial UUID
                output.value = generateUUID(4);
            }
        },

        // Utilities (Page 4)
        'regex': {
            html: `
                <div class="tool-icon"><i class="fas fa-search"></i></div>
                <h3>Regex Tester</h3>
                <div class="tool-content">
                    <input type="text" placeholder="Enter regex pattern" class="regex-pattern">
                    <div class="regex-flags">
                        <label><input type="checkbox" value="g"> Global</label>
                        <label><input type="checkbox" value="i"> Case-insensitive</label>
                        <label><input type="checkbox" value="m"> Multiline</label>
                    </div>
                    <textarea placeholder="Enter test text..." class="test-text"></textarea>
                    <button class="tool-button">Test</button>
                    <div class="regex-results"></div>
                </div>
            `,
            init: function(toolCard) {
                const patternInput = toolCard.querySelector('.regex-pattern');
                const flagInputs = toolCard.querySelectorAll('.regex-flags input');
                const testText = toolCard.querySelector('.test-text');
                const testBtn = toolCard.querySelector('.tool-button');
                const results = toolCard.querySelector('.regex-results');
                
                testBtn.addEventListener('click', function() {
                    try {
                        const pattern = patternInput.value;
                        const flags = Array.from(flagInputs)
                            .filter(input => input.checked)
                            .map(input => input.value)
                            .join('');
                        
                        const regex = new RegExp(pattern, flags);
                        const text = testText.value;
                        const matches = text.match(regex) || [];
                        
                        results.innerHTML = `
                            <div>Matches found: ${matches.length}</div>
                            <div>Matches: ${matches.map(m => `<span class="match">${m}</span>`).join(', ')}</div>
                        `;
                    } catch (e) {
                        results.innerHTML = `<div class="error">Invalid regex: ${e.message}</div>`;
                    }
                });
            }
        },
        'json-formatter': {
            html: `
                <div class="tool-icon"><i class="fas fa-code"></i></div>
                <h3>JSON Formatter</h3>
                <div class="tool-content">
                    <textarea placeholder="Paste your JSON here..."></textarea>
                    <div class="button-group">
                        <button class="tool-button format-btn">Format</button>
                        <button class="tool-button minify-btn">Minify</button>
                        <button class="tool-button validate-btn">Validate</button>
                    </div>
                    <div class="format-result"></div>
                </div>
            `,
            init: function(toolCard) {
                const textarea = toolCard.querySelector('textarea');
                const formatBtn = toolCard.querySelector('.format-btn');
                const minifyBtn = toolCard.querySelector('.minify-btn');
                const validateBtn = toolCard.querySelector('.validate-btn');
                const result = toolCard.querySelector('.format-result');
                
                formatBtn.addEventListener('click', function() {
                    try {
                        const json = JSON.parse(textarea.value);
                        textarea.value = JSON.stringify(json, null, 2);
                        result.innerHTML = '<div class="success">JSON formatted successfully</div>';
                    } catch (e) {
                        result.innerHTML = `<div class="error">Invalid JSON: ${e.message}</div>`;
                    }
                });
                
                minifyBtn.addEventListener('click', function() {
                    try {
                        const json = JSON.parse(textarea.value);
                        textarea.value = JSON.stringify(json);
                        result.innerHTML = '<div class="success">JSON minified successfully</div>';
                    } catch (e) {
                        result.innerHTML = `<div class="error">Invalid JSON: ${e.message}</div>`;
                    }
                });
                
                validateBtn.addEventListener('click', function() {
                    try {
                        JSON.parse(textarea.value);
                        result.innerHTML = '<div class="success">Valid JSON</div>';
                    } catch (e) {
                        result.innerHTML = `<div class="error">Invalid JSON: ${e.message}</div>`;
                    }
                });
            }
        },
        'markdown': {
            html: `
                <div class="tool-icon"><i class="fab fa-markdown"></i></div>
                <h3>Markdown Preview</h3>
                <div class="tool-content">
                    <div class="split-view">
                        <textarea placeholder="Write your markdown here..."></textarea>
                        <div class="markdown-preview"></div>
                    </div>
                </div>
            `,
            init: function(toolCard) {
                const textarea = toolCard.querySelector('textarea');
                const preview = toolCard.querySelector('.markdown-preview');
                
                function updatePreview() {
                    const markdown = textarea.value;
                    preview.innerHTML = marked.parse(markdown);
                    // Highlight code blocks
                    preview.querySelectorAll('pre code').forEach((block) => {
                        hljs.highlightElement(block);
                    });
                }
                
                textarea.addEventListener('input', updatePreview);
                // Initial preview
                updatePreview();
            }
        },
        'base64': {
            html: `
                <div class="tool-icon"><i class="fas fa-file-code"></i></div>
                <h3>Base64 Encoder/Decoder</h3>
                <div class="tool-content">
                    <textarea placeholder="Enter text to encode/decode..."></textarea>
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
                const output = toolCard.querySelector('.result-output');
                
                encodeBtn.addEventListener('click', function() {
                    try {
                    const text = textarea.value;
                        const encoded = btoa(text);
                        output.innerHTML = `
                            <div class="success">
                                <strong>Encoded:</strong>
                            <div class="result-text">${encoded}</div>
                            </div>
                        `;
                    } catch (e) {
                        output.innerHTML = `<div class="error">Error encoding: ${e.message}</div>`;
                    }
                });
                
                decodeBtn.addEventListener('click', function() {
                    try {
                        const text = textarea.value;
                        const decoded = atob(text);
                        output.innerHTML = `
                            <div class="success">
                                <strong>Decoded:</strong>
                            <div class="result-text">${decoded}</div>
                            </div>
                        `;
                    } catch (e) {
                        output.innerHTML = `<div class="error">Error decoding: Invalid Base64 string</div>`;
                    }
                });
            }
        },

        // Development Tools (Page 5)
        'html-encoder': {
            html: `
                <div class="tool-icon"><i class="fas fa-code"></i></div>
                <h3>HTML Encoder/Decoder</h3>
                <div class="tool-content">
                    <textarea placeholder="Enter HTML or text to encode/decode..."></textarea>
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
                const output = toolCard.querySelector('.result-output');

                encodeBtn.addEventListener('click', function() {
                    try {
                        const encoded = htmlCoder.encode(textarea.value);
                        output.innerHTML = `
                            <div class="success">
                                <strong>Encoded HTML:</strong>
                                <pre><code>${encoded}</code></pre>
                            </div>
                        `;
                    } catch (e) {
                        output.innerHTML = `<div class="error">Error encoding: ${e.message}</div>`;
                    }
                });

                decodeBtn.addEventListener('click', function() {
                    try {
                        const decoded = htmlCoder.decode(textarea.value);
                        output.innerHTML = `
                            <div class="success">
                                <strong>Decoded HTML:</strong>
                                <pre><code>${decoded}</code></pre>
                            </div>
                        `;
                    } catch (e) {
                        output.innerHTML = `<div class="error">Error decoding: ${e.message}</div>`;
                    }
                });
            }
        },
        'jwt-decoder': {
            html: `
                <div class="tool-icon"><i class="fas fa-key"></i></div>
                <h3>JWT Decoder</h3>
                <div class="tool-content">
                    <textarea placeholder="Paste your JWT token..."></textarea>
                    <button class="tool-button">Decode</button>
                    <div class="jwt-output">
                        <div class="header"></div>
                        <div class="payload"></div>
                        <div class="signature"></div>
                    </div>
                </div>
            `,
            init: function(toolCard) {
                const textarea = toolCard.querySelector('textarea');
                const decodeBtn = toolCard.querySelector('.tool-button');
                const header = toolCard.querySelector('.header');
                const payload = toolCard.querySelector('.payload');
                const signature = toolCard.querySelector('.signature');

                decodeBtn.addEventListener('click', function() {
                    try {
                        const decoded = decodeJWT(textarea.value);
                        header.innerHTML = `
                            <h4>Header:</h4>
                            <pre><code>${JSON.stringify(decoded.header, null, 2)}</code></pre>
                        `;
                        payload.innerHTML = `
                            <h4>Payload:</h4>
                            <pre><code>${JSON.stringify(decoded.payload, null, 2)}</code></pre>
                        `;
                        signature.innerHTML = `
                            <h4>Signature:</h4>
                            <pre><code>${decoded.signature}</code></pre>
                        `;
                    } catch (e) {
                        header.innerHTML = payload.innerHTML = signature.innerHTML = `
                            <div class="error">${e.message}</div>
                        `;
                    }
                });
            }
        },
        'cron-parser': {
            html: `
                <div class="tool-icon"><i class="fas fa-clock"></i></div>
                <h3>Cron Expression Parser</h3>
                <div class="tool-content">
                    <input type="text" placeholder="Enter cron expression (e.g., * * * * *)" class="cron-input">
                    <button class="tool-button">Parse</button>
                    <div class="cron-result"></div>
                    <div class="next-runs"></div>
                </div>
            `,
            init: function(toolCard) {
                const input = toolCard.querySelector('.cron-input');
                const parseBtn = toolCard.querySelector('.tool-button');
                const result = toolCard.querySelector('.cron-result');
                const nextRuns = toolCard.querySelector('.next-runs');

                parseBtn.addEventListener('click', function() {
                    try {
                        const parsed = cronParser.parse(input.value);
                        result.innerHTML = `
                            <div class="success">
                                <h4>Parsed Expression:</h4>
                                <ul>
                                    ${Object.entries(parsed).map(([field, value]) => 
                                        `<li><strong>${field}:</strong> ${value}</li>`
                                    ).join('')}
                                </ul>
                            </div>
                        `;

                        const runs = cronParser.getNextRuns(input.value);
                        nextRuns.innerHTML = `
                            <div class="success">
                                <h4>Next 5 Runs:</h4>
                                <ul>
                                    ${runs.map(run => `<li>${run}</li>`).join('')}
                                </ul>
                            </div>
                        `;
                    } catch (e) {
                        result.innerHTML = `<div class="error">${e.message}</div>`;
                        nextRuns.innerHTML = '';
                    }
                });
            }
        },
        'sql-formatter': {
            html: `
                <div class="tool-icon"><i class="fas fa-database"></i></div>
                <h3>SQL Formatter</h3>
                <div class="tool-content">
                    <textarea placeholder="Enter SQL query..."></textarea>
                    <div class="button-group">
                        <button class="tool-button format-btn">Format</button>
                        <button class="tool-button minify-btn">Minify</button>
                    </div>
                    <div class="format-result"></div>
                </div>
            `,
            init: function(toolCard) {
                const textarea = toolCard.querySelector('textarea');
                const formatBtn = toolCard.querySelector('.format-btn');
                const minifyBtn = toolCard.querySelector('.minify-btn');
                const result = toolCard.querySelector('.format-result');

                formatBtn.addEventListener('click', function() {
                    try {
                        const formatted = sqlFormatter.format(textarea.value);
                        textarea.value = formatted;
                        result.innerHTML = '<div class="success">SQL formatted successfully</div>';
                    } catch (e) {
                        result.innerHTML = `<div class="error">Error formatting SQL: ${e.message}</div>`;
                    }
                });

                minifyBtn.addEventListener('click', function() {
                    try {
                        const minified = sqlFormatter.minify(textarea.value);
                        textarea.value = minified;
                        result.innerHTML = '<div class="success">SQL minified successfully</div>';
                    } catch (e) {
                        result.innerHTML = `<div class="error">Error minifying SQL: ${e.message}</div>`;
                    }
                });
            }
        }
    };
    
    // Define tool groups for pagination
    const toolGroups = {
        1: ['text-speech', 'wordcount', 'text-case', 'text-diff'],              // Text Tools
        2: ['unit-converter', 'color-converter', 'number-base', 'json-yaml'],   // Converters
        3: ['password', 'qrcode', 'lorem', 'uuid'],                            // Generators
        4: ['regex', 'json-formatter', 'markdown', 'base64'],                  // Utilities
        5: ['html-encoder', 'jwt-decoder', 'cron-parser', 'sql-formatter']     // Development Tools
    };

    // Get container and navigation elements
    const toolsContainer = document.querySelector('.tools-container');
    const navButtons = document.querySelectorAll('.nav-btn');
    
    // Function to render a specific page of tools
    function renderToolsPage(pageNum) {
        toolsContainer.innerHTML = '';
        const toolsForPage = toolGroups[pageNum];
        
        if (!toolsForPage) return;
        
        toolsForPage.forEach(toolId => {
            const tool = window.allTools[toolId];
            if (tool) {
                const toolCard = document.createElement('div');
                toolCard.className = 'tool-card';
                toolCard.setAttribute('data-tool', toolId);
                toolCard.innerHTML = tool.html;
                toolsContainer.appendChild(toolCard);
                
                if (tool.init) {
                    tool.init(toolCard);
                }
            }
        });
    }
    
    // Set up navigation event listeners
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            // Update active button
            navButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Render the selected page
            renderToolsPage(parseInt(page));
        });
    });
    
    // Initialize with page 1
    renderToolsPage(1);
});