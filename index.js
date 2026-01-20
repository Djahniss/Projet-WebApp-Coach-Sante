// --- 1. LES PIOCHES DE CONSEILS (POOLS) ---
const poolBienManger = [
  "Ajouter un fruit au déjeuner ",
  "Manger une poignée d'amandes ",
  "Remplacer le dessert sucré par un yaourt nature ",
  "Manger des légumes verts ce soir ",
  "Éviter les produits transformés aujourd'hui ",
  "Prendre un petit-déjeuner complet (protéines + fibres) ",
  "Manger lentement et mâcher bien chaque bouchée ",
  "Cuisiner un repas maison aujourd'hui ",
  "Réduire le sel dans l'assiette ",
  "Manger un carré de chocolat noir au lieu d'un gâteau ",
];

const poolBienEtre = [
  "Prendre 5 minutes pour respirer profondément ",
  "Noter 3 choses positives de ta journée ",
  "Écouter ta musique préférée ",
  "Appeler un proche pour prendre des nouvelles ",
  "Se déconnecter des écrans pendant 1h ",
  "Faire une micro-sieste de 15 min ",
  "Lire 10 pages d'un livre ",
  "Sourire à un inconnu ou un collègue ",
  "Faire un compliment à quelqu'un ",
  "S'étirer le dos et les épaules au bureau ",
];

const poolHydratation = [
  "Boire un grand verre d'eau au réveil ",
  "Remplacer le soda par de l'eau ou du thé ",
  "Boire un verre d'eau avant chaque repas ",
  "Garder une gourde à portée de main toute la journée ",
  "Boire une tisane ce soir ",
  "Ajouter du citron ou du concombre dans ton eau ",
  "Éviter l'alcool aujourd'hui ",
  "Boire 1,5L d'eau au total aujourd'hui ",
  "Prendre un verre d'eau après le café ",
  "Boire de l'eau gazeuse pour changer ",
];

const poolPhysique = [
  "Prendre les escaliers au lieu de l'ascenseur ",
  "Faire 10 squats pendant la pause ",
  "Marcher 15 minutes après le déjeuner ",
  "Se garer un peu plus loin pour marcher plus ",
  "Faire le tour du pâté de maisons",
  "Danser sur une chanson énergique ",
  "Faire 1 minute de gainage (planche) ",
  "S'étirer 5 minutes avant de dormir ",
  "Aller au travail à vélo ou à pied si possible ",
  "Se lever et marcher toutes les heures au bureau ",
];

