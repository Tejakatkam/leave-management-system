<script setup>
import { ref, onMounted } from "vue";

import Home from "./pages/Home.vue";
import Login from "./pages/Login.vue";
import Signup from "./pages/Signup.vue";
import Employee from "./pages/Employee.vue";
import Employer from "./pages/Employer.vue";

const currentPath = ref("/");

onMounted(() => {
  currentPath.value = window.location.pathname;
});
</script>

<template>
  <Home v-if="currentPath === '/'" />
  <Login v-else-if="currentPath === '/login'" />
  <Signup v-else-if="currentPath === '/signup'" />
  <Employee v-else-if="currentPath === '/employee'" />
  <Employer v-else-if="currentPath === '/employer'" />
  <div v-else class="p-6">Page Not Found</div>
</template>
