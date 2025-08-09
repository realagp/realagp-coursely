import { headers } from "next/headers";
import LoginForm from "./_components/LoginForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Login = async () => { 

  const session = await auth.api.getSession({headers: await headers()});

  if(session) {
    return redirect("/");
  }

  return <LoginForm />
}

export default Login;