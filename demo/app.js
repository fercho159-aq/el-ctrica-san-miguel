/* ============================================================
   ELÉCTRICA SAN MIGUEL — DEMO INTERACTIVITY
   ============================================================ */

// ---- DARK MODE ----
const darkToggle = document.getElementById('darkToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

darkToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// ---- MOBILE NAV ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// ---- ACTIVE NAV LINK ON SCROLL ----
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            if (scrollY >= top && scrollY < top + height) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
});

// ---- REVEAL ON SCROLL ----
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
revealElements.forEach(el => revealObserver.observe(el));

// ============================================================
// SIMULATOR
// ============================================================
const simState = {
    room: 'sala',
    temp: 'fria',
    intensity: 70,
    color: '#E8F0FF',
    kelvin: '6500K'
};

const roomNames = {
    sala: 'Sala de estar',
    cocina: 'Cocina',
    recamara: 'Recámara',
    oficina: 'Oficina',
    bano: 'Baño'
};

const products = {
    fria: { name: 'Foco LED 12W Luz Fría', desc: '6500K · Ideal para {room}', price: '$89.00 MXN', emoji: '💡' },
    neutra: { name: 'Foco LED 10W Luz Neutra', desc: '4000K · Ideal para {room}', price: '$95.00 MXN', emoji: '💡' },
    calida: { name: 'Foco LED 9W Luz Cálida', desc: '2700K · Ideal para {room}', price: '$79.00 MXN', emoji: '💡' }
};

function updateSimulator() {
    const overlay = document.getElementById('simLightOverlay');
    const label = document.getElementById('simRoomLabel');
    const productDiv = document.getElementById('simProduct');

    // Update light overlay
    const alpha = simState.intensity / 100;
    let color;
    if (simState.temp === 'fria') {
        color = `rgba(200, 222, 255, ${alpha * 0.4})`;
    } else if (simState.temp === 'neutra') {
        color = `rgba(255, 245, 220, ${alpha * 0.4})`;
    } else {
        color = `rgba(255, 210, 130, ${alpha * 0.5})`;
    }
    overlay.style.background = color;

    // Add radial glow effect from ceiling light position
    const glowAlpha = alpha * 0.6;
    let glowColor;
    if (simState.temp === 'fria') {
        glowColor = `rgba(180, 210, 255, ${glowAlpha})`;
    } else if (simState.temp === 'neutra') {
        glowColor = `rgba(255, 240, 200, ${glowAlpha})`;
    } else {
        glowColor = `rgba(255, 200, 100, ${glowAlpha})`;
    }
    overlay.style.background = `radial-gradient(ellipse at 50% 8%, ${glowColor} 0%, ${color} 50%, rgba(0,0,0,${0.15 * (1 - alpha)}) 100%)`;

    // Update label
    label.textContent = roomNames[simState.room];

    // Update product recommendation
    const prod = products[simState.temp];
    productDiv.innerHTML = `
        <div class="sim-product-icon">${prod.emoji}</div>
        <div class="sim-product-info">
            <strong>${prod.name}</strong>
            <span>${prod.desc.replace('{room}', roomNames[simState.room].toLowerCase())}</span>
            <span class="sim-product-price">${prod.price}</span>
        </div>
        <a href="#productos" class="btn btn-sm btn-primary">Ver</a>
    `;

    // Update SVG bulb glow
    const bulbGlow = document.querySelector('.sim-bulb-glow');
    if (bulbGlow) {
        if (simState.temp === 'fria') {
            bulbGlow.setAttribute('fill', `rgba(200, 222, 255, ${alpha})`);
        } else if (simState.temp === 'neutra') {
            bulbGlow.setAttribute('fill', `rgba(255, 240, 200, ${alpha})`);
        } else {
            bulbGlow.setAttribute('fill', `rgba(255, 200, 100, ${alpha})`);
        }
    }
}

// Room selection
document.querySelectorAll('.sim-option').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.sim-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        simState.room = btn.dataset.room;
        updateSimulator();
    });
});

// Temperature selection
document.querySelectorAll('.sim-temp').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.sim-temp').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        simState.temp = btn.dataset.temp;
        simState.color = btn.dataset.color;
        simState.kelvin = btn.dataset.kelvin;
        updateSimulator();
    });
});

// Intensity slider
document.getElementById('simIntensity').addEventListener('input', (e) => {
    simState.intensity = parseInt(e.target.value);
    document.getElementById('simIntensityVal').textContent = simState.intensity;
    updateSimulator();
});

// Initial render
updateSimulator();

// ============================================================
// CABLE CALCULATOR
// ============================================================
const calcState = {
    step: 1,
    uso: '',
    aparatos: ['iluminacion'],
    distancia: 10,
    ubicacion: '',
    instalacion: ''
};

