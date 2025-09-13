#!/usr/bin/env python3
"""
Test server for PocketOption AI Signals Generator
Run this script to test the PWA locally
"""

import http.server
import socketserver
import ssl
import os
import sys
from pathlib import Path

# Configuration
PORT = 8000
HTTPS_PORT = 8443

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for PWA testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()
    
    def do_GET(self):
        # Serve index.html for root path
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

def create_self_signed_cert():
    """Create a self-signed certificate for HTTPS testing"""
    try:
        import subprocess
        
        # Create private key
        subprocess.run([
            'openssl', 'req', '-x509', '-newkey', 'rsa:4096', 
            '-keyout', 'key.pem', '-out', 'cert.pem', 
            '-days', '365', '-nodes', '-subj', 
            '/C=US/ST=State/L=City/O=PocketOptionSignals/CN=localhost'
        ], check=True, capture_output=True)
        
        print("✅ Self-signed certificate created")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Failed to create certificate. Install OpenSSL or use HTTP only.")
        return False

def start_http_server():
    """Start HTTP server"""
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"🌐 HTTP Server running at http://localhost:{PORT}")
        print("📱 Open this URL in Safari on your iPhone for PWA testing")
        print("⚠️  Note: Camera features require HTTPS")
        print("Press Ctrl+C to stop")
        httpd.serve_forever()

def start_https_server():
    """Start HTTPS server"""
    if not os.path.exists('cert.pem') or not os.path.exists('key.pem'):
        if not create_self_signed_cert():
            return start_http_server()
    
    with socketserver.TCPServer(("", HTTPS_PORT), CustomHTTPRequestHandler) as httpd:
        # Wrap socket with SSL
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.load_cert_chain('cert.pem', 'key.pem')
        httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
        
        print(f"🔒 HTTPS Server running at https://localhost:{HTTPS_PORT}")
        print("📱 Open this URL in Safari on your iPhone for full PWA testing")
        print("⚠️  You may need to accept the self-signed certificate")
        print("Press Ctrl+C to stop")
        httpd.serve_forever()

def main():
    print("🚀 PocketOption AI Signals Generator - Test Server")
    print("=" * 60)
    
    # Change to project directory
    project_dir = Path(__file__).parent
    os.chdir(project_dir)
    
    print("📁 Project directory:", project_dir)
    print("📄 Files found:")
    for file in sorted(project_dir.glob('*')):
        if file.is_file():
            print(f"   - {file.name}")
    
    print("\n" + "=" * 60)
    
    if len(sys.argv) > 1 and sys.argv[1] == '--https':
        start_https_server()
    else:
        start_http_server()

if __name__ == "__main__":
    main()
