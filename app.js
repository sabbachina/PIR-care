// PIR & CARE Application Logic - WITH AUTOMATIC PDF DATA EXTRACTION

// ========================================
// DATI ESTRATTI DAI PDF CARICATI
// ========================================
const extractedPDFData = {
    // Da Carta d'Identità (Print___Home__1_.pdf)
    identity: {
        firstName: "ADRYX",
        lastName: "FCO",
        address: "Via Pierpaolo Racchetti 1, Fiumicino",
        birthDate: "1961-01-15",
        nationality: "ITA",
        height: "180",
        weight: "80",
        eyeColor: "BLU",
        sex: "M",
        issueDate: "2025-10-06",
        expiryDate: "2047-12-31"
    },
    // Da Boarding Pass (17603__Convertito___Recuperato_.pdf)
    boardingPass: {
        flightNumber: "PRC001",
        flightDate: "2025-07-18",
        flightTime: "17:27",
        departureAirport: "MRX",
        departureName: "MARS",
        arrivalAirport: "FCO",
        arrivalName: "ROME",
        gate: "F01",
        seat: "1A",
        baggageTag: "2378650917",
        airline: "HANGAR PROGRAM",
        passengerName: "ADRYX FCO",
        boardingTime: "16:42",
        serviceClass: "PIR & CARE"
    }
};

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
let signaturePad = null;
let documentsUploaded = { boardingPass: false, idDoc: false };

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
                
                // Initialize signature pad when reaching step 5
                if (currentStep === 5) {
                    setTimeout(() => {
                        setupSignaturePad();
                    }, 100);
                }
            }
        }
    });
    
    // Submit button
    document.getElementById('submitBtn')?.addEventListener('click', () => {
        // Save signature before validation
        if (signaturePad && signaturePad.canvas) {
            const canvas = signaturePad.canvas;
            const ctx = signaturePad.ctx;
            
            // Check if canvas has any drawing
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const hasDrawing = imageData.data.some(channel => channel !== 0);
            
            if (hasDrawing) {
                formData.signature = canvas.toDataURL();
            }
        }
        
        if (validateStep(currentStep)) {
            submitPIR();
        }
    });
    
    // Compensation request button
    document.getElementById('requestCompensation')?.addEventListener('click', () => {
        showToast(translate('compensationTitle', getStoredLanguage()));
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
            showToast('Foto caricate con successo!');
        }
    });
    
    // Auto-save form data
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('change', saveFormData);
        input.addEventListener('blur', saveFormData);
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
            showToast('Lingua aggiornata!');
        });
    });
    
    // Close modal on outside click
    langModal?.addEventListener('click', function(e) {
        if (e.target === langModal) {
            langModal.classList.remove('active');
        }
    });
}

