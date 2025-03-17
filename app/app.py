from PyQt5.QtWidgets import QApplication,QScrollArea,QLineEdit, QRubberBand, QWidget, QVBoxLayout, QLabel, QPushButton, QDialog, QComboBox, QFormLayout, QMessageBox
from PyQt5.QtGui import QMouseEvent
from PyQt5.QtCore import Qt, QPoint, QRect
import sys
import keyboard
import requests

# Khởi tạo danh sách để lưu trữ kết quả API
api_results = []  # Lưu kết quả trả về từ API
api_key=None
api_url = None  # Lưu trữ API URL từ Google Sheet
flag=True
url_server = "https://dc00-2402-800-6205-a6e9-6828-4090-95e2-1d20.ngrok-free.app"
# Phím tắt mặc định
shortcuts = {
    "capture": "Ctrl + Shift + C",
    "send_api": "Ctrl + Shift + A",
    "show_results": "Ctrl + Shift + R",
    "open_settings": "Ctrl + Shift + O",
    "stop_program": "Ctrl + Shift + Q"
}

class Capture(QWidget):
    def __init__(self):
        super().__init__()
        self.setMouseTracking(True)
        screen = QApplication.primaryScreen()
        rect = screen.geometry()
        self.setGeometry(rect)
        self.setWindowFlags(self.windowFlags() | Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint)
        self.setWindowOpacity(0.15)

        self.rubber_band = QRubberBand(QRubberBand.Rectangle, self)
        self.origin = QPoint()

        QApplication.setOverrideCursor(Qt.CrossCursor)

        self.imgmap = screen.grabWindow(0, rect.x(), rect.y(), rect.width(), rect.height())

    def mousePressEvent(self, event: QMouseEvent):
        if event.button() == Qt.LeftButton:
            self.origin = event.pos()
            self.rubber_band.setGeometry(QRect(self.origin, event.pos()).normalized())
            self.rubber_band.show()

    def mouseMoveEvent(self, event: QMouseEvent):
        if not self.origin.isNull():
            self.rubber_band.setGeometry(QRect(self.origin, event.pos()).normalized())

    def mouseReleaseEvent(self, event: QMouseEvent):
        if event.button() == Qt.LeftButton:
            self.rubber_band.hide()
            rect = self.rubber_band.geometry()
            self.imgmap = self.imgmap.copy(rect)
            QApplication.restoreOverrideCursor()

            self.imgmap.save("capture.png")
            self.close()

            # Gửi hình ảnh đến API
            send_image_to_api("capture.png")

class ResultDialog(QDialog):
    def __init__(self, results):
        super().__init__()
        self.setWindowTitle("Kết Quả API")
        self.setGeometry(200, 200, 500, 300)
        main_layout = QVBoxLayout()
        content_widget = QWidget()
        content_layout = QVBoxLayout()
        for idx, result in enumerate(results, 1):
            question_label = QLabel(f"Câu hỏi {idx}: {result['answer']}")
            question_label.setWordWrap(True)
            content_layout.addWidget(question_label)
        content_widget.setLayout(content_layout)
        scroll_area = QScrollArea()
        scroll_area.setWidgetResizable(True)
        scroll_area.setWidget(content_widget)
        main_layout.addWidget(scroll_area)
        self.close_button = QPushButton("Đóng")
        self.close_button.clicked.connect(self.close)
        main_layout.addWidget(self.close_button)
        self.setLayout(main_layout)


class ShortcutSettingsDialog(QDialog):
    
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Cài đặt phím tắt")
        self.resize(400, 400)

        self.layout = QFormLayout()
        self.api_key_input = QLineEdit()
        self.api_key_input.setPlaceholderText("Nhập API Key")
        self.api_key_input.setText(api_key)
        
        self.layout.addRow("API Key:", self.api_key_input)

        self.capture_combo = QComboBox()
        self.capture_combo.addItems(["Ctrl + Shift + C", "Ctrl + Alt + C", "C"])
        self.capture_combo.setCurrentText(shortcuts["capture"])

        self.show_results_combo = QComboBox()
        self.show_results_combo.addItems(["Ctrl + Shift + R", "Ctrl + Alt + R", "R"])
        self.show_results_combo.setCurrentText(shortcuts["show_results"])

        self.open_settings_combo = QComboBox()
        self.open_settings_combo.addItems(["Ctrl + Shift + O", "Ctrl + Alt + O", "O"])
        self.open_settings_combo.setCurrentText(shortcuts["open_settings"])

        self.stop_program_combo = QComboBox()
        self.stop_program_combo.addItems(["Ctrl + Shift + Q", "Ctrl + Alt + Q", "Q"])
        self.stop_program_combo.setCurrentText(shortcuts["stop_program"])

        self.layout.addRow("Phím chụp màn hình:", self.capture_combo)
        self.layout.addRow("Phím hiển thị kết quả:", self.show_results_combo)
        self.layout.addRow("Phím mở cài đặt:", self.open_settings_combo)
        self.layout.addRow("Phím dừng chương trình:", self.stop_program_combo)

        self.save_button = QPushButton("Lưu")
        self.save_button.clicked.connect(self.save_settings)
        self.layout.addWidget(self.save_button)

        self.exit_button = QPushButton("Thoát ứng dụng")
        self.exit_button.clicked.connect(self.exit_application)
        self.layout.addWidget(self.exit_button)

        self.setLayout(self.layout)

    def save_settings(self):
        """Kiểm tra API key trước khi lưu cài đặt"""
        global api_key, url_server

        api_key = self.api_key_input.text().strip()
        if not api_key:
            QMessageBox.warning(self, "Lỗi", "Vui lòng nhập API Key trước khi lưu.")
            return

        url = url_server + "/api/checkapikey"
        data = {"apiKey": api_key}

        try:
            response = requests.post(url, json=data)
            response_data = response.json()

            if response.status_code != 200 or not response_data.get("success"):
                QMessageBox.warning(self, "Lỗi", "API Key không hợp lệ hoặc đã hết hạn.")
                return  # Không lưu cài đặt nếu API key không hợp lệ

        except requests.exceptions.RequestException as e:
            QMessageBox.critical(self, "Lỗi kết nối", f"Không thể kết nối đến server.\nLỗi: {str(e)}")
            return  # Không lưu cài đặt nếu có lỗi kết nối

        # Nếu API key hợp lệ, lưu cài đặt
        shortcuts["capture"] = self.capture_combo.currentText()
        shortcuts["show_results"] = self.show_results_combo.currentText()
        shortcuts["open_settings"] = self.open_settings_combo.currentText()
        shortcuts["stop_program"] = self.stop_program_combo.currentText()
        # Đăng ký lại phím tắt sau khi lưu
        try:
            keyboard.unhook_all()  # Hủy tất cả phím tắt cũ
            register_shortcuts()  # Đăng ký lại các phím tắt mới
            print("Phím tắt đã được cập nhật:", shortcuts)
        except Exception as e:
            QMessageBox.warning(self, "Lỗi", f"Không thể đăng ký phím tắt: {str(e)}")
            return
        QMessageBox.information(self, "Thành công", "Cài đặt đã được lưu và API Key hợp lệ!")
        self.close()

    def exit_application(self):
        print("Thoát ứng dụng.")
        sys.exit()

