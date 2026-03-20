<template>
  <div class="auth-bg">
    <div class="bg-orb bg-orb-1"></div>
    <div class="bg-orb bg-orb-2"></div>
    <div class="bg-grid"></div>

    <div class="auth-wrap">
      <!-- Left panel -->
      <div class="auth-panel-left">
        <div class="brand">
          <div class="brand-icon">⊕</div>
          <div class="brand-name">ReliefMS</div>
        </div>
        <div class="panel-headline">Join your<br /><em>organisation</em></div>
        <div class="panel-sub">
          Create your account to start managing leave requests, track approvals,
          and stay connected with your team.
        </div>

        <div class="panel-roles">
          <div
            class="role-card"
            :class="{ active: role === 'employee' }"
            @click="role = 'employee'"
          >
            <div class="role-icon">👤</div>
            <div>
              <div class="role-name">Employee</div>
              <div class="role-desc">Apply & track your leaves</div>
            </div>
            <div class="role-check">{{ role === "employee" ? "✓" : "" }}</div>
          </div>
          <div
            class="role-card"
            :class="{ active: role === 'employer' }"
            @click="role = 'employer'"
          >
            <div class="role-icon">🏢</div>
            <div>
              <div class="role-name">Employer</div>
              <div class="role-desc">Review & approve requests</div>
            </div>
            <div class="role-check">{{ role === "employer" ? "✓" : "" }}</div>
          </div>
        </div>
      </div>

      <!-- Right: form -->
      <div class="auth-card">
        <div class="auth-card-header">
          <div class="auth-card-title">Create account</div>
          <div class="auth-card-sub">Fill in your details to get started</div>
        </div>

        <div class="form-group">
          <label class="form-label">Full Name</label>
          <div class="input-wrap">
            <span class="input-icon">◈</span>
            <input
              v-model="name"
              type="text"
              placeholder="Your full name"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Email Address</label>
          <div class="input-wrap">
            <span class="input-icon">✉</span>
            <input
              v-model="email"
              type="email"
              placeholder="you@company.com"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="input-wrap">
            <span class="input-icon">◉</span>
            <input
              v-model="password"
              :type="showPass ? 'text' : 'password'"
              placeholder="Create a strong password"
              class="form-input"
            />
            <button
              class="input-toggle"
              @click="showPass = !showPass"
              type="button"
            >
              {{ showPass ? "◑" : "◎" }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Role</label>
          <div class="select-wrap">
            <span class="input-icon">⊛</span>
            <select v-model="role" class="form-select">
              <option value="employee">Employee</option>
              <option value="employer">Employer</option>
            </select>
            <span class="select-arrow">▾</span>
          </div>
        </div>

        <div v-if="error" class="form-error"><span>⚠</span> {{ error }}</div>
        <div v-if="success" class="form-success">
          <span>✓</span> {{ success }}
        </div>

        <button class="submit-btn" @click="signup" :disabled="loading">
          <span v-if="!loading">Create Account</span>
          <span v-else class="loading-dots"
            >Creating<span>.</span><span>.</span><span>.</span></span
          >
        </button>

        <div class="auth-switch">
          Already have an account?
          <a
            href="/login"
            class="auth-switch-link"
            onclick="
              window.location.href = '/login';
              return false;
            "
            >Sign in</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      role: "employee",
      showPass: false,
      loading: false,
      error: "",
      success: "",
    };
  },
  methods: {
    async signup() {
      if (!this.name || !this.email || !this.password) {
        this.error = "Please fill in all fields.";
        return;
      }
      this.error = "";
      this.loading = true;
      try {
        await axios.post("http://localhost:5000/api/auth/signup", {
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role,
        });
        this.success = "Account created! Redirecting to login…";
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } catch (err) {
        this.error =
          err.response?.data?.message || "Signup failed. Please try again.";
      }
      this.loading = false;
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

.auth-bg {
  min-height: 100vh;
  background: #f0ede8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: "Sora", sans-serif;
  position: relative;
  overflow: hidden;
}
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  pointer-events: none;
}
.bg-orb-1 {
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, #b8cce0, #d0e4f0);
  top: -120px;
  left: -100px;
}
.bg-orb-2 {
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, #c8d8c0, #ddeedd);
  bottom: -80px;
  right: -60px;
}
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(120, 130, 150, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120, 130, 150, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

.auth-wrap {
  display: flex;
  max-width: 900px;
  width: 100%;
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 8px 60px rgba(60, 80, 100, 0.12),
    0 1px 0 rgba(255, 255, 255, 0.8) inset;
  position: relative;
  z-index: 1;
  animation: fadeUp 0.5s ease both;
}
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Left panel */
.auth-panel-left {
  flex: 0 0 320px;
  background: linear-gradient(145deg, #2c3e50 0%, #3d5a73 50%, #4a6f85 100%);
  padding: 44px 36px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.auth-panel-left::before {
  content: "";
  position: absolute;
  top: -60px;
  right: -60px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 44px;
}
.brand-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #a8d8f0;
}
.brand-name {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.04em;
}
.panel-headline {
  font-family: "Lora", serif;
  font-size: 32px;
  font-weight: 400;
  color: #ffffff;
  line-height: 1.2;
  margin-bottom: 14px;
}
.panel-headline em {
  font-style: italic;
  color: #9ecfea;
}
.panel-sub {
  font-size: 12px;
  font-weight: 300;
  color: rgba(200, 220, 240, 0.7);
  line-height: 1.7;
  margin-bottom: 36px;
}

/* Role selector in left panel */
.panel-roles {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
}
.role-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.role-card:hover {
  background: rgba(255, 255, 255, 0.1);
}
.role-card.active {
  background: rgba(158, 207, 234, 0.15);
  border-color: rgba(158, 207, 234, 0.4);
}
.role-icon {
  font-size: 20px;
  flex-shrink: 0;
}
.role-name {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 2px;
}
.role-desc {
  font-size: 11px;
  color: rgba(180, 210, 230, 0.6);
}
.role-check {
  margin-left: auto;
  font-size: 14px;
  color: #9ecfea;
  font-weight: 700;
  width: 16px;
  text-align: center;
}

/* Card */
.auth-card {
  flex: 1;
  padding: 44px 44px;
  display: flex;
  flex-direction: column;
}
.auth-card-header {
  margin-bottom: 28px;
}
.auth-card-title {
  font-family: "Lora", serif;
  font-size: 26px;
  font-weight: 500;
  color: #1e2d3d;
  margin-bottom: 5px;
  letter-spacing: -0.01em;
}
.auth-card-sub {
  font-size: 13px;
  color: #8a9bb0;
  font-weight: 300;
}

.form-group {
  margin-bottom: 16px;
}
.form-label {
  display: block;
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
  left: 14px;
  font-size: 14px;
  color: #9aafbf;
  pointer-events: none;
  z-index: 1;
}
.form-input {
  width: 100%;
  padding: 11px 42px 11px 40px;
  background: #f5f7fa;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-family: "Sora", sans-serif;
  font-size: 13px;
  color: #1e2d3d;
  outline: none;
  transition: all 0.2s;
}
.form-input::placeholder {
  color: #b0bec8;
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
  padding: 11px 40px 11px 40px;
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
  right: 14px;
  font-size: 12px;
  color: #9aafbf;
  pointer-events: none;
}

.input-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  font-size: 15px;
  color: #9aafbf;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}
.input-toggle:hover {
  color: #5a8faa;
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

.submit-btn {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #2c3e50, #3d5a73);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-family: "Sora", sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
  margin-bottom: 20px;
}
.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #3d5a73, #4a6f85);
  box-shadow: 0 6px 20px rgba(44, 62, 80, 0.3);
  transform: translateY(-1px);
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.loading-dots span {
  animation: blink 1.2s infinite;
}
.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}
.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}

.auth-switch {
  text-align: center;
  font-size: 13px;
  color: #8a9bb0;
}
.auth-switch-link {
  color: #5a8faa;
  text-decoration: underline;
  text-underline-offset: 2px;
  font-weight: 600;
  margin-left: 4px;
  cursor: pointer;
}
.auth-switch-link:hover {
  color: #3d6f88;
}

@media (max-width: 700px) {
  .auth-panel-left {
    display: none;
  }
  .auth-card {
    padding: 36px 28px;
  }
}
</style>
