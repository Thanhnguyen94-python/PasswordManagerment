
// Nhập các module Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB1wdjpAy8HQa9rvu2P3drwghla6bQlQaw",
    authDomain: "passwordmanagerment.firebaseapp.com",
    databaseURL: "https://passwordmanagerment-default-rtdb.firebaseio.com",
    projectId: "passwordmanagerment",
    storageBucket: "passwordmanagerment.firebasestorage.app",
    messagingSenderId: "630778787238",
    appId: "1:630778787238:web:0d1b279f51af6cdb5f0b67",
    measurementId: "G-W9PZBYBSK1"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Export để các tệp khác có thể sử dụng
export { app, database };
