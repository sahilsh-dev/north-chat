import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="h-[50vh] flex flex-col justify-center items-center">
      <h1 className="text-8xl">404</h1>
      <h1>Not Found</h1>
      <Link to="/" className="text-blue-400">
        Go back home
      </Link>
    </div>
  );
}

export default NotFound;
