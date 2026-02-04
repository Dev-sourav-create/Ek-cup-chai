import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex mt-20 items-center justify-center">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        forceRedirectUrl="/"
        fallbackRedirectUrl="/"
      />
    </div>
  );
}
