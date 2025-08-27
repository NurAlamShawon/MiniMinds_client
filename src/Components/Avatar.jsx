import React, { useContext, useEffect, useState } from "react";
import { Navigation, A11y, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Useaxios from "../Hooks/Useaxios";
import { ValueContext } from "../Context/ValueContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";


const Avatar = () => {
  const axiosInstance = Useaxios();
  const [avater, setavater] = useState([]);
  const { currentuser } = useContext(ValueContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchAvaters = async () => {
      try {
        const result = await axiosInstance.get("/avaters");
        setavater(result.data);
      } catch (error) {
        console.error("Error fetching avaters:", error);
      }
    };

    fetchAvaters();
  }, []);

  const mutation = useMutation({
    mutationFn: async (newImg) => {
      return await axiosInstance.patch(`/avater/${currentuser.email}`, {
        img: newImg,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", currentuser?.email],
      });
    },
  });

  const handleAddAvatar = (newImgUrl) => {
    mutation.mutate(newImgUrl);
    Swal.fire({
      title: "Avater has Changed",
      width: 600,
      padding: "3em",
      color: "#716add",
      background: "#fff url(/images/trees.png)",
      backdrop: `
    rgba(0,0,123,0.4)
    url("/images/nyan-cat.gif")
    left top
    no-repeat
  `,
    });
  };

  return (
    <div className="max-w-2xl xl:mx-auto mt-10  mx-4">
      <Swiper
        // install Swiper modules
        modules={[Navigation, A11y, Scrollbar]}
        spaceBetween={50}
        slidesPerView={1}
        scrollbar={{ draggable: true }}
        navigation
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
      >
        {avater.map((item, index) => {
          return (
            <SwiperSlide key={index} className="select-none focus:outline-none">
              <img src={item.img} alt="" className="mx-auto" />
              <div className="mx-auto w-20 my-5">
                <button
                  onClick={() => handleAddAvatar(item.img)}
                  className="btn btn-success w-full mb-10"
                >
                  Add
                </button>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Avatar;
