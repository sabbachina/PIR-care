// PIR & CARE Application Logic

// Global state
let currentStep = 1;
const totalSteps = 5;
let formData = {
    documents: {},
    personal: {},
    flight: {},
    baggage: {},
    signature: null
};

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize language
    const storedLang = getStoredLanguage();
    updatePageLanguage(storedLang);
    
    // Setup event listeners
    setupNavigationListeners();
    setupFormListeners();
    setupLanguageListeners();
    setupSignaturePad();
    
    // Show home section by default
    showSection('homeSection');
}

// Navigation Listeners
function setupNavigationListeners() {
    // Start button
    document.getElementById('startBtn')?.addEventListener('click', () => {
        showSection('pirSection');
        currentStep = 1;
        updateProgress();
    });
    
    // Back button
    document.getElementById('backBtn')?.addEventListener('click', () => {
        showSection('homeSection');
    });
    
    // Back to home from tracking
    document.getElementById('backToHomeBtn')?.addEventListener('click', () => {
        showSection('homeSection');
        resetForm();
    });
    
    // Previous step button
    document.getElementById('prevStepBtn')?.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
            updateProgress();
        }
    });
    
    // Next step button
    document.getElementById('nextStepBtn')?.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
                updateProgress();
            }
        }
    });
    
    // Submit button
    document.getElementById('submitBtn')?.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            submitPIR();
        }
    });
    
    // Compensation request button
    document.getElementById('requestCompensation')?.addEventListener('click', () => {
        alert(translate('compensationTitle', getStoredLanguage()));
    });
}

// Form Listeners
function setupFormListeners() {
    // Boarding pass upload
    document.getElementById('boardingPassFile')?.addEventListener('change', function(e) {
        handleFileUpload(e, 'boardingPass', 'boardingPassUpload');
    });
    
    // ID document upload
    document.getElementById('idDocFile')?.addEventListener('change', function(e) {
        handleFileUpload(e, 'idDoc', 'idDocUpload');
    });
    
    // Baggage photo upload
    document.getElementById('baggagePhoto')?.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            formData.baggage.photos = Array.from(e.target.files);
        }
    });
    
    // Auto-save form data
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('change', saveFormData);
    });
}

// Language Listeners
function setupLanguageListeners() {
    const langBtn = document.getElementById('langBtn');
    const langModal = document.getElementById('langModal');
    const closeLangModal = document.getElementById('closeLangModal');
    const langOptions = document.querySelectorAll('.lang-option');
    
    langBtn?.addEventListener('click', () => {
        langModal.classList.add('active');
    });
    
    closeLangModal?.addEventListener('click', () => {
        langModal.classList.remove('active');
    });
    
    langOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            updatePageLanguage(selectedLang);
            langModal.classList.remove('active');
        });
    });
    
    // Close modal on outside click
    langModal?.addEventListener('click', function(e) {
        if (e.target === langModal) {
            langModal.classList.remove('active');
        }
    });
}

// File Upload Handler
function handleFileUpload(event, type, containerId) {
    const file = event.target.files[0];
    if (!file) return;
    
    const container = document.getElementById(containerId);
    const uploadContent = container.querySelector('.upload-content');
    const uploadPreview = container.querySelector('.upload-preview');
    
    // Show loading
    showAIExtraction();
    
    // Simulate file reading
    const reader = new FileReader();
    reader.onload = function(e) {
        // Store in form data
        formData.documents[type] = {
            file: file,
            dataUrl: e.target.result
        };
        
        // Show preview
        setTimeout(() => {
            uploadContent.style.display = 'none';
            uploadPreview.style.display = 'block';
            uploadPreview.querySelector('img').src = e.target.result;
            
            // Simulate AI extraction
            setTimeout(() => {
                extractDataFromDocument(type);
                hideAIExtraction();
            }, 2000);
        }, 500);
    };
    
    reader.readAsDataURL(file);
}

