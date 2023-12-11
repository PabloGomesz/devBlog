const express = require('express')
const router = express.Router()
const Category = require('./Category')
const slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')

router.get("/admin/categories/new", (request, response) =>{
    response.render('admin/categories/new')
});

router.post("/categories/save", (request, response) =>{
   let title = request.body.title
   if(title != undefined){

    Category.create({
        title: title,
        slug: slugify(title)
    }).then(() =>{
        response.redirect("/admin/categories")
    })

   }else{
    response.redirect("/admin/categories/new")
   }
});


router.get("/admin/categories", (request, response) =>{

    Category.findAll().then(categories => {
        response.render("admin/categories/index", {categories: categories})
    })
});

router.post("/categories/delete", (request, response) =>{
    let id = request.body.id
    if(id != undefined){
        if(!isNaN(id)){ // verifica se o valor é numerico ou não

            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
            response.redirect("/admin/categories") 
            });

        }else{ // se não for um numero
            response.redirect("/admin/categories")
        }
    }else{ // se for nulo
        response.redirect("/admin/categories")
    }
});


router.get("/admin/categories/edit/:id", (request, response) =>{
    let id = request.params.id

    if(isNaN(id)){
        response.redirect("/admin/categories")
    }

    Category.findByPk(id).then(category =>{
        if(category != undefined){

            response.render("admin/categories/edit", {category : category})

        }else{
            response.redirect("/admin/categories")
        }
    }).catch(erro =>{
        response.redirect("/admin/categories")
    })
});
router.post("/categories/update", (request, response) =>{
    let id = request.body.id
    let title = request.body.title

    Category.update({title: title, slug: slugify(title)},{
        where: {
            id: id
        }
    }).then(()=>{
        response.redirect("/admin/categories")
    })
});


module.exports = router