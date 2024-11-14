import { useEffect } from "react";
import { sayHelloWorld } from "../utils/sayHelloWorld";

const useSayHello = () => {
  useEffect(() => {
    sayHelloWorld();
  }, []);
};

export { useSayHello };