function getRandomItem(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// --- 2. CONFIGURATION DES OBJECTIFS ---
const objectives = [
  {
    id: 1,
    title: "Bien Manger",
    desc: getRandomItem(poolBienManger),
    icon: "🍏",
    etat: 0,
  },
  {
    id: 2,
    title: "Bien Être Mental",
    desc: getRandomItem(poolBienEtre),
    icon: "🧠",
    etat: 0,
  },
  {
    id: 3,
    title: "Bien s'Hydrater",
    desc: getRandomItem(poolHydratation),
    icon: "💧",
    etat: 0,
  },
  {
    id: 4,
    title: "Activité Physique",
    desc: getRandomItem(poolPhysique),
    icon: "🏃",
    etat: 0,
  },
];

const container = document.getElementById("goals-container");
const progressBar = document.getElementById("progress-bar");
const scoreText = document.getElementById("score-text");

// --- 3. AFFICHAGE (RENDER) ---
function render() {
  container.innerHTML = "";
  let currentScorePoints = 0;

  // Variable pour savoir si tout est coché
  let toutEstEvalue = true;

  objectives.forEach((obj, index) => {
    // Si un objectif est encore à l'état 0, alors tout n'est pas fini
    if (obj.etat === 0) {
      toutEstEvalue = false;
    }

    const card = document.createElement("div");
    let statusClass = "";
    let statusIcon = obj.icon;
    let statusText = obj.desc;

    if (obj.etat === 2) {
      statusClass = "doing";
      statusIcon = "🟠";
      statusText = "Objectif incomplet";
      currentScorePoints += 12.5;
    } else if (obj.etat === 3) {
      statusClass = "done";
      statusIcon = "✅";
      statusText = "Objectif validé !";
      currentScorePoints += 25;
    } else if (obj.etat === 1) {
      statusClass = "missed";
      statusIcon = "❌";
      statusText = "Non-accompli";
    }

    card.className = `card ${statusClass}`;
    card.onclick = () => toggleObjective(index);

    card.innerHTML = `
            <div class="icon">${statusIcon}</div>
            <div class="card-title">${obj.title}</div>
            <div class="card-desc">${statusText}</div>
        `;
    container.appendChild(card);

    updateProgress(currentScorePoints);
    window.currentObjectives = objectives;
  });

  // Ajout des points du challenge si validé
  if (window.challengeValideGlobal === true) {
    currentScorePoints += 10;
  }

  updateProgress(currentScorePoints);

  // GESTION DU BOUTON VALIDER ---
  const btnValider = document.getElementById("btnValiderJournee");
  if (btnValider) {
    if (toutEstEvalue) {
      btnValider.style.backgroundColor = "#4caf50";
      btnValider.style.color = "white";
      btnValider.style.padding = "15px 30px";
      btnValider.style.border = "none";
      btnValider.style.borderRadius = "10px";
      btnValider.style.fontSize = "1.1rem";
      btnValider.style.cursor = "pointer";
      btnValider.style.fontWeight = "bold";
      btnValider.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
      btnValider.disabled = false;
      btnValider.innerText = "✅ Valider ma journée";
    } else {
      // Sinon, on le grise et on le désactive
      btnValider.disabled = true;
      btnValider.style.cursor = "";
      btnValider.innerText = "⏳ En attente d'évaluation";
      btnValider.style.backgroundColor = "#999"; // Gris
      btnValider.style.color = "white";
      btnValider.style.border = "none";
      btnValider.style.padding = "15px";
      btnValider.style.borderRadius = "10px";
      btnValider.style.fontSize = "1.1rem";
      btnValider.style.transition = "background 0.2s";
      btnValider.style.fontWeight = "bold";
    }
  }
}

function toggleObjective(index) {
  // On change l'état (0 -> 1 -> 2 -> 3 -> 0)
  objectives[index].etat = (objectives[index].etat + 1) % 4;

  // Mise à jour visuelle immédiate
  render();

  // Sauvegarde dans Firebase (si la fonction existe)
  if (typeof window.saveDayToFirebase === "function") {
    window.saveDayToFirebase(objectives);
  }
}

function updateProgress(scoreTotal) {
  const visualWidth = Math.min(scoreTotal, 100);
  progressBar.style.width = visualWidth + "%";
  scoreText.innerText = `Mon score du jour : ${scoreTotal}%`;

  if (scoreTotal >= 100) {
    scoreText.innerText = `🔥 Score : ${scoreTotal}% - Exceptionnel !`;
    scoreText.style.color = "#08a553";
    progressBar.style.backgroundColor = "#08a553";
  } else {
    scoreText.style.color = "#333";
    progressBar.style.backgroundColor = "";
  }
}

// --- 4. SAUVEGARDE LOCALE (Uniquement pour les objectifs) ---

function loadData() {
  const saved = localStorage.getItem("coachTarnDemo");
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.length === objectives.length) {
      objectives.forEach((obj, i) => {
        obj.etat = parsed[i].etat;
        obj.desc = parsed[i].desc; // On garde le même conseil pour la journée
      });
    }
  }
}

// --- 5. INITIALISATION ---
loadData();
// Note : render() sera aussi appelé depuis index.html une fois Firebase chargé

/* --- 6. LOGIQUE DU CHALLENGE (POPUP) --- */
/* --- 6. LOGIQUE DU CHALLENGE (POPUP) --- */

// On initialise une liste vide (ou avec un message par défaut au cas où)
let challengesList = [
  "Chargement des défis...",
  "Fais 5 grandes respirations (Défaut)",
];

// Fonction pour charger le fichier texte
async function loadChallengesFromFile() {
  try {
    const response = await fetch("challenges.txt"); // Lecture du fichier
    if (!response.ok) {
      throw new Error("Impossible de lire le fichier challenges.txt");
    }
    const text = await response.text();

    // On coupe le texte à chaque saut de ligne (\n)
    // .map(line => line.trim()) enlève les espaces inutiles
    // .filter(...) enlève les lignes vides
    challengesList = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    console.log("Challenges chargés :", challengesList.length);
  } catch (error) {
    console.error("Erreur chargement challenges :", error);
    // On garde les valeurs par défaut si ça plante
  }
}

// Lancer le chargement dès le démarrage
loadChallengesFromFile();

const btnGeo = document.getElementById("geo-btn");
const modal = document.getElementById("challenge-modal");
const modalText = document.getElementById("modal-challenge-text");
const btnConfirm = document.getElementById("btn-confirm-challenge");
const btnCancel = document.getElementById("btn-cancel-challenge");

// Fonction pour mettre à jour l'interface du bouton
function updateChallengeUI(isDone) {
  if (isDone) {
    btnGeo.innerText = "✅ Validé !";
    btnGeo.classList.add("success");
    window.challengeValideGlobal = true;
  } else {
    btnGeo.innerText = "📍 Challenge ";
    btnGeo.classList.remove("success");
    window.challengeValideGlobal = false;
  }
}

