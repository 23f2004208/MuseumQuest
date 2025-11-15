const firebaseConfig = {
  apiKey: "YAIzaSyA-aj8K4CT5GRQaxBKIoeZTN6eRiCHfZgY",
  authDomain: "museum-quest-7e777.firebaseapp.com",
  projectId: "museum-quest-7e777.firebaseapp.com"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Redirect to login if not logged in
function protectPage() {
  auth.onAuthStateChanged(user => {
    if (!user) window.location.href = "login-page.html";
  });
}