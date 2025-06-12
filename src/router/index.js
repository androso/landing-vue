import { createRouter, createWebHistory } from 'vue-router'
import examAPI from '../services/examAPI.js'

// Import views
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Pricing from '../views/Pricing.vue'
import FAQ from '../views/FAQ.vue'
import Contact from '../views/Contact.vue'
import Checkout from '../views/Checkout.vue'
import Dashboard from '../views/Dashboard.vue'
import ExamTrial from '../views/ExamTrial.vue'
import ExamInterface from '../views/ExamInterface.vue'
import ExamResults from '../views/ExamResults.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/exam-trial',
    name: 'ExamTrial',
    component: ExamTrial,
    meta: { title: 'Free English Proficiency Trial', requiresAuth: true }
  },
  {
    path: '/exam/:sessionId',
    name: 'ExamInterface',
    component: ExamInterface,
    meta: { title: 'English Proficiency Exam', requiresAuth: true },
    props: true
  },
  {
    path: '/exam/:sessionId/results',
    name: 'ExamResults',
    component: ExamResults,
    meta: { title: 'Exam Results', requiresAuth: true },
    props: true
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: Pricing,
    meta: { requiresAuth: true }
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: FAQ,
    meta: { requiresAuth: true }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: { title: 'Checkout', requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Authentication guard and page title update
router.beforeEach((to, from, next) => {
  // Update page title
  if (to.meta.title) {
    document.title = `${to.meta.title} | Mentarie`
  } else {
    document.title = 'Mentarie - Language Learning Platform'
  }

  // Check authentication for protected routes
  if (to.meta.requiresAuth && !examAPI.isAuthenticated()) {
    // Store the intended route to redirect after login
    localStorage.setItem('redirectAfterLogin', to.fullPath)
    // Redirect to home page where user can open login modal
    next('/')
  } else {
    next()
  }
})

export default router 