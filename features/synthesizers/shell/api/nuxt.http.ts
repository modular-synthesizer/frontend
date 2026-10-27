import { useTab } from "../../../../composables/usetab"
import { createPut } from "./axios.http"
import { withAuthenticationGuard } from "./http"

export const put = withAuthenticationGuard(
  createPut(() => ({ auth_token: useSession().token, tab_id: useTab().id })),
  () => useSession().reset()
)