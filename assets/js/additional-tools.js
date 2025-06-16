document.addEventListener('DOMContentLoaded', function() {
    // Only proceed if we have the main allTools object from tools.js
    if (typeof window.allTools === 'undefined') {
        // Store additional tools for later addition
        window.additionalTools = createAdditionalTools();
        return;
    }
    
    // Add additional tools
    Object.assign(window.allTools, createAdditionalTools());
});

function createAdditionalTools() {
    return {
        // Page 3 Tools
        'unit-converter': {
            html: `
                <div class="tool-icon"><i class="fas fa-exchange-alt"></i></div>
                <h3>Unit Converter</h3>
                <div class="tool-content">
                    <div class="tool-controls">
                        <select class="conversion-type">
                            <option value="length">Length</option>
                            <option value="weight">Weight</option>
                            <option value="temperature">Temperature</option>
                        </select>
                    </div>
                    <div class="converter-inputs">
                        <div class="input-group">
                            <input type="number" class="from-value" value="1">
                            <select class="from-unit"></select>
                        </div>
                        <div class="input-group">
                            <input type="number" class="to-value" readonly>
                            <select class="to-unit"></select>
                        </div>
                    </div>
                </div>
            `,
            init: function(toolCard) {
                const conversionType = toolCard.querySelector('.conversion-type');
                const fromValue = toolCard.querySelector('.from-value');
                const fromUnit = toolCard.querySelector('.from-unit');
                const toValue = toolCard.querySelector('.to-value');
                const toUnit = toolCard.querySelector('.to-unit');
                
                const units = {
                    length: ['meters', 'kilometers', 'centimeters', 'miles', 'feet', 'inches'],
                    weight: ['kilograms', 'grams', 'pounds', 'ounces'],
                    temperature: ['celsius', 'fahrenheit', 'kelvin']
                };
                
                // Conversion rates to base unit (meters, kilograms, celsius)
                const conversionRates = {
                    length: {
                        meters: 1,
                        kilometers: 1000,
                        centimeters: 0.01,
                        miles: 1609.34,
                        feet: 0.3048,
                        inches: 0.0254
                    },
                    weight: {
                        kilograms: 1,
                        grams: 0.001,
                        pounds: 0.453592,
                        ounces: 0.0283495
                    }
                };
                
                // Temperature conversion requires special formulas
                function convertTemperature(value, fromUnit, toUnit) {
                    // Convert to Celsius first
                    let celsiusValue;
                    if (fromUnit === 'celsius') {
                        celsiusValue = value;
                    } else if (fromUnit === 'fahrenheit') {
                        celsiusValue = (value - 32) * 5/9;
                    } else if (fromUnit === 'kelvin') {
                        celsiusValue = value - 273.15;
                    }
                    
                    // Convert from Celsius to target unit
                    if (toUnit === 'celsius') {
                        return celsiusValue;
                    } else if (toUnit === 'fahrenheit') {
                        return (celsiusValue * 9/5) + 32;
                    } else if (toUnit === 'kelvin') {
                        return celsiusValue + 273.15;
                    }
                }
                
                // Populate units based on selected type
                function populateUnits() {
                    const type = conversionType.value;
                    fromUnit.innerHTML = '';
                    toUnit.innerHTML = '';
                    
                    units[type].forEach(unit => {
                        fromUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
                        toUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
                    });
                    
                    // Set default "to" unit to something different than "from"
                    if (units[type].length > 1) {
                        toUnit.selectedIndex = 1;
                    }
                    
                    convert();
                }
                
                // Convert between units
                function convert() {
                    const type = conversionType.value;
                    const value = parseFloat(fromValue.value);
                    
                    if (isNaN(value)) {
                        toValue.value = '';
                        return;
                    }
                    
                    const from = fromUnit.value;
                    const to = toUnit.value;
                    
                    let result;
                    if (type === 'temperature') {
                        result = convertTemperature(value, from, to);
                    } else {
                        // For length and weight, convert to base unit first, then to target unit
                        const baseValue = value * conversionRates[type][from];
                        result = baseValue / conversionRates[type][to];
                    }
                    
                    toValue.value = result.toFixed(4);
                }
                
                // Initialize
                populateUnits();
                
                // Add event listeners
                conversionType.addEventListener('change', populateUnits);
                fromValue.addEventListener('input', convert);
                fromUnit.addEventListener('change', convert);
                toUnit.addEventListener('change', convert);
            }
        },
        'bmi': {
            html: `
                <div class="tool-icon"><i class="fas fa-weight"></i></div>
                <h3>BMI Calculator</h3>
                <div class="tool-content">
                    <div class="input-group">
                        <label>Height (cm):</label>
                        <input type="number" class="height-input" placeholder="e.g., 170">
                    </div>
                    <div class="input-group">
                        <label>Weight (kg):</label>
                        <input type="number" class="weight-input" placeholder="e.g., 70">
                    </div>
                    <button class="tool-button">Calculate BMI</button>
                    <div class="bmi-result"></div>
                </div>
            `,
            init: function(toolCard) {
                const heightInput = toolCard.querySelector('.height-input');
                const weightInput = toolCard.querySelector('.weight-input');
                const calculateBtn = toolCard.querySelector('.tool-button');
                const result = toolCard.querySelector('.bmi-result');
                
                calculateBtn.addEventListener('click', function() {
                    const height = parseFloat(heightInput.value);
                    const weight = parseFloat(weightInput.value);
                    
                    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
                        result.innerHTML = '<div class="error">Please enter valid height and weight values.</div>';
                        return;
                    }
                    
                    // Calculate BMI: weight (kg) / (height (m))²
                    const heightInMeters = height / 100;
                    const bmi = weight / (heightInMeters * heightInMeters);
                    
                    // Determine BMI category
                    let category;
                    if (bmi < 18.5) {
                        category = '<span class="info">Underweight</span>';
                    } else if (bmi < 25) {
                        category = '<span class="success">Normal weight</span>';
                    } else if (bmi < 30) {
                        category = '<span class="info">Overweight</span>';
                    } else {
                        category = '<span class="error">Obesity</span>';
                    }
                    
                    result.innerHTML = `
                        <div class="result-item">
                            <span>BMI:</span> ${bmi.toFixed(1)}
                        </div>
                        <div class="result-item">
                            <span>Category:</span> ${category}
                        </div>
                    `;
                });
            }
        },
        'age-calculator': {
            html: `
                <div class="tool-icon"><i class="fas fa-calendar-alt"></i></div>
                <h3>Age Calculator</h3>
                <div class="tool-content">
                    <div class="input-group">
                        <label>Birth Date:</label>
                        <input type="date" class="birth-date">
                    </div>
                    <button class="tool-button">Calculate Age</button>
                    <div class="age-result"></div>
                </div>
            `,
            init: function(toolCard) {
                const birthDateInput = toolCard.querySelector('.birth-date');
                const calculateBtn = toolCard.querySelector('.tool-button');
                const result = toolCard.querySelector('.age-result');
                
                // Set max date to today
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                birthDateInput.max = `${yyyy}-${mm}-${dd}`;
                
                calculateBtn.addEventListener('click', function() {
                    const birthDate = new Date(birthDateInput.value);
                    
                    if (isNaN(birthDate.getTime())) {
                        result.innerHTML = '<div class="error">Please enter a valid date.</div>';
                        return;
                    }
                    
                    const today = new Date();
                    
                    // Calculate difference in years, months, and days
                    let ageYears = today.getFullYear() - birthDate.getFullYear();
                    let ageMonths = today.getMonth() - birthDate.getMonth();
                    let ageDays = today.getDate() - birthDate.getDate();
                    
                    // Adjust for negative months or days
                    if (ageDays < 0) {
                        ageMonths--;
                        // Get days in the previous month
                        const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                        ageDays += previousMonth.getDate();
                    }
                    
                    if (ageMonths < 0) {
                        ageYears--;
                        ageMonths += 12;
                    }
                    
                    result.innerHTML = `
                        <div class="result-item">
                            <span>Age:</span> ${ageYears} years, ${ageMonths} months, ${ageDays} days
                        </div>
                    `;
                });
            }
        },
        'timer': {
            html: `
                <div class="tool-icon"><i class="fas fa-stopwatch"></i></div>
                <h3>Timer / Stopwatch</h3>
                <div class="tool-content">
                    <div class="timer-display">00:00:00</div>
                    <div class="button-group">
                        <button class="tool-button start-btn">Start</button>
                        <button class="tool-button pause-btn" disabled>Pause</button>
                        <button class="tool-button reset-btn">Reset</button>
                    </div>
                </div>
            `,
            init: function(toolCard) {
                const display = toolCard.querySelector('.timer-display');
                const startBtn = toolCard.querySelector('.start-btn');
                const pauseBtn = toolCard.querySelector('.pause-btn');
                const resetBtn = toolCard.querySelector('.reset-btn');
                
                let startTime;
                let elapsedTime = 0;
                let timerInterval;
                
                function updateDisplay() {
                    const totalSeconds = Math.floor(elapsedTime / 1000);
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    const seconds = totalSeconds % 60;
                    
                    display.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                }
                
                startBtn.addEventListener('click', function() {
                    startTime = Date.now() - elapsedTime;
                    timerInterval = setInterval(function() {
                        elapsedTime = Date.now() - startTime;
                        updateDisplay();
                    }, 1000);
                    
                    startBtn.disabled = true;
                    pauseBtn.disabled = false;
                });
                
                pauseBtn.addEventListener('click', function() {
                    clearInterval(timerInterval);
                    startBtn.disabled = false;
                    pauseBtn.disabled = true;
                });
                
                resetBtn.addEventListener('click', function() {
                    clearInterval(timerInterval);
                    elapsedTime = 0;
                    updateDisplay();
                    startBtn.disabled = false;
                    pauseBtn.disabled = true;
                });
            }
        },
        'number-words': {
            html: `
                <div class="tool-icon"><i class="fas fa-sort-numeric-down"></i></div>
                <h3>Number to Words</h3>
                <div class="tool-content">
                    <div class="input-group">
                        <label>Number:</label>
                        <input type="number" class="number-input" placeholder="Enter a number">
                    </div>
                    <button class="tool-button">Convert</button>
                    <div class="number-result"></div>
                </div>
            `,
            init: function(toolCard) {
                const numberInput = toolCard.querySelector('.number-input');
                const convertBtn = toolCard.querySelector('.tool-button');
                const result = toolCard.querySelector('.number-result');
                
                const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
                const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
                
                function numberToWords(num) {
                    if (num === 0) return 'zero';
                    
                    if (num < 0) return 'negative ' + numberToWords(Math.abs(num));
                    
                    let words = '';
                    
                    if (Math.floor(num / 1000000000) > 0) {
                        words += numberToWords(Math.floor(num / 1000000000)) + ' billion ';
                        num %= 1000000000;
                    }
                    
                    if (Math.floor(num / 1000000) > 0) {
                        words += numberToWords(Math.floor(num / 1000000)) + ' million ';
                        num %= 1000000;
                    }
                    
                    if (Math.floor(num / 1000) > 0) {
                        words += numberToWords(Math.floor(num / 1000)) + ' thousand ';
                        num %= 1000;
                    }
                    
                    if (Math.floor(num / 100) > 0) {
                        words += numberToWords(Math.floor(num / 100)) + ' hundred ';
                        num %= 100;
                    }
                    
                    if (num > 0) {
                        if (words !== '') words += 'and ';
                        
                        if (num < 20) {
                            words += ones[num];
                        } else {
                            words += tens[Math.floor(num / 10)];
                            if (num % 10 > 0) {
                                words += '-' + ones[num % 10];
                            }
                        }
                    }
                    
                    return words.trim();
                }
                
                convertBtn.addEventListener('click', function() {
                    const number = parseInt(numberInput.value);
                    
                    if (isNaN(number)) {
                        result.innerHTML = '<div class="error">Please enter a valid number.</div>';
                        return;
                    }
                    
                    const words = numberToWords(number);
                    result.innerHTML = `<div class="result-text">${words}</div>`;
                });
            }
        }
    };
} 