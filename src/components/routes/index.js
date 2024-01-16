import { createRouter , createWebHistory} from "vue-router";
import GitMes from "../views/GitMes.vue";
import GitMesCommits from "../views/GitMesCommits.vue";

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
        }
    ]
})

export default router;