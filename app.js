document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const profilesContainer = document.querySelector('.profiles-container');
    const searchInput = document.getElementById('searchInput');
    const profilePageContainer = document.querySelector('.profile-page-container');
    const profileFormContainer = document.querySelector('.profile-form-container');

    // Récupérer les profils existants depuis le localStorage
    const existingProfiles = JSON.parse(localStorage.getItem('profiles')) || [];

    // Afficher les profils existants
    existingProfiles.forEach(profileData => createProfileCard(profileData));

    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Récupérer les données du formulaire
        const profileData = {};
        profileForm.querySelectorAll('input, select, textarea').forEach(input => {
            profileData[input.name] = input.type === 'checkbox' ? input.checked : input.value;
        });

        // Ajouter le nouveau profil aux profils existants
        existingProfiles.push(profileData);

        // Stocker les profils dans le localStorage
        localStorage.setItem('profiles', JSON.stringify(existingProfiles));

        // Créer la carte du profil
        createProfileCard(profileData);

        // Effacer le formulaire après la création du profil
        profileForm.reset();
    });

    // Fonction pour créer une carte de profil
    function createProfileCard(data) {
        const profileCard = document.createElement('div');
        profileCard.classList.add('profile-card');

        // Ajouter une classe spécifique en fonction du genre
        const genderClass = data.genre === 'homme' ? 'profil-men' : data.genre === 'femme' ? 'profil-women' : '';
        profileCard.classList.add(genderClass);

        // Calculer l'âge à partir de la date de naissance
        const birthDate = new Date(data.dateNaissance);
        const age = calculateAge(birthDate);

        // Condition pour déterminer l'URL de la photo ou les initiales
        const photoUrl = data.photoProfil ? data.photoProfil : getInitials(data.nom, data.prenom);

        // Ajouter des informations de profil à la carte
        const profileInfo = `
            <p>${photoUrl}</p>
            <p>${data.prenom}</p>
            <p>${data.nom}</p>
            <p>${data.adresseCity}</p>
            <p>${age} ans</p>
        `;

        profileCard.innerHTML = profileInfo;

        // Ajouter un gestionnaire d'événements pour rediriger vers la page du profil
        profileCard.addEventListener('click', () => {
            displayProfilePage(data);
        });

        // Ajouter la carte de profil à la liste des profils
        profilesContainer.appendChild(profileCard);
    }

    // Fonction pour obtenir les initiales à partir du nom et du prénom
    function getInitials(nom, prenom) {
        return (nom.charAt(0) + prenom.charAt(0)).toUpperCase();
    }

    // Fonction pour calculer l'âge à partir de la date de naissance
    function calculateAge(birthDate) {
        const currentDate = new Date();
        const age = currentDate.getFullYear() - birthDate.getFullYear();

        // Vérifier si l'anniversaire a déjà eu lieu cette année
        if (
            currentDate.getMonth() < birthDate.getMonth() ||
            (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())
        ) {
            return age - 1;
        }

        return age;
    }

    // Fonction pour afficher la page du profil
    function displayProfilePage(data) {
        // Masquer la liste des profils
        profilesContainer.style.display = 'none';

        // Afficher la page du profil avec un bouton de retour
        profilePageContainer.innerHTML = `
            <div class="profile-page">
                <h2>Profil</h2>
                <p><strong>Prénom:</strong> ${data.prenom}</p>
                <p><strong>Nom:</strong> ${data.nom}</p>
                <p><strong>Genre:</strong> ${data.genre}</p>
                <p><strong>Date de Naissance:</strong> ${data.dateNaissance}</p>
                <p><strong>Adresse:</strong> ${data.adresseName}</p>
                <p><strong>Code postal:</strong> ${data.adresseZip}</p>
                <p><strong>Ville:</strong> ${data.adresseCity}</p>
                <p><strong>Permis de Conduire:</strong> ${data.permis ? 'Oui' : 'Non'}</p>
                ${data.permis ? `<p><strong>Type de Permis:</strong> ${data.typePermis}</p>` : ''}
                ${data.fichier ? `<p><strong>Fichier Téléchargeable:</strong> ${data.fichier}</p>` : ''}
                <button id="editProfileBtn">Modifier le Profil</button>
                <button id="backToProfilesBtn">Retour aux Profils</button>
            </div>
        `;

        // Ajouter un gestionnaire d'événements pour le bouton de retour
        const backToProfilesBtn = document.getElementById('backToProfilesBtn');
        backToProfilesBtn.addEventListener('click', () => {
            // Afficher à nouveau la liste des profils
            profilesContainer.style.display = 'flex';
            // Masquer la page du profil
            profilePageContainer.innerHTML = '';
        });

        // Ajouter un gestionnaire d'événements pour le bouton de modification
        const editProfileBtn = document.getElementById('editProfileBtn');
        editProfileBtn.addEventListener('click', () => {
            displayProfileForm(data);
        });
    }

    // Fonction pour afficher le formulaire de modification du profil
    function displayProfileForm(data) {
        // Masquer la page du profil
        profilePageContainer.innerHTML = '';

        // Afficher le formulaire de modification
        profileFormContainer.innerHTML = `
            <h2>Modifier le Profil</h2>
            <form id="editProfileForm">
                <label for="prenom">Prénom :</label>
                <input type="text" id="prenom" name="prenom" value="${data.prenom}" required>

                <label for="nom">Nom :</label>
                <input type="text" id="nom" name="nom" value="${data.nom}" required>

                <label for="email">Email :</label>
                <input type="email" id="email" name="email" value="${data.email}" required>

                <label for="genre">Genre :</label>
                <select id="genre" name="genre">
                    <option value="homme" ${data.genre === 'homme' ? 'selected' : ''}>Homme</option>
                    <option value="femme" ${data.genre === 'femme' ? 'selected' : ''}>Femme</option>
                    <option value="autre" ${data.genre === 'autre' ? 'selected' : ''}>Autre</option>
                </select>

                <label for="dateNaissance">Date de Naissance :</label>
                <input type="date" id="dateNaissance" name="dateNaissance" value="${data.dateNaissance}" required>

                <label for="adresseName">Adresse :</label>
                <input type="text" id="adresseName" name="adresseName" value="${data.adresseName}" required>
                <label for="adresseZip">Code postal :</label>
                <input type="text" id="adresseZip" name="adresseZip" pattern="\d+" value="${data.adresseZip}" required>
                <label for="adresseCity">Ville :</label>
                <input type="text" id="adresseCity" name="adresseCity" value="${data.adresseCity}" required>

                <label for="permis">Permis de conduire :</label>
                <input type="checkbox" id="permis" name="permis" ${data.permis ? 'checked' : ''}>
                <label for="typePermis">Type de Permis (si applicable) :</label>
                <input type="text" id="typePermis" name="typePermis" value="${data.typePermis || ''}">

                <label for="fichier">Ajout de Fichier Téléchargeable :</label>
                <input type="file" id="fichier" name="fichier">

                <label for="avatar">Photo de Profil :</label>
                <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg">

                <button type="submit">Enregistrer les Modifications</button>
            </form>
        `;

        // Ajouter un gestionnaire d'événements pour le formulaire de modification
        const editProfileForm = document.getElementById('editProfileForm');
        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateProfile(data, new FormData(editProfileForm));
        });
    }

    // Fonction pour mettre à jour les informations du profil
    function updateProfile(originalData, formData) {
        // Trouver et mettre à jour le profil dans la liste des profils existants
        const updatedProfiles = existingProfiles.map(profile => {
            if (profile === originalData) {
                return Object.fromEntries(formData);
            }
            return profile;
        });

        // Mettre à jour les profils dans le localStorage
        localStorage.setItem('profiles', JSON.stringify(updatedProfiles));

        // Recharger la page pour afficher les modifications
        location.reload();
    }

    // Gestionnaire d'événements pour la recherche de profil
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();

        // Parcourir toutes les cartes de profil et cacher celles qui ne correspondent pas à la recherche
        const profileCards = document.querySelectorAll('.profile-card');
        profileCards.forEach((card) => {
            const profileText = card.innerText.toLowerCase();
            card.style.display = profileText.includes(searchTerm) ? 'block' : 'none';
        });
    });
});
