import React, { useEffect, useRef } from "react";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";

const PageNotFound404 = () => {
  const check = useRef<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: true,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseover = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
      willClose: () => {
        navigate("/");
      },
    });

    Toast.fire({
      icon: "error",
      title: "존재하지 않는 페이지입니다.",
    });
  }, []);

  return (
    <div
      style={{
        height: `calc(100% - 56px)`,
        width: "100%",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url("/PageNotFound404.jpg")`,
      }}
    ></div>
  );
};

export default PageNotFound404;
