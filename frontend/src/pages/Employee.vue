<template>
  <div class="dashboard">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon">⊕</div>
        <div class="brand-name">ReliefMS</div>
      </div>

      <nav class="sidebar-nav">
        <div
          v-for="item in navItems"
          :key="item.id"
          class="nav-item"
          :class="{ active: activeTab === item.id }"
          @click="activeTab = item.id"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="user-card">
          <div class="user-avatar">
            {{ user.name?.charAt(0).toUpperCase() }}
          </div>
          <div class="user-info">
            <div class="user-name">{{ user.name }}</div>
            <div class="user-role">Employee</div>
          </div>
        </div>
        <button class="logout-btn" @click="logout">↩ Sign out</button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="main">
      <!-- Top bar -->
      <div class="topbar">
        <div class="topbar-left">
          <div class="page-title">
            {{ navItems.find((n) => n.id === activeTab)?.label }}
          </div>
          <div class="page-date">{{ today }}</div>
        </div>
        <div class="topbar-right">
          <div class="notif-btn">🔔</div>
          <div class="user-avatar sm">
            {{ user.name?.charAt(0).toUpperCase() }}
          </div>
        </div>
      </div>

      <!-- APPLY LEAVE TAB -->
      <div v-if="activeTab === 'apply'" class="content-area">
        <!-- Summary chips -->
        <div class="stat-row">
          <div class="stat-card">
            <div class="stat-icon" style="background: #e8f0f8; color: #3d5a73">
              📅
            </div>
            <div>
              <div class="stat-val">
                {{ leaves.filter((l) => l.status === "Approved").length }}
              </div>
              <div class="stat-label">Approved</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: #fdf3e8; color: #b07030">
              ⏳
            </div>
            <div>
              <div class="stat-val">
                {{ leaves.filter((l) => l.status === "Pending").length }}
              </div>
              <div class="stat-label">Pending</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: #fdeaea; color: #a04040">
              ✕
            </div>
            <div>
              <div class="stat-val">
                {{ leaves.filter((l) => l.status === "Rejected").length }}
              </div>
              <div class="stat-label">Rejected</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: #eaf4ee; color: #3a7050">
              ◎
            </div>
            <div>
              <div class="stat-val">{{ leaves.length }}</div>
              <div class="stat-label">Total Requests</div>
            </div>
          </div>
        </div>

        <!-- Apply form -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Apply for Leave</div>
            <div class="card-sub">Submit a new leave request for review</div>
          </div>

          <div class="form-grid">
            <div class="form-group full">
              <label class="form-label">Leave Type</label>
              <div class="select-wrap">
                <span class="input-icon">◈</span>
                <select v-model="leaveType" class="form-select">
                  <option value="">Select leave type</option>
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Annual Leave</option>
                  <option>Maternity / Paternity Leave</option>
                  <option>Emergency Leave</option>
                  <option>Unpaid Leave</option>
                </select>
                <span class="select-arrow">▾</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Start Date</label>
              <div class="input-wrap">
                <span class="input-icon">◷</span>
                <input v-model="startDate" type="date" class="form-input" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">End Date</label>
              <div class="input-wrap">
                <span class="input-icon">◷</span>
                <input v-model="endDate" type="date" class="form-input" />
              </div>
            </div>

            <div class="form-group full">
              <label class="form-label">Reason</label>
              <textarea
                v-model="reason"
                placeholder="Briefly describe the reason for your leave request…"
                class="form-textarea"
                rows="4"
              ></textarea>
            </div>
          </div>

          <div v-if="applyError" class="form-error">
            <span>⚠</span> {{ applyError }}
          </div>
          <div v-if="applySuccess" class="form-success">
            <span>✓</span> {{ applySuccess }}
          </div>

          <div class="form-actions">
            <button class="btn-outline" @click="resetForm">Clear</button>
            <button
              class="btn-primary"
              @click="applyLeave"
              :disabled="applying"
            >
              {{ applying ? "Submitting…" : "Submit Request" }}
            </button>
          </div>
        </div>
      </div>

      <!-- MY LEAVES TAB -->
      <div v-if="activeTab === 'leaves'" class="content-area">
        <div class="card">
          <div class="card-header row">
            <div>
              <div class="card-title">My Leave History</div>
              <div class="card-sub">
                All your leave requests and their current status
              </div>
            </div>
            <button class="btn-primary sm" @click="getLeaves">↻ Refresh</button>
          </div>

          <div v-if="leaves.length === 0" class="empty-state">
            <div class="empty-icon">📋</div>
            <div class="empty-title">No leave requests yet</div>
            <div class="empty-sub">
              Submit your first leave request from the Apply tab.
            </div>
          </div>

          <div v-else class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(leave, i) in leaves" :key="leave._id">
                  <td class="idx">{{ i + 1 }}</td>
                  <td>
                    <span class="type-badge">{{ leave.leaveType }}</span>
                  </td>
                  <td>{{ formatDate(leave.startDate) }}</td>
                  <td>{{ formatDate(leave.endDate) }}</td>
                  <td>{{ calcDays(leave.startDate, leave.endDate) }} day(s)</td>
                  <td>
                    <span
                      class="status-badge"
                      :class="leave.status?.toLowerCase()"
                    >
                      {{ leave.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || {},
      activeTab: "apply",
      navItems: [
        { id: "apply", icon: "✦", label: "Apply Leave" },
        { id: "leaves", icon: "◎", label: "My Leaves" },
      ],
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
      leaves: [],
      applying: false,
      applyError: "",
      applySuccess: "",
    };
  },
  computed: {
    today() {
      return new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  mounted() {
    this.getLeaves();
  },
  methods: {
    async applyLeave() {
      if (!this.leaveType || !this.startDate || !this.endDate) {
        this.applyError = "Please fill in all required fields.";
        return;
      }
      this.applyError = "";
      this.applying = true;
      try {
        await axios.post("http://localhost:5000/api/leave/apply", {
          userId: this.user._id,
          leaveType: this.leaveType,
          startDate: this.startDate,
          endDate: this.endDate,
          reason: this.reason,
        });
        this.applySuccess = "Leave request submitted successfully!";
        this.resetForm();
        this.getLeaves();
        setTimeout(() => (this.applySuccess = ""), 3000);
      } catch (err) {
        this.applyError =
          err.response?.data?.message || "Failed to submit request.";
      }
      this.applying = false;
    },
    async getLeaves() {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/leave/my/${this.user._id}`,
        );
        this.leaves = res.data;
      } catch (err) {
        console.error(err);
      }
    },
    resetForm() {
      this.leaveType = "";
      this.startDate = "";
      this.endDate = "";
      this.reason = "";
      this.applyError = "";
    },
    formatDate(d) {
      if (!d) return "—";
      return new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
    calcDays(start, end) {
      if (!start || !end) return "—";
      const diff =
        Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) +
        1;
      return diff > 0 ? diff : "—";
    },
    logout() {
      localStorage.clear();
      window.location.href = "/";
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f0ede8;
  font-family: "Sora", sans-serif;
}

/* ── SIDEBAR ── */
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: linear-gradient(175deg, #2c3e50 0%, #3d5a73 60%, #4a6f85 100%);
  display: flex;
  flex-direction: column;
  padding: 28px 0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 24px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.brand-icon {
  width: 34px;
  height: 34px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  color: #a8d8f0;
}
.brand-name {
  font-size: 17px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.04em;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.18s;
  color: rgba(180, 210, 230, 0.65);
  font-size: 13px;
  font-weight: 400;
}
.nav-item:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #c8e4f4;
}
.nav-item.active {
  background: rgba(158, 207, 234, 0.15);
  color: #ffffff;
  font-weight: 600;
}
.nav-item.active .nav-icon {
  color: #9ecfea;
}
.nav-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 20px 16px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.user-avatar {
  width: 36px;
  height: 36px;
  background: rgba(158, 207, 234, 0.2);
  border: 1px solid rgba(158, 207, 234, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #9ecfea;
  flex-shrink: 0;
}
.user-avatar.sm {
  width: 32px;
  height: 32px;
  font-size: 13px;
  background: #dbe8f0;
  color: #3d5a73;
  border: none;
}
.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
}
.user-role {
  font-size: 10px;
  color: rgba(180, 210, 230, 0.5);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-top: 1px;
}
.logout-btn {
  width: 100%;
  padding: 9px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9px;
  font-family: "Sora", sans-serif;
  font-size: 12px;
  color: rgba(180, 210, 230, 0.6);
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}
.logout-btn:hover {
  background: rgba(200, 80, 80, 0.15);
  border-color: rgba(200, 80, 80, 0.3);
  color: #f0a0a0;
}

/* ── MAIN ── */
.main {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  background: #ffffff;
  border-bottom: 1px solid #e4eaf2;
  padding: 16px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 5;
}
.page-title {
  font-family: "Lora", serif;
  font-size: 20px;
  font-weight: 500;
  color: #1e2d3d;
}
.page-date {
  font-size: 11px;
  color: #9aafbf;
  margin-top: 2px;
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.notif-btn {
  width: 36px;
  height: 36px;
  background: #f5f7fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
}

.content-area {
  padding: 28px 32px;
  flex: 1;
}

/* Stat row */
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.stat-card {
  background: #ffffff;
  border: 1px solid #e4eaf2;
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 1px 8px rgba(60, 80, 100, 0.05);
}
.stat-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.stat-val {
  font-family: "Lora", serif;
  font-size: 26px;
  font-weight: 500;
  color: #1e2d3d;
  line-height: 1;
}
.stat-label {
  font-size: 11px;
  color: #8a9bb0;
  margin-top: 3px;
  font-weight: 400;
}

/* Card */
.card {
  background: #ffffff;
  border: 1px solid #e4eaf2;
  border-radius: 18px;
  padding: 28px 30px;
  box-shadow: 0 2px 16px rgba(60, 80, 100, 0.06);
}
.card-header {
  margin-bottom: 24px;
}
.card-header.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-title {
  font-family: "Lora", serif;
  font-size: 20px;
  font-weight: 500;
  color: #1e2d3d;
  margin-bottom: 4px;
}
.card-sub {
  font-size: 12px;
  color: #8a9bb0;
  font-weight: 300;
}

/* Form */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group.full {
  grid-column: 1 / -1;
}
.form-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #5a6e82;
  margin-bottom: 6px;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 13px;
  font-size: 14px;
  color: #9aafbf;
  pointer-events: none;
  z-index: 1;
}
.form-input {
  width: 100%;
  padding: 11px 14px 11px 38px;
  background: #f5f7fa;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-family: "Sora", sans-serif;
  font-size: 13px;
  color: #1e2d3d;
  outline: none;
  transition: all 0.2s;
}
.form-input:focus {
  border-color: #5a8faa;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(90, 143, 170, 0.1);
}

.select-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.form-select {
  width: 100%;
  padding: 11px 36px 11px 38px;
  background: #f5f7fa;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-family: "Sora", sans-serif;
  font-size: 13px;
  color: #1e2d3d;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s;
}
.form-select:focus {
  border-color: #5a8faa;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(90, 143, 170, 0.1);
}
.select-arrow {
  position: absolute;
  right: 13px;
  font-size: 12px;
  color: #9aafbf;
  pointer-events: none;
}

.form-textarea {
  width: 100%;
  padding: 11px 14px;
  background: #f5f7fa;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-family: "Sora", sans-serif;
  font-size: 13px;
  color: #1e2d3d;
  outline: none;
  resize: vertical;
  transition: all 0.2s;
}
.form-textarea::placeholder {
  color: #b0bec8;
}
.form-textarea:focus {
  border-color: #5a8faa;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(90, 143, 170, 0.1);
}

.form-error {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 14px;
  background: rgba(200, 80, 80, 0.07);
  border: 1px solid rgba(200, 80, 80, 0.18);
  border-radius: 8px;
  font-size: 12px;
  color: #c05050;
  margin-bottom: 14px;
}
.form-success {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 14px;
  background: rgba(80, 150, 100, 0.07);
  border: 1px solid rgba(80, 150, 100, 0.18);
  border-radius: 8px;
  font-size: 12px;
  color: #3a8050;
  margin-bottom: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}
.btn-primary {
  padding: 10px 24px;
  background: linear-gradient(135deg, #2c3e50, #3d5a73);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: "Sora", sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.03em;
}
.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #3d5a73, #4a6f85);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(44, 62, 80, 0.25);
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-primary.sm {
  padding: 8px 16px;
  font-size: 12px;
}
.btn-outline {
  padding: 10px 20px;
  background: transparent;
  border: 1.5px solid #d0dae6;
  color: #5a6e82;
  border-radius: 10px;
  font-family: "Sora", sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover {
  border-color: #5a8faa;
  color: #3d5a73;
}

/* Table */
.table-wrap {
  overflow-x: auto;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table thead tr {
  border-bottom: 2px solid #e8eef6;
}
.data-table th {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8a9bb0;
  padding: 0 14px 12px;
  text-align: left;
}
.data-table td {
  padding: 14px;
  border-bottom: 1px solid #f0f4f8;
  font-size: 13px;
  color: #2e3d4e;
  vertical-align: middle;
}
.data-table tbody tr:last-child td {
  border-bottom: none;
}
.data-table tbody tr:hover td {
  background: #fafcff;
}
.idx {
  color: #b0bec8;
  font-size: 12px;
  width: 36px;
}

.type-badge {
  padding: 4px 10px;
  background: #eef2f8;
  color: #4a6080;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}
.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}
.status-badge.pending {
  background: rgba(196, 140, 60, 0.12);
  color: #a07030;
}
.status-badge.approved {
  background: rgba(60, 140, 90, 0.12);
  color: #2a7050;
}
.status-badge.rejected {
  background: rgba(180, 60, 60, 0.12);
  color: #903030;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 48px 20px;
}
.empty-icon {
  font-size: 40px;
  margin-bottom: 14px;
  opacity: 0.4;
}
.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: #4a5e70;
  margin-bottom: 6px;
}
.empty-sub {
  font-size: 13px;
  color: #8a9bb0;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
  .main {
    margin-left: 0;
  }
  .stat-row {
    grid-template-columns: 1fr 1fr;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .content-area {
    padding: 20px 16px;
  }
}
</style>
