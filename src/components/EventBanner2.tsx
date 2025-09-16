import banner from "./ui/banner-guns&roses.webp";

const EventBanner2 = () => {
  return (
    <div className="w-full h-[400px] bg-black flex items-center justify-center overflow-hidden rounded-lg">
        <img src={banner} alt="Banner" className="max-h-full object-contain"
      />
    </div>

  );
};

export default EventBanner2;