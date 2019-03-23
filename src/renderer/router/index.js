import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: "history",
  mode: "hash",
  routes: [
    // {
    //   path: '/',
    //   name: 'landing-page',
    //   component: require('@/components/LandingPage').default
    // },
    {
      path: '/',
      name: 'main',
      component: require('@/view/Main').default,
      children: [
        {
          path: '/login',
          name: 'login',
          component: require('@/view/Main/Login').default,
        },
        {
          path: '/player',
          name: 'player',
          component: require('@/view/Main/Player').default,
          redirect: "/player/collection",
          children:[
            {
              path: '/player/collection',
              name: 'collection',
              component: require('@/view/Main/Player/Collection').default
            },
            {
              path: '/player/search',
              name: 'search',
              component: require('@/view/Main/Player/Search').default
            },
            {
              path: '/player/fm',
              name: 'fm',
              component: require('@/view/Main/Player/FM').default
            },
            {
              path: '/player/option',
              name: 'option',
              component: require('@/view/Main/Player/Option').default
            },
            {
              path: '/player/record',
              name: 'record',
              component: require('@/view/Main/Player/Playrecord').default
            },
          ]
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
