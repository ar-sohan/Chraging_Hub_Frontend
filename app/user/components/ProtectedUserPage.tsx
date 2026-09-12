"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

export type CurrentUser = {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  age: number;
  gender: string;
};

export default function ProtectedUserPage({
  children,
}: {
  children: (user: CurrentUser, updateUser: (user: CurrentUser) => void, logout: () => void) => ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    setUser(null);
    router.replace("/user/login");
  }, [router]);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("accessToken");

    function clearSession() {
      controller.abort();
      localStorage.removeItem("accessToken");
      setUser(null);
      router.replace("/user/login");
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === "accessToken" || event.key === null) {
        clearSession();
      }
    }

    if (!token) {
      router.replace("/user/login");
      return;
    }

    window.addEventListener("storage", handleStorage);
    axios.get<CurrentUser>(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/user/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      }
    ).then(({ data }) => {
      if (!controller.signal.aborted) setUser(data);
    }).catch((requestError: unknown) => {
      if (controller.signal.aborted || axios.isCancel(requestError)) return;
      if (axios.isAxiosError(requestError) &&
          (requestError.response?.status === 401 || requestError.response?.status === 404)) {
        clearSession();
        return;
      }
      setError("Unable to load your account. Please try again.");
    });

    return () => {
      controller.abort();
      window.removeEventListener("storage", handleStorage);
    };
  }, [router, attempt]);

  if (!user) {
    return (
      <main className="m-10" aria-live="polite">
        {error ? (
          <>
            <p role="alert">{error}</p>
            <button className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
              onClick={() => { setError(""); setAttempt((value) => value + 1); }}>
              Try again
            </button>
            <button className="ml-3 underline" onClick={logout}>Logout</button>
          </>
        ) : <p>Loading your account...</p>}
      </main>
    );
  }

  return (
    <div data-theme="light" className="ev-green flex min-h-screen flex-col bg-base-200 text-base-content">
      <Header user={user} onLogout={logout} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-8 sm:py-10">{children(user, setUser, logout)}</main>
      <Footer />
    </div>
  );
}




