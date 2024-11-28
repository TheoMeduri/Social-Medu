// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCNQRVoMiXG8pv8f1EDVDoTlkYvT7xqTdQ",
    authDomain: "social-websmedu.firebaseapp.com",
    projectId: "social-websmedu",
    storageBucket: "social-websmedu.firebasestorage.app",
    messagingSenderId: "940867777501",
    appId: "1:940867777501:web:33b4dbaa0271a89a903c34"
  };

  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

// Referências ao modal
const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal-content');

// Função para abrir o modal
function openModal() {
    modal.style.display = "flex";
    setTimeout(() => {
        modal.style.opacity = "1"; // Gradualmente aparecer
        modalContent.classList.add('open');
    }, 100);
}

// Função de fechamento do modal
function closeModal() {
    modalContent.classList.remove('open');
    setTimeout(() => {
        modal.style.opacity = "0"; // Usar opacidade para animação
        setTimeout(() => {
            modal.style.display = "none";
        }, 300); // Espera o fade-out terminar
    }, 600);
}

// Referências aos campos do formulário
const usernameField = document.getElementById('name');
const emailField = document.getElementById('email');
const passField = document.getElementById('pass');
const confirmPassField = document.getElementById('confirm-pass');

// Função de registro com verificação de nome de usuário
function register(event) {
    event.preventDefault(); // Previne o envio do formulário

    // Coletando valores do formulário
    const username = usernameField.value;
    const email = emailField.value;
    const password = passField.value;
    const confirmPassword = confirmPassField.value;

    // Validações simples
    if (password !== confirmPassword) {
        alert("As senhas não coincidem!");
        return;
    }

    // Verificar se o nome de usuário já existe no Firestore
    const usersRef = db.collection('users');
    usersRef.where('username', '==', username).get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                // Se o nome de usuário já existe
                alert("Nome de usuário já em uso!");
                openModal(); // Abre o modal com erro
            } else {
                // Criar usuário com o Firebase Authentication
                auth.createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;

                        // Armazenar dados do usuário no Firestore
                        db.collection('users').doc(user.uid).set({
                            username: username,
                            email: email,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        })
                        .then(() => {
                            console.log("Usuário registrado no Firestore com sucesso!");
                            alert("Cadastro realizado com sucesso!");
                        })
                        .catch((error) => {
                            console.error("Erro ao registrar usuário no Firestore: ", error);
                            alert("Ocorreu um erro ao salvar seus dados!");
                        });
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.error("Erro ao cadastrar usuário: ", errorCode, errorMessage);
                        alert("Erro ao cadastrar usuário: " + errorMessage);
                    });
            }
        })
        .catch((error) => {
            console.error("Erro ao verificar o nome de usuário: ", error);
            alert("Erro ao verificar o nome de usuário. Tente novamente.");
        });
}
