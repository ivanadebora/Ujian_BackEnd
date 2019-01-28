const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql')

const app = express();
const port = 2000;

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'idw',
    password: 'vandeb0703',
    database: 'moviebertasbih',
    port: 3306
});

app.use(cors());
app.use(bodyParser.json())

app.get('/', (req,res) => {
    res.send('<h1>Selamat datang di API!</h1>')
})

//---------------- Get Data Movie ------------------------//
app.get('/getmovielist', (req,res) => {
    var sql = `select * from movies;`
    conn.query(sql, (err,results) => {
        if(err) throw err;
        res.send(results)
    })
})


//---------------- Insert Data Movie -----------------------//
app.post('/addmovie', (req,res) => {
    var newDataMovie = {
        nama: req.body.nama,
        tahun: req.body.tahun,
        description: req.body.description
    }
    var sql = `insert into movies set ?;`;
    conn.query(sql, newDataMovie, (err,results) => {
        if(err) throw err;
        res.send(results)
    })
})

//--------------------- Edit Data Movie ---------------------//
app.put('/editmovie/:id', (req,res) => {
    var idMovie = req.params.id;
    var newEditDataMovie = {
        nama: req.body.nama,
        tahun: req.body.tahun,
        description: req.body.description
    }
    var sql = `update movies set ? where id=${idMovie};`;
    conn.query(sql, newEditDataMovie, (err,results) => {
        if(err) throw err;
        res.send(results)
    })
})

//--------------------- Delete Data Movie --------------------//
app.delete('/deletemovie/:id', (req,res) => {
    var idMovie = req.params.id;
    var sql = `delete from movies where id = ${idMovie}`
    conn.query(sql, (err,results) => {
        if(err) throw err;
        res.send(results)
        sql = `delete from movcat where idmovie=${idMovie}`
        conn.query(sql, (err, res1) => {
            if(err) throw err;
            res.send(res1)
        })
    })
})


//---------------- Get Data Kategori ------------------------//
app.get('/getcategories', (req,res) => {
    var sql = `select * from categories;`
    conn.query(sql, (err,results) => {
        if(err) throw err;
        res.send(results)
    })
})

//---------------- Insert Data Category -----------------------//
app.post('/addcategory', (req,res) => {
    var newDataCategory = {
        nama: req.body.nama,
    }
    var sql = `insert into categories set ?;`;
    conn.query(sql, newDataCategory, (err,results) => {
        if(err) throw err;
        res.send(results)
    })
})

//--------------------- Edit Data Category ---------------------//
app.put('/editcategory/:id', (req,res) => {
    var idCategory = req.params.id;
    var newEditDataCategory = {
        nama: req.body.nama
    }
    var sql = `update categories set ? where id=${idCategory};`;
    conn.query(sql, newEditDataCategory, (err,results) => {
        if(err) throw err;
        res.send(results)
    })
})

//--------------------- Delete Data Category --------------------//
app.delete('/deletecategory/:id', (req,res) => {
    var idCategory = req.params.id;
    var sql = `delete from categories where id = ${idCategory}`
    conn.query(sql, (err,results) => {
        if(err) throw err;
        res.send(results)
        sql = `delete from movcat where idcategory=${idCategory}`
        conn.query(sql, (err, res1) => {
            if(err) throw err;
            res.send(res1)
        })
    })
})





//----------------- Get Data Connection -------------------------//
app.get('/getconnection', (req,res) => {
    var sql = `select m.nama as namamovie, c.nama as namacategory
	            from movies m
                join movcat mc
                on m.id = mc.idmovie
                join categories c
                on c.id = mc.idcategory;`
    conn.query(sql, (err,results) => {
        if(err) throw err;
        res.send(results)
    })
})

//------------------ Add Data Connection ------------------------//
app.post('/addconnection', (req,res) => {
    var sql = `select id from categories where nama = '${req.body.namaCat}'`
    conn.query(sql, (err,res1) => {
        if(err) throw err;
        console.log(res1)
        var idCat = res1[0].id
        console.log(idCat)
        sql = `select id from movies where nama = '${req.body.namaMov}'`;
        conn.query(sql, (err,res2) => {
            if(err) throw err;
            console.log(res2)
            var idMov = res2[0].id
            console.log(idMov)
            sql = `insert into movcat values (${idMov},${idCat})`;
            conn.query(sql, (err,res3) => {
                if(err) throw err;
                res.send(res3)
            })
        })
    })
})

//----------------------- Delete Data Connection --------------------------//
app.delete('/deleteconnection', (req,res) => {
    var sql = `select id from categories where nama = '${req.body.namaCat}'`
    conn.query(sql, (err,res1) => {
        if(err) throw err;
        console.log(res1)
        var idCat = res1[0].id
        console.log(idCat)
        sql = `select id from movies where nama = '${req.body.namaMov}'`;
        conn.query(sql, (err,res2) => {
            if(err) throw err;
            console.log(res2)
            var idMov = res2[0].id
            console.log(idMov)
            sql = `delete movcat from movcat
                    where idmovie=${idMov} and idcategory=${idCat} `;
            conn.query(sql, (err,res3) => {
                if(err) throw err;
                res.send(res3)
            })
        })
    })
})



app.listen(port, () => console.log('API aktif di port ' + port));