document.addEventListener('DOMContentLoaded', function () {
    // --- Existing Logic ---
    const faleConoscoButton = document.querySelector('a[href="/fale-conosco"]');
    if (faleConoscoButton) {
        faleConoscoButton.addEventListener('click', function (event) {
            event.preventDefault();
            alert('Botão "Fale Conosco" clicado!');
        });
    }

    const partnerLinks = document.querySelectorAll('a[href^="/marcas/"]');
    partnerLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const partnerName = this.getAttribute('href').split('/').pop();
            alert(`Você clicou no logo do parceiro: ${partnerName}`);
        });
    });

    const whatsappIcon = document.getElementById('whatsapp-icon');
    const whatsappWidget = document.getElementById('whatsapp-chat-widget');
    const closeWhatsappWidget = document.getElementById('close-whatsapp-widget');

    if (whatsappIcon && whatsappWidget) {
        // Toggle widget on icon click
        whatsappIcon.addEventListener('click', function () {
            if (whatsappWidget.style.display === 'block') {
                whatsappWidget.style.display = 'none';
            } else {
                whatsappWidget.style.display = 'block';
            }
        });

        // Close widget on close button click
        if (closeWhatsappWidget) {
            closeWhatsappWidget.addEventListener('click', function () {
                whatsappWidget.style.display = 'none';
            });
        }

        // Close widget when clicking outside
        window.addEventListener('click', function (event) {
            if (!whatsappIcon.contains(event.target) && !whatsappWidget.contains(event.target)) {
                whatsappWidget.style.display = 'none';
            }
        });
    }

    // Interactive Map Logic
    const states = document.querySelectorAll('.state');
    const tooltip = document.getElementById('state-tooltip');
    const mapContainer = document.querySelector('.map-container');

    if (states.length > 0 && tooltip && mapContainer) {
        states.forEach(state => {
            state.addEventListener('mouseenter', (e) => {
                const stateName = state.getAttribute('data-name');
                tooltip.textContent = stateName;
                tooltip.style.display = 'block';
            });

            state.addEventListener('mousemove', (e) => {
                const containerRect = mapContainer.getBoundingClientRect();
                const x = e.clientX - containerRect.left;
                const y = e.clientY - containerRect.top;

                tooltip.style.left = x + 'px';
                tooltip.style.top = (y - 10) + 'px';
            });

            state.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        });
    }

    // --- Job Board Logic ---
    const jobListContainer = document.getElementById('job-list');
    const jobSearchInput = document.getElementById('job-search');
    const btnSearch = document.getElementById('btn-search');
    const noJobsMessage = document.getElementById('no-jobs-message');

    if (jobListContainer) {
        // Load Jobs from external file (jobs-data.js)
        const jobs = window.jobsData || [];

        // Render Jobs Function
        function renderJobs(jobsToRender) {
            jobListContainer.innerHTML = '';

            if (jobsToRender.length === 0) {
                noJobsMessage.classList.remove('d-none');
                return;
            } else {
                noJobsMessage.classList.add('d-none');
            }

            jobsToRender.forEach(job => {
                const card = document.createElement('div');
                card.className = 'col-md-6 col-lg-4';
                card.innerHTML = `
                    <div class="card h-100 border-0 shadow-sm hover-lift">
                        <div class="card-body p-4 d-flex flex-column">
                            <div class="mb-3">
                                <span class="badge bg-primary bg-opacity-10 text-primary mb-2">${job.location}</span>
                                <h4 class="card-title fw-bold text-dark">${job.title}</h4>
                                <span class="text-muted small"><i class="bi bi-clock me-1"></i>${job.type}</span>
                            </div>
                            <p class="card-text text-secondary flex-grow-1">${job.description.substring(0, 100)}...</p>
                            <button class="btn btn-outline-primary w-100 mt-3 fw-semibold btn-details" data-id="${job.id}">
                                Ver Detalhes
                            </button>
                        </div>
                    </div>
                `;
                jobListContainer.appendChild(card);
            });

            // Add Event Listeners to "Ver Detalhes" buttons
            document.querySelectorAll('.btn-details').forEach(btn => {
                btn.addEventListener('click', function () {
                    const jobId = parseInt(this.getAttribute('data-id'));
                    openJobModal(jobId);
                });
            });
        }

        // Open Modal Function
        function openJobModal(jobId) {
            const job = jobs.find(j => j.id === jobId);
            if (!job) return;

            document.getElementById('modal-job-title').textContent = job.title;
            document.getElementById('modal-job-location').textContent = job.location;
            document.getElementById('modal-job-type').textContent = job.type;
            document.getElementById('modal-job-description').textContent = job.description;
            document.getElementById('job-id-input').value = job.id;

            const reqList = document.getElementById('modal-job-requirements');
            reqList.innerHTML = '';
            job.requirements.forEach(req => {
                const li = document.createElement('li');
                li.textContent = req;
                reqList.appendChild(li);
            });

            const jobModal = new bootstrap.Modal(document.getElementById('jobModal'));
            jobModal.show();
        }

        // Filter Logic
        function filterJobs() {
            const searchTerm = jobSearchInput.value.toLowerCase();
            const filtered = jobs.filter(job =>
                job.title.toLowerCase().includes(searchTerm) ||
                job.description.toLowerCase().includes(searchTerm)
            );
            renderJobs(filtered);
        }

        btnSearch.addEventListener('click', filterJobs);
        jobSearchInput.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') filterJobs();
        });

        // Initial Render
        renderJobs(jobs);

        // Form Submission (Simulation)
        const appForm = document.getElementById('application-form');
        if (appForm) {
            appForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const name = document.getElementById('applicant-name').value;
                const email = document.getElementById('applicant-email').value;
                const jobTitle = document.getElementById('modal-job-title').textContent;

                // Here you would integrate EmailJS or another service
                // Example: emailjs.sendForm('service_id', 'template_id', this);

                alert(`Obrigado, ${name}! Sua candidatura para a vaga de "${jobTitle}" foi enviada com sucesso.\n\n(Simulação: Em um ambiente real, os dados seriam enviados para ${email})`);

                // Close modal
                const modalEl = document.getElementById('jobModal');
                const modalInstance = bootstrap.Modal.getInstance(modalEl);
                modalInstance.hide();

                // Reset form
                appForm.reset();
            });
        }
    }
});
