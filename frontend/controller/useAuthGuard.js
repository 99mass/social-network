import { useEffect } from "react";
import { isValideSession } from "../utils/cookies";

export function useAuthGuard() {
  useEffect(() => {
    const checkSession = async () => {
      const isValid = await isValideSession();
      if (!isValid) { window.location.href = "/";}
    };
    checkSession();
  }, []);
}
export function useAuthGuard2() {
  useEffect(() => {
    const checkSession = async () => {
      const isValid = await isValideSession();
      if (isValid) window.location.href = "/home";
      
    };
    checkSession();
  }, []);
}
