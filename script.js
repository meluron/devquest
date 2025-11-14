let data = [];

const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('noResults');
const resultsCount = document.getElementById('resultsCount');

// 🎨 20 visually distinct, dark, contrasting colors
const colorPalette = [
    "#e74c3c", "#3498db", "#27ae60", "#f39c12", "#8e44ad",
    "#16a085", "#c0392b", "#2980b9", "#2c3e50", "#d35400",
    "#7f8c8d", "#9b59b6", "#1abc9c", "#e67e22", "#34495e",
    "#b03a2e", "#117864", "#5d6d7e", "#784212", "#7d3c98"
];

// Category → color map
const categoryColors = {};
let colorIndex = 0;

function getCategoryColor(category) {
    // Return existing color if assigned
    if (categoryColors[category]) return categoryColors[category];
    
    // Assign next color in palette (wrap if more than 20 categories)
    const color = colorPalette[colorIndex % colorPalette.length];
    categoryColors[category] = color;
    colorIndex++;
    
    return color;
}

// Fetch and parse CSV
async function loadCSV() {
    try {
        const response = await fetch('./db.csv');
        const csvText = await response.text();
        const lines = csvText.trim().split('\n');
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const parts = parseCSVLine(line);
            if (parts.length >= 5) {
                data.push({
                    category: parts[0],
                    topic: parts[1],
                    description: parts[2] || '',
                    keywords: parts[3],
                    html: parts[4]
                });
            }
        }
        
        renderTable(data);
    } catch (error) {
        console.error('Error loading CSV:', error);
        noResults.textContent = 'Error loading data';
        noResults.style.display = 'block';
    }
}

// Parse CSV line (supports quoted fields)
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    
    return result;
}

function renderTable(filteredData) {
    tableBody.innerHTML = '';
    
    if (filteredData.length === 0) {
        document.getElementById('contentTable').style.display = 'none';
        noResults.style.display = 'block';
        resultsCount.textContent = '';
    } else {
        document.getElementById('contentTable').style.display = 'table';
        noResults.style.display = 'none';
        resultsCount.textContent = `Showing ${filteredData.length} result${filteredData.length !== 1 ? 's' : ''}`;
        
        filteredData.forEach(item => {
            const row = document.createElement('tr');
            const categoryColor = getCategoryColor(item.category);
            row.innerHTML = `
                <td data-label="Category">
                    <span style="color: ${categoryColor}; font-weight: 600;">
                        ${item.category}
                    </span>
                </td>
                <td data-label="Topic">${item.topic}</td>
                <td data-label="Description">${item.description}</td>
                <td data-label="Keywords">${item.keywords}</td>
                <td data-label="Link"><a href="${item.html}" target="_blank">Open</a></td>
            `;
            tableBody.appendChild(row);
        });
    }
}

function filterData(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    const searchWords = term.split(/\s+/).filter(w => w.length > 0);
    
    return data.filter(item => {
        const category = item.category.toLowerCase();
        const topic = item.topic.toLowerCase();
        const description = item.description.toLowerCase();
        const keywords = item.keywords.toLowerCase();
        
        return searchWords.every(word =>
            category.includes(word) || topic.includes(word) ||
            description.includes(word) || keywords.includes(word)
        );
    });
}

searchInput.addEventListener('input', (e) => {
    const filtered = filterData(e.target.value);
    renderTable(filtered);
});

loadCSV();
