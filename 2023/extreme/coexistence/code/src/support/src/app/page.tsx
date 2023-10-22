export default function Home() {
  return (
    <div className="h-[100vh] w-screen flex flex-col justify-center items-center relative z-50">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="150"
        height="150"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-helping-hand"
      >
        <path d="m3 15 5.12-5.12A3 3 0 0 1 10.24 9H13a2 2 0 1 1 0 4h-2.5m4-.68 4.17-4.89a1.88 1.88 0 0 1 2.92 2.36l-4.2 5.94A3 3 0 0 1 14.96 17H9.83a2 2 0 0 0-1.42.59L7 19" />
        <path d="m2 14 6 6" />
      </svg>

      <h1 id="title" className="text-black text-6xl font-bold mt-10 mb-4">Support</h1>
      <a
        id="home-btn"
        href="/"
        className="flex justify-center items-center cursor-pointer rounded-full font-semibold outline-none splash bg-black text-white transition-all duration-medium gap-2 px-6 py-2.5 text-[20px] mt-10 min-w-[150px]"
      >
        {' '}
        Back to Home{' '}
      </a>
    </div>
  );
}
