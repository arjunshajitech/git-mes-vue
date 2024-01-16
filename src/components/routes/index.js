import { createRouter , createWebHistory} from "vue-router";
import GitMes from "../views/GitMes.vue";
import GitMesCommits from "../views/GitMesCommits.vue";
import NotFoundPage from "../views/NotFoundPage.vue"

const router = createRouter({
    history: createWebHistory(),
    routes : [
        {
            path : "/",
            component : GitMes
        },
        {
            path : "/commits",
            component : GitMesCommits
        },
        {
            path : "/:pathMatch(.*)*",
            component: NotFoundPage 
        }
    ]
})

export default router;