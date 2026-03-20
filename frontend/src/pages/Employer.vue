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
            <div class="user-role">Employer</div>
          </div>
        </div>
        <button class="logout-btn" @click="logout">↩ Sign out</button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="main">
      <!-- Topbar -->
      <div class="topbar">
        <div class="topbar-left">
          <div class="page-title">
            {{ navItems.find((n) => n.id === activeTab)?.label }}
          </div>
          <div class="page-date">{{ today }}</div>
        </div>
        <div class="topbar-right">
          <div class="notif-btn">
            🔔<span v-if="pendingCount > 0" class="notif-dot">{{
              pendingCount
            }}</span>
          </div>
          <div class="user-avatar sm">
            {{ user.name?.charAt(0).toUpperCase() }}
          </div>
        </div>
      </div>

      <!-- ALL REQUESTS TAB -->
      <div v-if="activeTab === 'requests'" class="content-area">
        <!-- Summary stats -->
        <div class="stat-row">
          <div class="stat-card">
            <div class="stat-icon" style="background: #fdf3e8; color: #b07030">
              ⏳
            </div>
            <div>
              <div class="stat-val">{{ pendingCount }}</div>
              <div class="stat-label">Pending Review</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: #eaf4ee; color: #3a7050">
              ✓
            </div>
            <div>
              <div class="stat-val">
                {{ leaves.filter((l) => l.status === "Approved").length }}
              </div>
              <div class="stat-label">Approved</div>
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
            <div class="stat-icon" style="background: #e8f0f8; color: #3d5a73">
              ◎
            </div>
            <div>
              <div class="stat-val">{{ leaves.length }}</div>
              <div class="stat-label">Total Requests</div>
            </div>
          </div>
        </div>

        <!-- Filter bar -->
        <div class="filter-bar">
          <div class="filter-tabs">
            <button
              v-for="f in filters"
              :key="f.val"
              class="filter-tab"
              :class="{ active: activeFilter === f.val }"
              @click="activeFilter = f.val"
            >
              {{ f.label }}
              <span class="filter-count">{{ filterCount(f.val) }}</span>
            </button>
          </div>
          <button class="btn-outline sm" @click="getAllLeaves">
            ↻ Refresh
          </button>
        </div>

        <!-- Table card -->
        <div class="card">
          <div v-if="filteredLeaves.length === 0" class="empty-state">
            <div class="empty-icon">📋</div>
            <div class="empty-title">
              No
              {{
                activeFilter === "all" ? "" : activeFilter.toLowerCase() + " "
              }}requests
            </div>
            <div class="empty-sub">
              Check back later for new leave requests.
            </div>
          </div>

          <div v-else class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(leave, i) in filteredLeaves" :key="leave._id">
                  <td class="idx">{{ i + 1 }}</td>
                  <td>
                    <div class="emp-cell">
                      <div class="emp-avatar">
                        {{ leave.userId?.name?.charAt(0).toUpperCase() || "?" }}
                      </div>
                      <div class="emp-name">
                        {{ leave.userId?.name || "—" }}
                      </div>
                    </div>
                  </td>
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
                  <td>
                    <div v-if="leave.status === 'Pending'" class="action-btns">
                      <button
                        class="action-btn approve"
                        @click="updateStatus(leave._id, 'Approved')"
                        :disabled="updatingId === leave._id"
                      >
                        ✓ Approve
                      </button>
                      <button
                        class="action-btn reject"
                        @click="updateStatus(leave._id, 'Rejected')"
                        :disabled="updatingId === leave._id"
                      >
                        ✕ Reject
                      </button>
                    </div>
                    <span
                      v-else
                      class="action-done"
                      :class="leave.status?.toLowerCase()"
                    >
                      {{ leave.status === "Approved" ? "✓ Done" : "✕ Done" }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- PENDING TAB (quick view) -->
      <div v-if="activeTab === 'pending'" class="content-area">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Pending Requests</div>
            <div class="card-sub">These requests are awaiting your review</div>
          </div>

          <div v-if="pendingCount === 0" class="empty-state">
            <div class="empty-icon">🎉</div>
            <div class="empty-title">All caught up!</div>
            <div class="empty-sub">No pending requests at this time.</div>
          </div>

          <div v-else class="requests-list">
            <div
              v-for="leave in leaves.filter((l) => l.status === 'Pending')"
              :key="leave._id"
              class="request-card"
            >
              <div class="request-left">
                <div class="emp-avatar lg">
                  {{ leave.userId?.name?.charAt(0).toUpperCase() || "?" }}
                </div>
                <div>
                  <div class="request-name">
                    {{ leave.userId?.name || "—" }}
                  </div>
                  <div class="request-meta">
                    <span class="type-badge">{{ leave.leaveType }}</span>
                    <span class="request-dates"
                      >{{ formatDate(leave.startDate) }} →
                      {{ formatDate(leave.endDate) }}</span
                    >
                    <span class="request-dur"
                      >{{
                        calcDays(leave.startDate, leave.endDate)
                      }}
                      day(s)</span
                    >
                  </div>
                </div>
              </div>
              <div class="action-btns">
                <button
                  class="action-btn approve"
                  @click="updateStatus(leave._id, 'Approved')"
                  :disabled="updatingId === leave._id"
                >
                  ✓ Approve
                </button>
                <button
                  class="action-btn reject"
                  @click="updateStatus(leave._id, 'Rejected')"
                  :disabled="updatingId === leave._id"
                >
                  ✕ Reject
                </button>
              </div>
            </div>
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
      activeTab: "requests",
      navItems: [
        { id: "requests", icon: "◎", label: "All Requests" },
        { id: "pending", icon: "⏳", label: "Pending Review" },
      ],
      leaves: [],
      activeFilter: "all",
      filters: [
        { label: "All", val: "all" },
        { label: "Pending", val: "Pending" },
        { label: "Approved", val: "Approved" },
        { label: "Rejected", val: "Rejected" },
      ],
      updatingId: null,
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
    pendingCount() {
      return this.leaves.filter((l) => l.status === "Pending").length;
    },
    filteredLeaves() {
      if (this.activeFilter === "all") return this.leaves;
      return this.leaves.filter((l) => l.status === this.activeFilter);
    },
  },
  mounted() {
    this.getAllLeaves();
  },
  methods: {
    async getAllLeaves() {
      try {
        const res = await axios.get("http://localhost:5000/api/leave/all");
        this.leaves = res.data;
      } catch (err) {
        console.error(err);
      }
    },
    async updateStatus(id, status) {
      this.updatingId = id;
      try {
        await axios.put(`http://localhost:5000/api/leave/${id}`, { status });
        const idx = this.leaves.findIndex((l) => l._id === id);
        if (idx !== -1) this.leaves[idx].status = status;
      } catch (err) {
        console.error(err);
      }
      this.updatingId = null;
    },
    filterCount(val) {
      if (val === "all") return this.leaves.length;
      return this.leaves.filter((l) => l.status === val).length;
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
.user-avatar.lg {
  width: 44px;
  height: 44px;
  font-size: 16px;
  background: #dbe8f0;
  color: #3d5a73;
  border: none;
  flex-shrink: 0;
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
  position: relative;
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
.notif-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  background: #d45050;
  border-radius: 50%;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}

.content-area {
  padding: 28px 32px;
  flex: 1;
}

/* Stats */
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
}

/* Filter bar */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.filter-tabs {
  display: flex;
  gap: 6px;
}
.filter-tab {
  padding: 7px 16px;
  background: #ffffff;
  border: 1.5px solid #e4eaf2;
  border-radius: 20px;
  font-family: "Sora", sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #6a7e92;
  cursor: pointer;
  transition: all 0.18s;
  display: flex;
  align-items: center;
  gap: 6px;
}
.filter-tab:hover {
  border-color: #5a8faa;
  color: #3d5a73;
}
.filter-tab.active {
  background: linear-gradient(135deg, #2c3e50, #3d5a73);
  border-color: transparent;
  color: #ffffff;
}
.filter-count {
  font-size: 10px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  padding: 1px 6px;
  border-radius: 10px;
}
.filter-tab:not(.active) .filter-count {
  background: #eef2f8;
  color: #8a9bb0;
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

.emp-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.emp-avatar {
  width: 30px;
  height: 30px;
  background: #dbe8f0;
  color: #3d5a73;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}
.emp-name {
  font-size: 13px;
  font-weight: 500;
  color: #1e2d3d;
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

.action-btns {
  display: flex;
  gap: 6px;
}
.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-family: "Sora", sans-serif;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
}
.action-btn.approve {
  background: rgba(60, 140, 90, 0.1);
  color: #2a7050;
}
.action-btn.approve:hover:not(:disabled) {
  background: rgba(60, 140, 90, 0.2);
}
.action-btn.reject {
  background: rgba(180, 60, 60, 0.1);
  color: #903030;
}
.action-btn.reject:hover:not(:disabled) {
  background: rgba(180, 60, 60, 0.2);
}
.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.action-done {
  font-size: 11px;
  font-weight: 600;
}
.action-done.approved {
  color: #2a7050;
}
.action-done.rejected {
  color: #903030;
}

/* Pending list cards */
.requests-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.request-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: #f7fafc;
  border: 1px solid #e4eaf2;
  border-radius: 14px;
  transition: all 0.18s;
}
.request-card:hover {
  border-color: #c0d0e0;
  box-shadow: 0 2px 10px rgba(60, 80, 100, 0.06);
}
.request-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.request-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e2d3d;
  margin-bottom: 6px;
}
.request-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.request-dates {
  font-size: 12px;
  color: #7a8fa0;
}
.request-dur {
  font-size: 11px;
  color: #9aafbf;
}

/* Buttons */
.btn-outline {
  padding: 8px 16px;
  background: transparent;
  border: 1.5px solid #d0dae6;
  color: #5a6e82;
  border-radius: 8px;
  font-family: "Sora", sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover {
  border-color: #5a8faa;
  color: #3d5a73;
}
.btn-outline.sm {
  padding: 6px 14px;
  font-size: 11px;
}

/* Empty */
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
  .content-area {
    padding: 20px 16px;
  }
  .filter-tabs {
    flex-wrap: wrap;
  }
}
</style>
