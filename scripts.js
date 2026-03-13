document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SMOOTH SCROLL PARA ANCORAS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- 2. INTERSECTION OBSERVER (Fade in On Scroll) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply fade-in class to major sections right after load
    document.querySelectorAll('section').forEach(sec => {
        sec.classList.add('fade-in');
        fadeObserver.observe(sec);
    });

    // --- 3. FETCH E RENDERIZAÇÃO DE CONTEÚDO DINÂMICO ---

    // 3.1 Tendências
    fetch('content/tendencias.json')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('tendencias-container');
            let html = '';

            if (data.length > 0) {
                // Primeira tendência como Lead Editorial
                html += `
                    <div class="editorial-lead">
                        <h3 class="lead-title">${data[0].title}</h3>
                        <p class="lead-desc">${data[0].description}</p>
                    </div>
                `;

                // Restante em um grid elegante
                if (data.length > 1) {
                    html += '<div class="editorial-grid">';
                    for (let i = 1; i < data.length; i++) {
                        let imgHtml = '';
                        if (data[i].image) {
                            imgHtml = `
                                <div class="trend-img-wrap">
                                    <img src="${data[i].image}" alt="${data[i].title}" loading="lazy">
                                </div>
                            `;
                        }

                        html += `
                            <div class="editorial-trend">
                                ${imgHtml}
                                <h4 class="trend-title">${data[i].title}</h4>
                                <p class="trend-desc">${data[i].description}</p>
                            </div>
                        `;
                    }
                    html += '</div>';
                }
            }
            container.innerHTML = html;
        })
        .catch(err => console.error('Erro ao carregar tendências:', err));

    // 3.2 Shapes
    fetch('content/shapes.json')
        .then(res => res.json())
        .then(data => {
            const grid = document.getElementById('shapes-grid');
            let html = '';
            data.forEach(item => {
                html += `
                    <div class="shape-card">
                        <div class="shape-img-wrap">
                            <img src="${item.image}" alt="${item.name}" loading="lazy">
                        </div>
                        <h4 class="shape-name">${item.name}</h4>
                        <p class="shape-desc">${item.description}</p>
                        <div class="shape-meta">
                            <div class="meta-item">
                                <span class="meta-label">Vantagens</span>
                                <span class="meta-text">${item.vantagens}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label highlight">Insight Amolde</span>
                                <span class="meta-text">${item.insight}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            grid.innerHTML = html;
        })
        .catch(err => console.error('Erro ao carregar shapes:', err));

    // 3.3 Materiais
    fetch('content/materiais.json')
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('materiais-list');
            let html = '';
            data.forEach((item, index) => {
                html += `
                    <div class="material-item">
                        <span class="section-label">03.${index + 1}</span>
                        <h3>${item.name}</h3>
                        <div class="material-img-wrap">
                            <img src="${item.image}" alt="${item.name}" loading="lazy">
                        </div>
                        <p class="material-desc">${item.description}</p>
                        <div class="material-meta">
                            <strong>Ideal para:</strong> ${item.use}<br>
                            <strong style="margin-top:8px; display:inline-block;">Vantagem:</strong> ${item.advantages}
                        </div>
                    </div>
                `;
            });
            list.innerHTML = html;
        })
        .catch(err => console.error('Erro ao carregar materiais:', err));

});
