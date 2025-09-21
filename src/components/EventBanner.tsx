import banner from "./ui/banner-bad-bunny.webp";

const EventBanner = () => {
  return (
    <div className="w-full h-[400px] bg-[#3E8FC3] flex items-center justify-center overflow-hidden rounded-lg">
        <img src={banner} alt="Event Banner" className="max-h-full object-contain" />
    </div>
  );
};

export default EventBanner;