// Simulate AI data extraction
function extractDataFromDocument(type) {
    if (type === 'boardingPass') {
        // Simulate extracted data from boarding pass
        document.getElementById('airline').value = 'Alitalia';
        document.getElementById('flightNumber').value = 'AZ1234';
        document.getElementById('departure').value = 'MXP - Milano Malpensa';
        document.getElementById('arrival').value = 'FCO - Roma Fiumicino';
        document.getElementById('pnr').value = 'ABC123';
        
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('flightDate').value = today;
    } else if (type === 'idDoc') {
        // Simulate extracted data from ID
        document.getElementById('firstName').value = 'Mario';
        document.getElementById('lastName').value = 'Rossi';
    }
}

function showAIExtraction() {
    const aiInfo = document.getElementById('aiExtractionInfo');
    if (aiInfo) {
        aiInfo.style.display = 'block';
    }
}

function hideAIExtraction() {
    const aiInfo = document.getElementById('aiExtractionInfo');
    if (aiInfo) {
        aiInfo.style.display = 'none';
    }
}

// Step Navigation
function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(s => {
        s.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    // Update buttons
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (step === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-flex';
    }
    
    if (step === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-flex';
        populateReview();
    } else {
        nextBtn.style.display = 'inline-flex';
        submitBtn.style.display = 'none';
    }
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const currentStepEl = document.getElementById('currentStep');
    
    const progress = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${progress}%`;
    currentStepEl.textContent = currentStep;
}

// Form Validation
function validateStep(step) {
    let isValid = true;
    let errorMessage = '';
    const lang = getStoredLanguage();
    
    switch(step) {
        case 1:
            if (!formData.documents.boardingPass || !formData.documents.idDoc) {
                isValid = false;
                errorMessage = 'Carica entrambi i documenti';
            }
            break;
            
        case 2:
            const requiredPersonal = ['firstName', 'lastName', 'email', 'phone', 'address'];
            for (const field of requiredPersonal) {
                const value = document.getElementById(field)?.value;
                if (!value || value.trim() === '') {
                    isValid = false;
                    errorMessage = `Compila tutti i campi obbligatori`;
                    break;
                }
            }
            break;
            
        case 3:
            const requiredFlight = ['airline', 'flightNumber', 'flightDate', 'pnr', 'departure', 'arrival'];
            for (const field of requiredFlight) {
                const value = document.getElementById(field)?.value;
                if (!value || value.trim() === '') {
                    isValid = false;
                    errorMessage = `Compila tutti i campi obbligatori`;
                    break;
                }
            }
            break;
            
        case 4:
            const baggageType = document.getElementById('baggageType')?.value;
            const baggageColor = document.getElementById('baggageColor')?.value;
            if (!baggageType || !baggageColor) {
                isValid = false;
                errorMessage = `Fornisci almeno tipo e colore del bagaglio`;
            }
            break;
            
        case 5:
            if (!formData.signature) {
                isValid = false;
                errorMessage = `Firma il documento`;
            }
            const termsAccept = document.getElementById('termsAccept')?.checked;
            if (!termsAccept) {
                isValid = false;
                errorMessage = `Accetta i termini e condizioni`;
            }
            break;
    }
    
    if (!isValid) {
        alert(errorMessage);
    }
    
    return isValid;
}

// Save Form Data
function saveFormData() {
    // Personal data
    formData.personal = {
        firstName: document.getElementById('firstName')?.value || '',
        lastName: document.getElementById('lastName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        address: document.getElementById('address')?.value || ''
    };
    
    // Flight data
    formData.flight = {
        airline: document.getElementById('airline')?.value || '',
        flightNumber: document.getElementById('flightNumber')?.value || '',
        flightDate: document.getElementById('flightDate')?.value || '',
        pnr: document.getElementById('pnr')?.value || '',
        departure: document.getElementById('departure')?.value || '',
        arrival: document.getElementById('arrival')?.value || ''
    };
    
    // Baggage data
    formData.baggage = {
        tag: document.getElementById('baggageTag')?.value || '',
        type: document.getElementById('baggageType')?.value || '',
        color: document.getElementById('baggageColor')?.value || '',
        brand: document.getElementById('baggageBrand')?.value || '',
        description: document.getElementById('baggageDescription')?.value || '',
        contents: document.getElementById('baggageContents')?.value || ''
    };
}

// Populate Review Section
function populateReview() {
    saveFormData();
    
    const lang = getStoredLanguage();
    
    // Personal data review
    const reviewPersonal = document.getElementById('reviewPersonal');
    reviewPersonal.innerHTML = `
        <div class="review-item">
            <div class="review-item-label">${translate('firstName', lang)}</div>
            <div class="review-item-value">${formData.personal.firstName}</div>
        </div>
        <div class="review-item">
            <div class="review-item-label">${translate('lastName', lang)}</div>
            <div class="review-item-value">${formData.personal.lastName}</div>
        </div>
        <div class="review-item">
            <div class="review-item-label">${translate('email', lang)}</div>
            <div class="review-item-value">${formData.personal.email}</div>
        </div>
        <div class="review-item">
            <div class="review-item-label">${translate('phone', lang)}</div>
            <div class="review-item-value">${formData.personal.phone}</div>
        </div>
        <div class="review-item">
            <div class="review-item-label">${translate('address', lang)}</div>
            <div class="review-item-value">${formData.personal.address}</div>
        </div>
    `;
    
    // Flight data review
    const reviewFlight = document.getElementById('reviewFlight');
    reviewFlight.innerHTML = `
        <div class="review-item">
            <div class="review-item-label">${translate('airline', lang)}</div>
            <div class="review-item-value">${formData.flight.airline}</div>
        </div>
        <div class="review-item">
            <div class="review-item-label">${translate('flightNumber', lang)}</div>
            <div class="review-item-value">${formData.flight.flightNumber}</div>
        </div>
        <div class="review-item">
            <div class="review-item-label">${translate('flightDate', lang)}</div>
            <div class="review-item-value">${formData.flight.flightDate}</div>
        </div>
        <div class="review-item">
            <div class="review-item-label">${translate('pnr', lang)}</div>
            <div class="review-item-value">${formData.flight.pnr}</div>
        </div>
        <div class="review-item">
            <div class="review-item-label">${translate('departure', lang)}</div>
            <div class="review-item-value">${formData.flight.departure}</div>
        </div>
        <div class="review-item">
            <div class="review-item-label">${translate('arrival', lang)}</div>
            <div class="review-item-value">${formData.flight.arrival}</div>
        </div>
    `;
    
    // Baggage data review
    const reviewBaggage = document.getElementById('reviewBaggage');
    reviewBaggage.innerHTML = `
        <div class="review-item">
            <div class="review-item-label">${translate('baggageType', lang)}</div>
            <div class="review-item-value">${formData.baggage.type}</div>
        </div>
        <div class="review-item">
            <div class="review-item-label">${translate('baggageColor', lang)}</div>
            <div class="review-item-value">${formData.baggage.color}</div>
        </div>
        <div class="review-item">
            <div class="review-item-label">${translate('baggageBrand', lang)}</div>
            <div class="review-item-value">${formData.baggage.brand}</div>
        </div>
        <div class="review-item">
            <div class="review-item-label">${translate('baggageDescription', lang)}</div>
            <div class="review-item-value">${formData.baggage.description}</div>
        </div>
    `;
}

// Signature Pad Setup
function setupSignaturePad() {
    const canvas = document.getElementById('signaturePad');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;
    
    function startDrawing(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        [lastX, lastY] = [
            e.clientX - rect.left || e.touches[0].clientX - rect.left,
            e.clientY - rect.top || e.touches[0].clientY - rect.top
        ];
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        e.preventDefault();
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left || e.touches[0].clientX - rect.left;
        const y = e.clientY - rect.top || e.touches[0].clientY - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        [lastX, lastY] = [x, y];
    }
    
    function stopDrawing() {
        if (isDrawing) {
            isDrawing = false;
            formData.signature = canvas.toDataURL();
        }
    }
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    
    // Clear button
    document.getElementById('clearSignature')?.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        formData.signature = null;
    });
}

// Submit PIR
function submitPIR() {
    saveFormData();
    
    // Generate PIR reference number
    const pirRef = generatePIRReference();
    
    // Store submission
    const submission = {
        reference: pirRef,
        date: new Date().toISOString(),
        data: formData
    };
    
    localStorage.setItem('lastPIR', JSON.stringify(submission));
    
    // Show tracking section
    showSection('trackingSection');
    
    // Update tracking info
    document.getElementById('referenceNumber').textContent = pirRef;
    document.getElementById('submittedDate').textContent = formatDate(submission.date);
    
    // Simulate tracking progress
    simulateTracking();
}

function generatePIRReference() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `PIR-FCO-${new Date().getFullYear()}-${random.toString().padStart(6, '0')}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString(getStoredLanguage());
}

function simulateTracking() {
    // Simulate different statuses over time
    setTimeout(() => {
        const timelineItems = document.querySelectorAll('.timeline-item');
        if (timelineItems[2]) {
            timelineItems[1].classList.remove('active');
            timelineItems[1].classList.add('completed');
            timelineItems[2].classList.add('active');
        }
    }, 5000);
}

// Section Management
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Reset Form
function resetForm() {
    formData = {
        documents: {},
        personal: {},
        flight: {},
        baggage: {},
        signature: null
    };
    
    currentStep = 1;
    
    // Reset all inputs
    document.querySelectorAll('.form-input').forEach(input => {
        input.value = '';
    });
    
    // Reset file uploads
    document.querySelectorAll('.upload-box').forEach(box => {
        const uploadContent = box.querySelector('.upload-content');
        const uploadPreview = box.querySelector('.upload-preview');
        
        if (uploadContent) uploadContent.style.display = 'block';
        if (uploadPreview) uploadPreview.style.display = 'none';
    });
    
    // Clear signature
    const canvas = document.getElementById('signaturePad');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Reset checkbox
    const termsAccept = document.getElementById('termsAccept');
    if (termsAccept) termsAccept.checked = false;
}

// Dashboard Initialization (for demo purposes)
function initializeDashboard() {
    // Populate recent PIRs table
    const recentPirsTable = document.getElementById('recentPirsTable');
    if (!recentPirsTable) return;
    
    const sampleData = [
        {
            ref: 'PIR-FCO-2024-001234',
            passenger: 'Mario Rossi',
            flight: 'AZ1234',
            date: '2024-01-15',
            status: 'searching'
        },
        {
            ref: 'PIR-FCO-2024-001233',
            passenger: 'Laura Bianchi',
            flight: 'FR8765',
            date: '2024-01-14',
            status: 'found'
        },
        {
            ref: 'PIR-FCO-2024-001232',
            passenger: 'Giovanni Verdi',
            flight: 'LH9876',
            date: '2024-01-13',
            status: 'delivered'
        }
    ];
    
    sampleData.forEach(pir => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pir.ref}</td>
            <td>${pir.passenger}</td>
            <td>${pir.flight}</td>
            <td>${pir.date}</td>
            <td><span class="status-badge ${pir.status}">${pir.status}</span></td>
            <td>
                <button class="btn btn-small btn-secondary">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        recentPirsTable.appendChild(row);
    });
    
    // Initialize charts
    initializeCharts();
}

function initializeCharts() {
    // PIRs by Month Chart
    const pirsByMonthCtx = document.getElementById('pirsByMonthChart');
    if (pirsByMonthCtx && typeof Chart !== 'undefined') {
        new Chart(pirsByMonthCtx, {
            type: 'line',
            data: {
                labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu'],
                datasets: [{
                    label: 'PIR Totali',
                    data: [450, 520, 480, 580, 620, 650],
                    borderColor: '#0066cc',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // PIRs by Airline Chart
    const pirsByAirlineCtx = document.getElementById('pirsByAirlineChart');
    if (pirsByAirlineCtx && typeof Chart !== 'undefined') {
        new Chart(pirsByAirlineCtx, {
            type: 'doughnut',
            data: {
                labels: ['Alitalia', 'Ryanair', 'Lufthansa', 'Air France', 'Altri'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: [
                        '#0066cc',
                        '#00a651',
                        '#ffc107',
                        '#dc3545',
                        '#6c757d'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// Initialize dashboard if on that section
if (window.location.hash === '#dashboard') {
    setTimeout(initializeDashboard, 500);
}
