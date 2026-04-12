export default function MethodologySection() {
  return (
    <div className="min-h-screen py-12 px-5 bg-[#F2F4F7] flex flex-col gap-22">
      <div className="w-2/3 md:w-1/2">
        <p className="font-bold text-[12px] text-[#006492]">METHODOLOGY</p>
        <h1 className="font-semibold text-[#00263F] text-3xl md:text-4xl">
          The Three Pillars of Synthesis.
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-10">
        <div className="relative z-1 flex flex-col gap-2">
          <h2 className="font-semibold text-xl text-[#00263F]">
            Create a Vault
          </h2>
          <p className="text-[#42474E] text-sm md:w-[80%] tracking-wide">
            Establish a clean, focused digital architecture for your specific
            research objective or field of study.
          </p>
          <h1 className="text-gray-200 font-bold text-8xl absolute -top-17 -left-1 -z-1">01</h1>
        </div>

        <div className="relative z-1 flex flex-col gap-2">
          <h2 className="font-semibold text-xl text-[#00263F]">
            Add Resources & Notes
          </h2>
          <p className="text-[#42474E] text-sm md:w-[80%] tracking-wide">
            Populate your workspace with data points and
initial thoughts. Our engine handles the
structural sorting.
          </p>
          <h1 className="text-gray-200 font-bold text-8xl absolute -top-17 -left-1 -z-1">02</h1>
        </div>

        <div className="relative z-1 flex flex-col gap-2">
          <h2 className="font-semibold text-xl text-[#00263F]">
            Share & Collaborate
          </h2>
          <p className="text-[#42474E] text-sm md:w-[80%] tracking-wide">
            Sync with your collective mind. Review findings
and refine hypotheses through multi-user
interactions.
          </p>
          <h1 className="text-gray-200 font-bold text-8xl absolute -top-17 -left-1 -z-1">03</h1>
        </div>
      </div>
    </div>
  );
}
