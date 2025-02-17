// Hàm thêm một máy tính mới vào danh sách
function addItem() {
    const name = document.getElementById("newMachine").value;
    const user = document.getElementById("newUser").value;
    const pass = document.getElementById("newPass").value;
    const line = document.getElementById("newLine").value;
    const group = document.getElementById("newGroup").value;

    if (name && user && pass && line && group) {
        const newComputer = { name, user, pass, line, group };
        computers.push(newComputer);
        localStorage.setItem("computers", JSON.stringify(computers));  // Lưu vào localStorage
        displayComputers();
    } else {
        alert("Vui lòng điền đầy đủ thông tin.");
    }

    // Làm trống các trường nhập
    document.getElementById("newMachine").value = "";
    document.getElementById("newUser").value = "";
    document.getElementById("newPass").value = "";
    document.getElementById("newLine").value = "";
    document.getElementById("newGroup").value = "";
}
// Tải dữ liệu từ localStorage
function loadData() {
    const storedData = localStorage.getItem("computers");
    if (storedData) {
        computers = JSON.parse(storedData);
    } else {
        computers = [
            
        ];
    }
    displayComputers();
}


// Hàm để hiển thị danh sách máy tính
function displayComputers() {
    const tbody = document.querySelector("#data-table tbody");
    tbody.innerHTML = ""; // Xóa dữ liệu cũ trong bảng

    computers.forEach((computer, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${computer.name}</td>
            <td>${computer.user}</td>
            <td id="pass-${index}" onclick="showPassword(${index})">${'*'.repeat(computer.pass.length)}</td>
            <td>${computer.line}</td>
            <td>${computer.group}</td>
            <td><button onclick="editItem(${index})">Chỉnh sửa</button></td>
            <td><button onclick="deleteItem(${index})">Xóa</button></td>
        `;
        tbody.appendChild(row);
    });
}

// Hàm tìm kiếm trong danh sách máy tính (tìm kiếm linh hoạt trên tất cả các trường)
function filterList() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const tbody = document.querySelector("#data-table tbody");
    tbody.innerHTML = ""; // Xóa dữ liệu cũ trong bảng

    // Tìm kiếm linh hoạt qua tất cả các trường (name, user, pass, line, group)
    const filteredComputers = computers.filter(computer => {
        return (
            computer.name.toLowerCase().includes(searchValue) ||
            computer.user.toLowerCase().includes(searchValue) ||
            computer.pass.toLowerCase().includes(searchValue) ||
            computer.line.toLowerCase().includes(searchValue) ||
            computer.group.toLowerCase().includes(searchValue)
        );
    });

    // Hiển thị các kết quả tìm kiếm
    filteredComputers.forEach((computer, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${computer.name}</td>
            <td>${computer.user}</td>
            <td id="pass-${index}" onclick="showPassword(${index})">${'*'.repeat(computer.pass.length)}</td>
            <td>${computer.line}</td>
            <td>${computer.group}</td>
            <td><button onclick="editItem(${index})">Chỉnh sửa</button></td>
            <td><button onclick="deleteItem(${index})">Xóa</button></td>
        `;
        tbody.appendChild(row);
    });

    // Nếu không có kết quả tìm kiếm, hiển thị thông báo
    if (filteredComputers.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = "<td colspan='7' style='text-align:center;'>Không tìm thấy kết quả</td>";
        tbody.appendChild(row);
    }
}

// Hàm hiển thị mật khẩu khi click vào cột "Pass"
function showPassword(index) {
    const passwordCell = document.getElementById(`pass-${index}`);

    // Hiển thị mật khẩu
    passwordCell.textContent = computers[index].pass;

    // Ẩn mật khẩu sau 5 giây
    setTimeout(function() {
        passwordCell.textContent = "*".repeat(computers[index].pass.length);  // Hiển thị dấu *
    }, 5000);  // 5000ms = 5 giây
}



// Hàm thêm một máy tính mới vào danh sách
function addItem() {
    const name = document.getElementById("newMachine").value;
    const user = document.getElementById("newUser").value;
    const pass = document.getElementById("newPass").value;
    const line = document.getElementById("newLine").value;
    const group = document.getElementById("newGroup").value;

    // Kiểm tra nếu dữ liệu không trống
    if (name && user && pass) {
        computers.push({ name, user, pass,line,group });
        displayComputers(); // Cập nhật lại bảng sau khi thêm
    } else {
        alert("Vui lòng điền đầy đủ thông tin.");
    }

    // Làm trống các trường nhập
    document.getElementById("newMachine").value = "";
    document.getElementById("newUser").value = "";
    document.getElementById("newPass").value = "";
    document.getElementById("newLine").value = "";
    document.getElementById("newGroup").value = "";
}

// Hàm xóa một máy tính khỏi danh sách
function deleteItem(index) {
    if (confirm("Bạn có chắc chắn muốn xóa?")) {
        computers.splice(index, 1);
        localStorage.setItem("computers", JSON.stringify(computers));  // Lưu lại sau khi xóa
        displayComputers();
    }
}


// Hàm chỉnh sửa một máy tính trong danh sách
function editItem(index) {
    const computer = computers[index];
    const newName = prompt("Nhập tên mới cho máy tính:", computer.name);
    const newUser = prompt("Nhập user mới:", computer.user);
    const newPass = prompt("Nhập mật khẩu mới:", computer.pass);
    const newLine = prompt("Nhập Line mới:", computer.line);
    const newGroup = prompt("Nhập Nhóm mới:", computer.group);

    if (newName && newUser && newPass && newLine && newGroup) {
        computers[index] = { name: newName, user: newUser, pass: newPass, line: newLine, group: newGroup };
        localStorage.setItem("computers", JSON.stringify(computers));  // Lưu lại sau khi chỉnh sửa
        displayComputers();
    }
}


function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "admin123") {
        document.querySelector(".login-form").style.display = "none";
        document.querySelector(".main-content").style.display = "block";
        loadData();  // Tải dữ liệu từ localStorage khi đăng nhập thành công
    } else {
        alert("Sai tên đăng nhập hoặc mật khẩu!");
    }
}

function backupLocalStorage() {
    const data = localStorage.getItem("computers");  // Lấy dữ liệu từ localStorage (trong trường hợp bạn lưu danh sách máy tính ở đó)
    
    if (data) {
        // Chuyển chuỗi JSON thành object JavaScript
        const computers = JSON.parse(data);
        
        // Chuyển object JavaScript thành chuỗi JSON để tải xuống dưới dạng file
        const blob = new Blob([JSON.stringify(computers, null, 2)], { type: "application/json" });
        
        // Tạo một URL tạm thời để tải file
        const url = URL.createObjectURL(blob);
        
        // Tạo thẻ anchor để tải file về
        const a = document.createElement("a");
        a.href = url;
        a.download = "computers_backup.json";  // Đặt tên file khi tải về
        document.body.appendChild(a);
        a.click();
        
        // Xóa thẻ anchor sau khi tải xong
        document.body.removeChild(a);
        
        // Giải phóng URL
        URL.revokeObjectURL(url);
        
        alert("Đã sao lưu dữ liệu thành công!");
    } else {
        alert("Không có dữ liệu để sao lưu!");
    }
}

