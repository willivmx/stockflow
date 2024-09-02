import { Auth } from "@/lib/auth/utils";
import { clientAction } from "@/lib/safeActions/clientAction";

export const authenticatedClientAction = clientAction.use(async ({ next }) => {
  const session = await Auth();

  if (!session) {
    throw new Error("Session not found!");
  }

  const user = session.session?.user;

  if (!user?.email) {
    throw new Error("Session is not valid!");
  }

  return next({
    ctx: {
      user,
    },
  });
});
