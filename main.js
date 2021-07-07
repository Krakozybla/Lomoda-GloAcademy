const headerCityButton = document.querySelector(".header__city-button");

headerCityButton.textContent = localStorage.getItem('lamoda-location') || 'Ваш город?'
//Появляеться null в headerCityButton.textConten, как его убрать? =))
let hash = location.hash.substring(1);
console.log(headerCityButton);
headerCityButton.addEventListener('click', () =>{
    

    const city = prompt('Укажите ваш город');
    //Что бы убрать null решил сделать проверку propmt на пустоту, надеюсь есть вариант получше=))
    if(city.value === ""){
        city.textContent = 'Ваш город?'
    }else{
        headerCityButton.textContent = city;
        localStorage.setItem('lamoda-location', city);
    }
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



const cardModalOpen =()=>{
    cartOverlay.classList.add('cart-overlay-open');
    disbleScroll();
}

const cardModalClose =()=>{
    cartOverlay.classList.remove('cart-overlay-open');
    enableScroll();
}




//requests to database
const getData = async () =>{
    const data = await fetch('db.json');
    if(data.ok){
        return data.json();
    }else{
        throw new Error(`Данные не были получены, ошибка ${data.status} s${data.statusText}`)
    }
}

const getGoods = (callback, value) =>{
    getData().then(data=>{
        if(value){
            callback(data.filter(item => item.category === value))
        }else{
            callback(data);
        }
    }, err=>{
        console.error(err);
    })
}

getGoods((data) =>{
    console.warn(data);
})


//EventListeners 
subheaderCard.addEventListener('click', ()=>{
    cardModalOpen();
})
cartOverlay.addEventListener('click', (e)=>{
    const target = e.target;
    if(target.classList.contains('cart__btn-close') || (target.classList.contains('cart-overlay'))){
        cardModalClose();
    }
})

try{
    console.log(hash);
    const goodsList = document.querySelector('.goods__list');
    if(!goodsList){
        console.log('This is not a goods page');
    }

    const creatCard = data =>{
        
        const {id, preview, cost, brend, name, sizes} = data;
        /*
        const id = data.id;
        const preview = data.preview;
        const cost = data.cost;
        const brend = data.brend;
        const name = data.name;
        const sizes = data.sizes;
        */

        const li = document.createElement('li');
        li.classList.add('goods__item');
        li.innerHTML = ` <article class="good">
        <a class="good__link-img" href="card-good.html#${id}">
            <img class="good__img" src="goods-image/${preview}" alt="">
        </a>
        <div class="good__description">
            <p class="good__price">${cost} &#8381;</p>
            <h3 class="good__title">${brend}<span class="good__title__grey">${name}</span></h3>
            ${sizes ? 
                `<p class="good__sizes">${sizes.join(' ')} (RUS): <span class="good__sizes-list">40 42 44 46</span></p>` 
                : 
                ""
            }
            <a class="good__link" href="card-good.html#${id}">Подробнее</a>
        </div>
        </article>`;

        return li;
    };


    const renderGoodsList = data =>{
       goodsList.textContent = '';

       data.forEach(elem => {
        const card = creatCard(elem);
        goodsList.append(card);
       });
    }

    window.addEventListener('hashchange', ()=>{
        hash = location.hash.substring(1);
        getGoods(renderGoodsList, hash);
    })

    getGoods(renderGoodsList, hash);

}catch(err){
    console.log(err);
}