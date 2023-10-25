import { memo } from "react";
import { Link } from "react-router-dom";
import { TopItemType } from "src/pages/hub/Mainpage";
import CountdownTimer from "../../pages/auction-list/CountdownTimer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css/scrollbar";
import "swiper/css";

interface TopItemProps {
  topItems: TopItemType[];
}

const ItemCards = ({ topItems }: TopItemProps) => {
  return (
    <Swiper
      scrollbar={{
        hide: true,
      }}
      slidesPerView={2.2}
      centeredSlides={false}
      modules={[Scrollbar]}
      className="mySwiper w-full flex flex-row"
    >
      {topItems.map((item: TopItemType) => (
        <SwiperSlide
          key={item.id}
          className="w-[170px] h-[240px] bg-white border border-gray-200 mt-1 mr-3 rounded-lg shadow-md"
        >
          <Link to={`/items/detail/${item.id}`}>
            <img
              className="p-2 rounded-lg w-[170px] h-[120px] object-cover"
              src={item.itemImages[0]}
              alt="product image"
            />
          </Link>
          <div className="px-3">
            <Link to={`/items/detail/${item.id}`}>
              <h5 className="text-lg font-bold text-gray-900">{item.title}</h5>
            </Link>
            <div className="flex">
              <span>
                <CountdownTimer
                  endTime={item.auctionEndTime}
                  bidCount={item.bidCount}
                />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className=" font-semibold text-gray-900">
                {item.presentPrice}원
              </span>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default memo(ItemCards);
