let isMuted = false,
    volume = 69;

const player = document.getElementById('videoPlayer');
const video = document.getElementById('GuideVideo');
const pFill = document.getElementById('progressFill');
const pThumb = document.getElementById('progressThumb');
const timeLabel = document.getElementById('progressTime');
const vFill = document.getElementById('volFill');
const vThumb = document.getElementById('volThumb');

const ru = {
    'subtitle': 'Гайд по установке',
    'note': 'Если у вас есть вопросы, обратитесь в <a class="note" href="https://t.me/heroku_talks" target="_blank">поддержку</a>.',
    'video-header': 'Полное видео руководство',
    'steps-header': 'Пошаговое руководство',
    'step1-title': 'Установите UserLAnd',
    'step1-desc': 'Скачайте и установите UserLAnd из Google Play Store. Это приложение позволяет запускать Linux на вашем Android устройстве.',
    'step1-link': 'Скачать из Google Play ->',
    'step2-title': 'Установите Ubuntu',
    'step2-desc': 'Откройте UserLand, выберите Ubuntu → Minimal → Terminal. Это настроит лёгкое Ubuntu окружение на вашем устройстве.',
    'step3-title': 'Ожидайте установку',
    'step3-desc': 'Ожидайте установку дистрибутива. Это может занять несколько минут в зависимости от скорости интернета. Если видите окна с <code class="inline-code">[y/n]</code> просто отвечайте <code class="inline-code">y</code>, ну а пока можете налить чай ;)',
    'step4-title': 'Вставьте команду установки',
    'step4-desc': 'После успешной установки перед вами откроется терминал, напишите там:',
    'step5-title': 'Войдите в аккаунт',
    'step5-desc': 'Вас попросят ввести данные аккаунта, следуйте инструкциям и внимательно читайте подсказки. Если вы плохо знаете английский, смотрите видео или используйте переводчик.',
    'step6-title': 'Готово!',
    'step6-desc': 'Вуаля! Вы установили Heroku на UserLAnd. Всё готово к использованию.',
    'sub1-title': 'Получаем API данные Telegram',
    'sub1-li1': 'Перейдите на <a href="https://my.telegram.org/auth?to=apps" target="_blank" class="step-link">https://my.telegram.org/auth?to=apps</a> и войдите в свой аккаунт Telegram.',
    'sub1-li2': 'Нажмите на <span class="sub-highlight">"API development tools"</span>.',
    'sub1-li3': 'Создайте новое приложение, заполнив необходимые данные (название и описание могут быть любыми, url тоже).',
    'sub1-li4': 'Скопируйте ваш <span class="sub-highlight">API ID</span> и <span class="sub-highlight">API hash</span>.',
    'sub2-title': 'Вводим данные в терминал UserLAnd',
    'sub2-li1': 'Когда появится запрос, введите скопированный <span class="sub-highlight">API ID</span> <span class="sub-example">(например, 33728218)</span>.',
    'sub2-li2': 'Затем введите скопированный <span class="sub-highlight">API hash</span> <span class="sub-example">(например, 2c416c3a6e867f9c67169a6c8506990b)</span>.',
    'sub3-title': 'Выбираем способ входа',
    'sub3-li1': 'Решите, хотите ли вы использовать QR-код введите <code class="inline-code">y</code> для да, или <code class="inline-code">n</code> для входа по номеру телефона.',
    'sub3-li2': 'Если выбрали телефон, введите номер в международном формате <span class="sub-example">(например, +7908 ***)</span>.',
    'sub3-li3': 'После завершения конфигурация API будет сохранена и юзербот войдёт в аккаунт.',
};

if (navigator.language.startsWith('ru')) {
    document.querySelectorAll('[language-data]').forEach(el => {
        const key = el.getAttribute('language-data');
        if (ru[key]) el.innerHTML = ru[key];
    });
}

function fmt(s) {
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function renderProgress() {
    const pct = video.duration ? (video.currentTime / video.duration * 100) : 0;
    pFill.style.width = pct + '%';
    pThumb.style.left = pct + '%';
    timeLabel.textContent = `${fmt(video.currentTime || 0)} / ${fmt(video.duration || 0)}`;
}

function renderVolume() {
    vFill.style.width = volume + '%';
    vThumb.style.left = volume + '%';
}

function togglePlay() {
    if (video.paused) {
        video.play();
        player.classList.add('is-playing');
    } else {
        video.pause();
        player.classList.remove('is-playing');
    }
}

function seekVideo(e) {
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    video.currentTime = video.duration * Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
}

function toggleMute() {
    isMuted = !isMuted;
    video.muted = isMuted;
    player.classList.toggle('is-muted', isMuted);
    
    if (isMuted) {
        vFill.style.width = '0%';
        vThumb.style.left = '0%';
    } else {
        vFill.style.width = volume + '%';
        vThumb.style.left = volume + '%';
    }
}

function setVolume(e) {
    const r = e.currentTarget.getBoundingClientRect();
    volume = Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100));
    video.volume = volume / 100;
    isMuted = volume === 0;
    video.muted = isMuted;
    player.classList.toggle('is-muted', isMuted);
    renderVolume();
}

video.addEventListener('timeupdate', renderProgress);
video.addEventListener('ended', () => player.classList.remove('is-playing'));

let expanded = false;
function toggleExpand() {
    expanded = !expanded;
    document.getElementById('stepBlock').classList.toggle('is-expanded', expanded);
}

function copyCode(btn) {
    const code = btn.closest('.terminal').querySelector('.terminal-code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 1500);
    });
}

video.volume = volume / 100;
renderVolume();