// Toast notification for better UX
function showToast(message, duration = 3000) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 10000;
        animation: slideUp 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 90%;
        text-align: center;
    `;
    
    document.body.appendChild(toast);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    if (!document.getElementById('toast-style')) {
        style.id = 'toast-style';
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease reverse';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

// File Upload Handler - ENHANCED WITH AUTO-FILL
function handleFileUpload(event, type, containerId) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showToast('Per favore carica un\'immagine valida');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showToast('File troppo grande. Massimo 5MB');
        return;
    }
    
    const container = document.getElementById(containerId);
    const uploadContent = container.querySelector('.upload-content');
    const uploadPreview = container.querySelector('.upload-preview');
    
    // Show loading
    showAIExtraction();
    showToast('Caricamento documento...');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        formData.documents[type] = {
            file: file,
            dataUrl: e.target.result
        };
        
        // Mark as uploaded
        documentsUploaded[type] = true;
        
        setTimeout(() => {
            uploadContent.style.display = 'none';
            uploadPreview.style.display = 'block';
            uploadPreview.querySelector('img').src = e.target.result;
            
            showToast('Documento caricato con successo!');
            
            // Simulate AI extraction with realistic delay
            setTimeout(() => {
                extractDataFromDocument(type);
                hideAIExtraction();
                
                // Check if both documents are uploaded for full auto-fill
                if (documentsUploaded.boardingPass && documentsUploaded.idDoc) {
                    showToast('✅ Dati estratti automaticamente dai documenti!', 4000);
                    // Auto-advance to personal info after extraction
                    setTimeout(() => {
                        if (currentStep === 1) {
                            currentStep = 2;
                            showStep(currentStep);
                            updateProgress();
                        }
                    }, 1000);
                } else {
                    showToast('Dati estratti! Carica l\'altro documento per continuare');
                }
            }, 2000);
        }, 800);
    };
    
    reader.onerror = function() {
        showToast('Errore nel caricamento del file');
        hideAIExtraction();
    };
    
    reader.readAsDataURL(file);
}

// ========================================
// ENHANCED AI DATA EXTRACTION WITH ANIMATION
// ========================================
function extractDataFromDocument(type) {
    if (type === 'boardingPass') {
        // Extract and animate boarding pass data
        const fields = [
            { id: 'airline', value: extractedPDFData.boardingPass.airline, delay: 300 },
            { id: 'flightNumber', value: extractedPDFData.boardingPass.flightNumber, delay: 500 },
            { id: 'flightDate', value: extractedPDFData.boardingPass.flightDate, delay: 700 },
            { id: 'departure', value: `${extractedPDFData.boardingPass.departureAirport} - ${extractedPDFData.boardingPass.departureName}`, delay: 900 },
            { id: 'arrival', value: `${extractedPDFData.boardingPass.arrivalAirport} - ${extractedPDFData.boardingPass.arrivalName}`, delay: 1100 },
            { id: 'baggageTag', value: extractedPDFData.boardingPass.baggageTag, delay: 1300 }
        ];
        
        fields.forEach(field => {
            setTimeout(() => {
                const element = document.getElementById(field.id);
                if (element) {
                    element.value = field.value;
                    animateFieldFill(element);
                }
            }, field.delay);
        });
        
        // Also pre-fill PNR with passenger name
        setTimeout(() => {
            const pnrElement = document.getElementById('pnr');
            if (pnrElement && !pnrElement.value) {
                pnrElement.value = 'ADRYXFCO';
                animateFieldFill(pnrElement);
            }
        }, 1500);
        
    } else if (type === 'idDoc') {
        // Extract and animate ID document data
        const fields = [
            { id: 'firstName', value: extractedPDFData.identity.firstName, delay: 300 },
            { id: 'lastName', value: extractedPDFData.identity.lastName, delay: 500 },
            { id: 'address', value: extractedPDFData.identity.address, delay: 700 }
        ];
        
        fields.forEach(field => {
            setTimeout(() => {
                const element = document.getElementById(field.id);
                if (element) {
                    element.value = field.value;
                    animateFieldFill(element);
                }
            }, field.delay);
        });
        
        // Pre-fill email and phone with realistic data
        setTimeout(() => {
            const emailElement = document.getElementById('email');
            if (emailElement && !emailElement.value) {
                emailElement.value = ' ';
                animateFieldFill(emailElement);
            }
        }, 900);
        
        setTimeout(() => {
            const phoneElement = document.getElementById('phone');
            if (phoneElement && !phoneElement.value) {
                phoneElement.value = ' ';
                animateFieldFill(phoneElement);
            }
        }, 1100);
    }
}

// Animate field when auto-filled
function animateFieldFill(element) {
    element.style.backgroundColor = '#d4edda';
    element.style.borderColor = '#28a745';
    element.style.transition = 'all 0.3s ease';
    
    // Add a pulse animation
    element.style.animation = 'fieldPulse 0.5s ease';
    
    // Add animation keyframes if not exists
    if (!document.getElementById('field-animation-style')) {
        const style = document.createElement('style');
        style.id = 'field-animation-style';
        style.textContent = `
            @keyframes fieldPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.02); box-shadow: 0 0 10px rgba(40, 167, 69, 0.3); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Reset background after a delay
    setTimeout(() => {
        element.style.backgroundColor = '#f8f9fa';
        element.style.borderColor = '#28a745';
    }, 3000);
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
    document.querySelectorAll('.form-step').forEach(s => {
        s.classList.remove('active');
    });
    
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
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
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const currentStepEl = document.getElementById('currentStep');
    
    const progress = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${progress}%`;
    currentStepEl.textContent = currentStep;
}

// Form Validation - IMPROVED WITH TOAST
function validateStep(step) {
    let isValid = true;
    let errorMessage = '';
    const lang = getStoredLanguage();
    
    switch(step) {
        case 1:
            if (!formData.documents.boardingPass || !formData.documents.idDoc) {
                isValid = false;
                errorMessage = lang === 'en' ? 'Upload both documents' : 'Carica entrambi i documenti';
            }
            break;
            
        case 2:
            const requiredPersonal = ['firstName', 'lastName', 'email', 'phone', 'address'];
            for (const field of requiredPersonal) {
                const value = document.getElementById(field)?.value;
                if (!value || value.trim() === '') {
                    isValid = false;
                    errorMessage = lang === 'en' ? 'Fill in all required fields' : 'Compila tutti i campi obbligatori';
                    break;
                }
            }
            
            const email = document.getElementById('email')?.value;
            if (email && !email.includes('@')) {
                isValid = false;
                errorMessage = lang === 'en' ? 'Invalid email address' : 'Indirizzo email non valido';
            }
            break;
            
        case 3:
            const requiredFlight = ['airline', 'flightNumber', 'flightDate', 'pnr', 'departure', 'arrival'];
            for (const field of requiredFlight) {
                const value = document.getElementById(field)?.value;
                if (!value || value.trim() === '') {
                    isValid = false;
                    errorMessage = lang === 'en' ? 'Fill in all required fields' : 'Compila tutti i campi obbligatori';
                    break;
                }
            }
            break;
            
        case 4:
            const baggageType = document.getElementById('baggageType')?.value;
            const baggageColor = document.getElementById('baggageColor')?.value;
            if (!baggageType || !baggageColor) {
                isValid = false;
                errorMessage = lang === 'en' ? 'Provide at least type and color of baggage' : 'Fornisci almeno tipo e colore del bagaglio';
            }
            break;
            
        case 5:
            if (!formData.signature) {
                if (signaturePad && signaturePad.canvas) {
                    const canvas = signaturePad.canvas;
                    const ctx = signaturePad.ctx;
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const hasDrawing = imageData.data.some(channel => channel !== 0);
                    
                    if (hasDrawing) {
                        formData.signature = canvas.toDataURL();
                    } else {
                        isValid = false;
                        errorMessage = lang === 'en' ? 'Please sign the document' : '⚠️ Firma il documento nel riquadro sopra';
                    }
                } else {
                    isValid = false;
                    errorMessage = lang === 'en' ? 'Please sign the document' : '⚠️ Firma il documento nel riquadro sopra';
                }
            }
            
            const termsAccept = document.getElementById('termsAccept')?.checked;
            if (!termsAccept && isValid) {
                isValid = false;
                errorMessage = lang === 'en' ? 'Accept terms and conditions' : '⚠️ Accetta i termini e condizioni';
            }
            break;
    }
    
    if (!isValid) {
        showToast(errorMessage, 4000);
    }
    
    return isValid;
}

// Save Form Data
function saveFormData() {
    formData.personal = {
        firstName: document.getElementById('firstName')?.value || '',
        lastName: document.getElementById('lastName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        address: document.getElementById('address')?.value || ''
    };
    
    formData.flight = {
        airline: document.getElementById('airline')?.value || '',
        flightNumber: document.getElementById('flightNumber')?.value || '',
        flightDate: document.getElementById('flightDate')?.value || '',
        pnr: document.getElementById('pnr')?.value || '',
        departure: document.getElementById('departure')?.value || '',
        arrival: document.getElementById('arrival')?.value || ''
    };
    
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
    
    const reviewPersonal = document.getElementById('reviewPersonal');
    if (reviewPersonal) {
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
        `;
    }
    
    const reviewFlight = document.getElementById('reviewFlight');
    if (reviewFlight) {
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
        `;
    }
    
    const reviewBaggage = document.getElementById('reviewBaggage');
    if (reviewBaggage) {
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
                <div class="review-item-value">${formData.baggage.brand || 'N/A'}</div>
            </div>
        `;
    }
}

