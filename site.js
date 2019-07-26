const api = 'http://localhost:8080/api/v1/site/';
const loadButton = document.getElementById('load-button');



/********************/
/********************/
//             GET XMLHTTP
/********************/
/********************/

function getRequest(url) {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open('GET', url);
        req.onreadystatechange = () => {
            if (req.readyState === 4) {
                if (req.status !== 200) {
                    reject(req.status + ' ' + req.readyState);
                }
                resolve(JSON.parse(req.response));
            }
        };
        req.send();
    });
}

/********************/
/********************/
//             GET ACTU POST
/********************/
/********************/

async function getActuPost() {
    const actuPromise = getRequest(api + '/actu');
    try {
        let [actuResponse] = await Promise.all([actuPromise]);
        let actu = document.querySelector('#actu')
        for (let i = 0; i < actuResponse.result.length; i++) {
            actu.appendChild(buildActuElement(
                actuResponse.result[i].id,
                actuResponse.result[i].image,
                actuResponse.result[i].tags,
                actuResponse.result[i].title,
                actuResponse.result[i].text,
                actuResponse.result[i].link,
            ));
        }
    } catch (error) {
        document.querySelector('#error').appendChild(buildErrorElement('Une erreur est survenue !', error));
    }
}


/********************/
/********************/
//             GET UNE POST
/********************/
/********************/

async function getUnePost() {
    const unePromise = getRequest(api + '/une');
    try {
        let [uneResponse] = await Promise.all([unePromise]);
        let actu = document.querySelector('#une')
        for (let i = 0; i < uneResponse.result.length; i++) {
            actu.appendChild(buildUneElement(
                uneResponse.result[i].id,
                uneResponse.result[i].image,
                uneResponse.result[i].date,
                uneResponse.result[i].title,
                uneResponse.result[i].text,
            ));
        }
    } catch (error) {
        document.querySelector('#error').appendChild(buildActuElement('Une erreur est survenue !', error));
    }
}


/********************/
/********************/
//             Edit ACTU
/********************/
/********************/
/*
async function putActuPost() {
    const actuPromise = getRequest(api + '/actu/');
    try {
        let [actuResponse] = await Promise.all([actuPromise]);
        for (let i = 0; i < actuResponse.result.length; i++) {
            var allActu = [].slice.call(document.querySelectorAll('.card__actu'));
            allActu[i].addEventListener("click", function() {
                editactupost(allActu[i].title)
            })
        }
    } catch (error) {
        document.querySelector('#error').appendChild(buildErrorElement('Une erreur est survenue !', error));
    }
}


async function editactupost(id) {
    const editActu = getRequest(api + '/actu/' + id);
    try {
        let [actuResponse] = await Promise.all([editActu]);
        console.log(actuResponse.result.tags)
        let modfiActu = document.querySelector('#modif')
        modfiActu.appendChild(EditActuElement(
            actuResponse.result.id,
            actuResponse.result.image,
            actuResponse.result.tags,
            actuResponse.result.title,
            actuResponse.result.text));

    } catch (error) {
        document.querySelector('#error').appendChild(buildErrorElement('Une erreur est survenue !', error));
    }
}
*/
/********************/
/********************/
//             BUILD ACTU ELEMENT
/********************/
/********************/

function buildActuElement(id, image, tags, title, text, link) {

    let tagsCheck = tags;

    /**  Element Actu **/
    let col = document.createElement('div')
    let card = document.createElement('div');
    let cardBody = document.createElement('div');
    let cardImage = document.createElement('img');
    let cardTitle = document.createElement('h2');
    let cardContent = document.createElement('p');
    let button = document.createElement('a');

    cardBody.appendChild(cardImage);

    if (tagsCheck.length > 0) {
        if (tagsCheck.length == 1) {
            tagsCheck = tags[0].trim().split(',');
            console.log(tagsCheck)
        }
        if (tagsCheck.length >= 1) {
            for (var i = 0; i < tagsCheck.length; i++) {
                let cardTags = document.createElement('h3');
                cardTags.classList.add('card__actu-tag')
                cardTags.setAttribute("id", "card__actu__tag__" + i);
                cardTags.textContent = tagsCheck[i]
                cardBody.appendChild(cardTags);
            }
        }
    }

    col.classList.add('col-2', 'col-responsive-1')
    button.classList.add('button', 'card__une__button')
    button.setAttribute('href', link)
    card.setAttribute("id", "card__actu__" + id);
    card.setAttribute("title", id);
    cardImage.setAttribute("src", image);
    cardImage.setAttribute("alt", "img-" + title);
    cardImage.classList.add('card__actu-img');
    card.classList.add('card__actu');
    cardBody.classList.add('card__actu-body', 'sep__actu');
    cardTitle.classList.add('card__actu-title');
    cardContent.classList.add('card__actu-text');

    cardTitle.textContent = title;
    cardContent.textContent = text;
    button.textContent = "En savoir plus"

    /**  AppendChild **/
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardContent);
    cardBody.appendChild(button);
    col.appendChild(card)
    card.appendChild(cardBody);

    return col;
}


