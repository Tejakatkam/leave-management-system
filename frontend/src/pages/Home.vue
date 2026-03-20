<template>
  <div class="flex items-center justify-center h-screen bg-page">
    <div class="card">
      <div class="brand-icon">⊕</div>

      <h1 class="title">Leave Management System</h1>
      <p class="subtitle">Streamlined leave requests for modern teams</p>

      <div class="btn-row">
        <button @click="goToLogin" class="btn btn-ghost">Login</button>
        <button @click="goToSignup" class="btn btn-solid">Sign Up</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goToLogin() {
      window.location.href = "/login";
    },
    goToSignup() {
      window.location.href = "/signup";
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.bg-page {
  min-height: 100vh;
  background: #edeae4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Sora", sans-serif;
  position: relative;
  overflow: hidden;
}

/* Soft background orbs */
.bg-page::before {
  content: "";
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: radial-gradient(circle, #b8cce0, #ccdff0);
  filter: blur(90px);
  opacity: 0.5;
  top: -160px;
  left: -140px;
  pointer-events: none;
}
.bg-page::after {
  content: "";
  position: absolute;
  width: 380px;
  height: 380px;
  border-radius: 50%;
  background: radial-gradient(circle, #c4d8c0, #d8edda);
  filter: blur(80px);
  opacity: 0.45;
  bottom: -80px;
  right: -80px;
  pointer-events: none;
}

/* ── CARD ── */
.card {
  position: relative;
  z-index: 1;
  background: #ffffff;
  border: 1px solid #e0e8f2;
  border-radius: 24px;
  padding: 52px 56px;
  text-align: center;
  box-shadow: 0 8px 48px rgba(60, 80, 100, 0.11);
  width: 100%;
  max-width: 420px;
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

/* Brand icon */
.brand-icon {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #2c3e50, #3d5a73);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #9ecfea;
  margin: 0 auto 24px;
}

/* Title */
.title {
  font-family: "Lora", serif;
  font-size: 26px;
  font-weight: 500;
  color: #1e2d3d;
  line-height: 1.25;
  letter-spacing: -0.01em;
  margin-bottom: 10px;
}

/* Subtitle */
.subtitle {
  font-size: 13px;
  font-weight: 300;
  color: #8a9bb0;
  margin-bottom: 36px;
  line-height: 1.6;
}

/* Buttons */
.btn-row {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.btn {
  padding: 11px 32px;
  border-radius: 11px;
  font-family: "Sora", sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.02em;
}
.btn-ghost {
  background: transparent;
  border: 1.5px solid #c0cede;
  color: #3d5a73;
}
.btn-ghost:hover {
  border-color: #3d5a73;
  background: rgba(61, 90, 115, 0.06);
}
.btn-solid {
  background: linear-gradient(135deg, #2c3e50, #3d5a73);
  border: none;
  color: #ffffff;
}
.btn-solid:hover {
  background: linear-gradient(135deg, #3d5a73, #4a6f85);
  box-shadow: 0 4px 16px rgba(44, 62, 80, 0.25);
  transform: translateY(-1px);
}
</style>
