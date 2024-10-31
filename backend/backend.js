const express = require('express')

const app = express()
const port = 3000

app.use(express.json())

const charRoutes = require('./routes/charRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const reactionsRoutes = require('./routes/reactionsRoutes');
const searchRoutes = require('./routes/searchRoutes');
const tokenRelRoutes = require('./routes/tokenRelRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(charRoutes);
app.use(favoritesRoutes);
app.use(reactionsRoutes);
app.use(searchRoutes);
app.use(tokenRelRoutes);
app.use(userRoutes);

app.listen(port, () => {
    console.log(`A big hello from port ${port}`)
})