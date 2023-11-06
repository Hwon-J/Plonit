import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Input from "components/common/Input";
import { BackTopBar } from "components/common/TopBar";
import style from "styles/css/CrewpingCreatePage.module.css";
import CrewpingImg from "components/CrewpingCreate/CrewpingImg";
import CrewpingDate from "components/CrewpingCreate/CrewpingDate";
import CrewpingAddress from "components/CrewpingCreate/CrewpingAddress";
import CrewpingPeople from "components/CrewpingCreate/CrewpingPeople";
import CommonButton from "components/common/CommonButton";
import { getCrewpingCreate } from "api/lib/crewping";

const CrewpingCreatePage = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state: any) => state.user.accessToken);
  const [isCrewpingName, setCrewpingName] = useState("");
  const [isCrewpingPlace, setCrewpingPlace] = useState("");
  const [isCrewpingIntroduce, setCrewpingIntroduce] = useState("");
  const [isCrewpingImage, setCrewpingImage] = useState(null);
  const [isCrewpingStartDate, setCrewpingStartDate] = useState("");
  const [isCrewpingEndDate, setCrewpingEndDate] = useState("");
  const [isCrewpingMaxPeople, setCrewpingMaxPeople] = useState<number>(0);
  const onChangeName = (event: any) => {
    setCrewpingName(event.target.value);
  };
  const onChangeIntroduce = (event: any) => {
    setCrewpingIntroduce(event.target.value);
  };

  const crewpingCreateHandler = () => {
    const formData = new FormData();
    formData.append("name", isCrewpingName);
    formData.append("place", isCrewpingPlace);
    formData.append("introduce", isCrewpingIntroduce);
    formData.append("startDate", isCrewpingStartDate);
    formData.append("endDate", isCrewpingEndDate);
    formData.append("maxPeople", isCrewpingMaxPeople.toString());
    if (isCrewpingImage) {
      formData.append("crewpingImage", isCrewpingImage);
    }
    console.log(formData);
    getCrewpingCreate(
      accessToken,
      formData,
      (res) => {
        console.log(res.data);
        console.log("크루핑 생성 성공");
      },
      (err) => {
        console.log("크루핑 생성 에러", err);
      },
    );
  };

  return (
    <div>
      <BackTopBar text="크루핑 생성" />
      <CrewpingImg
        setCrewpingImage={setCrewpingImage}
        isCrewpingImage={isCrewpingImage}
      />
      <Input
        id="crewping_name"
        labelTitle="크루핑 이름"
        type="text"
        value={isCrewpingName}
        onChange={onChangeName}
      />
      <CrewpingDate
        setCrewpingStartDate={setCrewpingStartDate}
        setCrewpingEndDate={setCrewpingEndDate}
      />
      <CrewpingAddress setCrewpingPlace={setCrewpingPlace} />
      <CrewpingPeople setCrewpingMaxPeople={setCrewpingMaxPeople} />
      <div className={style.introduce}>
        <label className={style.label} htmlFor="crewping_introduce">
          활동 소개
        </label>
        <textarea
          className={style.inputBox}
          name="crewping_introduce"
          id="crewping_introduce"
          value={isCrewpingIntroduce}
          onChange={onChangeIntroduce}
        ></textarea>
      </div>
      <CommonButton
        text="크루핑 생성"
        styles={{
          backgroundColor: "#2cd261",
        }}
        onClick={crewpingCreateHandler}
      />
      <div style={{ height: "4rem" }}></div>
    </div>
  );
};

export default CrewpingCreatePage;
