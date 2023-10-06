import { useState } from "react";

function AuctionList() {
  // const [auctionItem, setAuctionItem] = useState([])
  // 데이터 받아와서 return해주고 state에 저장
  //   const auctionList = async ()=>{
  //     const response = await fetcher()
  //     setAuctionItem(response?.data)
  //   }

  // 받아온 데이터를 auctionItem에 넣고 아래 JSX에 map으로 할당.
  return (
    <>
      {/* {auctionItem.map((item)=>{})} */}
      <div>
        <div className="title">
          <h1 className="text-3xl font-extrabold my-[20px]">
            Auction Item List
          </h1>
        </div>
        <div>
          <select>
            <option>카테고리1</option>
            <option>카테고리2</option>
            <option>카테고리3</option>
            <option>카테고리4</option>
          </select>
        </div>
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <button>
            <img
              className="p-8 rounded-t-lg"
              src="../public/vite.svg"
              alt="product image"
            />
          </button>
          <div className="px-5 pb-5">
            <button>
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                푸바오 가지마😥
              </h5>
            </button>
            <div className="flex items-center mt-2.5 mb-5">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
                남은 시간 : 94:02:16
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                $99999
              </span>
              <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                찜하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuctionList;
