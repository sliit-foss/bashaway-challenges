<script>
  import '$styles/styles.css';
</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

<div class="h-[100vh] w-screen flex flex-col justify-center items-center relative z-50">
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
    class="lucide lucide-layout-dashboard"
    ><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect
      width="7"
      height="5"
      x="3"
      y="16"
      rx="1"
    /></svg
  >

  <h1 class="text-black text-6xl font-bold mt-10 mb-4">Dashboard</h1>
  <a id="home-btn" href="/" class="flex justify-center items-center cursor-pointer rounded-full font-semibold outline-none splash bg-black text-white transition-all duration-medium gap-2 px-6 py-2.5 text-[20px] mt-10 min-w-[150px]"> Back to Home </a>
</div>
