import { useTab } from "../../../../composables/usetab"
import { createPut } from "./axios.http"

export const put = createPut(() => ({ auth_token: useSession().token, tab_id: useTab().id }))