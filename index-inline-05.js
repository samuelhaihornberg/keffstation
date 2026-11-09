

(function () {

  document.querySelectorAll('.app-card').forEach(function (card) {

    var count = 4;

    for (var i = 0; i < count; i++) {

      var s = document.createElement('span');

      s.className = 'sparkle';

      s.style.left = (10 + Math.random() * 80) + '%';

      s.style.top = (10 + Math.random() * 80) + '%';

      s.style.animationDelay = (Math.random() * 3) + 's';

      card.appendChild(s);

    }

  });

})();

