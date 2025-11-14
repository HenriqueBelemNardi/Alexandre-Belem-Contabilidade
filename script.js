document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DARK MODE TOGGLE ---
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const icon = themeBtn.querySelector('i');

    // Verificar preferência salva
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);
    }

    themeBtn.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });

    function updateIcon(theme) {
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // --- 2. MENU MOBILE AVANÇADO ---
    const mobileBtn = document.getElementById('mobile-menu-icon');
    const navList = document.getElementById('nav-list');
    const overlay = document.getElementById('menu-overlay');
    const body = document.body;

    function toggleMenu() {
        navList.classList.toggle('active');
        overlay.classList.toggle('active');
        // Travar scroll quando menu aberto
        body.style.overflow = navList.classList.contains('active') ? 'hidden' : 'auto';
    }

    mobileBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Fechar ao clicar em link
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) toggleMenu();
        });
    });

    // --- 3. ANIMAÇÕES AO SCROLL (REVEAL) ---
    const reveals = document.querySelectorAll('.reveal, .reveal-card');

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animar apenas uma vez
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => revealOnScroll.observe(el));

    // --- 4. FORMULÁRIO E MODAL ---
    const form = document.getElementById('contactForm');
    const modal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulação de envio
        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Enviando...';
        btn.disabled = true;

        setTimeout(() => {
            modal.style.display = 'flex';
            form.reset();
            btn.innerText = originalText;
            btn.disabled = false;
        }, 1500);
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.onclick = (e) => {
        if (e.target == modal) modal.style.display = 'none';
    }
});

// --- 5. SIMULADOR PJ (ESCOPO GLOBAL) ---
function calcularPJ() {
    const fatInput = document.getElementById('faturamentoInput').value;
    const despInput = document.getElementById('despesasInput').value;
    const resDiv = document.getElementById('resultado');
    
    if (!fatInput || fatInput <= 0) {
        alert("Por favor, insira um faturamento válido.");
        return;
    }

    const faturamento = parseFloat(fatInput);
    const despesas = despInput ? parseFloat(despInput) : 0;

    // Lógica Estimativa (Simplificada para conversão)
    // CLT: Base cálculo ~ (Fat - 27.5% IRPF/INSS Teto)
    const liquidoCLT = faturamento * 0.725; 

    // PJ: (Fat - Imposto Simples ~6% - Despesas)
    // *Nota: Cenário otimista de Anexo III
    const impostoPJ = faturamento * 0.06;
    const liquidoPJ = faturamento - impostoPJ - despesas;

    const diferenca = liquidoPJ - liquidoCLT;

    // Formatador BRL
    const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    document.getElementById('resCLT').innerText = fmt.format(liquidoCLT);
    document.getElementById('resPJ').innerText = fmt.format(liquidoPJ);
    document.getElementById('resDif').innerText = fmt.format(diferenca);

    // Exibir resultado
    resDiv.classList.remove('hidden');
    
    // Scroll suave até o resultado
    resDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}