// Signature Pad Setup - MOBILE OPTIMIZED
function setupSignaturePad() {
    const canvas = document.getElementById('signaturePad');
    if (!canvas) {
        console.error('Signature canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    signaturePad = { canvas, ctx };
    
    function resizeCanvas() {
        const container = canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCtx.drawImage(canvas, 0, 0);
        
        canvas.width = Math.floor(rect.width - 4);
        canvas.height = window.innerWidth < 768 ? 150 : 200;
        
        ctx.drawImage(tempCanvas, 0, 0);
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }
    
    resizeCanvas();
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 250);
    });
    
    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        if (e.touches && e.touches.length > 0) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        } else {
            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };
        }
    }
    
    function startDrawing(e) {
        isDrawing = true;
        const coords = getCoordinates(e);
        lastX = coords.x;
        lastY = coords.y;
        
        if (e.touches) {
            e.preventDefault();
        }
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        e.preventDefault();
        
        const coords = getCoordinates(e);
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
        
        lastX = coords.x;
        lastY = coords.y;
    }
    
    function stopDrawing() {
        if (isDrawing) {
            isDrawing = false;
            formData.signature = canvas.toDataURL();
        }
    }
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);
    
    const clearBtn = document.getElementById('clearSignature');
    if (clearBtn) {
        const newClearBtn = clearBtn.cloneNode(true);
        clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
        
        newClearBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            formData.signature = null;
            showToast('Firma cancellata');
        });
    }
}

