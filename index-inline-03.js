

(function () {

  var container = document.querySelector('.matrix-rain');

  if (!container) return;

  var width = window.innerWidth;

  var colCount = Math.ceil(width / 18);

  var codes = [

    { text: '<A1➡️B2>', klass: 'vert' },

    { text: '<sandwich>', klass: 'bleu' },

    { text: '<adresse>', klass: 'blanc' },

    { text: '<cos>', klass: 'rouge' },

    { text: '<BLM>', klass: 'vert' },

    { text: '<BLSM>', klass: 'bleu' },

    { text: '<motor.s>', klass: 'blanc' },

    { text: '<CSM>', klass: 'rouge' },

    { text: '<connexion>', klass: 'vert' },

    { text: '<registre>', klass: 'bleu' },

    { text: '<nœud>', klass: 'blanc' },

    { text: '<graphe>', klass: 'rouge' },

    { text: '<cos-editor>', klass: 'vert' },

    { text: '<ViA>', klass: 'bleu' },

    { text: '<Golem>', klass: 'blanc' },

    { text: '<Geeko>', klass: 'rouge' },

    { text: '<Guideoplan>', klass: 'vert' },

    { text: '<SuperBots>', klass: 'bleu' },

    { text: '<KT->', klass: 'blanc' },

    { text: '<recyclor>', klass: 'rouge' }

  ];

  function randomCode() {

    var c = codes[Math.floor(Math.random() * codes.length)];

    return '<span class="matrix-code ' + c.klass + '" data-i18n="./index.html_ctext_70">' + c.text + '</span>';

  }

  function buildColumn(left, delay, duration) {

    var col = document.createElement('div');

    col.className = 'matrix-col';

    col.style.left = left + 'px';

    col.style.animationDelay = delay + 's';

    col.style.animationDuration = duration + 's';

    var lines = Math.floor(1 + Math.random() * 3);

    var html = '';

    for (var i = 0; i < lines; i++) {

      html += randomCode();

    }

    col.innerHTML = html;

    return col;

  }

  var COL_SPACING = 160;

  var LINE_SPACING = 120;

  var colCount = Math.ceil(width / COL_SPACING) + 1;

  var lineCount = Math.ceil(window.innerHeight / LINE_SPACING) + 1;



  function randomLineCode() {

    var c = codes[Math.floor(Math.random() * codes.length)];

    return '<span class="matrix-line-code ' + c.klass + '" data-i18n="./index.html_ctext_71">' + c.text + '</span>';

  }



  function buildLine(top, delay, duration) {

    var line = document.createElement('div');

    line.className = 'matrix-line';

    line.style.top = top + 'px';

    line.style.animationDelay = delay + 's';

    line.style.animationDuration = duration + 's';

    var count = Math.floor(2 + Math.random() * 5);

    var html = '';

    for (var i = 0; i < count; i++) {

      html += randomLineCode();

    }

    line.innerHTML = html;

    return line;

  }



  for (var i = 0; i < colCount; i++) {

    var left = i * COL_SPACING + (Math.random() * 40);

    var delay = Math.random() * 20;

    var duration = 10 + Math.random() * 15;

    var col = buildColumn(left, delay, duration);

    container.appendChild(col);

  }

  for (var i = 0; i < lineCount; i++) {

    var top = i * LINE_SPACING + (Math.random() * 30);

    var delay = Math.random() * 15;

    var duration = 8 + Math.random() * 12;

    var line = buildLine(top, delay, duration);

    container.appendChild(line);

  }



  window.addEventListener('resize', function () {

    width = window.innerWidth;

    colCount = Math.ceil(width / COL_SPACING) + 1;

    lineCount = Math.ceil(window.innerHeight / LINE_SPACING) + 1;

    while (container.firstChild) container.removeChild(container.firstChild);

    for (var i = 0; i < colCount; i++) {

      var left = i * COL_SPACING + (Math.random() * 40);

      var delay = Math.random() * 20;

      var duration = 10 + Math.random() * 15;

      var col = buildColumn(left, delay, duration);

      container.appendChild(col);

    }

    for (var i = 0; i < lineCount; i++) {

      var top = i * LINE_SPACING + (Math.random() * 30);

      var delay = Math.random() * 15;

      var duration = 8 + Math.random() * 12;

      var line = buildLine(top, delay, duration);

      container.appendChild(line);

    }

  });

})();

