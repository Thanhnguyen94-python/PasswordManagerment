import { app, database } from "./firebase-config.js";
import { 
  get, ref, push, update, remove 
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// ================== CẤU HÌNH CHUNG ==================
const auth = {
  username: "admin",
  password: "admin123"
};

const domElements = {
  loginForm: document.querySelector(".login-form"),
  userAvatar: document.getElementById("userAvatar"),
  dataTable: document.getElementById("data-table"),
  // ... thêm các phần tử DOM khác nếu cần
};

// ================== HÀM XỬ LÝ CHÍNH ==================
function initializeEventListeners() {
  // Sự kiện đăng nhập
  document.getElementById("loginButton").addEventListener("click", handleLogin);
  
  // Sự kiện bảng
  domElements.dataTable.addEventListener("click", handleTableClick);
  
  // Sự kiện form thêm mới
  document.getElementById("addButton").addEventListener("click", handleAddItem);
}

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

async function loadDataFromFirebase() {
  try {
    const snapshot = await get(ref(database, 'machines'));
    displayData(snapshot.exists() ? snapshot.val() : {});
  } catch (error) {
    console.error("Lỗi tải dữ liệu:", error);
    alert("Không thể tải dữ liệu từ server!");
  }
}

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

function handleTableClick(e) {
  const target = e.target;
  
  // Xử lý xem mật khẩu
  if (target.matches('td[data-password]')) {
    showPassword(target);
    return;
  }

  // Xử lý các action
  const key = target.dataset.key;
  if (target.matches('.edit-btn')) return handleEdit(key);
  if (target.matches('.delete-btn')) return handleDelete(key);
}

async function handleAddItem() {
  const inputs = {
    name: document.getElementById("newMachine"),
    user: document.getElementById("newUser"),
    password: document.getElementById("newPass"),
    line: document.getElementById("newLine"),
    group: document.getElementById("newGroup")
  };

  // Validate dữ liệu
  if (!inputs.name.value || !inputs.user.value || !inputs.password.value) {
    return alert("Vui lòng điền đầy đủ các trường bắt buộc!");
  }

  try {
    await push(ref(database, 'machines'), {
      name: inputs.name.value,
      user: inputs.user.value,
      password: inputs.password.value,
      line: inputs.line.value,
      group: inputs.group.value
    });
    
    // Reset form và tải lại dữ liệu
    Object.values(inputs).forEach(input => input.value = '');
    await loadDataFromFirebase();
    alert("Thêm máy tính thành công!");
  } catch (error) {
    console.error("Lỗi khi thêm dữ liệu:", error);
    alert("Có lỗi xảy ra khi thêm máy tính!");
  }
}

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

// ================== HÀM TIỆN ÍCH ==================
function showPassword(cell) {
  const original = cell.textContent;
  cell.textContent = cell.dataset.password;
  setTimeout(() => cell.textContent = original, 3000);
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => 
    page.style.display = page.id === pageId ? 'block' : 'none'
  );
}

// ================== KHỞI TẠO ỨNG DỤNG ==================
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  showPage('home');
});

// Xuất các hàm cần thiết
window.loadDataFromFirebase = loadDataFromFirebase;
window.showPage = showPage;