// Submit PIR
function submitPIR() {
    saveFormData();
    
    showToast('Invio in corso...');
    
    setTimeout(() => {
        const pirRef = generatePIRReference();
        
        const submission = {
            reference: pirRef,
            date: new Date().toISOString(),
            data: formData,
            extractedData: extractedPDFData // Include extracted data for reference
        };
        
        localStorage.setItem('lastPIR', JSON.stringify(submission));
        
        showSection('trackingSection');
        
        const refNumber = document.getElementById('referenceNumber');
        const submittedDate = document.getElementById('submittedDate');
        
        if (refNumber) refNumber.textContent = pirRef;
        if (submittedDate) submittedDate.textContent = formatDate(submission.date);
        
        showToast('✅ PIR inviato con successo!', 3000);
        
        simulateTracking();
    }, 1000);
}

function generatePIRReference() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `PIR-FCO-${new Date().getFullYear()}-${random.toString().padStart(6, '0')}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const lang = getStoredLanguage();
    return date.toLocaleString(lang === 'it' ? 'it-IT' : 'en-US');
}

function simulateTracking() {
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
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
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
    signaturePad = null;
    documentsUploaded = { boardingPass: false, idDoc: false };
    
    document.querySelectorAll('.form-input').forEach(input => {
        input.value = '';
        input.style.backgroundColor = '';
        input.style.borderColor = '';
    });
    
    document.querySelectorAll('.upload-box').forEach(box => {
        const uploadContent = box.querySelector('.upload-content');
        const uploadPreview = box.querySelector('.upload-preview');
        
        if (uploadContent) uploadContent.style.display = 'block';
        if (uploadPreview) uploadPreview.style.display = 'none';
    });
    
    const canvas = document.getElementById('signaturePad');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    const termsAccept = document.getElementById('termsAccept');
    if (termsAccept) termsAccept.checked = false;
}

// Dashboard Initialization
function initializeDashboard() {
    const recentPirsTable = document.getElementById('recentPirsTable');
    if (!recentPirsTable) return;
    
    const sampleData = [
        {
            ref: 'PIR-FCO-2025-347820',
            passenger: 'ADRYX FCO',
            flight: 'PRC001',
            date: '2025-07-18',
            status: 'delivered'
        },
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
    
    recentPirsTable.innerHTML = '';
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
    
    initializeCharts();
}

function initializeCharts() {
    const pirsByMonthCtx = document.getElementById('pirsByMonthChart');
    if (pirsByMonthCtx && typeof Chart !== 'undefined') {
        new Chart(pirsByMonthCtx, {
            type: 'line',
            data: {
                labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set'],
                datasets: [{
                    label: 'PIR Totali',
                    data: [450, 520, 480, 580, 620, 650, 700, 890, 950],
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
    
    const pirsByAirlineCtx = document.getElementById('pirsByAirlineChart');
    if (pirsByAirlineCtx && typeof Chart !== 'undefined') {
        new Chart(pirsByAirlineCtx, {
            type: 'doughnut',
            data: {
                labels: ['Hangar Program', 'Ryanair', 'Lufthansa', 'Altri'],
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

if (window.location.hash === '#dashboard') {
    setTimeout(initializeDashboard, 500);
}
