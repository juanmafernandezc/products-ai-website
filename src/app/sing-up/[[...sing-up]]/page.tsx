import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md">
        <SignUp 
          path="/sign-up" 
          routing="path"
          signInUrl="/sign-in"
          redirectUrl="/dashboard"
          appearance={{
            baseTheme: undefined,
            variables: {
              colorPrimary: "#4f46e5",
              colorText: "#ffffff",
              colorBackground: "#1f2937",
              colorInputBackground: "#374151",
              colorInputText: "#ffffff",
              borderRadius: "0.5rem",
            },
            elements: {
              card: "bg-gray-800 border border-gray-700",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-300",
              socialButtonsBlockButton: "border-gray-600 hover:bg-gray-700",
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
              footerActionLink: "text-indigo-400 hover:text-indigo-300",
            }
          }}
        />
      </div>
    </div>
  );
}