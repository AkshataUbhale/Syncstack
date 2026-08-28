import { SignUp } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-default-50">
      {/* Use the unified Navbar component */}
      <Navbar />

      <main className="flex-1 flex justify-center items-center p-6">
        <SignUp />
      </main>

      {/* Footer */}
      <footer className="bg-default-50 border-t border-default-200 py-4">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-default-500">
            &copy; {new Date().getFullYear()} Syncstack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
