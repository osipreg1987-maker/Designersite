"""
Cyber-Conversion Portfolio — Local Development Server
=====================================================
Простой HTTP-сервер для локальной разработки.
Отдаёт index.html и раздаёт статические файлы.

Запуск: python server.py
Адрес: http://localhost:8080
"""

import http.server
import os
import sys

PORT = 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


class PortfolioHandler(http.server.SimpleHTTPRequestHandler):
    """Кастомный обработчик запросов."""

    def do_GET(self):
        # Корневой URL → отдаём index.html из templates/
        if self.path == '/' or self.path == '/index.html':
            self.path = '/templates/index.html'
        # Все остальные запросы — как обычно (static/)
        return super().do_GET()

    def end_headers(self):
        # CORS и кэширование для разработки
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def log_message(self, format, *args):
        """Красивый лог запросов."""
        sys.stdout.write(
            f"  ⚡ {self.address_string()} — {format % args}\n"
        )


def run():
    os.chdir(BASE_DIR)
    with http.server.HTTPServer(('', PORT), PortfolioHandler) as httpd:
        print(f"""
╔══════════════════════════════════════════════╗
║   🚀 Cyber-Conversion Portfolio Server       ║
║   ────────────────────────────────────────   ║
║   URL:  http://localhost:{PORT}               ║
║   Dir:  {BASE_DIR[:40]}   ║
║   ────────────────────────────────────────   ║
║   Ctrl+C для остановки                       ║
╚══════════════════════════════════════════════╝
        """)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  🛑 Сервер остановлен.")
            httpd.server_close()


if __name__ == '__main__':
    run()
