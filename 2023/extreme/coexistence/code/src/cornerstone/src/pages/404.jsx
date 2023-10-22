import { Watch } from "react-loader-spinner";
import { useTitle } from "@/hooks";
import { Button } from "@sliit-foss/bashaway-ui/components";

const NotFound = () => {
  useTitle("404 | Cornerstone");
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center relative z-50">
      <Watch
        height="110"
        width="110"
        radius="48"
        color="#000000"
        ariaLabel="watch-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
      <h1 className="text-black text-6xl font-bold mt-10">404</h1>
      <a id="home-btn" href="/">
        <Button className="px-6 py-2 text-[20px] mt-10">
          Back to Home
        </Button>
      </a>
    </div>
  );
};

export default NotFound;
