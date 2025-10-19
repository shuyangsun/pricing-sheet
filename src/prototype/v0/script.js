// Pricing Sheet Prototype v0 - Script
// All interactions are local, no network calls

(function () {
    'use strict';

    // Load hardcoded model data
    const modelDataEl = document.getElementById('modelData');
    const modelData = JSON.parse(modelDataEl.textContent);

    // State
    let currentInputs = { ...modelData.inputs };
    let uploadedFile = null;

    // DOM elements
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const singleRunForm = document.getElementById('singleRunForm');
    const singleRunResults = document.getElementById('singleRunResults');
    const gridForm = document.getElementById('gridForm');
    const gridResults = document.getElementById('gridResults');
    const gridControls = document.getElementById('gridControls');
    const metricSelector = document.getElementById('metricSelector');
    const gridActions = document.getElementById('gridActions');
    const exportCsvBtn = document.getElementById('exportCsvBtn');

    // Initialize
    init();

    function init() {
        // Upload area interactions
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInput.click();
            }
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--color-primary)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '';
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
            }
        });

        // Single run form
        singleRunForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSingleRun();
        });

        // Grid form
        gridForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleGridGeneration();
        });

        // Export CSV
        exportCsvBtn.addEventListener('click', handleExportCsv);

        // Metric selector
        metricSelector.addEventListener('change', () => {
            if (window.currentGridData && window.currentGridParams) {
                displayGridResults(
                    window.currentGridData,
                    window.currentGridParams.param1Name,
                    window.currentGridParams.param2Name,
                    window.currentGridParams.param1Values,
                    window.currentGridParams.param2Values
                );
            }
        });

        // Show initial upload message
        showFileInfo('No model uploaded. Using default Standard Credit Model v2.3', 'info');
    }

    function handleFileUpload(file) {
        // Validate file type
        if (!file.name.endsWith('.xlsx')) {
            showFileInfo('Error: Only .xlsx files are supported', 'error');
            return;
        }

        // Simulated validation (in prototype, we just accept it)
        uploadedFile = file;
        showFileInfo(`✓ Uploaded: ${file.name} (${formatFileSize(file.size)})`, 'success');

        // In a real app, we would parse and validate the Excel file here
        // For prototype, we continue using hardcoded model data
    }

    function showFileInfo(message, type) {
        fileInfo.textContent = message;
        fileInfo.className = 'file-info';
        if (type === 'error') {
            fileInfo.classList.add('status-error');
        } else if (type === 'success') {
            fileInfo.classList.add('status-success');
        }
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function handleSingleRun() {
        // Read form values
        const inputs = {
            loanAmount: parseFloat(document.getElementById('loanAmount').value),
            baseRate: parseFloat(document.getElementById('baseRate').value),
            spread: parseFloat(document.getElementById('spread').value),
            oid: parseFloat(document.getElementById('oid').value),
            tenor: parseFloat(document.getElementById('tenor').value),
            ebitda: parseFloat(document.getElementById('ebitda').value)
        };

        // Calculate outputs using hardcoded formulas
        const outputs = calculateOutputs(inputs);

        // Display results
        displaySingleRunResults(outputs);
    }

    function calculateOutputs(inputs) {
        // Simplified credit model calculations (hardcoded for prototype)
        const allInYield = inputs.baseRate + (inputs.spread / 100) + (inputs.oid / inputs.tenor);
        const leverage = inputs.loanAmount / inputs.ebitda;
        const annualInterestPayment = inputs.loanAmount * (inputs.baseRate + inputs.spread / 100) / 100;
        const interestCoverage = inputs.ebitda / annualInterestPayment;
        const effectiveRate = (inputs.baseRate + inputs.spread / 100) * (1 + inputs.oid / 100);

        return {
            allInYield: allInYield,
            leverage: leverage,
            interestCoverage: interestCoverage,
            effectiveRate: effectiveRate,
            totalDebtService: annualInterestPayment,
            dscr: inputs.ebitda / annualInterestPayment
        };
    }

    function displaySingleRunResults(outputs) {
        const html = `
      <h3>Results</h3>
      <div class="results-grid">
        <div class="result-card">
          <div class="result-label">All-In Yield</div>
          <div class="result-value">${outputs.allInYield.toFixed(2)}<span class="result-unit">%</span></div>
        </div>
        <div class="result-card">
          <div class="result-label">Net Debt / EBITDA</div>
          <div class="result-value">${outputs.leverage.toFixed(2)}<span class="result-unit">x</span></div>
        </div>
        <div class="result-card">
          <div class="result-label">Interest Coverage</div>
          <div class="result-value">${outputs.interestCoverage.toFixed(2)}<span class="result-unit">x</span></div>
        </div>
        <div class="result-card">
          <div class="result-label">Effective Rate</div>
          <div class="result-value">${outputs.effectiveRate.toFixed(2)}<span class="result-unit">%</span></div>
        </div>
        <div class="result-card">
          <div class="result-label">Annual Debt Service</div>
          <div class="result-value">$${outputs.totalDebtService.toFixed(2)}<span class="result-unit">M</span></div>
        </div>
        <div class="result-card">
          <div class="result-label">DSCR</div>
          <div class="result-value">${outputs.dscr.toFixed(2)}<span class="result-unit">x</span></div>
        </div>
      </div>
    `;
        singleRunResults.innerHTML = html;
    }

    function handleGridGeneration() {
        // Read grid configuration
        const param1Name = document.getElementById('gridParam1').value;
        const param1Min = parseFloat(document.getElementById('gridParam1Min').value);
        const param1Max = parseFloat(document.getElementById('gridParam1Max').value);
        const param1Step = parseFloat(document.getElementById('gridParam1Step').value);

        const param2Name = document.getElementById('gridParam2').value;
        const param2Min = parseFloat(document.getElementById('gridParam2Min').value);
        const param2Max = parseFloat(document.getElementById('gridParam2Max').value);
        const param2Step = parseFloat(document.getElementById('gridParam2Step').value);

        // Generate ranges
        const param1Values = generateRange(param1Min, param1Max, param1Step);
        const param2Values = generateRange(param2Min, param2Max, param2Step);

        // Get base inputs from form
        const baseInputs = {
            loanAmount: parseFloat(document.getElementById('loanAmount').value),
            baseRate: parseFloat(document.getElementById('baseRate').value),
            spread: parseFloat(document.getElementById('spread').value),
            oid: parseFloat(document.getElementById('oid').value),
            tenor: parseFloat(document.getElementById('tenor').value),
            ebitda: parseFloat(document.getElementById('ebitda').value)
        };

        // Calculate grid (cartesian product)
        const gridData = [];
        for (const val1 of param1Values) {
            for (const val2 of param2Values) {
                const inputs = { ...baseInputs };
                inputs[param1Name] = val1;
                inputs[param2Name] = val2;
                const outputs = calculateOutputs(inputs);
                gridData.push({
                    [param1Name]: val1,
                    [param2Name]: val2,
                    ...outputs
                });
            }
        }

        // Display grid
        displayGridResults(gridData, param1Name, param2Name, param1Values, param2Values);

        // Store grid data for export
        window.currentGridData = gridData;
        window.currentGridParams = { param1Name, param2Name, param1Values, param2Values };
        gridControls.style.display = 'flex';
        gridActions.style.display = 'flex';
    }

    function generateRange(min, max, step) {
        const values = [];
        for (let val = min; val <= max; val += step) {
            values.push(Math.round(val * 1000) / 1000); // Round to 3 decimals
        }
        return values;
    }

    function displayGridResults(data, param1Name, param2Name, param1Values, param2Values) {
        const paramLabels = {
            spread: 'Spread (bps)',
            oid: 'OID (%)',
            baseRate: 'Base Rate (%)',
            tenor: 'Tenor (yrs)',
            loanAmount: 'Loan Amt ($M)',
            ebitda: 'EBITDA ($M)'
        };

        const metricLabels = {
            allInYield: 'All-In Yield (%)',
            leverage: 'Leverage (x)',
            interestCoverage: 'Interest Coverage (x)',
            dscr: 'DSCR (x)',
            effectiveRate: 'Effective Rate (%)'
        };

        // Get selected metric
        const selectedMetric = metricSelector.value;

        // Build a 2D matrix from the data
        const matrix = {};
        for (const row of data) {
            const key1 = row[param1Name].toFixed(3);
            const key2 = row[param2Name].toFixed(3);
            if (!matrix[key1]) matrix[key1] = {};
            matrix[key1][key2] = row[selectedMetric];
        }

        // Find min/max for color scaling
        const values = data.map(d => d[selectedMetric]);
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);

        // Determine if lower is better (e.g., leverage) or higher is better (e.g., coverage)
        const lowerIsBetter = ['leverage'].includes(selectedMetric);

        // Build heatmap HTML
        let html = `
            <div class="heatmap-container">
                <div class="heatmap-title">${metricLabels[selectedMetric]}</div>
                <div class="heatmap-grid" style="grid-template-columns: auto repeat(${param2Values.length}, 1fr);">
        `;

        // Header row (top-left corner + param2 values)
        html += `<div class="heatmap-cell heatmap-header"></div>`;
        for (const val2 of param2Values) {
            html += `<div class="heatmap-cell heatmap-header">${val2.toFixed(2)}</div>`;
        }

        // Data rows (param1 label + cells)
        for (const val1 of param1Values) {
            html += `<div class="heatmap-cell heatmap-header">${val1.toFixed(2)}</div>`;

            for (const val2 of param2Values) {
                const key1 = val1.toFixed(3);
                const key2 = val2.toFixed(3);
                const cellValue = matrix[key1]?.[key2];

                if (cellValue !== undefined) {
                    const color = getHeatmapColor(cellValue, minVal, maxVal, lowerIsBetter);
                    const textColor = getContrastColor(color);
                    html += `
                        <div class="heatmap-cell"
                             style="background-color: ${color}; color: ${textColor};"
                             title="${paramLabels[param1Name]}: ${val1.toFixed(2)}, ${paramLabels[param2Name]}: ${val2.toFixed(2)}, ${metricLabels[selectedMetric]}: ${cellValue.toFixed(2)}">
                            <div class="heatmap-value">${cellValue.toFixed(2)}</div>
                            <div class="heatmap-coords">${val1.toFixed(1)}, ${val2.toFixed(1)}</div>
                        </div>
                    `;
                } else {
                    html += `<div class="heatmap-cell" style="background-color: #f0f0f0;">-</div>`;
                }
            }
        }

        html += `
                </div>

                <div class="heatmap-legend">
                    <span class="legend-label">Scale:</span>
                    <div style="flex: 1;">
                        <div class="legend-gradient" style="background: linear-gradient(to right,
                            ${lowerIsBetter ? 'rgb(34, 139, 34), rgb(255, 255, 0), rgb(220, 20, 60)' : 'rgb(220, 20, 60), rgb(255, 255, 0), rgb(34, 139, 34)'}
                        );"></div>
                        <div class="legend-values">
                            <span>${lowerIsBetter ? 'Better' : 'Worse'}: ${minVal.toFixed(2)}</span>
                            <span>${((minVal + maxVal) / 2).toFixed(2)}</span>
                            <span>${lowerIsBetter ? 'Worse' : 'Better'}: ${maxVal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        html += `
            <div style="margin-top: var(--spacing-md); padding: var(--spacing-sm); background-color: var(--color-background); border-radius: var(--radius); font-size: 0.85rem; color: var(--color-text-muted);">
                <strong>Axes:</strong> ${paramLabels[param1Name]} (vertical) × ${paramLabels[param2Name]} (horizontal)
            </div>
        `;

        gridResults.innerHTML = html;
    }

    function getHeatmapColor(value, min, max, lowerIsBetter) {
        // Normalize value to 0-1 range
        const normalized = max === min ? 0.5 : (value - min) / (max - min);

        // Invert if lower is better
        const ratio = lowerIsBetter ? (1 - normalized) : normalized;

        // Color interpolation: red (bad) -> yellow (medium) -> green (good)
        let r, g, b;

        if (ratio < 0.5) {
            // Red to Yellow
            const localRatio = ratio * 2;
            r = 220;
            g = Math.round(20 + (255 - 20) * localRatio);
            b = Math.round(60 * (1 - localRatio));
        } else {
            // Yellow to Green
            const localRatio = (ratio - 0.5) * 2;
            r = Math.round(255 - (255 - 34) * localRatio);
            g = Math.round(255 - (255 - 139) * localRatio);
            b = Math.round(34 * localRatio);
        }

        return `rgb(${r}, ${g}, ${b})`;
    }

    function getContrastColor(rgbColor) {
        // Parse RGB values
        const match = rgbColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!match) return '#000000';

        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);

        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // Return black or white based on luminance
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    function handleExportCsv() {
        if (!window.currentGridData) return;

        const data = window.currentGridData;
        const params = window.currentGridParams;

        // Build CSV
        const headers = [params.param1Name, params.param2Name, 'allInYield', 'leverage', 'interestCoverage', 'dscr'];
        let csv = headers.join(',') + '\n';

        for (const row of data) {
            const values = headers.map(h => row[h].toFixed(4));
            csv += values.join(',') + '\n';
        }

        // Download (simulated - creates download link)
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pricing-grid-export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

})();
