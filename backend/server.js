// server.js

// Installer les modules nécessaires: express, body-parser et mongoose
const express = require('express'); 
const mongoose = require('mongoose');
const app = express(); 
const Thing = require('./models/thing');
const port = 3000; 
app.use(express.json());

// Se connecter à la base de données mongodb, en utilisant la méthode mongoose.connect
mongoose.connect('mongodb+srv://vjeanty02:jesus123@cluster0.1sagvzb.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware pour gérer les requêtes CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
// crée une route GET qui retournera tous les produits
app.get('/api/products', (req, res) => {
  Thing.find()
    .then(Products => res.status(200).json({products:Products}))
    .catch(error => res.status(400).json({ error }));
});
// crée une route GET qui retournera le produit avec le_id fourni
app.get('/api/products/:id', (req, res) => {
    Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json({product:thing}))
    .catch(error => res.status(404).json({ error }));
  });
// crée une route POST qui créera un nouveau Product dans la base de données, en utilisant la méthode app.post d’express
app.post('/api/products', (req, res) => {
    delete req.body._id;
    const thing = new Thing({
      ...req.body
    });
    thing.save()
      .then(() => res.status(201).json({ product: thing}))
      .catch(error => res.status(400).json({ error }));
});
// crée une route PUT qui modifiera le produit avec le _id fourni
app.put('/api/products/:id', (req, res) => {
    Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ product: req.body}))
    .catch(error => res.status(400).json({ error }));
  });
// crée une route DELETE qui supprimera le produit avec le _id fourni
app.delete('/api/products/:id', (req, res) => {
    Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
  });

// démarre le serveur et affiche un message dans la console
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});