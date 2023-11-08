import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRecoilState, useRecoilValue } from "recoil";
import { categoryList } from "../../atoms/category";
import { category } from "../../atoms/category";
import { auctionRegister } from "../../apis/auction-register/AuctionRegister";
import { useNavigate } from "react-router";
import imageCompression from "browser-image-compression";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css/scrollbar";
import "swiper/css";

/**
 * @author : Jiwon Kim
 * @returns : 상품 등록페이지, 사용자가 입력한 상품 정보와 이미지를 서버로 전송하며,
 * 이때, 이미지는 압축을 통해 용량을 줄이고 react-hook-form를 사용해서 각종 유효성 검사를 진행하고
 * formData를 활용해서 데이터를 서버로 전송한다.
 */

interface IForm {
  title: string;
  content: string;
  startPrice: number;
  minBidPrice: number;
  deadline: number;
  category: string;
  auctionStatus: string;
}

function RegisterProduct() {
  // useRecoilState를 사용하여 selectCategory와 setSelectCategory를 가져와서 Recoil 상태를 관리
  const [selectCategory, setSelectCategory] = useRecoilState(category);

  // 이미지 파일을 저장하고 관리하기 위한 state 생성
  const [images, setImages] = useState<File[]>([]);

  // 이미지 미리보기 관련 state
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // 카테고리 리스트를 recoil로부터 불러옴
  const categoryLi = useRecoilValue(categoryList);
  const navigate = useNavigate();

  // React-Hook-Form을 사용해서 form의 상태와 메서드를 가져오며, onBlur 모드를 사용해서 각 입력 필드에서 포커스를 벗어날때마다
  // 유효성 검사를 수행.
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<IForm>({
    defaultValues: {},
    mode: "onBlur",
  });

  // 컴포넌트 마운트 시 로그인 여부에 따라 페이지 이동
  useEffect(() => {
    const accessToken = localStorage.getItem("authorization");
    if (!accessToken) {
      toast.error("로그인 후 이용가능합니다.");
      navigate("/login");
    }
  }, []);

  // 카테고리 버튼 클릭 시 선택한 카테고리를 업데이트하고 form의 category 필드에 해당 값을 설정
  const onClickCategory = (event: React.MouseEvent<HTMLButtonElement>) => {
    const category = event.currentTarget.value;
    setSelectCategory(category);
    setValue("category", category);
  };

  // 이미지를 추가하는 함수로, 선택된 이미지 파일을 상태에 추가하기 전에 이미지를 압축하고 미리보기 URL를 생성,
  // 이미지 갯수가 3개를 초과 시 알림창 설정, browser-image-compression 사용 이미지 압축
  const addImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentImageCount = images.length;
    if (currentImageCount >= 3) {
      toast.warning("등록 가능한 이미지 갯수를 초과했습니다.");
      return;
    }
    const imageFiles: FileList | null = event.target.files;
    if (imageFiles) {
      const newImages = [...images];
      const previews = imagePreviews.slice(); // 이미지 미리보기 배열의 복사본
      for (let i = 0; i < imageFiles.length; i++) {
        if (currentImageCount + i >= 3) {
          toast.warning("등록 가능한 이미지 갯수를 초과했습니다.");
          break;
        }
        try {
          const compressedImage = await imageCompression(imageFiles[i], {
            maxSizeMB: 0.5, // 필요에 따라 최대 크기를 조정
            maxWidthOrHeight: 800, // 필요에 따라 최대 너비 또는 높이를 조정
          });
          newImages.push(compressedImage);
          previews.push(URL.createObjectURL(compressedImage)); // 이미지 미리보기 URL 생성
        } catch (error) {
          console.error("이미지 압축 중 오류:", error);
          toast.error("이미지 압축 중 오류가 발생했습니다.");
        }
      }
      setImages(newImages);
      setImagePreviews(previews);
    }
  };

  // 이미지 미리보기 칸에서 이미지를 제거하기 위한 함수로, 해당 인덱스의 이미지와 미리보기를 state에서 제거
  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  // form 데이터가 유효할 경우 실행되는 함수로 카테고리를 선택하지 않았거나 '전체'를 선택한 경우 경고창을 띄우고
  // 선택한 카테고리와 이미지를 서버로 전송
  const onValid = async (data: IForm) => {
    if (!data.category || data.category === "전체") {
      toast.warning("카테고리를 선택해주세요!");
      return;
    } else {
      const formData = new FormData();
      formData.append(
        "itemRequestDto",
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
      const response = await auctionRegister(formData);
      if (response?.status === 200) {
        toast.success("상품이 등록되었습니다🔥");
        navigate("/items/public-search");
        reset();
      } else {
        toast.error("사진과 모든 내용을 작성하셔야 합니다.😥");
        setImages([]);
        setImagePreviews([]);
      }
    }
  };

  return (
    <div className="flex flex-col py-3">
      <form
        onSubmit={handleSubmit(onValid)}
        className="flex flex-col justify-center items-center"
      >
        <Swiper
          scrollbar={{
            hide: true,
          }}
          slidesPerView={5.5}
          centeredSlides={false}
          modules={[Scrollbar]}
          className="flex w-full mb-3 mySwiper"
        >
          {categoryLi.map((item) => (
            <SwiperSlide key={item}>
              <button
                type="button"
                value={item}
                onClick={onClickCategory}
                className={`${
                  selectCategory === item
                    ? "flex-row rounded-2xl m-0.5 p-1 border-2 w-[60px] cursor-pointer text-sm text-white bg-gray-950"
                    : "flex-row rounded-2xl m-0.5 p-1 border-2 w-[60px] cursor-pointer text-sm text-gray-950"
                } `}
              >
                {item}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
        <span className="text-red-500 font-semibold text-[14px]">
          {errors.category?.message as string}
        </span>
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-[350px] h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 my-2"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-800 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-800 dark:text-gray-400">
              <span className="font-semibold">버튼을 클릭하세요!</span>
            </p>
            <p className="text-xs text-gray-500">
              최대 3장까지 등록 가능합니다.
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={addImage}
          />
        </label>
        {/* 이미지 미리보기 섹션 */}
        <div className="w-[350px] h-32 bg-gray-50 border-none my-2 flex justify-center items-center rounded-xl">
          {imagePreviews.map((preview, index) => (
            <div key={index + 1} className="relative">
              <img
                src={preview}
                alt={`미리보기 ${index + 1}`}
                className="max-w-[120px] h-[128px] object-cover mx-2"
              />
              <button
                className="absolute top-2 right-2 text-red-500 cursor-pointer"
                onClick={() => removeImage(index)}
              >
                x
              </button>
            </div>
          ))}
        </div>
        <input
          {...register("title", { required: "제품명은 필수입니다." })}
          type="text"
          id="title"
          placeholder="상품 이름"
          className="w-[350px] h-[35px] border-none bg-gray-200 text-gray-800 font-pretendard text-md font-bold rounded-lg my-2 text-center"
        />
        <span className="text-red-500 font-semibold text-[14px]">
          {errors.title?.message as string}
        </span>
        <textarea
          {...register("content", {
            required: "제품 설명은 필수입니다.",
            minLength: {
              message: "설명은 최소 10글자 이상이어야 합니다.",
              value: 10,
            },
          })}
          id="desc"
          placeholder="상품 설명은 최소 10자 이상 작성해야 합니다."
          className="w-[350px] h-[80px] p-1 border-none bg-gray-200 text-gray-800 font-pretendard text-md font-bold rounded-lg my-2 overflow-y-hidden"
        />
        <span className="text-red-500 font-semibold text-[14px]">
          {errors.content?.message as string}
        </span>
        <div className="flex flex-col justify-center w-[350px] font-pretendard text-md font-bold my-2">
          <div>마감기한 설정</div>
          <div>
            <input
              {...register("deadline", {
                required: "경매 마감기한 설정은 필수입니다.",
              })}
              type="range"
              id="dueDate"
              min="1"
              max="5"
              className="mt-2 w-[250px] h-2 accent-[#278374] rounded-lg cursor-pointer"
            />
            <span className="font-pretendard text-md font-extrabold mx-4">
              {watch("deadline")} Days
            </span>
          </div>
          <span className="text-red-500 font-semibold text-[14px]">
            {errors.deadline?.message as string}
          </span>
        </div>
        <div className="flex flex-col justify-center w-[350px] my-2">
          <span className="font-pretendard text-md font-extrabold mb-2">
            경매 시작 가격
          </span>
          <input
            {...register("startPrice", {
              required: "시작 경매가는 필수입니다.",
              min: { message: "최소 경매가는 1원입니다.", value: "1" },
            })}
            type="number"
            min={0}
            id="valueForStart"
            placeholder=" 경매 시작가"
            className="w-[350px] h-[35px] border-2 rounded-lg font-pretendard text-md font-bold"
          />
          <span className="text-red-500 font-semibold text-[14px] mt-2">
            {errors.startPrice?.message as string}
          </span>
          <div className="my-3">
            <span className="font-pretendard text-md font-bold mb-2">
              경매가 최소 단위
            </span>
            <input
              {...register("minBidPrice", {
                required: "경매가 단위는 필수입니다.",
                min: { message: "최소 단위는 1원입니다.", value: "1" },
              })}
              type="number"
              min={0}
              id="valuePerBid"
              placeholder=" 경매가 단위"
              className="w-[350px] h-[35px] border-2 rounded-lg mt-1 mb-2 font-pretendard text-md font-bold"
            />
            <span className="text-red-500 font-semibold text-[14px] mt-2">
              {errors.minBidPrice?.message as string}
            </span>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <button className="w-[350px] h-[40px] bg-[#278374] font-pretendard text-white font-bold rounded-lg">
            경매 시작하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterProduct;
