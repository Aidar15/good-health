// Меню бургер

const iconMenu = document.querySelector('.header-burger');
const menuBody = document.querySelector('.main-header__menu');

if(iconMenu) {
    
    iconMenu.addEventListener("click", function(e){
        document.body.classList.toggle('lock');
        iconMenu.classList.toggle('_active');
        menuBody.classList.toggle('_active');
    });
}

// Прокрутка при клике

let menuLinks = document.querySelectorAll('.main-header__link[data-goto]');
if (menuLinks.length>0) {
    menuLinks.forEach(menuLink => {
        menuLink.addEventListener("click", onMenuLinkClick);
    });

    function onMenuLinkClick(e) {
        const menuLink = e.target;
        if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
            const headerHeight = document.querySelector('.main-header__wrapper')
            const gotoBlock = document.querySelector(menuLink.dataset.goto);
            const gotoBlockValue = gotoBlock.getBoundingClientRect().top + window.pageYOffset;
            const gotoBlockValue2 = gotoBlock.getBoundingClientRect().top + window.pageYOffset - headerHeight.offsetHeight;

            if (iconMenu.classList.contains('_active')) {
                document.body.classList.remove('lock');
                iconMenu.classList.remove('_active');
                menuBody.classList.remove('_active');
            }

            if (document.documentElement.clientWidth > 960) {
                window.scrollTo({
                    top: gotoBlockValue,
                    behavior: "smooth"
                });
                e.preventDefault();
            } else {
                window.scrollTo({
                    top: gotoBlockValue2,
                    behavior: "smooth"
                });
                e.preventDefault();
            }
        }
    }
}

// Прокрутка при клике в футере

let menuLinksF = document.querySelectorAll('.page-footer__link[data-goto]');
if (menuLinksF.length>0) {
    menuLinksF.forEach(menuLinkF => {
        menuLinkF.addEventListener("click", onMenuLinkClick);
    });

    function onMenuLinkClick(e) {
        const menuLinkF = e.target;
        if (menuLinkF.dataset.goto && document.querySelector(menuLinkF.dataset.goto)) {
            const footerHeight = document.querySelector('.page-footer__wrapper')
            const gotoBlockF = document.querySelector(menuLinkF.dataset.goto);
            const gotoBlockValueF = gotoBlockF.getBoundingClientRect().top + window.pageYOffset;

            if (document.documentElement.clientWidth > 960) {
                window.scrollTo({
                    top: gotoBlockValueF,
                    behavior: "smooth"
                });
                e.preventDefault();
            } 
        }
    }
}

//Попапы
const removeVideo1 = document.getElementById("video1");
const removeVideo2 = document.getElementById("video2");
const removeVideo3 = document.getElementById("video3");
const removeVideo4 = document.getElementById("video4");
const removeVideo5 = document.getElementById("video5");
const removeVideo6 = document.getElementById("video6");
const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelector('.lock-padding');

let unlock = true;

const timeout = 600;

if(popupLinks.length > 0) {
  for (let index = 0; index < popupLinks.length; index++) {
    const popupLink = popupLinks[index];
    popupLink.addEventListener("click", function(e) {
      const popupName = popupLink.getAttribute('href').replace('#', '');
      const currentPopup = document.getElementById(popupName);
      popupOpen(currentPopup);
      e.preventDefault();
    });
  }
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
  for (let index = 0; index < popupCloseIcon.length; index++) {
    const el = popupCloseIcon[index];
    el.addEventListener('click', function(e) {
      popupClose(el.closest('.popup'));
      e.preventDefault();
    });
  }
}

function popupOpen(currentPopup) {
  if(currentPopup && unlock) {
    const popupActive = document.querySelector('.popup.open');
    if (popupActive) {
      popupClose(popupActive, false);
    } else {
      bodyLock();
    }
    currentPopup.classList.add('open');
    currentPopup.addEventListener("click", function (e) {
      if(!e.target.closest('.popup__content')) {
        popupClose(e.target.closest('.popup'));
      }
    })
  }
}

function popupClose(popupActive, doUnlock = true) {
  if (unlock) {
    popupActive.classList.remove('open');
    if (doUnlock) {
      bodyUnlock();
    }
  }
  removeVideo1.pause();
  removeVideo2.pause();
  removeVideo3.pause();
  removeVideo4.pause();
  removeVideo5.pause();
  removeVideo6.pause();
}

function bodyLock() {
  const lockPaddingValue = window.innerWidth - document.querySelector('.page-body').offsetWidth + 'px';

  if (lockPadding.length>0) {
    for (let index = 0; index < lockPadding.length; index++) {
      const el = lockPadding[index];
      el.style.paddingRight = lockPaddingValue
    }
  }
  
  body.style.paddingRight = lockPaddingValue;
  body.classList.add('lock');

  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}

function bodyUnlock() {
  setTimeout(function () {
    if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index];
        el.style.paddingRight = '0px';
      }
    }
    
    body.style.paddingRight = '0px';
    body.classList.remove('lock');
  }, timeout)

  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout)
}

document.addEventListener('keydown', function (e) {
  if(e.which === 27) {
    const popupActive = document.querySelector('.popup.open');
    popupClose(popupActive);
    
  }
});

// Проверка формы

const form = document.getElementById('form');
form.addEventListener('submit', formSend);
async function formSend(e) {
  e.preventDefault();
  let error = formValidate(form);

  let formData = new FormData(form);
  
  if (error === 0) {
    form.classList.add('_sending');
    let response = await fetch('sendmail.php', {
      method: 'POST',
      body: formData
    });
    if (response.ok) {
       let result = await response.json();
       alert(result.message);
       form.reset();
       form.classList.remove('_sending') ;
    } else {
      alert("Ошибка");
      form.classList.remove('_sending') ;
    }
  } else {
    alert('Заполните обязательные поля');
  }
}

function formValidate(form) {
  let error = 0;
  let formReq = document.querySelectorAll('._req');
  for (let index = 0; index < formReq.length; index++) {
    const input = formReq[index];
    formRemoveError(input);

    if (input.getAttribute("type")==="checkbox" && input.checked === false) {
        formAddError(input);
        error++;
    } else {
      if(input.value === '') {
        formAddError(input);
        error++;
      }
    }
  }
  return error;
}

function formAddError(input) {
  input.parentElement.classList.add('_error');
  input.classList.add('_error');
}

function formRemoveError(input) {
  input.parentElement.classList.remove('_error');
  input.classList.remove('_error');
}

// Слайдер

const swiper = new Swiper('.swiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    initialSlide: 1,
    slideActiveClass: 'swiper-slide-active',
    loop: true,
    

    breakpoints: {
      280: {
        slidesPerView: 1.5,
        spaceBetween: 40
      },

      900: {
        slidesPerView: 3,
        spaceBetween: 55
      },
    },

coverflowEffect: {
   rotate: 0,
   stretch: 0,
   depth: 0,
   modifier: 0,
 },

 pagination: {
  el: '.swiper-pagination',
  clickable: true,
},

 });

 