const AuthImagePattern = ({ title, subtitle }) => {
  // Array of random avatar URLs (using DiceBear API for demonstration)
  const avatars = Array(9)
    .fill()
    .map(
      () =>
        `https://api.dicebear.com/7.x/personas/svg?seed=${Math.random()}&backgroundColor=b6e3f4,c0aede,d1d4f9`
    );

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {avatars.map((avatar, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl overflow-hidden ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            >
              <img
                src={avatar}
                alt="User avatar"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