/********************/
/********************/
//             BUILD Edit actu
/********************/
/********************/
/*
function EditActuElement(id, image, tags, title, text) {
    if (!document.getElementById('form__modif__' + id)) {
        let modifActu = document.getElementById('card__actu__' + id)

        let form = document.createElement('form')
        form.setAttribute("id", "form__modif__" + id);
        //form.setAttribute("action", "api/v1/site/actu/" + id);
        //form.setAttribute("action", '/edit/edit.html');
        form.setAttribute("action", "api/v1/site/actu/" + id);
        form.setAttribute("method", "post");

        let para = document.createElement('p')




        let inputPUT = document.createElement('input')
        let inputTitle = document.createElement('input')
        let inputText = document.createElement('input')
        let inputImage = document.createElement('input')
        inputPUT.setAttribute("type", "hidden");
        inputPUT.setAttribute("name", "_METHOD");
        inputPUT.setAttribute("value", "PUT");
        inputText.setAttribute("type", "text");
        inputText.setAttribute("value", text);
        inputTitle.setAttribute("type", "text");
        inputTitle.setAttribute("value", title);
        inputImage.setAttribute("type", "text");
        inputImage.setAttribute("value", image);

        let input = document.createElement('input')
        input.setAttribute("type", "submit");
        input.setAttribute("value", "Modifier l'article : " + id)
        input.setAttribute("id", "update")

        form.appendChild(para)
        para.appendChild(inputImage)
        para.appendChild(inputTitle)
        para.appendChild(inputText)
        para.appendChild(input)
        modifActu.appendChild(form)

        return form;

    } else {
        //form = document.getElementById('form__modif__' + id);
        //form.setAttribute("style", "display:none");

    }
}

*/

/********************/
/********************/
//             BUILD UNE
/********************/
/********************/


function buildUneElement(id, image, date, title, text) {


    /**  container une **/
    let col1 = document.createElement('div')
    let col2 = document.createElement('div')
    let row = document.createElement('div')
    let colGlobal = document.createElement('div')

    colGlobal.classList.add('col-1', 'no-padding', 'sep__une')
    row.classList.add('row')
    col1.classList.add('col-2', 'card__left__wrap', 'col-responsive-1')
    col2.classList.add('col-2', 'card__right__wrap', 'col-responsive-1')

    /**  Element une **/
    let card = document.createElement('div');
    let cardImage = document.createElement('img');
    let cardTitle = document.createElement('h2');
    let cardContent = document.createElement('p');
    let cardDate = document.createElement('h4');

    card.setAttribute("id", "card__une__" + id);
    card.setAttribute("title", id);

    cardImage.setAttribute("src", image);
    cardImage.setAttribute("alt", "img-" + title);

    cardDate.classList.add('card__une-date');
    cardImage.classList.add('card__une-img');
    card.classList.add('card__une');
    cardTitle.classList.add('card__une-title');
    cardContent.classList.add('card__une-text');

    cardDate.textContent = date;
    cardTitle.textContent = title;
    cardContent.innerHTML = text;

    /**  Element une **/
    col1.appendChild(cardImage);
    col1.appendChild(cardDate);
    col1.appendChild(cardTitle);
    col2.appendChild(cardContent)



    row.appendChild(col1)
    row.appendChild(col2)
    card.appendChild(row)


    colGlobal.appendChild(card)

    return colGlobal;
}

/********************/
/********************/
//             BUILD ERROR
/********************/
/********************/

function buildErrorElement(errorMessage, error) {
    let card = document.createElement('div');
    let cardContent = document.createElement('p');

    cardContent.classList.add('card__error');

    cardContent.textContent = errorMessage + error;
    card.appendChild(cardContent);

    return card;
}


/********************/
/********************/
//             LANCEMENT INIT
/********************/
/********************/


(function() {

    let editPage = document.getElementById('button__edit')
    let allForms = document.getElementById('all_forms')
    let open = false;

    // **** init page ****/

    getActuPost()
    getUnePost()
        //putActuPost()


    /* ---------------------------------------------- /*
     * Navbar__scroll & sticky
    /* ---------------------------------------------- */

    var width = window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    console.log(width)

    var navbar = document.getElementById("all__main__menu");
    var sticky = navbar.offsetTop;
    window.addEventListener('scroll', function() {
        if (window.pageYOffset >= sticky) {
            navbar.classList.add("sticky")
        } else {
            navbar.classList.remove("sticky");
        }
    })

    /* ---------------------------------------------- /*
     * Affichage du menu
    /* ---------------------------------------------- */

    allForms.classList.add('hidden')
    editPage.addEventListener('click', function() {
        let allForms = document.getElementById('all_forms')
        if (open) {
            editPage.textContent = "Editer les pages"
            allForms.classList.add('animation-end')
            setTimeout(function() {
                allForms.classList.add('hidden')

            }, 500)

            open = false
        } else {
            editPage.textContent = "Fermer"
            allForms.classList.remove('animation-end')
            allForms.classList.remove('hidden')
            open = true
        }
    })

})()