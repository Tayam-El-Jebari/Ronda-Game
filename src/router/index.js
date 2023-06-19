import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import GameTable from '../components/GameTable.vue';
import Forbidden403 from '../components/errors/Forbidden.vue';
import NotFound from '../components/errors/NotFound.vue';
import AdminOverview from '../components/AdminOverview.vue';
import Users from '../components/Users.vue';
import { useUserAuthStore } from "../stores/authstore.js";
import axios from 'axios';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Login },
    { path: '/gameTable', component: GameTable, meta: { requiresAuth: true }},
    { path: '/Admin-Overview', component: AdminOverview, meta: { requiresAuth: true, requiresAdmin: true }},
    { path: '/Admin-Overview/Users', component: Users, meta: { requiresAuth: true, requiresAdmin: true }},
    { path: '/403', component: Forbidden403 },
    { path: '/:catchAll(.*)', component: NotFound }, // 404
  ]
})


router.beforeEach(async (to, from, next) => {
  const store = useUserAuthStore();
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    try {
      //if user is not logged in, don't bother sending api request
      if(store.getJwt === '') {
        sendToLogin(store, next);
      }
      else{
        const response = await axios.get("http://localhost:80/users/authenticate", {
          headers: {
            'Authorization': `Bearer ${store.getJwt}`,
          }
        });        
        if (response.status === 200) {
          // Check if the route requires admin rights and if the user has them
          if (to.meta.requiresAdmin && store.getRole !== 'admin') {
            console.log(store.getRole);
            next({ path: '/403' });
          } else {
            next();
          }
        } else {
          console.log("aaa");
          sendToLogin(store, next);
        }
      }
    } catch (error) {
      sendToLogin(store, next);
    }
  } else {
    next();
  }
});

function sendToLogin(store, next){
  store.logout();
  next({ path: '/login' });
}
export default router;