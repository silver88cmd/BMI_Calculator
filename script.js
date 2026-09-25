// DOM Elements
const bmiForm = document.getElementById('bmiForm');
const results = document.getElementById('results');
const bmiValue = document.getElementById('bmiValue');
const bmiCategory = document.getElementById('bmiCategory');
const chartFill = document.getElementById('chartFill');
const ageInput = document.getElementById('age');
const genderInputs = document.querySelectorAll('input[name="gender"]');
const calculatorLayout = document.querySelector('.calculator-layout');

// Unit conversion elements
const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
const heightFeetInput = document.getElementById('heightFeet');
const heightInchesInput = document.getElementById('heightInches');
const weightUnit = document.getElementById('weightUnit');
const heightUnit = document.getElementById('heightUnit');
const weightToggle = document.getElementById('weightToggle');
const heightToggle = document.getElementById('heightToggle');
const heightFeetInches = document.getElementById('heightFeetInches');

// Unit conversion state
let isWeightInPounds = false;
let isHeightInFeetInches = false;

// BMI Categories
const bmiCategories = {
    underweight: { min: 0, max: 18.5, label: 'Underweight', class: 'underweight' },
    normal: { min: 18.5, max: 25, label: 'Normal', class: 'normal' },
    overweight: { min: 25, max: 30, label: 'Overweight', class: 'overweight' },
    obese: { min: 30, max: 100, label: 'Obese', class: 'obese' }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners
    if (bmiForm) {
        bmiForm.addEventListener('submit', calculateBMI);
    }
    
    // Initialize layout state
    updateLayoutState();
    
    // Add event listeners for height conversion
    if (heightFeetInput && heightInchesInput) {
        heightFeetInput.addEventListener('input', convertFeetInchesToCm);
        heightInchesInput.addEventListener('input', convertFeetInchesToCm);
    }
    
    // Add smooth scrolling for navbar links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Add gender toggle animations
    genderInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Add a subtle animation when gender changes
            const toggleOptions = document.querySelectorAll('.toggle-option');
            toggleOptions.forEach(option => {
                option.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    option.style.transform = '';
                }, 150);
            });
        });
    });
});

// Unit Conversion Functions
function toggleWeightUnit() {
    isWeightInPounds = !isWeightInPounds;
    
    if (isWeightInPounds) {
        weightUnit.textContent = 'lbs';
        weightToggle.innerHTML = '<i class="fas fa-exchange-alt"></i><span>Switch to kg</span>';
        weightInput.placeholder = '154';
        weightInput.min = '2';
        weightInput.max = '660';
        
        // Convert existing value if any
        if (weightInput.value) {
            const kgValue = parseFloat(weightInput.value);
            weightInput.value = (kgValue * 2.20462).toFixed(1);
        }
    } else {
        weightUnit.textContent = 'kg';
        weightToggle.innerHTML = '<i class="fas fa-exchange-alt"></i><span>Switch to lbs</span>';
        weightInput.placeholder = '70';
        weightInput.min = '1';
        weightInput.max = '300';
        
        // Convert existing value if any
        if (weightInput.value) {
            const lbsValue = parseFloat(weightInput.value);
            weightInput.value = (lbsValue / 2.20462).toFixed(1);
        }
    }
}

function toggleHeightUnit() {
    isHeightInFeetInches = !isHeightInFeetInches;
    
    if (isHeightInFeetInches) {
        heightUnit.textContent = 'ft/in';
        heightToggle.innerHTML = '<i class="fas fa-exchange-alt"></i><span>Switch to cm</span>';
        heightInput.style.display = 'none';
        heightFeetInches.style.display = 'block';
        
        // Convert existing value if any
        if (heightInput.value) {
            const cmValue = parseFloat(heightInput.value);
            const totalInches = cmValue / 2.54;
            const feet = Math.floor(totalInches / 12);
            const inches = Math.round(totalInches % 12);
            heightFeetInput.value = feet;
            heightInchesInput.value = inches;
        }
    } else {
        heightUnit.textContent = 'cm';
        heightToggle.innerHTML = '<i class="fas fa-exchange-alt"></i><span>Switch to ft/in</span>';
        heightInput.style.display = 'block';
        heightFeetInches.style.display = 'none';
        
        // Convert existing values if any
        if (heightFeetInput.value || heightInchesInput.value) {
            const feet = parseFloat(heightFeetInput.value) || 0;
            const inches = parseFloat(heightInchesInput.value) || 0;
            const totalInches = feet * 12 + inches;
            heightInput.value = Math.round(totalInches * 2.54);
        }
    }
}

function convertFeetInchesToCm() {
    if (isHeightInFeetInches) {
        const feet = parseFloat(heightFeetInput.value) || 0;
        const inches = parseFloat(heightInchesInput.value) || 0;
        const totalInches = feet * 12 + inches;
        heightInput.value = Math.round(totalInches * 2.54);
    }
}

