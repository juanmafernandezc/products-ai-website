import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <SignIn path="/sign-in" routing="path" />
    </div>
  );
}