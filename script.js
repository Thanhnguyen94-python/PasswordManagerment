import { app, database } from "./firebase-config.js";
import { 
  get, ref, push, update, remove 
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "admin123") {
        document.querySelector(".login-form").style.display = "none";
        document.querySelector(".main-content").style.display = "block";
        loadDataFromFirebase();  // Load data from Firebase upon successful login
    } else {
        alert("Incorrect username or password!");
    }
}


// Hàm tải dữ liệu từ Firebase
function loadDataFromFirebase() {
    console.log("Dữ liệu đang được tải từ Firebase...");

    // Lấy tham chiếu đến dữ liệu trong Firebase
    const dbRef = ref(database,'machines');  // 'machines' là tên của node trong Realtime Database

    // Lấy dữ liệu từ Firebase
    get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                displayData(data);  // Gọi hàm để hiển thị dữ liệu trong bảng
            } else {
                console.log("Không có dữ liệu.");
            }
        })
        .catch((error) => {
            console.error("Lỗi khi lấy dữ liệu: ", error);
        });
}

// Hàm hiển thị dữ liệu vào bảng
function displayData(data) {
  const tableBody = document.querySelector("#data-table tbody");
  tableBody.innerHTML = ""; // Xóa nội dung bảng trước khi thêm dữ liệu mới

  for (const key in data) {
      if (data.hasOwnProperty(key)) {
          const row = data[key]; // Dữ liệu của mỗi máy tính

          // Tạo một hàng mới trong bảng
          const tr = document.createElement("tr");

          // Thêm các cột dữ liệu
          tr.innerHTML = `
              <td>${row.name}</td>
              <td>${row.user}</td>
              <td data-password="${row.password}">*****</td> <!-- Gán lại data-password -->
              <td>${row.line}</td>
              <td>${row.group}</td>
              <td><button class="edit-btn" data-key="${key}">Chỉnh sửa</button></td>
              <td><button class="delete-btn" data-key="${key}">Xóa</button></td>
          `;
          tableBody.appendChild(tr);
      }
  }
}

// ================== CÁC HÀM CHÍNH ==================

// Hàm lọc dữ liệu trong bảng
function filterList() {
  const input = document.getElementById("searchInput");
  const filter = input.value.toUpperCase(); // Chuyển từ khóa tìm kiếm thành chữ hoa
  const table = document.getElementById("data-table");
  const tr = table.getElementsByTagName("tr");

  // Duyệt qua từng hàng (bỏ qua hàng đầu tiên là header)
  for (let i = 1; i < tr.length; i++) {
    const tds = tr[i].getElementsByTagName("td"); // Lấy tất cả các ô trong hàng
    let isMatch = false; // Biến kiểm tra xem hàng có khớp với từ khóa không

    // Duyệt qua các cột cần tìm kiếm (ví dụ: cột 0, 1, 3, 4)
    for (let j = 0; j < tds.length; j++) {
      if (j === 2) continue; // Bỏ qua cột Password (cột thứ 3, index 2)
      const td = tds[j];
      if (td) {
        const txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().includes(filter)) {
          isMatch = true; // Nếu tìm thấy từ khóa, đánh dấu là khớp
          break; // Thoát vòng lặp nếu đã tìm thấy kết quả
        }
      }
    }

    // Hiển thị hoặc ẩn hàng dựa trên kết quả tìm kiếm
    tr[i].style.display = isMatch ? "" : "none";
  }
}

// Hàm thêm dữ liệu mới
function addItem() {
  const newMachine = document.getElementById("newMachine").value;
  const newUser = document.getElementById("newUser").value;
  const newPass = document.getElementById("newPass").value;
  const newLine = document.getElementById("newLine").value;
  const newGroup = document.getElementById("newGroup").value;

  if (!newMachine || !newUser || !newPass) {
    alert("Vui lòng điền đầy đủ thông tin bắt buộc (Tên máy, User, Mật khẩu)");
    return;
  }

  const newData = {
    name: newMachine,
    user: newUser,
    password: newPass,
    line: newLine,
    group: newGroup
  };

  // Thêm dữ liệu vào Firebase   , 'machines/'
  push(ref(database,'machines/'), newData)
    .then(() => {
      alert("Thêm dữ liệu thành công!");
      loadDataFromFirebase(); // Load lại dữ liệu
      // Xóa form nhập
      document.querySelectorAll('#newMachine, #newUser, #newPass, #newLine, #newGroup')
        .forEach(input => input.value = '');
    })
    .catch((error) => {
      console.error("Lỗi khi thêm dữ liệu: ", error);
    });
}

// Hàm chỉnh sửa dữ liệu
function editItem(key) {
  const row = document.querySelector(`[data-key="${key}"]`).parentElement.parentElement;
  const cells = row.getElementsByTagName("td");

  const newData = {
      name: prompt("Tên máy mới:", cells[0].textContent),
      user: prompt("User mới:", cells[1].textContent),
      password: prompt("Mật khẩu mới:", cells[2].textContent),
      line: prompt("Line mới:", cells[3].textContent),
      group: prompt("Nhóm mới:", cells[4].textContent)
  };

  if (newData.name && newData.user && newData.password) {
      update(ref(database, `machines/${key}`), newData)
          .then(() => {
              alert("Cập nhật thành công!");
              loadDataFromFirebase(); // Tải lại dữ liệu
          })
          .catch((error) => {
              console.error("Lỗi khi cập nhật:", error);
          });
  }
}

// Hàm xóa dữ liệu
function deleteItem(key) {
  if (confirm("Bạn chắc chắn muốn xóa?")) {
    remove(ref(database, `machines/${key}`))
      .then(() => loadDataFromFirebase())
      .catch((error) => console.error("Lỗi khi xóa:", error));
  }
}

// Hàm xử lý upload file JSON
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      Object.values(data).forEach(item => {
        push(ref(database,'machines'), item);
      });
      alert("Import dữ liệu thành công!");
      loadDataFromFirebase();
    } catch (error) {
      alert("File JSON không hợp lệ!");
    }
  };
  reader.readAsText(file);
}

function showPassword(cell, password) {
  const originalContent = cell.textContent; // Lưu lại nội dung gốc của ô (*****)
  cell.textContent = password; // Hiển thị mật khẩu thực

  // Khôi phục lại nội dung gốc sau 5 giây
  setTimeout(() => {
      cell.textContent = originalContent; // Chuyển lại thành *****
  }, 5000); // 5000ms = 5 giây
}

// ================== EVENT LISTENERS ==================
document.getElementById("loginButton").addEventListener("click", login);
document.getElementById("searchInput").addEventListener("keyup", filterList);
document.querySelector(".btn").addEventListener("click", addItem);
document.getElementById("jsonFile").addEventListener("change", handleFileUpload);
document.getElementById("addButton").addEventListener("click", addItem);

// Xử lý sự kiện cho nút Edit/Delete (Event Delegation)
document.getElementById("data-table").addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    editItem(e.target.dataset.key);
  }
  if (e.target.classList.contains("delete-btn")) {
    deleteItem(e.target.dataset.key);
  }
});
document.getElementById("data-table").addEventListener("click", (e) => {
  if (e.target.tagName === "TD" && e.target.hasAttribute("data-password")) {
      const passwordCell = e.target; // Ô Password được click
      const password = passwordCell.dataset.password; // Lấy mật khẩu từ data attribute
      showPassword(passwordCell, password); // Gọi hàm hiển thị mật khẩu
  }
});