// Calculate BMI
function calculateBMI(e) {
    e.preventDefault();
    
    let weight = parseFloat(weightInput.value);
    let height = parseFloat(heightInput.value);
    const age = parseInt(ageInput.value);
    const gender = document.querySelector('input[name="gender"]:checked').value;
    
    // Convert weight from pounds to kg if needed
    if (isWeightInPounds) {
        weight = weight / 2.20462;
    }
    
    // Height is already converted to cm in the convertFeetInchesToCm function
    
    // Validate inputs
    if (!weight || !height || weight <= 0 || height <= 0) {
        showError('Please enter valid weight and height values.');
        return;
    }
    
    if (height < 50 || height > 250) {
        showError('Please enter a height between 50cm and 250cm.');
        return;
    }
    
    if (weight < 1 || weight > 300) {
        showError('Please enter a weight between 1kg and 300kg.');
        return;
    }
    
    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Display results
    displayResults(bmi, weight, height, age, gender);
}

// Update layout state based on results visibility
function updateLayoutState() {
    if (calculatorLayout) {
        if (results.style.display === 'none' || results.style.display === '') {
            calculatorLayout.classList.add('no-results');
        } else {
            calculatorLayout.classList.remove('no-results');
        }
    }
}

// Display BMI results
function displayResults(bmi, weight, height, age, gender) {
    // Determine BMI category
    let category = 'obese';
    for (const [key, value] of Object.entries(bmiCategories)) {
        if (bmi >= value.min && bmi < value.max) {
            category = key;
            break;
        }
    }
    
    // Update BMI value with animation
    animateValue(bmiValue, 0, bmi, 1000);
    
    // Update category
    bmiCategory.textContent = bmiCategories[category].label;
    bmiCategory.className = `bmi-category ${bmiCategories[category].class}`;
    
    // Update chart
    updateChart(bmi);
    
    // Show results with animation
    results.style.display = 'block';
    
    // Update layout state
    updateLayoutState();
    
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Add some additional information based on gender and age
    setTimeout(() => {
        showAdditionalInfo(bmi, category, age, gender);
    }, 1200);
}

// Animate number counting
function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    const range = end - start;
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (range * easeOutQuart);
        
        element.textContent = current.toFixed(1);
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Update BMI chart
function updateChart(bmi) {
    let percentage = 0;
    
    if (bmi < 18.5) {
        percentage = (bmi / 18.5) * 25; // Underweight: 0-25%
    } else if (bmi < 25) {
        percentage = 25 + ((bmi - 18.5) / 6.5) * 25; // Normal: 25-50%
    } else if (bmi < 30) {
        percentage = 50 + ((bmi - 25) / 5) * 25; // Overweight: 50-75%
    } else {
        percentage = Math.min(75 + ((bmi - 30) / 20) * 25, 100); // Obese: 75-100%
    }
    
    // Animate chart fill
    setTimeout(() => {
        chartFill.style.width = `${Math.min(percentage, 100)}%`;
    }, 500);
}

// Show additional information
function showAdditionalInfo(bmi, category, age, gender) {
    const additionalInfo = document.createElement('div');
    additionalInfo.className = 'additional-info';
    additionalInfo.style.cssText = `
        margin-top: 20px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 10px;
        font-size: 0.9rem;
        color: #666;
        animation: fadeIn 0.5s ease-out;
    `;
    
    let infoText = '';
    
    // Age-specific recommendations
    if (age < 18) {
        infoText += 'Note: BMI interpretation may vary for individuals under 18. Consult a healthcare provider for accurate assessment.';
    } else if (age > 65) {
        infoText += 'For adults over 65, BMI ranges may be slightly different. Consider consulting a healthcare provider.';
    }
    
    // Category-specific advice
    switch (category) {
        case 'underweight':
            infoText += (infoText ? ' ' : '') + 'Consider consulting a healthcare provider or nutritionist for healthy weight gain strategies.';
            break;
        case 'normal':
            infoText += (infoText ? ' ' : '') + 'Great! You\'re in a healthy weight range. Maintain your current lifestyle.';
            break;
        case 'overweight':
            infoText += (infoText ? ' ' : '') + 'Consider incorporating regular exercise and a balanced diet to reach a healthier weight.';
            break;
        case 'obese':
            infoText += (infoText ? ' ' : '') + 'Consider consulting a healthcare provider for personalized weight management strategies.';
            break;
    }
    
    additionalInfo.textContent = infoText;
    
    // Remove existing additional info if any
    const existingInfo = results.querySelector('.additional-info');
    if (existingInfo) {
        existingInfo.remove();
    }
    
    results.appendChild(additionalInfo);
}

// Show error message
function showError(message) {
    // Remove existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #ffebee;
        color: #d32f2f;
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 20px;
        border-left: 4px solid #d32f2f;
        animation: slideIn 0.3s ease-out;
    `;
    errorDiv.textContent = message;
    
    bmiForm.insertBefore(errorDiv, bmiForm.firstChild);
    
    // Auto-remove error after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                errorDiv.remove();
            }, 300);
        }
    }, 5000);
}

// Add CSS animations for error messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-20px);
        }
    }
`;
document.head.appendChild(style);

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to input boxes
    const inputBoxes = document.querySelectorAll('.input-box');
    inputBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        box.addEventListener('mouseleave', function() {
            if (!this.querySelector('input:focus')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Add keyboard navigation for age input
    if (ageInput) {
        ageInput.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                const step = e.key === 'ArrowUp' ? 1 : -1;
                this.value = Math.max(1, Math.min(120, parseInt(this.value) + step));
            }
        });
    }
    
    // Add form validation feedback
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.style.borderColor = '#4caf50';
            } else {
                this.style.borderColor = '#f44336';
            }
        });
    });
});
