import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "components/common/Input";
import CommonButton from "components/common/CommonButton";
import { addInfo } from "api/lib/members";
import { useSelector } from "react-redux";
import style from "styles/css/AddInfoPage.module.css";

const AddInfoPage = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state: any) => state.user.accessToken);
  const [signupInput, setSignupInput] = useState({
    name: "",
    nickname: "",
    gender: false,
    birth: "",
    region: "",
  });
  const onChange = (event: any) => {
    const { id, value } = event.target;
    setSignupInput((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const onChangeGender = (value: boolean) => {
    setSignupInput((prevState) => ({
      ...prevState,
      gender: value,
    }));
  };

  const SendInfo = () => {
    const data = signupInput;
    console.log(data);
    console.log(accessToken);
    addInfo(
      accessToken,
      data,
      (res) => {
        console.log("추가정보 입력 성공");
        navigate("/");
      },
      (err) => {
        console.log(accessToken, "토큰");
        console.log("추가정보 에러...");
      },
    );
  };

  return (
    <div className={style.add_info}>
      <div className={style.guide}>
        서비스 사용을 위해 추가 정보를 등록해 주세요!
      </div>
      <Input
        id="name"
        labelTitle="이름"
        type="text"
        value={signupInput.name}
        onChange={onChange}
      />
      <Input
        id="nickname"
        labelTitle="닉네임"
        type="text"
        value={signupInput.nickname}
        onChange={onChange}
      />
      <div className={style.gender}>
        <div
          className={
            signupInput.gender === false
              ? `${style.choice1} ${style.selected}`
              : style.choice1
          }
          onClick={() => onChangeGender(false)}
        >
          남
        </div>
        <div
          className={
            signupInput.gender === true
              ? `${style.choice2} ${style.selected}`
              : style.choice2
          }
          onClick={() => onChangeGender(true)}
        >
          여
        </div>
      </div>
      <Input
        id="birth"
        labelTitle="생년월일"
        type="text"
        value={signupInput.birth}
        placeholder="1990.01.01"
        onChange={onChange}
      />
      <Input
        id="region"
        labelTitle="활동 지역"
        type="text"
        value={signupInput.region}
        placeholder="예) 장덕동"
        onChange={onChange}
      />
      <CommonButton
        text="시작하기"
        styles={{
          backgroundColor: "#2cd261",
        }}
        onClick={SendInfo}
      />
    </div>
  );
};

export default AddInfoPage;