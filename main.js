const headerCityButton = document.querySelector(".header__city-button");
const cardListGoods = document.querySelector('.cart__list-goods');
const cardTotalCoast = document.querySelector('.cart__total-cost');

headerCityButton.textContent = localStorage.getItem('lamoda-location') || 'Ваш город?'
//Появляеться null в headerCityButton.textConten, как его убрать? =))
let hash = location.hash.substring(1);
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
// LocalStorage 
 const getLocalStorage = () => JSON?.parse(localStorage.getItem('card-lomoda')) || [];
 const setLocalStorage = data => localStorage.setItem('card-lomoda', JSON.stringify(data));
const renderCard = () =>{
    cardListGoods.textContent = '';

    const cardItems = getLocalStorage();

    let totalPrice = 0;

    cardItems.forEach((item, i)=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${item.name} ${item.name}</td>
        ${item.color ? `<td>${item.color}</td>` : '<td>-</td>'}
        ${item.sizes ? `<td>${item.sizes}</td>` : '<td>-</td>'}
        <td>${item.cost} &#8381;</td>
        <td><button class="btn-delete" data-id="${item.id}">&times;</button></td>
        `;
        totalPrice += item.cost; 
        cardListGoods.append(tr);
    })
    cardTotalCoast.textContent = totalPrice;
}


const deleteItemCard = id =>{
    const cardItems = getLocalStorage();
    const newCardItems = cardItems.filter(item => item.id !== id);
    setLocalStorage(newCardItems);
}

cardListGoods.addEventListener('click', (e)=>{
    if(e.target.classList.contains('btn-delete')){
        deleteItemCard(e.target.dataset.id);
        renderCard();
    }
})
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
    renderCard();
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

const getGoods = (callback, prop, value) =>{
    getData().then(data=>{
        if(value){
            callback(data.filter(item => item[prop] === value))
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
// category pages
try{
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
        
        let labelProductPage = document.querySelector('.goods__title');
        if(hash === 'men'){
            labelProductPage.textContent = 'Мужчинам';
        }else if(hash === 'women'){
            labelProductPage.textContent = 'Девушкам';
        }else{
            labelProductPage.textContent = 'Детям';
        }

        getGoods(renderGoodsList,'category', hash);
    })
    getGoods(renderGoodsList, 'category', hash);

}catch(err){
    console.log(err);
}

// goods pages

try{
    if(!document.querySelector('.card-good')){
        throw 'This is not a crad-good page';
    }

 const cardGoodImage = document.querySelector(".card-good__image");
 const cardGoodBrand = document.querySelector(".card-good__brand");
 const cardGoodTitle  = document.querySelector(".card-good__title");
 const cardGoodPrice = document.querySelector(".card-good__price");
 const cardGoodColor  = document.querySelector(".card-good__color");
 const cardGoodColorList = document.querySelector(".card-good__color-list");
 const cardGoodSizes = document.querySelector(".card-good__sizes");
 const cardGoodSizesList = document.querySelector(".card-good__sizes-list"); 
 const cardGoodBuy = document.querySelector(".card-good__buy");
 const cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper'); 

const generateList = data => data.reduce((html, item, i) => 
    html +  `<li class="card-good__select-item data-id="${i}"">${item}</li>`,
    '')

 const renderCardGood = ([{id, brand, name, cost, color, sizes, photo}]) =>{
        
    const data = {brand, name, cost, id};


    cardGoodImage.src = 'goods-image/' + photo;
    cardGoodImage.alt = `${brand} ${name}`;
    cardGoodBrand.textContent = brand;
    cardGoodTitle.textContent = name;
    cardGoodPrice.textContent = `${cost} ₽`; 
    if(color){
        cardGoodColor.textContent = color[0];
        cardGoodColor.dataset.id = 0;
        cardGoodColorList.innerHTML = generateList(color)
    }else{
        cardGoodColor.style.display = 'none';
    };
    if(sizes){
        cardGoodSizes.textContent = sizes[0];
        cardGoodSizes.dataset.id = 0;
        cardGoodSizesList.innerHTML = generateList(sizes)
    }else{
        cardGoodSizes.style.display = 'none';
    };
    if(getLocalStorage().some(item => item.id === id)){
        cardGoodBuy.classList.add('delete');
        cardGoodBuy.textContent = 'Удалить из корзины';
    }
    //render card with goods//
 cardGoodBuy.addEventListener('click', ()=>{
     if(cardGoodBuy.classList.contains('delete')){
         deleteItemCard(id);
         cardGoodBuy.classList.remove('delete');
         cardGoodBuy.textContent = 'Добавить в корзину';
     }
    if(color) data.color = cardGoodColor.textContent;
    if(sizes) data.sizes =  cardGoodSizes.textContent;
    cardGoodBuy.classList.add('delete');
    cardGoodBuy.textContent = 'Удалить из корзины';
    const cardData = getLocalStorage();
    cardData.push(data);
    setLocalStorage(cardData); 
})
    console.log(brand);
 }


 getGoods(renderCardGood, 'id', hash);

 cardGoodSelectWrapper.forEach(item=>{
        item.addEventListener('click', e =>{
            const target = e.target;
            if(target.closest('.card-good__select')){
                target.classList.toggle('card-good__select__open')
            }
            if(target.closest('.card-good__select-item')){
                const cardGoodSelect = item.querySelector('.card-good__select');
                cardGoodSelect.textContent = target.textContent;
                cardGoodSelect.dataset.id = target.dataset.id;
                cardGoodSelect.classList.remove('card-good__select__open');
            }
        })
 })

}catch(err){
    console.warn(err);
}