const host = 8080;
const imglocal = "/assets/img/"

const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
var path = require('path');

// Debugging
app.use(morgan('dev'))
    // create application/json parser
app.use(bodyParser.json())
    // create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))
    // index.html
app.use(express.static(__dirname))

// create a middleware with use to debug / or use morgan
app.use((req, res, next) => {
    console.log(__dirname)
    next()
})

/********************/
// Existing object
/********************/

const actu = [{
        id: 1,
        image: imglocal + 'item-2.jpg',
        tags: ['Noir et blanc'],
        title: 'Lancement du prix photos tremplin de l\'année',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam urna felis, accumsan et placerat id, rutrum id dolor. Sed quis quam et nulla aliquet tempus eget in nunc. Aliquam erat volutpat.',
        link: 'https://jeannelaloyau.com/'

    },
    {
        id: 2,
        image: imglocal + 'item-3.jpg',
        tags: ['Noir et blanc', 'couleurs'],
        title: 'lee jeffries s\'illustre encore en noir & blanc',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis quam et nulla aliquet tempus eget in nunc. Aliquam erat volutpat.',
        link: 'https://jeannelaloyau.com/'
    }
]

const une = [{
    id: 1,
    image: imglocal + 'item-1.jpg',
    date: '22 juillet 2016',
    title: 'Expo Photo Lyon',
    text: 'Nunc laoreet, velit tristique ornare elementum, augue mauris sollicitudin turpis, eu commodo mi mauris et sem. Mauris quis nisl ligula. Nam sapien erat, rhoncus nec gravida nec, condimentum id sapien. Nullam eu mauris a purus viverra congue eget quis mi. Ut in consectetur augue, eget convallis turpis. Praesent purus mi, molestie eget feugiat nec, dignissim id nibh. <br><br> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vulputate ac mi vel sollicitudin. Quisque euismod semper mauris in tincidunt. Ut imperdiet eros at est interdum, id pharetra nisi suscipit. Nunc laoreet, velit tristique ornare elementum, augue mauris sollicitudin turpis, eu commodo mi mauris et sem. Mauris quis nisl ligula. Nam sapien erat, rhoncus nec gravida nec, condimentum id sapien. Nullam eu mauris a purus viverra congue eget quis mi. Ut in consectetur augue, eget convallis turpis. Praesent purus mi, molestie eget feugiat nec, dignissim id nibh.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vulputate ac mi vel sollicitudin. Quisque euismod semper mauris in tincidunt. Ut imperdiet eros at est interdum, id pharetra nisi suscipit. Nunc laoreet, velit tristique ornare elementum, augue mauris sollicitudin turpis, eu commodo mi mauris et sem. Mauris quis nisl ligula. Nam sapien erat, rhoncus nec gravida nec, condimentum id sapien. Nullam eu mauris a purus viverra congue eget quis mi.'
}]


/********************/
/********************/
//             ROUTES ACTU
/********************/
/********************/

let actuRouter = express.Router()

// get actu id

actuRouter.route('/actu/:id')
    .get((req, res) => {
        index = verifIndex(req.params.id, actu)
        if (isNaN(index) || actu.length - 1 < index || index < 0) {
            res.json(error(index))
        } else {
            res.json(success(actu[index]))

        }
    })

// edit actu
.put((req, res) => {
    let index = verifIndex(req.params.id, actu)
    if (isNaN(index)) {
        res.json(error(index))
    } else {
        let same = false

        for (let article of actu) {
            if (article.title == req.body.title && article.id != req.params.id) {
                same = true
                res.json(error('same title'))
                break
            }
        }
        if (!same) {
            actu[index].title = req.body.title
                //res.json(success(`The new title is : ${actu[index].title}`))
            res.redirect('/')
        }
    }
})

// Delete selected id
.delete((req, res) => {
    let index = verifIndex(req.params.id)
    if (isNaN(index)) {
        res.json(error(index))
    } else {
        let actuArticle = actu[index].title
        actu.splice(index, 1)
        res.json(success(`${actuArticle} has been deleted`))
    }
})


// get all actu
actuRouter.route('/actu')
    .get((req, res) => {
        res.json(success(actu))
    })

// add a new actu
actuRouter.route('/actu/ajouter')
    .post((req, res) => {
        if (req.body.title && req.body.image && req.body.text) {
            let sameName = false;

            for (let article of actu) {
                if (article.title == req.body.title) {
                    res.json(error('nom identique'))
                    sameName = true;
                    break
                }
            }
            if (sameName == false) {
                let article = {
                    id: (actu[actu.length - 1].id) + 1,
                    image: imglocal + '' + req.body.image,
                    title: req.body.title,
                    tags: [req.body.tags],
                    text: req.body.text,
                    link: req.body.link
                }
                actu.push(article)
                res.redirect('/')
                    //res.json(success(actu))
            }

        } else {
            res.redirect('/ajouter/actu.html')
                //res.json(error('You need to add more value(s)'))
        }
    })


/********************/
/********************/
//             ROUTES UNE
/********************/
/********************/

let uneRouter = express.Router()

// get id une
uneRouter.route('/une/:id')
    .get((req, res) => {
        index = verifIndex(req.params.id, une)
        if (isNaN(index) || une.length - 1 < index || index < 0) {
            res.json(error(index))
        } else {
            res.json(success(une[index]))
        }
    })

uneRouter.route('/une')
    // get all une
    .get((req, res) => {
        res.json(success(une))
    })


// add a new une
actuRouter.route('/une/ajouter')
    .post((req, res) => {
        if (req.body.title && req.body.image && req.body.text) {
            let sameName = false;

            for (let article of une) {
                if (article.title == req.body.title) {
                    res.json(error('nom identique'))
                    sameName = true;
                    break
                }
            }
            if (sameName == false) {
                let article = {
                    id: (une[une.length - 1].id) + 1,
                    image: imglocal + '' + req.body.image,
                    date: req.body.date,
                    title: req.body.title,
                    text: req.body.text
                }
                une.push(article)
                res.redirect('/')
                    //res.json(success(actu))
            }

        } else {
            res.redirect('/ajouter/une.html')
                //res.json(error('You need to add more value(s)'))
        }
    })


/********************/
/********************/
//             FUNCTION SUCCES ERROR
/********************/
/********************/


function success(result) {
    return {
        success: true,
        status: 'success',
        result: result
    }
}

function error(message) {
    return {
        error: true,
        status: 'error',
        message: message
    }
}


/********************/
/********************/
//             FUNCTION HELPERS
/********************/
/********************/

function verifIndex(index, tab) {
    for (let i = 0; i < tab.length; i++) {
        if (tab[i].id == index) {
            return i
        }
    }
    return "Maybe it's not a number, or change/decrease ID : " + index
}


app.use('/api/v1/site', uneRouter)
app.use('/api/v1/site', actuRouter)

app.listen(host, () => console.log(`Serveur start on 8080`))