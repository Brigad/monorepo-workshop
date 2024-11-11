import { useEffect } from "react";
import { sayHelloWorld } from "../utils/sayHelloWorld";

export function useHelloWorld() {
  useEffect(() => {
    sayHelloWorld();
  }, []);
}
