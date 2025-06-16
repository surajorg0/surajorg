// Tool Implementations

// Color Converter Functions
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function rgbToCmyk(r, g, b) {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, m, y);

    c = ((c - k) / (1 - k)) || 0;
    m = ((m - k) / (1 - k)) || 0;
    y = ((y - k) / (1 - k)) || 0;

    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100)
    };
}

// Number Base Converter Functions
function convertBase(num, fromBase, toBase) {
    if (fromBase === 10) {
        return parseInt(num).toString(toBase);
    }
    const decimal = parseInt(num.toString(), fromBase);
    return decimal.toString(toBase);
}

// YAML Parser and Stringifier
const yamlParser = {
    parse: function(str) {
        const lines = str.split('\n');
        const result = {};
        let currentKey = '';
        let currentIndent = 0;

        lines.forEach(line => {
            if (line.trim() === '') return;
            const indent = line.search(/\S/);
            const [key, ...values] = line.trim().split(':');
            const value = values.join(':').trim();

            if (indent === 0) {
                currentKey = key;
                result[key] = value || {};
            } else if (indent > currentIndent) {
                if (!result[currentKey]) result[currentKey] = {};
                result[currentKey][key] = value;
            }
            currentIndent = indent;
        });

        return result;
    },
    stringify: function(obj, indent = 0) {
        let result = '';
        const spaces = ' '.repeat(indent);

        Object.entries(obj).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                result += `${spaces}${key}:\n${this.stringify(value, indent + 2)}`;
            } else {
                result += `${spaces}${key}: ${value}\n`;
            }
        });

        return result;
    }
};

// Lorem Ipsum Generator
const loremIpsum = {
    words: [
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
        "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
        "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation",
        "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat"
    ],
    
    generateWords: function(count) {
        let result = [];
        for (let i = 0; i < count; i++) {
            result.push(this.words[Math.floor(Math.random() * this.words.length)]);
        }
        return result.join(' ');
    },
    
    generateSentences: function(count) {
        let result = [];
        for (let i = 0; i < count; i++) {
            const wordCount = Math.floor(Math.random() * 10) + 5;
            let sentence = this.generateWords(wordCount);
            sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
            result.push(sentence);
        }
        return result.join(' ');
    },
    
    generateParagraphs: function(count) {
        let result = [];
        for (let i = 0; i < count; i++) {
            const sentenceCount = Math.floor(Math.random() * 5) + 3;
            result.push(this.generateSentences(sentenceCount));
        }
        return result.join('\n\n');
    }
};

// UUID Generator
function generateUUID(version = 4) {
    if (version === 4) {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    } else if (version === 1) {
        const now = new Date().getTime();
        const uuid = 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = (now + Math.random() * 16) % 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
}

// HTML Encoder/Decoder
const htmlCoder = {
    encode: function(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },
    decode: function(str) {
        return str
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'");
    }
};

// JWT Decoder
function decodeJWT(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) throw new Error('Invalid JWT format');

        return {
            header: JSON.parse(atob(parts[0])),
            payload: JSON.parse(atob(parts[1])),
            signature: parts[2]
        };
    } catch (e) {
        throw new Error('Invalid JWT: ' + e.message);
    }
}

// Cron Expression Parser
const cronParser = {
    fields: ['minute', 'hour', 'day', 'month', 'weekday'],
    
    parse: function(expression) {
        const parts = expression.trim().split(/\s+/);
        if (parts.length !== 5) throw new Error('Invalid cron expression');
        
        const result = {};
        parts.forEach((part, i) => {
            result[this.fields[i]] = this.parseField(part, i);
        });
        
        return result;
    },
    
    parseField: function(field, index) {
        if (field === '*') return 'any';
        if (field.includes('/')) {
            const [, step] = field.split('/');
            return `every ${step} ${this.fields[index]}s`;
        }
        if (field.includes('-')) {
            const [start, end] = field.split('-');
            return `${start} through ${end}`;
        }
        if (field.includes(',')) {
            return field.split(',').join(' and ');
        }
        return field;
    },
    
    getNextRuns: function(expression) {
        const now = new Date();
        const runs = [];
        let current = new Date(now);
        
        // Simple implementation - just increment by minutes
        for (let i = 0; i < 5; i++) {
            current = new Date(current.getTime() + 60000);
            runs.push(current.toLocaleString());
        }
        
        return runs;
    }
};

// SQL Formatter
const sqlFormatter = {
    format: function(sql) {
        sql = sql.trim();
        
        // Keywords to capitalize
        const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 
                         'HAVING', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 
                         'OUTER JOIN', 'ON', 'IN', 'NOT', 'BETWEEN', 'LIKE', 'AS',
                         'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM'];
        
        // Capitalize keywords
        keywords.forEach(keyword => {
            const regex = new RegExp('\\b' + keyword + '\\b', 'gi');
            sql = sql.replace(regex, keyword);
        });
        
        // Add newlines and indentation
        sql = sql
            .replace(/\s*,\s*/g, ',\n  ')
            .replace(/\bFROM\b/g, '\nFROM')
            .replace(/\bWHERE\b/g, '\nWHERE')
            .replace(/\bAND\b/g, '\n  AND')
            .replace(/\bOR\b/g, '\n  OR')
            .replace(/\bORDER BY\b/g, '\nORDER BY')
            .replace(/\bGROUP BY\b/g, '\nGROUP BY')
            .replace(/\bHAVING\b/g, '\nHAVING')
            .replace(/\bJOIN\b/g, '\nJOIN')
            .replace(/\bLEFT JOIN\b/g, '\nLEFT JOIN')
            .replace(/\bRIGHT JOIN\b/g, '\nRIGHT JOIN')
            .replace(/\bINNER JOIN\b/g, '\nINNER JOIN')
            .replace(/\bOUTER JOIN\b/g, '\nOUTER JOIN');
        
        return sql;
    },
    
    minify: function(sql) {
        return sql
            .replace(/\s+/g, ' ')
            .replace(/\s*,\s*/g, ',')
            .replace(/\s*=\s*/g, '=')
            .trim();
    }
}; 