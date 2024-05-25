import { useCallback, useState } from "react";
import "./App.css";

interface Props {
  children: (props: {
    count: number;
    increment: () => void;
    decrement: () => void;
  }) => JSX.Element;
}

function Counter({ children }: Props) {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount((prev) => prev - 1);
  }, []);

  return children({ count, increment, decrement });
}

function CounterDisplay({ count }: { count: number }) {
  return <p>{count}</p>;
}

function App() {
  return (
    <Counter>
      {({ count, increment, decrement }) => (
        <div>
          <CounterDisplay count={count} />
          <button onClick={increment}>Increment</button>
          <button onClick={decrement}>Decrement</button>
        </div>
      )}
    </Counter>
  );
}

export default App;
