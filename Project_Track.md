You have already generated a working full-stack ARBDE (Adaptive Rule-Based Decision Engine) application using React (frontend) and Node.js (backend). Now enhance and fix the system with the following improvements.

IMPORTANT:

* Do NOT break existing functionality
* Make incremental changes only
* Ensure everything works locally before suggesting GitHub push
* The system runs on Windows (Node.js + npm environment)

---

## 🎯 1. NODE MANAGEMENT (CRITICAL FIX)

Implement full node control:

* Allow deleting nodes:

  * Press "Delete" key when node is selected
  * Right-click context menu → Delete
  * Small delete (❌) icon on node

* Allow renaming nodes (editable title)

* Allow duplicating nodes

* Ensure deleting a node also removes its edges

---

## 🔗 2. CONNECTION VALIDATION

Restrict invalid connections:

Allowed:

* Request → Decision / Expression / Function / Decision Table
* Decision / Expression / Function / Decision Table → Response

Disallowed:

* Response → anything
* Random invalid links

If invalid connection:

* Prevent connection
* Show error toast/message

---

## ⚙️ 3. MAKE NODES FUNCTIONAL

### 🟦 Expression Node

Purpose: Transform input data

* Allow user to write JS expression

* Example:
  input.company.turnover > 1000000 ? "High" : "Low"

* Output should be added to flow data

---

### 🟨 Function Node

Purpose: Custom logic execution

* Allow user to define JS function body

* Execute safely (use Function constructor or sandbox)

* Example:
  return input.company.turnover * 0.18;

* Output stored in flow

---

### 🟩 Decision Node

Purpose: Conditional branching

* Allow condition input

* Example:
  input.company.country === "US"

* Output:
  true → next node A
  false → next node B

---

## 💾 4. LOCAL STORAGE PERSISTENCE (NO DATABASE)

Implement auto-save using localStorage:

Save:

* nodes
* edges
* request JSON

Key: "arbde_flow"

On every change:
localStorage.setItem("arbde_flow", JSON.stringify({ nodes, edges, request }))

On app load:

* Restore state if exists

Also:

* Add "Clear Flow" button (clears localStorage)

---

## 🧾 5. LOGS PANEL (DEBUG FEATURE)

Add a Logs panel below or beside Response panel.

Show execution steps:

* Node executed
* Expression result
* Decision result (true/false)

Example:
[Request] received
[Decision Node] condition true
[Expression Node] result = "High"

---

## 🎨 6. UI ENHANCEMENTS

* Color code nodes:
  Request → Purple
  Decision → Green
  Function → Yellow
  Expression → Blue
  Response → Gray

* Add tooltips on hover for each node

* Improve spacing and alignment

---

## 📊 7. DECISION TABLE UI CHANGE (IMPORTANT)

Currently:

* Decision table opens in a popup modal (REMOVE THIS)

Change to:

* Open decision table in a NEW TAB inside the app UI
* Similar to Zen interface

Requirements:

* Add tab system above canvas (like browser tabs)
* Each decision table opens as a new tab
* User can switch between:

  * Graph (main canvas)
  * Decision table tabs

Decision table UI should:

* Look like spreadsheet
* Have columns: Inputs, Outputs, Description
* Allow:

  * Add rows
  * Edit cells
  * Delete rows

IMPORTANT:

* Do NOT implement advanced features like CSV import/export yet
* Keep it simple and functional

---

## 📦 8. TEMPLATE SUPPORT (LOW PRIORITY)

(Add ONLY AFTER all above features work perfectly)

Add buttons:

* "Load Sample: Company Classification"
* "Load Sample: Loan Approval"

These should auto-fill:

* nodes
* edges
* request JSON

---

## 🧪 TESTING REQUIREMENTS

Before final output:

* Test node deletion
* Test connections validation
* Test expression execution
* Test decision branching
* Test localStorage persistence (refresh page)
* Test decision table tab switching

---

## 📁 OUTPUT EXPECTATION

* Updated frontend code (React)
* Any backend changes if needed
* Clear instructions to run locally:
  npm install
  npm run dev

Ensure no breaking errors.

---

## ⚡ FINAL GOAL

The system should behave like a real rule engine:

User creates flow → inputs JSON → clicks Run → system processes nodes → logs execution → returns output → state persists after reload

---

## IMPORTANT NOTE

Implement features step-by-step.
Do NOT jump to advanced features before core fixes are stable.