function calcSelect(btn, step) {
    // Remove selected from siblings
    btn.closest('.calc-options-grid').querySelectorAll('.calc-choice').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    const value = btn.dataset.value;
    if (step === 1) {
        calcState.uso = value;
        setTimeout(() => calcNext(2), 300);
    } else if (step === 4) {
        calcState.ubicacion = value;
        setTimeout(() => calcNext(5), 300);
    } else if (step === 5) {
        calcState.instalacion = value;
        setTimeout(() => calcNext(6), 300);
    }
}

function calcNext(step) {
    // Gather step 2 data
    if (step === 3) {
        const checks = document.querySelectorAll('#calcStep2 input[type="checkbox"]:checked');
        calcState.aparatos = Array.from(checks).map(c => c.value);
        if (calcState.aparatos.length === 0) {
            alert('Selecciona al menos un aparato.');
            return;
        }
    }
    if (step === 4) {
        calcState.distancia = parseInt(document.getElementById('calcDistance').value);
    }

    // Calculate result if going to step 6
    if (step === 6) {
        calculateResult();
    }

    calcState.step = step;
    updateCalcUI();
}

function calcBack(step) {
    calcState.step = step;
    updateCalcUI();
}

function calcReset() {
    calcState.step = 1;
    calcState.uso = '';
    calcState.aparatos = ['iluminacion'];
    calcState.distancia = 10;
    calcState.ubicacion = '';
    calcState.instalacion = '';
    // Reset UI selections
    document.querySelectorAll('.calc-choice').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('#calcStep2 input[type="checkbox"]').forEach(c => {
        c.checked = c.value === 'iluminacion';
    });
    document.getElementById('calcDistance').value = 10;
    document.getElementById('calcDistVal').textContent = '10';
    updateCalcUI();
}

function updateCalcUI() {
    // Update panels
    for (let i = 1; i <= 6; i++) {
        const panel = document.getElementById(`calcStep${i}`);
        panel.classList.toggle('active', i === calcState.step);
    }
    // Update progress bar
    const pct = (calcState.step / 6) * 100;
    document.getElementById('calcProgressBar').style.width = pct + '%';
    // Update step indicators
    document.querySelectorAll('.calc-step').forEach(s => {
        const sNum = parseInt(s.dataset.step);
        s.classList.remove('active', 'done');
        if (sNum === calcState.step) s.classList.add('active');
        else if (sNum < calcState.step) s.classList.add('done');
    });
}

function calculateResult() {
    // Determine the highest-demand appliance
    const amperageTable = {
        iluminacion: { gauge: '14 AWG', amp: '15A', type: 'THW', use: 'Iluminación' },
        contactos: { gauge: '12 AWG', amp: '20A', type: 'THW', use: 'Contactos generales' },
        aire: { gauge: '10 AWG', amp: '30A', type: 'THW', use: 'Aire acondicionado' },
        estufa: { gauge: '8 AWG', amp: '40A', type: 'THW', use: 'Estufa eléctrica' },
        motor: { gauge: '10 AWG', amp: '30A', type: 'THW', use: 'Motor/bomba de agua' },
        calentador: { gauge: '10 AWG', amp: '30A', type: 'THW', use: 'Calentador eléctrico' }
    };

    const gaugeOrder = ['14 AWG', '12 AWG', '10 AWG', '8 AWG', '6 AWG'];

    let maxGaugeIdx = 0;
    let maxUse = 'Iluminación';
    let maxAmp = '15A';

    calcState.aparatos.forEach(a => {
        const info = amperageTable[a];
        if (info) {
            const idx = gaugeOrder.indexOf(info.gauge);
            if (idx > maxGaugeIdx) {
                maxGaugeIdx = idx;
                maxUse = info.use;
                maxAmp = info.amp;
            }
        }
    });

    // If distance > 20m, bump up one gauge
    if (calcState.distancia > 20 && maxGaugeIdx < gaugeOrder.length - 1) {
        maxGaugeIdx++;
    }

    const gauge = gaugeOrder[maxGaugeIdx];
    const cableType = calcState.ubicacion === 'intemperie' ? 'THHW' : 'THW';
    const install = calcState.instalacion === 'tuberia' ? 'Interior en tubería' : 'Instalación aparente';

    document.getElementById('calcResultCable').innerHTML = `
        <span class="calc-result-type">Cable ${cableType}</span>
        <span class="calc-result-gauge">Calibre ${gauge}</span>
    `;
    document.getElementById('calcResultDetails').innerHTML = `
        <div class="calc-result-detail"><strong>Amperaje:</strong> ${maxAmp}</div>
        <div class="calc-result-detail"><strong>Uso:</strong> ${maxUse}</div>
        <div class="calc-result-detail"><strong>Tipo:</strong> ${install}</div>
    `;
}

function shareWhatsApp() {
    const cable = document.querySelector('.calc-result-type')?.textContent || '';
    const gauge = document.querySelector('.calc-result-gauge')?.textContent || '';
    const msg = encodeURIComponent(`Hola! Según la calculadora de Eléctrica San Miguel necesito: ${cable} ${gauge}. ¿Lo tienen disponible?`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
}

// ---- NAVBAR SCROLL EFFECT ----
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});
