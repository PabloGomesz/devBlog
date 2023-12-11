const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const session = require('express-session')
const connection = require('./database/database')

const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
const usersController = require('./users/UsersController')

const Category = require('./categories/Category')
const Article = require('./articles/Article')
const User = require('./users/User')



// view engine
app.set('view engine', 'ejs')

// sessions

app.use(session({
    secret: 'bemaleatorio',
    cookie: {
        maxAge: 3000000
    }

}))

//Static
app.use(express.static('public'))

// body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Database
connection.authenticate().then(() =>{
    console.log('Conexão feita')
}).catch((error) =>{
    console.log(error)
});

app.use("/", categoriesController)
app.use("/", articlesController)
app.use("/", usersController)

app.get("/session", (request, response) =>{
    
});

app.get("/leitura", (request, response) =>{
    
});


app.get("/", (request, response) =>{
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles =>{
        Category.findAll().then(categories =>{
            response.render("index", {articles: articles, categories: categories})
        })
        
    })
    
});

app.get("/:slug", (request , response) =>{
    let slug = request.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article =>{
        if(article != undefined){
            Category.findAll().then(categories =>{
                response.render("article", {article: article, categories: categories})
            })
        }else{
            response.redirect("/")
        }
       
    }).catch( erro =>{
        response.redirect("/")
    })
});

app.get("/category/:slug", (request, response) =>{
    let slug = request.params.slug
    Category.findOne({
        where:{
            slug: slug
        },
        include: [{model: Article}]
    }).then(category =>{
        if(category != undefined){
            Category.findAll().then(categories =>{
                response.render("index", {articles: category.articles, categories: categories})
            })
        }else{
            response.redirect("/")
        }
    }).catch(erro =>{
        response.redirect("/")
    })
})

app.listen(3333,() =>{
    console.log('Servidor rodando')
})