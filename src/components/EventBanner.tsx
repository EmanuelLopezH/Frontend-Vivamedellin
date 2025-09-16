import banner from "./ui/banner-bad-bunny.webp";

const EventBanner = () => {
  return (
    <div className="w-full h-64 overflow-hidden rounded-lg">
      <img src={banner} alt="Event Banner" className="w-full h-full object-cover" />
    </div>
  );
};

export default EventBanner;
