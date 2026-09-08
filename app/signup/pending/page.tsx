import { Header } from "@/components/Header";

export default function SignupPendingPage() {
    return (
        <div className="min-h-screen bg-paper">
            <Header />
            <div className="max-w-sm mx-auto px-6 py-10 text-sm text-[#5c5942]">
                <h1 className="font-display text-xl text-ink mb-2">Registration received</h1>
                <p>
                    Your account is pending verification. Once approved, you'll be able
                    to log in with your username and password.
                </p>
            </div>
        </div>
    );
}