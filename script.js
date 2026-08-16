// В шаге от дома — общий скрипт сайта
// Полноэкранный просмотр фото кошек с листанием (клик по карточке -> лайтбокс)

(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('#cats-grid .cat-card'));
  if (!cards.length) return;

  var cats = cards.map(function (card) {
    var img = card.querySelector('.photo img');
    var ageEl = card.querySelector('.age');
    var linkEl = card.querySelector('.body > a.btn');
    return {
      photo: img ? img.getAttribute('src') : '',
      alt: img ? img.getAttribute('alt') : '',
      name: (card.querySelector('h3') || {}).textContent || '',
      age: ageEl ? ageEl.textContent.trim() : '',
      desc: (card.querySelector('.body > p') || {}).textContent || '',
      tags: Array.prototype.map.call(card.querySelectorAll('.tag'), function (t) {
        return t.textContent.trim();
      }),
      link: linkEl ? linkEl.getAttribute('href') : null
    };
  });

  var overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML =
    '<button type="button" class="lb-close" aria-label="Закрыть">&times;</button>' +
    '<button type="button" class="lb-prev" aria-label="Предыдущая кошка">&#8249;</button>' +
    '<button type="button" class="lb-next" aria-label="Следующая кошка">&#8250;</button>' +
    '<div class="lb-inner">' +
      '<div class="lb-photo"><img alt=""></div>' +
      '<div class="lb-info">' +
        '<div class="lb-name-row"><h3></h3><span class="lb-age"></span></div>' +
        '<p class="lb-desc"></p>' +
        '<div class="lb-tags"></div>' +
        '<a class="btn btn-primary lb-link" target="_blank" rel="noopener">Забрать домой</a>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);

  var imgEl = overlay.querySelector('.lb-photo img');
  var nameEl = overlay.querySelector('.lb-name-row h3');
  var ageEl = overlay.querySelector('.lb-age');
  var descEl = overlay.querySelector('.lb-desc');
  var tagsEl = overlay.querySelector('.lb-tags');
  var linkEl = overlay.querySelector('.lb-link');

  var current = 0;

  function render(i) {
    current = (i + cats.length) % cats.length;
    var c = cats[current];
    imgEl.src = c.photo;
    imgEl.alt = c.alt;
    nameEl.textContent = c.name;
    ageEl.textContent = c.age;
    descEl.textContent = c.desc;
    tagsEl.innerHTML = c.tags
      .map(function (t) { return '<span class="tag">' + t + '</span>'; })
      .join('');
    if (c.link) {
      linkEl.style.display = '';
      linkEl.href = c.link;
    } else {
      linkEl.style.display = 'none';
    }
  }

  function open(i) {
    render(i);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  cards.forEach(function (card, i) {
    var photo = card.querySelector('.photo');
    if (!photo) return;
    photo.style.cursor = 'zoom-in';
    photo.addEventListener('click', function () { open(i); });
  });

  overlay.querySelector('.lb-close').addEventListener('click', close);
  overlay.querySelector('.lb-prev').addEventListener('click', function () { render(current - 1); });
  overlay.querySelector('.lb-next').addEventListener('click', function () { render(current + 1); });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') render(current - 1);
    if (e.key === 'ArrowRight') render(current + 1);
  });

  // свайп для тачскринов
  var touchStartX = null;
  overlay.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  overlay.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) render(current + 1); else render(current - 1);
    }
    touchStartX = null;
  }, { passive: true });
})();