// Ouvrir la modale
btnGeo.onclick = () => {
  if (window.challengeValideGlobal === true) return;

  // On pioche dans la liste (qui a été remplie par le fichier texte)
  const challenge = getRandomItem(challengesList);
  modalText.innerText = challenge;
  modal.classList.add("active");
};

// ... Le reste du code (btnCancel, btnConfirm, etc.) reste identique ...
// (Ne change rien en dessous de btnGeo.onclick sauf si tu as effacé par erreur)
btnCancel.onclick = () => {
  modal.classList.remove("active");
};

btnConfirm.onclick = () => {
  modal.classList.remove("active");
  if (typeof window.validerChallengeFirebase === "function") {
    window.validerChallengeFirebase();
  }
};
// Fonction pour mettre à jour l'interface du bouton (appelée aussi depuis html)
function updateChallengeUI(isDone) {
  if (isDone) {
    btnGeo.innerText = "✅ Validé !";
    btnGeo.classList.add("success");
    window.challengeValideGlobal = true; // On s'assure que la variable est synchro
  } else {
    btnGeo.innerText = "📍 Challenge";
    btnGeo.classList.remove("success");
    window.challengeValideGlobal = false;
  }
}

// Ouvrir la modale
btnGeo.onclick = () => {
  // Si déjà validé, on ne fait rien
  if (window.challengeValideGlobal === true) return;

  const challenge = getRandomItem(challengesList);
  modalText.innerText = challenge;
  modal.classList.add("active");
};

// Fermer la modale (Annuler)
btnCancel.onclick = () => {
  modal.classList.remove("active");
};

// Clic sur "J'ai relevé le défi !"
btnConfirm.onclick = () => {
  modal.classList.remove("active");
  // On appelle la fonction définie dans index.html qui a accès à Firebase
  if (typeof window.validerChallengeFirebase === "function") {
    window.validerChallengeFirebase();
  }
};

// Fonction appelée par index.html quand on change de jour (Chargement)
window.loadObjectivesFromExternal = function (savedObjectives) {
  if (savedObjectives && savedObjectives.length > 0) {
    objectives.forEach((obj, i) => {
      if (savedObjectives[i]) {
        obj.etat = savedObjectives[i].etat;
        obj.desc = savedObjectives[i].desc;
      }
    });
  } else {
    objectives.forEach((obj) => {
      obj.etat = 0;
    });
  }
  render();
};
/* --- 7. TUTORIEL (DRIVER.JS) --- */

window.lancerTuto = function (onCompleteCallback) {
  // On vérifie que la librairie est bien chargée
  const driver = window.driver.js.driver;

  const driverObj = driver({
    showProgress: true,
    allowClose: false, // Force à suivre ou utiliser le bouton croix
    nextBtnText: "Suivant →",
    prevBtnText: "← Retour",
    doneBtnText: "C'est parti !",
    steps: [
      {
        element: "header",
        popover: {
          title: "Bienvenue sur Le Coach Tarnais ! 👋",
          description:
            "Cette application t'aide à maintenir une bonne hygiène de vie au quotidien. Faisons un tour rapide.",
        },
      },
      {
        element: "#goals-container",
        popover: {
          title: "Tes 4 Piliers",
          description:
            "Chaque jour, tu as 4 objectifs. <br><strong>Clique sur une carte</strong> pour changer son état :<br>⬜ Pas fait<br>❌ Raté<br>🟠 Moyen<br>✅ Réussi",
        },
      },
      {
        element: ".progress-section",
        popover: {
          title: "Ta progression",
          description:
            "La barre se remplit au fur et à mesure que tu valides tes objectifs.",
        },
      },
      {
        element: "#geo-btn",
        popover: {
          title: "Le Défi Bonus",
          description:
            "Chaque jour, clique ici pour découvrir un petit défi surprise qui te rapporte des points bonus !",
        },
      },
      {
        element: "#btnValiderJournee",
        popover: {
          title: "Valider ta journée",
          description:
            "Une fois que tu as rempli l'état de tes 4 objectifs, ce bouton devient vert. <strong>N'oublie pas de cliquer dessus</strong> pour sauvegarder tes points !",
        },
      },
      {
        element: ".date-navigation",
        popover: {
          title: "Voyage dans le temps",
          description:
            "Tu as oublié de valider hier ? Utilise les flèches pour revenir en arrière et compléter ton historique.",
        },
      },
    ],
    onDestroyStarted: () => {
      // Si l'utilisateur ferme le tuto ou le finit
      if (onCompleteCallback) onCompleteCallback();
      driverObj.destroy();
    },
  });

  driverObj.drive();
};

/* --- GESTION DES PARAMÈTRES (MODALE) --- */

