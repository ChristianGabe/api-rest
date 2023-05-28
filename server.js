require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


// code qui dépend du module 'fetch'
import('node-fetch').then(fetch => {   
  }).catch(error => {
    
    // Gérer les erreurs qui se produisent lors de l'importation dynamique
    console.error(error);
  });
  

// Importe le modèle User dans le fichier server.js
const User = require('./models/User');

const mongoose = require('mongoose');
const DB_CONNECTION_STRING = 'mongodb+srv://cgngoran:O7wzr14YquEg8n8b@christiangabe.tqq5v1i.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB:', error));

app.use(express.json()); // Ajout d'un middleware pour analyser les requêtes JSON

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//  routes pour  API :

// GET : récupère tous les utilisateurs
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// POST : Ajouter un nouvel utilisateur
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur' });
  }
});

// PUT : Modifier un utilisateur par ID
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la modification de l\'utilisateur', error);
    res.status(500).json({ error: 'Erreur lors de la modification de l\'utilisateur' });
  }
});

// SUPPRIMER : supprimer un utilisateur par ID
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

// Test de chaque route :

// 1- Route GET : Récupérer tous les utilisateurs
fetch('http://localhost:3000/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// 2- Route POST : Ajouter un nouvel utilisateur
const nouvelUtilisateur = {
    name: 'jeandepappin',
    email: 'jeandepapin@example.com'
  };
  
  fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nouvelUtilisateur)
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
  
  // 3- PUT route : Modifier un utilisateur par ID
  const idUtilisateurAModifier = 'your_user_id';
  const modifications = {
    name: 'Louis corentin',
    email: 'louiscorentin@example.com'
  };
  
  fetch(`http://localhost:3000/users/${idUtilisateurAModifier}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(modifications)
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
  

// 4- DELETE route : Supprimer un utilisateur par ID

  const idUtilisateurASupprimer = 'your_user_id';
  
  fetch(`http://localhost:3000/users/${idUtilisateurASupprimer}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
  
