import { hasAnyUser } from "@/utils/database";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import "../global.css";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      const exists = await hasAnyUser();
      console.log("¿Tabla user existe?", exists);
      setIsLoggedIn(exists);
      setIsLoading(false);
    };

    checkLogin();
  }, []);

  if (isLoading) return null;

  if (isLoggedIn) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
