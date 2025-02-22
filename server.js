const express = require('express');
const puppeteer = require('puppeteer');

// Khởi tạo ứng dụng Express
const app = express();
const PORT = 8080;

// Route để lấy dữ liệu từ trang web yêu cầu đăng nhập
app.get('/scrape', async (req, res) => {
    let browser;
    try {
        const url = req.query.url; // Lấy URL từ query parameter

        // Kiểm tra URL hợp lệ
        if (!url || !url.startsWith('http')) {
            return res.status(400).send('URL không hợp lệ');
        }

        console.log('Đang khởi động Puppeteer...');
        browser = await puppeteer.launch({ headless: true }); // Chạy ở chế độ không có giao diện
        const page = await browser.newPage();

        // Điều hướng đến trang đăng nhập
        const loginUrl = 'http://192.168.10.1:8080/lws/LwsInitialize.do'; // Thay bằng URL đăng nhập thực tế
        console.log('Đang truy cập trang đăng nhập:', loginUrl);
        await page.goto(loginUrl, { waitUntil: 'networkidle2', timeout: 60000 });

        // Điền thông tin đăng nhập và submit form
        console.log('Đang đăng nhập...');
        await page.type('input[name="userid"]', 'pfsc'); // Điền tên đăng nhập
        await page.type('input[name="password"]', '1qaz2wsx'); // Điền mật khẩu
        await page.click('input[name="btnLogin"]'); // Nhấn nút đăng nhập

        // Đợi cho đến khi đăng nhập thành công và chuyển hướng
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });

        // Truy cập trang cần lấy dữ liệu
        console.log('Đang truy cập URL:', url);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Lấy dữ liệu từ trang web
        console.log('Đang lấy dữ liệu từ trang web...');
        const data = await page.evaluate(() => {
            const cells = [];
            document.querySelectorAll('.tabulator-cell').forEach(cell => {
                cells.push({
                    text: cell.innerText.trim(),
                    field: cell.getAttribute('tabulator-field') || 'N/A',
                });
            });
            return cells;
        });

        console.log('Dữ liệu đã được trích xuất:', data);
        await browser.close();

        // Trả về dữ liệu dưới dạng JSON
        res.json(data);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
        if (browser) await browser.close(); // Đóng trình duyệt nếu có lỗi
        res.status(500).send(`Đã xảy ra lỗi: ${error.message}`);
    }
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});