const headerCityButton = document.querySelector(".header__city-button");

headerCityButton.textContent = localStorage.getItem('lamoda-location') || 'Ваш город?'
headerCityButton.textContent === null ? headerCityButton.textContent = 'Ваш город?' : localStorage.getItem('lamoda-location')

//Появляеться null в headerCityButton.textConten, как его убрать? =))

headerCityButton.addEventListener('click', () =>{
    const city = prompt('Укажите ваш город');
    headerCityButton.textContent = city;
    localStorage.setItem('lamoda-location', city);
});


// Modal Window
const subheaderCard = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

const disbleScroll = () =>{
    const widthScroll = window.innerWidth - document.body.offsetWidth;
    document.body.dbScrollY = window.scrollY;
    document.body.style.cssText = `
    position: fixed;
    top: ${-window.scrollY}px;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    padding-right: ${widthScroll}px;
    `;
    //document.body.style.overflow  = 'hidden';
}

const enableScroll = () =>{
    document.body.style.cssText  = '';
    window.scroll({
        top: document.body.dbScrollY
    })
}


subheaderCard.addEventListener('click', ()=>{
    cardModalOpen();
})

const cardModalOpen =()=>{
    cartOverlay.classList.add('cart-overlay-open');
    disbleScroll();
}

const cardModalClose =()=>{
    cartOverlay.classList.remove('cart-overlay-open');
    enableScroll();
}

cartOverlay.addEventListener('click', (e)=>{
    const target = e.target;
    if(target.classList.contains('cart__btn-close') || (target.classList.contains('cart-overlay'))){
        cardModalClose();
    }
})