const btnSettings = document.getElementById("btn-settings");
const settingsModal = document.getElementById("settings-modal");
const btnCloseSettings = document.getElementById("btn-close-settings");
const btnSavePassword = document.getElementById("btn-save-password");
const inputNewPassword = document.getElementById("settings-new-password");

// 1. Ouvrir la modale au clic sur le bouton paramètres
if (btnSettings) {
  btnSettings.onclick = () => {
    // On vide le champ pour qu'il soit propre à l'ouverture
    if (inputNewPassword) inputNewPassword.value = "";
    settingsModal.classList.add("active");
  };
}

// 2. Fermer la modale
if (btnCloseSettings) {
  btnCloseSettings.onclick = () => {
    settingsModal.classList.remove("active");
  };
}

// Fermer aussi si on clique en dehors de la carte (sur le fond gris)
if (settingsModal) {
  settingsModal.onclick = (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.remove("active");
    }
  };
}

// 3. Logique de changement de mot de passe
if (btnSavePassword) {
  btnSavePassword.onclick = () => {
    const newPass = inputNewPassword.value.trim();

    if (newPass.length < 6) {
      alert("⚠️ Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    // Affiche un état de chargement visuel
    const originalText = btnSavePassword.innerText;
    btnSavePassword.innerText = "Mise à jour...";
    btnSavePassword.disabled = true;

    // Appel à la fonction Firebase (définie dans index.html ou un script firebase)
    // On vérifie si la fonction existe pour éviter les bugs si Firebase n'est pas chargé
    if (typeof window.updateUserPasswordFirebase === "function") {
      window
        .updateUserPasswordFirebase(newPass)
        .then(() => {
          alert("✅ Mot de passe modifié avec succès !");
          settingsModal.classList.remove("active");
        })
        .catch((error) => {
          alert("❌ Erreur : " + error.message);
        })
        .finally(() => {
          // Remettre le bouton à la normale
          btnSavePassword.innerText = originalText;
          btnSavePassword.disabled = false;
        });
    } else {
      // Fallback si pas de backend connecté (mode test)
      console.log("Simulation : Nouveau MDP -> ", newPass);
      setTimeout(() => {
        alert("Mode Simulation : Mot de passe validé !");
        settingsModal.classList.remove("active");
        btnSavePassword.innerText = originalText;
        btnSavePassword.disabled = false;
      }, 800);
    }
  };
}

//
// À ajouter au début avec les autres sélecteurs
const inputNewEmail = document.getElementById("settings-new-email");
const btnSaveEmail = document.getElementById("btn-save-email");

// Listener pour le changement d'email
if (btnSaveEmail) {
  btnSaveEmail.onclick = () => {
    const newEmail = inputNewEmail.value.trim();

    if (!newEmail.includes("@")) {
      alert("⚠️ Veuillez entrer une adresse email valide.");
      return;
    }

    const originalText = btnSaveEmail.innerText;
    btnSaveEmail.innerText = "Mise à jour...";
    btnSaveEmail.disabled = true;

    if (typeof window.updateUserEmailFirebase === "function") {
      window
        .updateUserEmailFirebase(newEmail)
        .then(() => {
          alert("✅ Email modifié avec succès !");
          inputNewEmail.value = "";
          document.getElementById("settings-modal").classList.remove("active");
        })
        .catch((error) => {
          alert("❌ Erreur : " + error.message);
        })
        .finally(() => {
          btnSaveEmail.innerText = originalText;
          btnSaveEmail.disabled = false;
        });
    }
  };
}

// À ajouter vers la fin de index.js, avec les autres boutons de paramètres
const btnDeleteAccount = document.getElementById("btn-delete-account");

if (btnDeleteAccount) {
  btnDeleteAccount.onclick = async () => {
    // 1. Demander une confirmation
    const confirmFirst = confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et effacera toutes vos données.");
    
    if (confirmFirst) {
      const confirmSecond = confirm("Dernière vérification : Voulez-vous vraiment TOUT supprimer ?");
      
      if (confirmSecond) {
        btnDeleteAccount.innerText = "Suppression en cours...";
        btnDeleteAccount.disabled = true;

        try {
          if (typeof window.deleteUserAccountFirebase === "function") {
            await window.deleteUserAccountFirebase();
            alert("✅ Votre compte a été supprimé avec succès.");
            window.location.reload(); // Recharge pour revenir à l'écran de connexion
          } else {
            throw new Error("Fonction de suppression non trouvée.");
          }
        } catch (error) {
          console.error(error);
          alert("❌ Erreur lors de la suppression : " + error.message);
          btnDeleteAccount.innerText = "🗑️ Supprimer mon compte définitivement";
          btnDeleteAccount.disabled = false;
        }
      }
    }
  };
}