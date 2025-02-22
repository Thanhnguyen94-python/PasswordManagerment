import "https://cdn.jsdelivr.net/npm/qrcode@1.4.4/build/qrcode.min.js";

// Dữ liệu mẫu in, giờ là mảng để lưu nhiều thiết bị
let formDataList = [];

/**
 * Khởi tạo các sự kiện cho mẫu in
 */
function initializePrintFormEvents() {
    document.getElementById("fileInput").addEventListener("change", handleFileInput);
    document.getElementById("updateFormButton").addEventListener("click", updateForm);
    document.getElementById("printFormButton").addEventListener("click", printForm);
}

/**
 * Xử lý khi người dùng chọn tệp .txt hoặc .csv
 * @param {Event} e - Sự kiện change từ input file
 */
function handleFileInput(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const content = event.target.result;
        file.name.endsWith('.txt') ? parseTxt(content) : parseCsv(content);
        updateFormDisplay();
    };
    reader.readAsText(file);
}

/**
 * Phân tích tệp .txt chứa nhiều thiết bị
 * @param {string} content - Nội dung tệp .txt
 */
function parseTxt(content) {
    formDataList = [];
    const devices = content.split('---').filter(d => d.trim());
    devices.forEach(device => {
        const lines = device.split('\n').filter(line => line.trim());
        let deviceData = { deviceName: '', entryDate: '', department: '', location: '', deviceCode: '' };
        lines.forEach(line => {
            const [key, value] = line.split(':').map(part => part.trim());
            if (key === 'Tên thiết bị') deviceData.deviceName = value;
            if (key === 'Ngày nhập') deviceData.entryDate = value;
            if (key === 'Bộ phận quản lý') deviceData.department = value;
            if (key === 'Vị trí hiện tại') deviceData.location = value;
            if (key === 'Mã quản lý') deviceData.deviceCode = value;
        });
        formDataList.push(deviceData);
    });
}

/**
 * Phân tích tệp .csv chứa nhiều thiết bị
 * @param {string} content - Nội dung tệp .csv
 */
function parseCsv(content) {
    formDataList = [];
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        let deviceData = {
            deviceName: values[headers.indexOf('Tên thiết bị')] || '',
            entryDate: values[headers.indexOf('Ngày nhập')] || '',
            department: values[headers.indexOf('Bộ phận quản lý')] || '',
            location: values[headers.indexOf('Vị trí hiện tại')] || '',
            deviceCode: values[headers.indexOf('Mã quản lý')] || ''
        };
        formDataList.push(deviceData);
    }
}

/**
 * Cập nhật dữ liệu mẫu từ các trường nhập tay (chỉ áp dụng cho thiết bị đầu tiên)
 */
function updateForm() {
    if (formDataList.length === 0) formDataList.push({ deviceName: '', entryDate: '', department: '', location: '', deviceCode: '' });
    formDataList[0].deviceName = document.getElementById('deviceNameInput').value || formDataList[0].deviceName;
    formDataList[0].entryDate = document.getElementById('entryDateInput').value || formDataList[0].entryDate;
    formDataList[0].department = document.getElementById('departmentInput').value || formDataList[0].department;
    formDataList[0].location = document.getElementById('locationInput').value || formDataList[0].location;
    formDataList[0].deviceCode = document.getElementById('deviceCodeInput').value || formDataList[0].deviceCode;
    updateFormDisplay();
}

/**
 * Cập nhật giao diện mẫu in với nhiều thiết bị
 */
function updateFormDisplay() {
    const formOutput = document.getElementById('formOutput');
    formOutput.innerHTML = '';
    formDataList.forEach((data, index) => {
        const template = document.createElement('div');
        template.className = 'form-template';
        template.innerHTML = `
            <div class="header">
                <img src="https://github.com/Thanhnguyen94-python/PasswordManagerment/blob/master/logo.JPG" alt="Logo" class="logo">
                <h1>CÔNG TY ABC</h1>
            </div>
            <hr class="header-divider">
            <div class="form-content">
                <div class="device-info">
                    <div class="field-box">
                        <span class="field-label">Tên thiết bị:</span>
                        <span class="field-value">${data.deviceName}</span>
                    </div>
                    <div class="field-box">
                        <span class="field-label">Ngày nhập:</span>
                        <span class="field-value">${data.entryDate}</span>
                    </div>
                    <div class="field-box">
                        <span class="field-label">Bộ phận quản lý:</span>
                        <span class="field-value">${data.department}</span>
                    </div>
                    <div class="field-box">
                        <span class="field-label">Vị trí hiện tại:</span>
                        <span class="field-value">${data.location}</span>
                    </div>
                </div>
                <div class="qr-section">
                    <div class="field-box">
                        <span class="field-label">Mã quản lý:</span>
                        <span class="field-value">${data.deviceCode}</span>
                    </div>
                    <div id="qrCode-${index}" class="qr-container"></div>
                </div>
            </div>
        `;
        formOutput.appendChild(template);
        generateQRCode(data.deviceCode, index);
    });
}

/**
 * Tạo mã QR cho thiết bị
 * @param {string} code - Mã quản lý thiết bị
 * @param {number} index - Chỉ số của thiết bị để gắn QR vào đúng vị trí
 */
