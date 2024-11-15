import {
    createRouter as createVueRouter,
    createWebHistory,
    RouteRecordRaw,
} from 'vue-router';
import HomeApp from './components/Home.vue';
import MarkdownToPdfApp from './markdown-to-pdf/App.vue';

const BASE_TITLE = 'Inf-Lab Tools';

const routes: RouteRecordRaw[] = [
    { path: '/', meta: { title: null }, component: HomeApp },
    {
        path: '/markdown-to-pdf',
        meta: { title: 'Markdown to PDF' },
        component: MarkdownToPdfApp,
    },
];

export function createRouter() {
    const router = createVueRouter({
        history: createWebHistory(),
        routes,
    });

    router.beforeEach((to, _from, next) => {
        document.title = to.meta.title
            ? `${to.meta.title} | ${BASE_TITLE}`
            : BASE_TITLE;

        next();
    });

    return router;
}
