export default function LoginHero() {
  const images = [
    "/imagen1.png",
    "/imagen2.png",
    "/imagen3.png",
    "/imagen4.png",
  ];

  const randomIndex = Math.floor(Math.random() * images.length);
  const randomImage = images[randomIndex];

  return (
    <div className="hidden lg:flex lg:w-1/2 h-full relative box-border p-3">
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-rose-500 via-red-400 to-red-500">
        <div className="absolute inset-0 z-10" />
        <img
          src={randomImage}
          alt="Login cover"
          className={
            randomIndex === 0
              ? "w-full h-full object-cover opacity-85"
              : "w-full h-full object-contain opacity-85"
          }
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-start px-10 text-white">
          <h1 className="text-4xl pt-5 font-bold text-pink-100">PinkMuse</h1>
          <p className="text-xl text-pink-100 font-semibold leading-relaxed">
            Tu música, tus fans, tu espacio.
          </p>
        </div>
      </div>
    </div>
  );
}