function generateQRCode(code, index) {
    const qrCodeDiv = document.getElementById(`qrCode-${index}`);
    qrCodeDiv.innerHTML = '';
    if (code) {
        QRCode.toCanvas(code, { width: 80 }, (err, canvas) => { // Giảm từ 100px xuống 80px
            if (err) console.error(err);
            qrCodeDiv.appendChild(canvas);
        });
    }
}

/**
 * In tất cả các mẫu thiết bị trên cùng trang A4
 */
function printForm() {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>In mẫu thiết bị</title>
            <script src="https://cdn.jsdelivr.net/npm/qrcode@1.4.4/build/qrcode.min.js"></script>
            <style>
                body {
                    margin: 0;
                    padding: 10px; /* Lề nhỏ cho trang */
                    font-family: Arial, sans-serif;
                }
                .form-container {
                    width: 100%;
                    max-width: 794px; /* Chiều ngang A4 */
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px; /* Khoảng cách giữa các mẫu */
                }
                .form-template {
                    padding: 10px;
                    border: 2px solid #000;
                    background: #fff;
                    width: 370px; /* Chiều rộng mỗi mẫu */
                    position: relative;
                    box-sizing: border-box;
                    margin-bottom: 0; /* Không cần margin vì dùng gap */
                }
                .form-template::after {
                    content: '';
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    right: 2px;
                    bottom: 2px;
                    border: 1px solid #999;
                    border-radius: 3px;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 5px;
                }
                .header h1 {
                    font-size: 16px;
                    color: #3498db;
                    text-transform: uppercase;
                    margin: 0;
                    flex-grow: 1;
                    text-align: center;
                }
                .logo {
                    width: 50px;
                    height: auto;
                    border-radius: 5px;
                }
                .header-divider {
                    border: none;
                    border-top: 1px solid #333;
                    margin: 3px 0;
                }
                .form-content {
                    display: flex;
                    justify-content: space-between;
                    margin: 5px 0;
                }
                .device-info {
                    width: 60%;
                }
                .qr-section {
                    width: 35%;
                    text-align: center;
                }
                .field-box {
                    display: flex;
                    align-items: center;
                    border: 1px solid #333;
                    border-radius: 5px;
                    margin-bottom: 3px;
                    padding: 3px;
                    background: #f9f9f9;
                }
                .field-label {
                    font-weight: bold;
                    width: 80px;
                    color: #2c3e50;
                    border-right: 1px solid #ccc;
                    padding-right: 3px;
                    margin-right: 3px;
                }
                .field-value {
                    flex: 1;
                    padding-left: 3px;
                    color: #333;
                }
                .qr-container {
                    border: 1px solid #333;
                    border-radius: 5px;
                    padding: 3px;
                    display: inline-block;
                    margin-top: 3px;
                    background: #fff;
                }
                .qr-container canvas {
                    width: 80px !important;
                    height: 80px !important;
                }
                @media print {
                    .form-container {
                        page-break-inside: avoid; /* Tránh ngắt giữa các mẫu */
                    }
                    .form-template {
                        break-inside: avoid; /* Đảm bảo mẫu không bị cắt đôi */
                    }
                }
            </style>
        </head>
        <body>
            <div class="form-container">
    `);

    formDataList.forEach((data, index) => {
        printWindow.document.write(`
            <div class="form-template">
                <div class="header">
                    <img src="https://github.com/Thanhnguyen94-python/PasswordManagerment/blob/master/logo.JPG" alt="Logo" class="logo">
                    <h1>CÔNG TY ABC</h1>
                </div>
                <hr class="header-divider">
                <div class="form-content">
                    <div class="device-info">
                        <div class="field-box">
                            <span class="field-label">Tên thiết bị:</span>
                            <span class="field-value">${data.deviceName}</span>
                        </div>
                        <div class="field-box">
                            <span class="field-label">Ngày nhập:</span>
                            <span class="field-value">${data.entryDate}</span>
                        </div>
                        <div class="field-box">
                            <span class="field-label">Bộ phận quản lý:</span>
                            <span class="field-value">${data.department}</span>
                        </div>
                        <div class="field-box">
                            <span class="field-label">Vị trí hiện tại:</span>
                            <span class="field-value">${data.location}</span>
                        </div>
                    </div>
                    <div class="qr-section">
                        <div class="field-box">
                            <span class="field-label">Mã quản lý:</span>
                            <span class="field-value">${data.deviceCode}</span>
                        </div>
                        <div id="qrCode-${index}" class="qr-container"></div>
                    </div>
                </div>
            </div>
        `);
    });

    printWindow.document.write(`
            </div>
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                ${formDataList.map((data, index) => `
                    if ("${data.deviceCode}") {
                        QRCode.toCanvas("${data.deviceCode}", { width: 80 }, (err, canvas) => {
                            if (err) console.error(err);
                            document.getElementById('qrCode-${index}').appendChild(canvas);
                        });
                    }
                `).join('')}
                setTimeout(() => {
                    window.print();
                    window.close();
                }, 1000);
            });
        </script>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
}

export { initializePrintFormEvents, updateForm, printForm };