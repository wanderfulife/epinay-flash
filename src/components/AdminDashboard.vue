<template>
  <div>
    <button class="btn-signin" @click="showSignInModal = true">
      Connexion Admin
    </button>

    <!-- Sign In Modal -->
    <div v-if="showSignInModal" class="modal">
      <div class="modal-content signin-modal">
        <button class="close" @click="showSignInModal = false">&times;</button>
        <h2>Connexion Admin</h2>
        <input
          v-model="password"
          type="password"
          placeholder="Entrez le mot de passe"
          class="form-control"
        />
        <button @click="signIn" class="btn-signin">Se connecter</button>
      </div>
    </div>

    <!-- Admin Dashboard Modal -->
    <div v-if="showAdminDashboard" class="modal">
      <div class="modal-content admin-dashboard">
        <button class="close" @click="showAdminDashboard = false">
          &times;
        </button>
        <h2>Tableau de Bord Admin</h2>

        <!-- Added filter checkbox -->
        <div style="margin-bottom: 20px">
          <label
            style="
              color: #ecf0f1;
              display: flex;
              align-items: center;
              gap: 10px;
            "
          >
            <input type="checkbox" v-model="showTodayOnly" style="margin: 0" />
            Afficher uniquement les enquêtes d'aujourd'hui
          </label>
        </div>

        <div class="dashboard-content">
          <div class="dashboard-card total">
            <h3>Total des Enquêtes</h3>
            <p class="big-number">{{ totalSurveys }}</p>
          </div>
          <div class="dashboard-card">
            <h3>Enquêtes par Enquêteur</h3>
            <ul>
              <li v-for="(count, name) in surveysByEnqueteur" :key="name">
                <span>{{ name }}</span>
                <span class="count">{{ count }}</span>
              </li>
            </ul>
          </div>
        </div>
        <button @click="downloadData" class="btn-download">
          Télécharger les Données
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import * as XLSX from "xlsx";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

const props = defineProps({
  questions: {
    type: Array,
    required: true,
  },
});

const showSignInModal = ref(false);
const showAdminDashboard = ref(false);
const password = ref("");
const totalSurveys = ref(0);
const surveysByEnqueteur = ref({});
const showTodayOnly = ref(false);

const surveyCollectionRef = collection(db, "EpinayFlash");

const getTodayDateString = () => {
  const now = new Date();
  // Format as DD-MM-YYYY to match your Firebase date format
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};

const signIn = () => {
  if (password.value === "admin123") {
    showSignInModal.value = false;
    showAdminDashboard.value = true;
    fetchDashboardData();
  } else {
    alert("Mot de passe incorrect");
  }
};

const fetchDashboardData = async () => {
  try {
    let queryRef = surveyCollectionRef;

    if (showTodayOnly.value) {
      const today = getTodayDateString();
      console.log("Filtering for date:", today); // Debug log
      queryRef = query(surveyCollectionRef, where("DATE", "==", today));
    }

    const querySnapshot = await getDocs(queryRef);
    totalSurveys.value = querySnapshot.size;

    const enqueteurCounts = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("Document date:", data.DATE); // Debug log
      const enqueteur = data.ENQUETEUR || "Unknown";
      enqueteurCounts[enqueteur] = (enqueteurCounts[enqueteur] || 0) + 1;
    });

    surveysByEnqueteur.value = enqueteurCounts;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    alert("Erreur lors de la récupération des données");
  }
};

const downloadData = async () => {
  try {
    let queryRef = surveyCollectionRef;

    if (showTodayOnly.value) {
      const today = getTodayDateString();
      queryRef = query(surveyCollectionRef, where("DATE", "==", today));
    }

    const querySnapshot = await getDocs(queryRef);

    const headerOrder = [
      "ID_questionnaire",
      "ENQUETEUR",
      "DATE",
      "JOUR",
      "HEURE_DEBUT",
      "HEURE_FIN",
    ];

    props.questions.forEach((question) => {
      // Skip Q2 and Q5a questions

      if (question.usesCommuneSelector) {
        headerOrder.push(
          `${question.id}_COMMUNE`,
          `${question.id}_CODE_INSEE`,
          `${question.id}_COMMUNE_LIBRE`
        );
      } else if (question.usesStreetSelector) {
        headerOrder.push(`${question.id}_RUE`);
      } else {
        headerOrder.push(question.id);
      }
    });

    const data = querySnapshot.docs.map((doc) => {
      const docData = doc.data();
      const row = headerOrder.reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {});

      Object.keys(docData).forEach((key) => {
        if (headerOrder.includes(key)) {
          row[key] = docData[key];
        }
      });

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data, { header: headerOrder });
    const colWidths = headerOrder.map(() => ({ wch: 20 }));
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Survey Data");

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filePrefix = showTodayOnly.value ? "Today_" : "";
    XLSX.writeFile(
      workbook,
      `${filePrefix}EpinayFlash_Survey_Data_${timestamp}.xlsx`
    );
  } catch (error) {
    console.error("Error downloading data:", error);
    alert("Erreur lors du téléchargement des données");
  }
};

// Watch for changes in showTodayOnly to refresh data
watch(showTodayOnly, () => {
  fetchDashboardData();
});
</script>
<style scoped>
.btn-signin {
  background-color: #4caf50;
  color: #ffffff;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 30px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.btn-signin:hover {
  background-color: #45a049;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

/* Keep the rest of the styles unchanged */
.btn-download {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  width: 100%;
  margin-top: 20px;
}

.btn-download:hover {
  background-color: #2980b9;
}

.modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close {
  position: fixed;
  /* Change from absolute to fixed */
  right: 20px;
  top: 20px;
  font-size: 28px;
  font-weight: bold;
  color: #bdc3c7;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1010;
  /* Ensure it's above other content */
}

.close:hover {
  color: #ecf0f1;
}

.dashboard-content {
  display: grid;
  gap: 20px;
  margin-bottom: 20px;
}

.dashboard-card {
  background-color: #34495e;
  border-radius: 8px;
  padding: 15px;
}

.dashboard-card h3 {
  margin-top: 0;
  color: #3498db;
}

.dashboard-card ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.dashboard-card li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.big-number {
  font-size: 3em;
  font-weight: bold;
  color: #2ecc71;
  margin: 10px 0;
}

.count {
  font-weight: bold;
  color: #2ecc71;
}

.form-control {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #34495e;
  border-radius: 5px;
  background-color: #34495e;
  color: #ecf0f1;
}

@media (max-width: 600px) {
  .modal-content {
    width: 100%;
    height: 100%;
    border-radius: 0;
    max-height: 100vh;
  }

  .close {
    top: 10px;
    right: 10px;
  }
}
</style>