def send_image_to_api(image_path):
    global api_url, flag  # Cần khai báo global để thay đổi giá trị
    if not flag:
        print("⏳ Đang xử lý ảnh trước đó, vui lòng chờ...")
        return

    flag = False  # Ngăn người dùng thao tác tiếp khi đang gửi API

    if not api_url:
        print("API URL chưa có, đang lấy lại từ server...")
        api_url = get_api_url_from_server()
        if not api_url:
            print("Không thể lấy API URL. Hủy gửi ảnh.")
            flag = True  # Cho phép chụp lại nếu lỗi
            return

    try:
        print("🚀 Đang gửi ảnh đến API...")
        data = {'api_key': api_key}
        with open(image_path, 'rb') as image_file:
            files = {'image': image_file}
            response = requests.post(api_url, data=data, files=files)
            response.raise_for_status()
            result = response.json()
            api_results.append(result)
            print(f"✅ Ảnh đã gửi thành công: {result}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Lỗi khi gửi ảnh: {e}")
        QMessageBox.warning(None, "Lỗi", "Có lỗi xảy ra khi gửi ảnh đến API!")
    finally:
        flag = True  # Luôn đặt lại `flag=True` để tiếp tục thao tác sau khi gửi xong



# Hàm lấy API URL từ Google Sheet
def get_api_url_from_server():
    global api_url
    if api_url is not None:
        return api_url  # Nếu đã có, không gọi lại API
    
    try:
        google_sheet_api = url_server + "/api/server/available?model_type=gpt-4o-mini"
        response = requests.get(google_sheet_api)
        response.raise_for_status()
        data = response.json()
        api_url = data["data"]["server_url"] + "/upload"
        print(f"API URL nhận được từ Server: {api_url}")
    except requests.exceptions.RequestException as e:
        print(f"Lỗi khi lấy URL từ Server: {e}")
        api_url = None
    
    return api_url

def show_capture_interface():
    global flag
    if flag:
        print("📸 Bắt đầu chụp màn hình...")
        app = QApplication.instance() or QApplication(sys.argv)
        capture = Capture()
        capture.show()
        app.exec_()
    else:
        QMessageBox.warning(None, "Chờ chút!!", "🚀 Đang xử lý ảnh trước đó, vui lòng chờ rồi thử lại.")

def show_results():
    # Khởi tạo QApplication nếu chưa có
    app = QApplication.instance()
    if app is None:
        app = QApplication(sys.argv)

    if not api_results:
        print("Không có kết quả để hiển thị.")
        QMessageBox.warning(None, "Không có kết quả", "Không có kết quả nào để hiển thị.")
        return

    dialog = ResultDialog(api_results)
    dialog.exec_()

def open_shortcut_settings():
    app = QApplication.instance() or QApplication(sys.argv)
    dialog = ShortcutSettingsDialog()
    dialog.exec_()

def stop_program():
    print("Chương trình đã dừng.")
    sys.exit()

def convert_shortcut_to_keyboard_format(shortcut):
    shortcut = shortcut.lower()
    shortcut = shortcut.replace("ctrl", "control")
    shortcut = shortcut.replace(" + ", "+")
    return shortcut

def register_shortcuts():
    try:
        keyboard.unhook_all()
        keyboard.add_hotkey(convert_shortcut_to_keyboard_format(shortcuts["capture"]), show_capture_interface)
        keyboard.add_hotkey(convert_shortcut_to_keyboard_format(shortcuts["show_results"]), show_results)
        keyboard.add_hotkey(convert_shortcut_to_keyboard_format(shortcuts["open_settings"]), open_shortcut_settings)
        keyboard.add_hotkey(convert_shortcut_to_keyboard_format(shortcuts["stop_program"]), stop_program)
        print("Phím tắt đã được đăng ký:", shortcuts)
    except Exception as e:
        print(f"Lỗi khi đăng ký phím tắt: {e}")

if __name__ == "__main__":
    print("Chương trình đang chạy nền.")
    api_url = get_api_url_from_server()
    open_shortcut_settings()
    keyboard.wait()
