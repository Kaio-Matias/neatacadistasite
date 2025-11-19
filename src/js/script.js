document.addEventListener('DOMContentLoaded', function() {
    const faleConoscoButton = document.querySelector('a[href="/fale-conosco"]');
    if (faleConoscoButton) {
        faleConoscoButton.addEventListener('click', function(event) {
            event.preventDefault();
            alert('Botão "Fale Conosco" clicado!');
        });
    }

    const partnerLinks = document.querySelectorAll('a[href^="/marcas/"]');
    partnerLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const partnerName = this.getAttribute('href').split('/').pop();
            alert(`Você clicou no logo do parceiro: ${partnerName}`);
        });
    });
});
