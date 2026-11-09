
    document.getElementById('date').textContent = new Date().toLocaleString();
    // Simuler la vérification des anciens éléments
    const htmlOld = parseInt(document.getElementById('html-old').textContent);
    const cssOld = parseInt(document.getElementById('css-old').textContent);
    document.getElementById('html-old').textContent = htmlOld === 0 ? '0 (correct)' : htmlOld + ' (problème)';
    document.getElementById('css-old').textContent = cssOld === 0 ? '0 (correct)' : cssOld + ' (problème)';
  