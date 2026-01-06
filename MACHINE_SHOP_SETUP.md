# Small Machine Shop ERPNext Setup & Workflow Guide

This guide is designed for a small machine shop (5-10 users) looking to document workflow, track jobs, and manage shop floor operations using ERPNext.

## 1. Introduction
ERPNext is a comprehensive open-source ERP. While it contains modules for everything from Accounting to HR, it is highly modular in usage. For a machine shop, you can focus strictly on the **Manufacturing** capabilities (Job Cards, Work Orders, BOMs) while ignoring the rest.

## 2. Tech Stack & Architecture
ERPNext is a "Monolith" application, meaning all modules are part of the same codebase, but you can turn them on/off via configuration.

### The Stack
*   **Backend Framework:** [Frappe Framework](https://frappeframework.com) (Python). It handles the database, API, and background jobs.
*   **Database:** **MariaDB** (MySQL compatible). This is where all your data (BOMs, Operations, Logs) lives.
*   **Caching:** **Redis**. Used for caching and background job queuing.
*   **Frontend:** HTML/JS (Jinja templates + proprietary "Desk" UI).
*   **Real-time:** Socket.io (Node.js) for real-time updates.

### Is it Flexible?
**Yes.** ERPNext is metadata-driven.
*   **Do not edit the code directly.** This breaks updates.
*   **Use "Customize Form":** Add fields (e.g., "Machine Setup Time") directly in the UI.
*   **Use "Server Scripts" / "Client Scripts":** Write small Python or JS snippets in the UI to add logic (e.g., "Validation: Don't allow starting Job Card if material is missing").
*   This allows you to change the system without breaking the ability to update.

## 3. Functionality & Modules
You asked: *"What functionality can I use as modules if I don't end up needing the whole app?"*

ERPNext is installed as a whole, but you configure it to **act** small.
1.  **Domain Settings:** On first setup, select **"Manufacturing"** as your domain. This hides unrelated modules like HR, Education, Healthcare, etc.
2.  **Show/Hide Modules:** You can go to "Show/Hide Modules" in the settings to further disable things like "CRM" or "Selling" if you don't use them.

### Core Modules for You:
*   **Manufacturing:** Work Orders, Job Cards, Bill of Materials (BOM), Routings.
*   **Stock:** Items (Raw Materials, Tools, Finished Goods), Warehouses (Shop Floor, Store). *Required dependency for Manufacturing.*
*   **Setup:** Users, Roles, Permissions.

## 4. Licensing
**License:** GNU General Public License v3 (GPLv3).
*   **Cost:** Free (Open Source).
*   **Usage:** You can install it on your local server and use it for your business for free.
*   **Restrictions:** If you modify the *source code* and *distribute* it (sell the software), you must release your source code. For internal use, you can modify it however you like without sharing code.

## 5. Workflow Guide: Machine Shop
Here is how to set up your workflow.

### Step 1: Define Your Shop (Setup)
1.  **Workstations:** Create a "Workstation" for every machine (e.g., "CNC Mill 1", "Lathe A", "Assembly Bench").
    *   *Tip:* Set "Hour Rate" here to track costs later.
2.  **Operations:** Define the *types* of work (e.g., "Milling", "Turning", "QC", "Deburring").
3.  **Routings (Optional but Recommended):** Create a template for standard parts (e.g., "Part A Routing" = Milling -> Deburring -> QC).

### Step 2: Define Items
Even if you don't track inventory counts strictly, you need "Items" to put on a Work Order.
1.  **Create Items:** "6061 Aluminum Block" (Raw Material), "Finished Widget" (Product).

### Step 3: The Job Workflow
1.  **Bill of Materials (BOM):**
    *   Create a BOM for "Finished Widget".
    *   List "6061 Aluminum Block" as Input.
    *   List Operations: "Milling" on "CNC Mill 1" (30 mins), "Deburring" on "Bench" (10 mins).
2.  **Work Order (The "Traveler"):**
    *   Create a Work Order to make 10x "Finished Widgets".
    *   ERPNext pulls in the BOM and Operations.
    *   Submit the Work Order.
3.  **Job Cards (The Worker's View):**
    *   The system automatically creates "Job Cards" for each operation.
    *   Worker logs into a dedicated "Job Card" view (can be a tablet/PC at the station).
    *   Worker clicks **"Start Job"** (Timer starts).
    *   Worker clicks **"Complete Job"** (Enters quantity made).
4.  **Result:** You have a digital log of who did what, on which machine, and how long it took.

## 6. Hosting & Installation (Local Server)
For a small shop with a "Typical PC" and a frontend engineer, **Docker** is the best approach. It keeps your PC clean and is easy to restart/update.

### Option A: Local Server (Docker) - Recommended
*Best for: Windows/Mac/Linux PC on the LAN.*

**Prerequisites:**
*   Install **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux).
*   Install **Git**.

**Setup Steps:**
1.  **Clone the Docker Repo:**
    ```bash
    git clone https://github.com/frappe/frappe_docker
    cd frappe_docker
    ```
2.  **Start the Server:**
    We will use the "Pwd" (Play with Docker) setup for a quick start, or the standard compose.
    ```bash
    # This downloads detailed images and starts MariaDB, Redis, and ERPNext
    docker compose -f pwd.yml up -d
    ```
3.  **Access:**
    *   Open `http://localhost:8080` in your browser.
    *   Default User: `Administrator`
    *   Default Pass: `admin`
4.  **Network Access:**
    *   Find your PC's Local IP (e.g., `192.168.1.50`).
    *   Other computers in the shop can access `http://192.168.1.50:8080`.

### Option B: Dedicated Server (Cloud)
*Best for: Remote access, backups managed by provider.*

1.  **Provider:** DigitalOcean, Hetzner, or Linode. (~$20-40/mo).
2.  **OS:** Ubuntu 22.04 LTS.
3.  **Install:** SSH into the server and run the "Easy Install" script:
    ```bash
    # (Example command, check official docs for latest)
    wget https://raw.githubusercontent.com/frappe/bench/develop/install.py
    python3 install.py --production --user frappe
    ```

## 7. Summary
*   **Hardware:** A decent PC (i5/i7, 16GB RAM) is fine for 5-10 users.
*   **Software:** Use Docker for the easiest maintenance.
*   **Focus:** Use "Manufacturing" Domain. Ignore the rest.
*   **Flexibility:** Use "Customize Form" to adapt it to your specific data needs.
