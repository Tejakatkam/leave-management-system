<template>
  <div class="auth-bg">
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>
    <div class="bg-grid"></div>

    <div class="auth-wrap">
      <!-- Left panel -->
      <div class="auth-panel-left">
        <div class="brand">
          <div class="brand-icon">⊕</div>
          <div class="brand-name">ReliefMS</div>
        </div>
        <div class="panel-headline">Welcome<br /><em>back</em></div>
        <div class="panel-sub">
          Sign in to manage leave requests, track approvals, and stay on top of
          your workforce.
        </div>
        <div class="panel-stats">
          <div class="pstat">
            <div class="pstat-val">98%</div>
            <div class="pstat-label">Approval Rate</div>
          </div>
          <div class="pstat-divider"></div>
          <div class="pstat">
            <div class="pstat-val">24h</div>
            <div class="pstat-label">Avg Response</div>
          </div>
          <div class="pstat-divider"></div>
          <div class="pstat">
            <div class="pstat-val">5k+</div>
            <div class="pstat-label">Active Users</div>
          </div>
        </div>
      </div>

      <!-- Right: form -->
      <div class="auth-card">
        <div class="auth-card-header">
          <div class="auth-card-title">Sign in</div>
          <div class="auth-card-sub">Enter your credentials to continue</div>
        </div>

        <div class="form-group">
          <label class="form-label">Email Address</label>
          <div class="input-wrap">
            <span class="input-icon">✉</span>
            <input
              v-model="email"
              placeholder="you@company.com"
              class="form-input"
              @keydown.enter="login"
            />
          </div>
        </div>

        <div class="form-group">
          <div class="form-label-row">
            <label class="form-label">Password</label>
            <a href="#" class="form-link">Forgot password?</a>
          </div>
          <div class="input-wrap">
            <span class="input-icon">◉</span>
            <input
              v-model="password"
              :type="showPass ? 'text' : 'password'"
              placeholder="Enter your password"
              class="form-input"
              @keydown.enter="login"
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

        <div v-if="errorMsg" class="form-error">
          <span>⚠</span> {{ errorMsg }}
        </div>

        <button class="submit-btn" @click="login" :disabled="loading">
          <span v-if="!loading">Sign In</span>
          <span v-else class="loading-dots"
            >Signing in<span>.</span><span>.</span><span>.</span></span
          >
        </button>

        <div class="auth-switch">
          Don't have an account?
          <a href="/signup" class="auth-switch-link">Create one</a>
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
      email: "",
      password: "",
      // UI-only helpers — do not affect original logic
      showPass: false,
      loading: false,
      errorMsg: "",
    };
  },
  methods: {
    async login() {
      this.loading = true;
      this.errorMsg = "";
      try {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: this.email,
          password: this.password,
        });
        // store user
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Login successful");
        // redirect
        if (res.data.user.role === "employee") {
          window.location.href = "/employee";
        } else {
          window.location.href = "/employer";
        }
      } catch (err) {
        console.log(err.response?.data);
        this.errorMsg = err.response?.data?.message || "Login failed";
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
  background: #edeae4;
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
  filter: blur(90px);
  opacity: 0.4;
  pointer-events: none;
}
.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #b8cce0, #ccdff0);
  top: -140px;
  left: -120px;
}
.orb-2 {
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, #c4d8c0, #d8edda);
  bottom: -80px;
  right: -80px;
}
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(100, 120, 150, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100, 120, 150, 0.05) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

/* ── CARD WRAP ── */
.auth-wrap {
  display: flex;
  max-width: 880px;
  width: 100%;
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 60px rgba(60, 80, 100, 0.12);
  position: relative;
  z-index: 1;
  animation: fadeUp 0.5s ease both;
}
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── LEFT PANEL ── */
.auth-panel-left {
  flex: 0 0 320px;
  background: linear-gradient(150deg, #2c3e50 0%, #3d5a73 55%, #4a6f85 100%);
  padding: 52px 38px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.auth-panel-left::before {
  content: "";
  position: absolute;
  top: -70px;
  right: -70px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
}
.auth-panel-left::after {
  content: "";
  position: absolute;
  bottom: -50px;
  left: -50px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 52px;
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
  font-size: 17px;
  color: #a8d8f0;
}
.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.04em;
}

.panel-headline {
  font-family: "Lora", serif;
  font-size: 40px;
  font-weight: 400;
  color: #ffffff;
  line-height: 1.15;
  margin-bottom: 18px;
  position: relative;
  z-index: 1;
}
.panel-headline em {
  font-style: italic;
  color: #9ecfea;
}

.panel-sub {
  font-size: 13px;
  font-weight: 300;
  color: rgba(200, 220, 240, 0.65);
  line-height: 1.75;
  margin-bottom: 52px;
  position: relative;
  z-index: 1;
}

.panel-stats {
  display: flex;
  align-items: center;
  margin-top: auto;
  position: relative;
  z-index: 1;
}
.pstat {
  flex: 1;
  text-align: center;
}
.pstat-val {
  font-family: "Lora", serif;
  font-size: 24px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 4px;
}
.pstat-label {
  font-size: 10px;
  font-weight: 400;
  color: rgba(180, 210, 230, 0.55);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.pstat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.12);
}

/* ── RIGHT FORM ── */
.auth-card {
  flex: 1;
  padding: 52px 48px;
  display: flex;
  flex-direction: column;
}

.auth-card-header {
  margin-bottom: 32px;
}
.auth-card-title {
  font-family: "Lora", serif;
  font-size: 30px;
  font-weight: 500;
  color: #1e2d3d;
  margin-bottom: 6px;
  letter-spacing: -0.01em;
}
.auth-card-sub {
  font-size: 13px;
  font-weight: 300;
  color: #8a9bb0;
}

/* Form */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #5a6e82;
  margin-bottom: 7px;
}
.form-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
}
.form-link {
  font-size: 11px;
  color: #5a8faa;
  text-decoration: none;
}
.form-link:hover {
  color: #2c3e50;
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
  padding: 12px 42px 12px 40px;
  background: #f5f7fa;
  border: 1.5px solid #e2e8f0;
  border-radius: 11px;
  font-family: "Sora", sans-serif;
  font-size: 13px;
  color: #1e2d3d;
  outline: none;
  transition: all 0.2s;
}
.form-input::placeholder {
  color: #b8c8d8;
}
.form-input:focus {
  border-color: #5a8faa;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(90, 143, 170, 0.1);
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
  transition: color 0.15s;
}
.input-toggle:hover {
  color: #5a8faa;
}

.form-error {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 14px;
  background: rgba(200, 70, 70, 0.07);
  border: 1px solid rgba(200, 70, 70, 0.18);
  border-radius: 9px;
  font-size: 12px;
  color: #b84040;
  margin-bottom: 16px;
  animation: fadeUp 0.2s ease;
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
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.22s;
  margin-top: 4px;
  margin-bottom: 22px;
}
.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #3d5a73, #4a6f85);
  transform: translateY(-1px);
  box-shadow: 0 6px 22px rgba(44, 62, 80, 0.28);
}
.submit-btn:disabled {
  opacity: 0.55;
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
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
}
.auth-switch-link:hover {
  color: #2c3e50;
}

@media (max-width: 680px) {
  .auth-panel-left {
    display: none;
  }
  .auth-card {
    padding: 36px 26px;
  }
}
</style>
