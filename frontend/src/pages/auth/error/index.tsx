import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const errorParam = router.query.error as string;
        setError(errorParam);
    }, [router.query]);

    const errorMessages: { [key: string]: string } = {
        Configuration: "There is a problem with the server configuration. Please contact support.",
        AccessDenied: "You do not have permission to sign in.",
        Verification: "The verification link is no longer valid.",
        OAuthSignin: "Error in constructing an authorization URL.",
        OAuthCallback: "Error in handling the response from an OAuth provider.",
        Default: "An error occurred during authentication.",
    };

    const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-semibold text-gray-900">
                        Authentication Error
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                    <p className="text-gray-600 text-sm">
                        {errorMessage}
                    </p>
                    {error && (
                        <div className="bg-gray-100 p-3 rounded-md">
                            <code className="text-xs text-gray-500">Error code: {error}</code>
                        </div>
                    )}
                    <div className="space-y-3">
                        <Button
                            onClick={() => router.push('/login')}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            Return to Sign In
                        </Button>
                        <Button
                            onClick={() => router.push('/')}
                            variant="outline"
                            className="w-full"
                        >
                            Go to Homepage
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}