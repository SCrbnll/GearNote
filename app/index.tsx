import { Redirect } from "expo-router";
import '../global.css';

export default function Index() {
  // ⚠️ Simula si el usuario está logueado o no
  const isLoggedIn = false;

  if (isLoggedIn) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
