#!/usr/bin/env python3
"""
mk_superuser.py — Cross-platform PocketBase superuser creator
Works seamlessly on Linux, macOS, and Windows.
Usage:
    python mk_superuser.py <username_or_email> <password>
Examples:
    python mk_superuser.py admin password123
    python mk_superuser.py admin@buddyup.com password123
"""

import sys
import subprocess
import shutil

CONTAINER_NAME = "buddyup-pocketbase"

def print_usage():
    print("=" * 45)
    print("  BuddyUp — PocketBase Superuser Creator  ")
    print("=" * 45)
    print("Usage:")
    print("  python mk_superuser.py <username_or_email> <password>")
    print("\nExamples:")
    print("  python mk_superuser.py admin password123")
    print("  python mk_superuser.py admin@buddyup.com password123")
    print("=" * 45)

def main():
    if len(sys.argv) < 3:
        print_usage()
        sys.exit(1)

    username_or_email = sys.argv[1].strip()
    password = sys.argv[2]

    email = username_or_email
    if "@" not in email:
        email = f"{email}@buddyup.com"
        print(f"[i] Username formatted as email: {email}")

    if not shutil.which("docker"):
        print("[!] Error: 'docker' command not found. Please install Docker and ensure it is in your PATH.")
        sys.exit(1)

    # Check if container is running
    ps_proc = subprocess.run(
        ["docker", "ps", "--format", "{{.Names}}"],
        capture_output=True,
        text=True
    )
    if CONTAINER_NAME not in ps_proc.stdout:
        print(f"[!] Container '{CONTAINER_NAME}' is not running.")
        print("    Starting container with docker-compose up -d...")
        subprocess.run(["docker-compose", "up", "-d"])

    print(f"[*] Creating superuser '{email}' in container '{CONTAINER_NAME}'...")

    commands_to_try = [
        ["docker", "exec", CONTAINER_NAME, "/pocketbase", "superuser", "create", email, password, "--dir=/pb_data"],
        ["docker", "exec", CONTAINER_NAME, "pocketbase", "superuser", "create", email, password, "--dir=/pb_data"],
        ["docker", "exec", CONTAINER_NAME, "/pocketbase", "admin", "create", email, password, "--dir=/pb_data"],
        ["docker", "exec", CONTAINER_NAME, "pocketbase", "admin", "create", email, password, "--dir=/pb_data"],
    ]

    success = False
    last_error = ""

    for cmd in commands_to_try:
        proc = subprocess.run(cmd, capture_output=True, text=True)
        if proc.returncode == 0:
            success = True
            break
        else:
            last_error = proc.stderr or proc.stdout

    if success:
        print(f"[✓] Superuser '{email}' successfully created!")
        print("\nYou can now log in to the PocketBase Admin Panel at:")
        print("👉 http://localhost:8090/_/")
    else:
        print(f"[!] Failed to create superuser.\nDetails: {last_error}")
        print("Please ensure the container is healthy and the password has at least 8 characters.")
        sys.exit(1)

if __name__ == "__main__":
    main()
