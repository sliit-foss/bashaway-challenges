import { useTitle } from "@/hooks";
import { Button } from "@sliit-foss/bashaway-ui/components";

const NotFound = () => {
    useTitle("Home | Cornerstone");
    return (
        <div className="h-[100vh] w-screen flex flex-col justify-center items-center relative z-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-webhook"><path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" /><path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" /><path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" /></svg>
            <h1 className="text-black text-6xl font-bold mt-10">Home</h1>
            <hr className="h-0.5 w-3/4 bg-black/5 my-10" />
            <h1 className="text-black text-2xl font-medium">Useful Links</h1>
            <div className="flex flex-col sm:flex-row gap-6">
                <a id="dashboard-btn" href="/dashboard" >
                    <Button className="px-6 py-2 text-[20px] mt-10 min-w-[150px]">
                        Dashboard
                    </Button>
                </a>
                <a id="support-btn" href="/support" >
                    <Button className="px-6 py-2 text-[20px] mt-0 sm:mt-10 min-w-[150px]">
                        Support
                    </Button>
                </a>
            </div>
        </div>
    );
};

export default NotFound;
