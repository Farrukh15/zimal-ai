#!/usr/bin/env python3
"""
Zimal AI — Landing Page Server
A simple, fast HTTP server to preview the Zimal AI landing page locally.

Usage:
    python app.py           # Serves on http://localhost:8000
    python app.py 8080      # Serves on custom port

Features:
    - Serves static files (HTML, CSS, JS, images)
    - Auto-opens browser on startup
    - Handles common MIME types
    - Logs requests to console
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path

# Configuration
HOST = "localhost"
DEFAULT_PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class ZimalHandler(http.server.SimpleHTTPRequestHandler):
    """Custom request handler with proper MIME types and logging."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        """Custom log format with colors."""
        print(f"  [SERVER] {self.address_string()} - {format % args}")

    def end_headers(self):
        """Add caching headers for performance."""
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def guess_type(self, path):
        """Enhanced MIME type guessing."""
        ext = Path(path).suffix.lower()
        mime_types = {
            '.html': 'text/html',
            '.htm': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf',
            '.eot': 'application/vnd.ms-fontobject',
        }
        return mime_types.get(ext, super().guess_type(path))


def print_banner(port):
    """Print a nice startup banner."""
    banner = f"""
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║     ⚡ ZIMAL AI — Landing Page Server                        ║
    ║                                                              ║
    ║     📁 Serving from: {DIRECTORY:<36}   ║
    ║     🌐 URL: http://{HOST}:{port:<47}   ║
    ║                                                              ║
    ║     Press Ctrl+C to stop the server                          ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    """
    print(banner)


def main():
    """Main entry point."""
    # Parse port from command line
    port = DEFAULT_PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"  [ERROR] Invalid port: {sys.argv[1]}. Using default port {DEFAULT_PORT}.")

    # Ensure we're in the right directory
    os.chdir(DIRECTORY)

    # Check if index.html exists
    if not os.path.exists("index.html"):
        print(f"  [WARNING] index.html not found in {DIRECTORY}")
        print(f"  [WARNING] Make sure you're running this from the project root.")

    # Create and start server
    with socketserver.TCPServer((HOST, port), ZimalHandler) as httpd:
        print_banner(port)

        # Try to open browser automatically
        try:
            url = f"http://{HOST}:{port}"
            print(f"  [INFO] Opening browser...")
            webbrowser.open(url, new=2)  # new=2 opens in new tab
        except Exception as e:
            print(f"  [INFO] Could not open browser automatically: {e}")

        print(f"  [INFO] Server running. Waiting for requests...\n")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  [INFO] Server stopped by user.")
            httpd.shutdown()


if __name__ == "__main__":
    main()
