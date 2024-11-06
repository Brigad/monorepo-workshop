import { useEffect } from "react";
import { sayHelloWorld } from "./sayHelloWorld";

export function useHelloWorld() {
  useEffect(() => {
    sayHelloWorld();
  }, []);
}
