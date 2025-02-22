import { app, database } from "./firebase-config.js";
import { get, ref, push, update, remove } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";
import { initializePrintFormEvents } from "./print-form.js";

// Cấu hình chung
const auth = { username: "admin", password: "admin123" };
const domElements = {
    loginForm: document.querySelector(".login-form"),
    userAvatar: document.getElementById("userAvatar"),
    dataTable: document.getElementById("data-table"),
};

// Khởi tạo sự kiện
function initializeEventListeners() {
    document.getElementById("loginButton").addEventListener("click", handleLogin);
    domElements.dataTable.addEventListener("click", handleTableClick);
    document.getElementById("addButton").addEventListener("click", handleAddItem);
    initializePrintFormEvents(); // Gọi hàm khởi tạo sự kiện mẫu in
}

// Xử lý đăng nhập
async function handleLogin() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === auth.username && password === auth.password) {
        domElements.loginForm.style.display = "none";
        domElements.userAvatar.style.display = "flex";
        showPage('computer-list');
        await loadDataFromFirebase();
    } else {
        alert("Thông tin đăng nhập không chính xác!");
        domElements.loginForm.classList.add('shake');
        setTimeout(() => domElements.loginForm.classList.remove('shake'), 500);
    }
}

// Tải dữ liệu từ Firebase
async function loadDataFromFirebase() {
    try {
        const snapshot = await get(ref(database, 'machines'));
        displayData(snapshot.exists() ? snapshot.val() : {});
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        alert("Không thể tải dữ liệu từ server!");
    }
}

// Hiển thị dữ liệu bảng
function displayData(data) {
    const tableBody = domElements.dataTable.querySelector("tbody");
    tableBody.innerHTML = Object.entries(data).map(([key, item]) => `
        <tr>
            <td>${item.name}</td>
            <td>${item.user}</td>
            <td data-password="${item.password}">*****</td>
            <td>${item.line}</td>
            <td>${item.group}</td>
            <td><button class="edit-btn" data-key="${key}">Sửa</button></td>
            <td><button class="delete-btn" data-key="${key}">Xóa</button></td>
        </tr>
    `).join('');
}

// Xử lý sự kiện bảng
function handleTableClick(e) {
    const target = e.target;
    if (target.matches('td[data-password]')) return showPassword(target);
    const key = target.dataset.key;
    if (target.matches('.edit-btn')) return handleEdit(key);
    if (target.matches('.delete-btn')) return handleDelete(key);
}

// Thêm dữ liệu mới
async function handleAddItem() {
    const inputs = {
        name: document.getElementById("newMachine").value,
        user: document.getElementById("newUser").value,
        password: document.getElementById("newPass").value,
        line: document.getElementById("newLine").value,
        group: document.getElementById("newGroup").value
    };

    if (!inputs.name || !inputs.user || !inputs.password) return alert("Vui lòng điền đầy đủ các trường bắt buộc!");
    try {
        await push(ref(database, 'machines'), inputs);
        Object.values(inputs).forEach((_, i) => document.getElementsByTagName("input")[i + 4].value = '');
        await loadDataFromFirebase();
        alert("Thêm máy tính thành công!");
    } catch (error) {
        console.error("Lỗi khi thêm dữ liệu:", error);
        alert("Có lỗi xảy ra khi thêm máy tính!");
    }
}

// Chỉnh sửa dữ liệu
async function handleEdit(key) {
    const snapshot = await get(ref(database, `machines/${key}`));
    const currentData = snapshot.val();
    const newData = {
        name: prompt("Tên máy mới:", currentData.name),
        user: prompt("User mới:", currentData.user),
        password: prompt("Mật khẩu mới:", currentData.password),
        line: prompt("Line mới:", currentData.line),
        group: prompt("Nhóm mới:", currentData.group)
    };

    if (newData.name && newData.user && newData.password) {
        try {
            await update(ref(database, `machines/${key}`), newData);
            await loadDataFromFirebase();
            alert("Cập nhật thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert("Có lỗi xảy ra khi cập nhật!");
        }
    }
}

// Xóa dữ liệu
async function handleDelete(key) {
    if (!confirm("Bạn chắc chắn muốn xóa máy tính này?")) return;
    try {
        await remove(ref(database, `machines/${key}`));
        await loadDataFromFirebase();
        alert("Xóa máy tính thành công!");
    } catch (error) {
        console.error("Lỗi khi xóa:", error);
        alert("Có lỗi xảy ra khi xóa!");
    }
}

// Hiển thị mật khẩu
function showPassword(cell) {
    const original = cell.textContent;
    cell.textContent = cell.dataset.password;
    setTimeout(() => cell.textContent = original, 3000);
}

// Chuyển trang
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.style.display = page.id === pageId ? 'block' : 'none');
    if (pageId === 'computer-list' && domElements.userAvatar.style.display === 'flex') loadDataFromFirebase();
}

// Khởi động ứng dụng
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    showPage('home');
});

// Xuất hàm cho HTML
window.showPage = showPage;
window.loadDataFromFirebase = loadDataFromFirebase;
window.showPasswordReset = () => alert("Tính năng đang phát triển!");