import { createRouter, createWebHistory } from 'vue-router'

// Import views
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Pricing from '../views/Pricing.vue'
import FAQ from '../views/FAQ.vue'
import Contact from '../views/Contact.vue'
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
    meta: { title: 'Free English Proficiency Trial' }
  },
  {
    path: '/exam/:sessionId',
    name: 'ExamInterface',
    component: ExamInterface,
    meta: { title: 'English Proficiency Exam' },
    props: true
  },
  {
    path: '/exam/:sessionId/results',
    name: 'ExamResults',
    component: ExamResults,
    meta: { title: 'Exam Results' },
    props: true
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: Pricing
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: FAQ
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
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

// Update page title based on route meta
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} | Mentarie`
  } else {
    document.title = 'Mentarie - Language Learning Platform'
  }
  next()
})

export default router 