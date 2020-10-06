const express = require('express');
const app = express();
const cors = require('cors')

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(cors())

app.get('/', function(req, res) {
    res.render('pages/index');
});

const PORT = 3000 || process.env.PORT;
//wtf
app.listen(PORT, () => {
    console.log('App Live on', PORT)
})